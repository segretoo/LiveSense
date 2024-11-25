import React from 'react';
import Header from '../../components/Header';
import FilterBar from './FilterBar'; // 필터바 컴포넌트
import MapContainer from './MapContainer'; // 지도 컴포넌트
import CategorySidebar from './CategorySidebar'; // 카테고리 컴포넌트
import { PageWrapper, MainContent, CategorySection, MapSection, FilterBarSection } from './styled';

const MapPage: React.FC = () => {
    return (
        <PageWrapper>
            {/* 헤더 */}
            <Header />

            {/* 필터바 */}
            <FilterBarSection>
                <FilterBar />
            </FilterBarSection>

            {/* 메인 컨텐츠 */}
            <MainContent>
                {/* 카테고리 섹션 */}
                <CategorySection>
                    <CategorySidebar />
                </CategorySection>

                {/* 지도 섹션 */}
                <MapSection>
                    <MapContainer />
                </MapSection>
            </MainContent>
        </PageWrapper>
    );
};

export default MapPage;
