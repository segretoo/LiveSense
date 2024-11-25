// src/pages/styled.ts
import styled from 'styled-components';

export const MainContainer = styled.div`
   
    margin: 0 auto;
    /* padding: 0 20px; */
`;

export const GridLayout = styled.div`
 max-width: 1200px;
 margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 4개의 열 */
    grid-template-rows: repeat(2, auto); /* 2개의 행 */
    grid-template-areas:
        'category category adBanner adBanner'
        'category category button1 button2'; /* 2행으로 배치 */
    gap: 20px; /* 요소 간격 */
    margin-top: 50px;
    margin-bottom: 50px;
`;

export const CategoryGrid = styled.div`
    grid-area: category;
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2x2 그리드로 설정 */
    grid-template-rows: repeat(2, auto);
    gap: 20px;
`;

export const AdBannerGrid = styled.div`
    grid-area: adBanner;
    background-color: #f8f8f8;
    border-radius: 8px;
    padding: 20px;
`;

export const BottomButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    /* font-weight: bold; */
    height: 100px;
    width: 220px;

    span.material-icons {
        font-size: 24px;
        margin-right: 8px;
        /* color: #f36; */
    }

    &:hover {
        background-color: #f7f7f7;
    }
`;

export const LikeButton = styled(BottomButton)`
    grid-area: button1;
    display: flex;
    flex-direction: column;
`;

export const RentOutButton = styled(BottomButton)`
    grid-area: button2;
    display: flex;
    flex-direction: column;
`;

