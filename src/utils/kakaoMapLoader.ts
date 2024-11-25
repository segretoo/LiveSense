// src/utils/kakaoMapLoader.ts
const loadKakaoMap = (callback: () => void) => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false&libraries=services,clusterer`;
    script.onload = () => {
        window.kakao.maps.load(callback); // 카카오 맵 API 로드 후 콜백 실행
    };
    document.head.appendChild(script);
};

export default loadKakaoMap;
