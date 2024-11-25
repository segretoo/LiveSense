// src/global.d.ts

declare global {
    interface Window {
        kakao: typeof kakao; // kakao 객체를 명시적으로 정의
    }
}

// 카카오 API에 필요한 기본 타입 정의
declare namespace kakao {
    namespace maps {
        class Map {
            constructor(container: HTMLElement, options: MapOptions);
        }

        class LatLng {
            constructor(lat: number, lng: number);
        }

        class Marker {
            constructor(options: MarkerOptions);
            setMap(map: Map): void;
        }

        interface MapOptions {
            center: LatLng;
            level: number;
        }

        interface MarkerOptions {
            position: LatLng;
        }
    }
}
