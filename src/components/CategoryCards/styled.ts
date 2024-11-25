// src/components/CategoryCards/styled.ts
import styled from 'styled-components';

export const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2x2 그리드 */
    gap: 20px;
`;

export const Card = styled.div`
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    text-align: center;
    height: 200px;
    width: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    p {
        padding: 10px;
        font-size: 16px;
    }

    span.material-icons {
        font-size: 48px;
        color: #666;
    }

    &:hover {
        background-color: #f7f7f7;
    }
`;
