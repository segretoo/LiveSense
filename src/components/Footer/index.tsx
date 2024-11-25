import React from 'react';
import { FooterContainer } from './styled';

const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <p>이용약관 | 개인정보처리방침 | 사이트 정보</p>
            <p>&copy; 2024 LiveSense. All Rights Reserved.</p>
        </FooterContainer>
    );
};

export default Footer;
