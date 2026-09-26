/* 사진 뭉치(6.8MB)도 같은 이유로 가린다. 설명은 `data.json.js` 에 있다. */
const OK_HOSTS = ["pxpick.com", "pages.dev", "localhost", "127.0.0.1"];

export async function onRequest(context) {
  try {
    const { request, next } = context;
    const ref = request.headers.get("referer") || "";
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
    return context.next();
  }
}
