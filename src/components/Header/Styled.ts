import styled from 'styled-components';

// Header 전체 컨테이너
export const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 100px;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
`;

// 로고와 SearchBar를 수평으로 배치할 컨테이너
export const LogoSearchWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 20px; /* 로고와 SearchBar 간격 조정 */
`;

// 로고 스타일링
export const Logo = styled.h1`
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
`;

// 네비게이션 메뉴
export const Nav = styled.nav`
    display: flex;
    align-items: center;
    gap: 20px;
`;

export const NavItem = styled.div`
    cursor: pointer;
    font-size: 18px;
`;

export const LoginButtons = styled.div`
    display: flex;
    gap: 10px;
    margin-left: 40px;

    button {
        padding: 8px 16px;
        border: 1px solid #e0e0e0;
        background: white;
        cursor: pointer;
    }
`;
