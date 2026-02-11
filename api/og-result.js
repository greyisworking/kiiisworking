export const config = {
  runtime: 'edge',
};

const typeData = {
  1: {
    ogTitle: '우리 회사는 [이미 이륙한 회사 🚀] 타입!',
    ogDesc: 'AI 준비도 상위 5%. 전 영역 업계 평균 상회. 당신의 회사는?',
  },
  2: {
    ogTitle: '우리 회사는 [활주로 위에 선 회사 🛫] 타입!',
    ogDesc: '방향은 잡았지만 실행이 남았다면? 취약 포인트를 찾아보세요.',
  },
  3: {
    ogTitle: '우리 회사는 [탑승권은 끊은 회사 🎫] 타입!',
    ogDesc: 'AI, 뭐부터 할지 모르겠다면? 5개 영역 우선순위를 알려드립니다.',
  },
  4: {
    ogTitle: '우리 회사는 [아직 공항 밖인 회사 🪑] 타입!',
    ogDesc: '지금 시작해도 늦지 않습니다. AI 기본법 시행, 어디서부터 준비할까요?',
  },
};

export default async function handler(request) {
  const url = new URL(request.url);
  const typeParam = url.searchParams.get('type') || '1';
  const type = Math.max(1, Math.min(4, parseInt(typeParam, 10) || 1));
  const data = typeData[type];
  const baseUrl = 'https://kiiisworking.vercel.app';

  // Fetch the original result.html (bypass cache)
  const resultHtml = await fetch(`${baseUrl}/result.html`, { cache: 'no-store' }).then(r => r.text());

  // Replace OG meta tags
  const modifiedHtml = resultHtml
    .replace(/<meta property="og:title" content="[^"]*" id="og-title">/, 
      `<meta property="og:title" content="${data.ogTitle}" id="og-title">`)
    .replace(/<meta property="og:description" content="[^"]*" id="og-desc">/, 
      `<meta property="og:description" content="${data.ogDesc}" id="og-desc">`)
    .replace(/<meta property="og:image" content="[^"]*" id="og-image">/, 
      `<meta property="og:image" content="${baseUrl}/og/type${type}.png" id="og-image">`)
    .replace(/<meta property="og:url" content="[^"]*" id="og-url">/, 
      `<meta property="og:url" content="${baseUrl}/result?type=${type}" id="og-url">`)
    .replace(/<meta name="twitter:title" content="[^"]*" id="tw-title">/, 
      `<meta name="twitter:title" content="${data.ogTitle}" id="tw-title">`)
    .replace(/<meta name="twitter:description" content="[^"]*" id="tw-desc">/, 
      `<meta name="twitter:description" content="${data.ogDesc}" id="tw-desc">`)
    .replace(/<meta name="twitter:image" content="[^"]*" id="tw-image">/, 
      `<meta name="twitter:image" content="${baseUrl}/og/type${type}.png" id="tw-image">`)
    .replace(/<title>[^<]*<\/title>/, 
      `<title>${data.ogTitle} | AI 준비도 테스트</title>`);

  return new Response(modifiedHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
