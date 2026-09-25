/* 사진 뭉치(6.8MB)도 같은 이유로 가린다. 설명은 `data.json.js` 에 있다. */
const OK_HOSTS = ["pxpick.com", "pages.dev", "localhost", "127.0.0.1"];

export async function onRequest(context) {
  try {
    const { request, next } = context;
    const ref = request.headers.get("referer") || "";
    const site = request.headers.get("sec-fetch-site") || "";
    const mine = site === "same-origin" ||
      OK_HOSTS.some((h) => ref.includes(h));
    if (mine) return next();
    return new Response(
      "이 파일은 pxpick.com 화면에서만 씁니다.\n" +
      "상품 값은 https://pxpick.com/ 에서 보실 수 있습니다.\n",
      { status: 403, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  } catch (e) {
    return context.next();
  }
}
