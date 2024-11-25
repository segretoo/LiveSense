import React from 'react';
import { useRouter } from 'next/router';
import { HeaderContainer, Logo, Nav, NavItem, LoginButtons, LogoSearchWrapper } from './Styled';
import SearchBar from '../SearchBar'; // SearchBar 컴포넌트 추가

const Header: React.FC = () => {
    const router = useRouter();

    // 지도 페이지에서만 SearchBar 표시
    const isMapPage = router.pathname === '/mapPage';

    return (
        <HeaderContainer>
            {/* 로고와 SearchBar를 감싸는 Wrapper */}
            <LogoSearchWrapper>
                <Logo onClick={() => router.push('/')}>Live Sense</Logo>
                {/* 지도 페이지에서만 SearchBar를 렌더링 */}
                {isMapPage && <SearchBar isMapPage={isMapPage} />}
            </LogoSearchWrapper>

            <Nav>
                <NavItem onClick={() => router.push('/mapPage')}>지도</NavItem>
                <NavItem>관심목록</NavItem>
                {/* <NavItem>방내놓기</NavItem> */}
                <LoginButtons>
                    <button>로그인</button>
                    {/* <button>중개사 가입 / 광고문의</button> */}
                </LoginButtons>
            </Nav>
        </HeaderContainer>
    );
};

export default Header;
