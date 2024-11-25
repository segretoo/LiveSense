import React from 'react';
import { ListContainer } from './styled';

const MapSidebar: React.FC = () => {
    return (
        <ListContainer>
            {/* 예시 매물 리스트 */}
            <div className="list-item">
                <h3>월세 3000/30</h3>
                <p>원룸 | 16.52m² | 관리비 5만</p>
            </div>
            <div className="list-item">
                <h3>월세 200/58</h3>
                <p>원룸 | 16.52m² | 관리비 6만</p>
            </div>
            <div className="list-item">
                <h3>월세 1000/60</h3>
                <p>원룸 | 19.83m² | 관리비 5만</p>
            </div>
            {/* 추가 매물 리스트 */}
        </ListContainer>
    );
};

export default MapSidebar;
