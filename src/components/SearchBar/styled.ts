import styled from 'styled-components';

// SearchBar Wrapper 컴포넌트
// $를 추가하여 transient prop으로 설정
export const SearchBarWrapper = styled.div<{ $isMapPage: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: ${({ $isMapPage }) => ($isMapPage ? '300px' : '600px')};
    height: ${({ $isMapPage }) => ($isMapPage ? '30px' : '45px')};
    margin: ${({ $isMapPage }) => ($isMapPage ? '0' : '30px auto')};
    margin-top: ${({ $isMapPage }) => ($isMapPage ? '0' : '40px')};
    border-radius: 5px;
    transition: width 0.3s, height 0.3s;
`;

// Google Material Icons 아이콘 스타일링
export const SearchIconWrapper = styled.span`
    position: absolute;
    left: 10px; /* 아이콘을 왼쪽에 배치 */
    top: 50%;
    transform: translateY(-50%); /* 아이콘을 수직 중앙에 위치 */
    font-size: 20px; /* 아이콘 크기 */
    color: #888; /* 아이콘 색상 */
    margin-left: 5px;
`;

// Search Input 필드 스타일링
export const SearchInput = styled.input`
    width: 100%;
    height: 100%;
    padding: 12px;
    padding-left: 40px; /* 아이콘이 있는 만큼 패딩 추가 */
    border-radius: 24px;
    border: 1px solid #e0e0e0;
    font-size: 14px;
    outline: none;
`;
