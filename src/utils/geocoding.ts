// src/utils/geocoding.ts
import axios from 'axios';

export const geocodeAddress = async (address: string) => {
    try {
        const { data } = await axios.get(`https://dapi.kakao.com/v2/local/search/address.json`, {
            params: { query: address },
            headers: { Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}` },
            timeout: 10000,
        });

        if (data.documents && data.documents.length > 0) {
            const { x: longitude, y: latitude } = data.documents[0].address;
            return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
        }

        return null;
    } catch (error) {
        console.error(`Failed to geocode address ${address}:`, error);
        return null;
    }
};
