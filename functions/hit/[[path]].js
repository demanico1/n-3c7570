/* ── 소개 화면에서 앱으로 넘어가는 단추 세기 (2026-10-02 사장님) ─────────────
 *
 * 소개 화면(홈·추천템·가이드·상품 상세)의 스크립트가 이 주소로 신호를 한 번 보낸다.
 *
 *     /hit/<페이지>/<무엇>/<들어온 곳>[/<검색어>]
 *     /hit/home/view/nsearch            홈을 열었다 (네이버 검색에서 옴)
 *     /hit/home/end/ad/PX               맨 아래 단추를 눌렀다 (광고 · 키워드 PX)
 *
 * **여기서는 아무것도 저장하지 않는다.** 클라우드플레어가 요청 주소별로 세어 둔 숫자를
 * `참고_수집스크립트/조회/성과.py` 가 읽는다(httpRequestsAdaptiveGroups · clientRequestPath).
 * 사람 한 명 한 명을 따라가지 않는다 — 쿠키도, 사람마다의 번호도 없다.
 *
 * 검색과 무관하다: 링크가 아니라 사이트맵에도 없고, noindex 를 붙여 돌려준다.
 * 무슨 일이 있어도 204 — 이 기능이 죽어도 화면은 아무 영향을 안 받는다.
 */
export async function onRequest() {
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
