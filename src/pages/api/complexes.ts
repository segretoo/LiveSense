import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import { geocodeAddress } from '../../utils/geocoding'; // 지오코딩 함수 임포트

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'qwerty1234',
    database: 'real_estate',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    try {
        // MySQL에서 매물 데이터 조회 (주소 기반), 최대 10개의 데이터만 가져오기 위해 LIMIT 추가
        const [rows] = await db.execute(`
            SELECT name, road_addr, min_area, max_area, made_year, dong_cnt, family_cnt, category
            FROM naver_complex_info
            LIMIT 10  -- 여기서 10개의 데이터만 가져오도록 설정
        `);

        // 각 매물에 대해 주소를 지오코딩하여 좌표로 변환
        const complexesWithCoords = await Promise.all(
            rows.map(async (complex) => {
                const coords = await geocodeAddress(complex.road_addr);
                if (coords) {
                    return {
                        ...complex,
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                    };
                }
                return null; // 좌표 변환 실패 시 null 반환
            })
        );

        // 좌표가 유효한 매물만 필터링
        const validComplexes = complexesWithCoords.filter((complex) => complex !== null);

        res.status(200).json({ complexes: validComplexes });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data', details: error.message });
    }
}
