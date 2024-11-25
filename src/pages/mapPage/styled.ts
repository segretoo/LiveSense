import styled from 'styled-components';

// 전체 페이지 래퍼
export const PageWrapper = styled.div`
    display: grid;
    grid-template-rows: auto 50px 1fr; /* 헤더, 필터바, 메인 컨텐츠 */
    height: 100vh; /* 화면 높이 전체 사용 */
`;

// 필터바가 들어가는 영역
export const FilterBarSection = styled.div`
    grid-row: 2;
    background-color: #a0e6a0; /* 필터바 배경색 */
`;

// 메인 컨텐츠: 카테고리, 지도
export const MainContent = styled.div`
    grid-row: 3;
    display: grid;
    grid-template-columns: 80px 1fr; /* 카테고리 80px, 나머지 지도 */
    height: 100%;
    grid-gap: 0px; /* 각 섹션 간의 간격 */
`;

// 카테고리 섹션
export const CategorySection = styled.div`
    background-color: #d8bfd8; /* 카테고리 섹션 배경색 */
    width: 100px;
`;

// 지도 섹션
export const MapSection = styled.div`
    width: 100%;
    height: 100%;
`;

export const MapWrapper = styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
`;

export const InfoWindowWrapper = styled.div`
    position: absolute;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
    width: 200px;
    text-align: center;
    transform: translate(-50%, -100%); /* 마커 위에 위치하도록 조정 */
`;

export const ScoreHeart = styled.span<{ color: string }>`
    color: ${({ color }) => color};
    font-size: 18px;
`;
