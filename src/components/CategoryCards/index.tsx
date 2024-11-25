// src/components/CategoryCards/index.tsx
import React from 'react';
import { CardGrid, Card } from './styled';

const categories = [
    { name: '생활 편의 시설', icon: 'home' },
    { name: '교육 및 학습 시설', icon: 'school' },
    { name: '여가 및 문화 시설', icon: 'loyalty' },
    { name: '의료 및 건강 관리', icon: 'local_hospital' },
];

const CategoryCards: React.FC = () => {
    return (
        <CardGrid>
            {categories.map((category, index) => (
                <Card key={index}>
                    <span className="material-icons">{category.icon}</span>
                    <p>{category.name}</p>
                </Card>
            ))}
        </CardGrid>
    );
};

export default CategoryCards;
