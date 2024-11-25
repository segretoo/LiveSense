import React from 'react';
import { SearchBarWrapper, SearchInput, SearchIconWrapper } from './styled';

// src/components/SearchBar/index.tsx

interface SearchBarProps {
    isMapPage?: boolean; // 지도 페이지 여부를 받아서 크기를 조절
}

const SearchBar: React.FC<SearchBarProps> = ({ isMapPage = false }) => {
    return (
        <SearchBarWrapper $isMapPage={isMapPage}>
            <SearchInput type="text" placeholder="지역, 지하철, 대학" />
            <SearchIconWrapper className="material-icons">search</SearchIconWrapper>
        </SearchBarWrapper>
    );
};

export default SearchBar;
