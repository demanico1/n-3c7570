/* ── 찜 목록 공유 주소 `/w/?c=코드-코드-…` (2026-09-26) ─────────────────
 *
 * ### 왜 따로 있나
 *
 * 카톡은 주소의 `#` 뒤를 안 읽는다. 앱 주소(`/#w=…`)를 그대로 보내면
 * 미리보기에 **늘 앱 소개 카드**만 뜬다(상품 공유 때 겪은 일, CLAUDE.md).
 * `?` 뒤는 서버까지 오므로 여기서 미리보기를 만들어 준다.
 *
 *     카톡이 미리보기를 만들 때  →  이 장의 og (몇 개 · 첫 상품 사진)
 *     사람이 누르면             →  곧바로 앱 `/#w=…` 로 넘어간다
 *
 * ### 지키는 것
 *
 * - 찜 목록은 **어디에도 저장하지 않는다.** 주소에 실려 올 뿐이다
 * - `noindex` 다. 검색에 나갈 까닭이 없다
 * - `meta refresh` 로 넘기지 마라. 미리보기 로봇이 따라가서 앱 홈의 og 를
 *   읽어 버린다. 자바스크립트는 그쪽이 안 돌린다
 * - 무슨 일이 있어도 죽지 않는다. 틀린 주소면 그냥 홈으로 보낸다
 * - 상품 이름은 싣지 않는다. 이름을 알려면 1MB 자료를 풀어야 하는데
 *   무료 판은 한 번에 쓸 수 있는 계산 시간이 짧다
 */
export async function onRequest(context) {
  const { request, env } = context;
  const home = new URL("/", request.url).toString();
  try {
    const url = new URL(request.url);
    const raw = url.searchParams.get("c") || "";
    // ★ 수량이 붙어 올 수 있다 (2026-09-28): `32814x2` — 코드마다 한 번만
    const seen = new Set(), toks = [], codes = [];
    let pcs = 0;
    for (const t of raw.split("-")) {
      const m = t.match(/^([0-9]{1,6})(?:x([0-9]{1,2}))?$/);
      if (!m || seen.has(m[1])) continue;
      seen.add(m[1]);
      const q = m[2] && Number(m[2]) > 1 ? Number(m[2]) : 1;
      toks.push(q > 1 ? m[1] + "x" + q : m[1]);
      codes.push(m[1]);
      pcs += q;
      if (codes.length >= 300) break;
    }
    if (!codes.length) return Response.redirect(home, 302);
    const list = toks.join("-");
    const app = "/app/#w=" + list;   // 앱은 /app/ (2026-09-30)

    // 미리보기 사진 — 앞에서부터 사진이 있는 첫 상품 (사진이 없는 상품이 4건 있다)
    let img = "";
    for (const c of codes.slice(0, 5)) {
      const u = new URL("/big/" + c + ".jpg", url);
      try {
        const r = await env.ASSETS.fetch(new Request(u.toString()));
        if (r.body) r.body.cancel();
        // ★ `ok` 만 보면 안 된다. 없는 파일을 부르면 클라우드플레어가 404 대신
        //   **앱 홈(HTML)을 200 으로** 돌려준다. 그림인지 꼭 본다.
        const ct = r.headers.get("content-type") || "";
        if (r.ok && ct.startsWith("image/")) { img = u.toString(); break; }
      } catch (e) { /* 다음 것 */ }
    }

    const n = codes.length;
    const title = "PX 찜 목록 " + n + "개";
    const desc = "군마트(PX) 상품 " + n + "개" + (pcs > n ? "(모두 " + pcs + "개)" : "")
      + "를 모아서 보냈어요. 눌러서 온라인 가격과 비교해 보세요.";
    const me = url.origin + "/w/?c=" + list;
    const html =
      '<!doctype html><html lang="ko"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      "\n<title>" + title + "</title>" +
      '\n<meta name="robots" content="noindex">' +
      '\n<meta name="description" content="' + desc + '">' +
      '\n<meta property="og:type" content="website">' +
      '\n<meta property="og:title" content="' + title + '">' +
      '\n<meta property="og:description" content="' + desc + '">' +
      (img ? '\n<meta property="og:image" content="' + img + '">' : "") +
      '\n<meta property="og:url" content="' + me + '">' +
      '\n<script>location.replace("' + app + '")</script>' +
      '\n</head><body style="font-family:sans-serif;padding:24px">' +
      '<p><a href="' + app + '">찜 목록 보러 가기</a></p></body></html>\n';
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=3600",
        "x-robots-tag": "noindex",
      },
    });
  } catch (e) {
    return Response.redirect(home, 302);
  }
}
