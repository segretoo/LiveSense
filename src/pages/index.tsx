// src/pages/index.tsx
import React from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategoryCards from '../components/CategoryCards';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';
import { MainContainer, GridLayout, CategoryGrid, AdBannerGrid, LikeButton, RentOutButton } from './styled';

const Home: React.FC = () => {
    return (
        <MainContainer>
            <Header />
            <SearchBar />
            <GridLayout>
                {/* 카테고리 카드들 */}
                <CategoryGrid>
                    <CategoryCards />
                </CategoryGrid>

                {/* 광고 배너 */}
                <AdBannerGrid>
                    <AdBanner />
                </AdBannerGrid>

                {/* 찜한 방, 방 내놓기 버튼 */}
                <LikeButton>
                    <span className="material-icons">favorite</span>
                    찜한 시설
                </LikeButton>
                <RentOutButton>
                    <span className="material-icons">home_work</span>방 내놓기
                </RentOutButton>
            </GridLayout>
            <Footer />
        </MainContainer>
    );
};

export default Home;
