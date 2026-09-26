/* ── 자료 파일을 밖에서 곧바로 부르는 것을 막는다 (2026-09-25) ────────
 *
 * ### 왜
 *
 * `data.json` 한 방이면 2,263건이 통째로 나간다. 재 봤다.
 *
 *     data.json 한 번        요청 1번 · 1.6초 · 전부
 *     상품 페이지 하나씩       요청 2,006번 · 25분
 *
 * 앞엣것은 **요청이 한 번이라 속도 제한이 걸리지 않는다.** 이 한 겹이
 * 없으면 다른 보호 장치가 다 무의미하다.
 *
 * ### 구글에 영향이 없다
 *
 * 검색에 나가는 값은 정적 HTML 2,247장 안에 따로 박혀 있다.
 * **구글은 이 파일을 읽지도 않고 필요하지도 않다.**
 *
 * ### 왜 이 자리에 두나 — `_middleware.js` 가 아니라
 *
 * 뿌리에 `_middleware.js` 를 두면 **모든 요청**이 이 코드를 지난다.
 * 한 줄 잘못 쓰면 2,247장이 통째로 죽는다. 파일 이름으로 길을 잡으면
 * (`data.json.js` → `/data.json`) 이 한 주소에만 걸린다.
 *
 * ### 완벽하지 않다 — 값을 올리는 것이다
 *
 * `Referer` 는 한 줄로 흉내 낼 수 있다. 목표는 못 하게 하는 것이 아니라
 * `1.6초` 를 `25분 + 계속 막힘` 으로 만드는 것이다.
 *
 * ### 손대기 전에
 *
 * 이걸 잘못 건드리면 **앱 목록이 안 뜨고 흰 화면**만 남는다. 고쳤으면
 * 반드시 브라우저로 열어 보고 목록이 그려지는지 확인해라.
 */
const OK_HOSTS = ["pxpick.com", "pages.dev", "localhost", "127.0.0.1"];

export async function onRequest(context) {
  try {
    const { request, next } = context;
    const ref = request.headers.get("referer") || "";
    // 브라우저가 스스로 붙이는 값. curl 은 안 붙인다.
    const site = request.headers.get("sec-fetch-site") || "";
    const mine = site === "same-origin" ||
      OK_HOSTS.some((h) => ref.includes(h));
    if (mine) {
      const res = await next();
      // ★ 이름표(?v=내용지문)가 붙었을 때만 1년 캐시 (2026-09-26).
      // 내용이 바뀌면 이름이 바뀌므로 오래 둬도 옛것이 남지 않는다.
      // 이름표 없이 부르면 예전 그대로 둔다 — 옛 화면이 들고 있을 수 있다.
      if (!res.ok || !new URL(request.url).searchParams.has("v")) return res;
      const out = new Response(res.body, res);
      out.headers.set("Cache-Control", "public, max-age=31536000, immutable");
      return out;
    }
    return new Response(
      "이 파일은 pxpick.com 화면에서만 씁니다.\n" +
      "상품 값은 https://pxpick.com/ 에서 보실 수 있습니다.\n",
      { status: 403, headers: { "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store" } },
    );
  } catch (e) {
    // ★ 무슨 일이 있어도 사이트를 죽이지 않는다. 막는 것보다 뜨는 게 먼저다.
    return context.next();
  }
}
