import React, { useEffect, useState } from 'react';
import { MapWrapper } from './styled';
import loadKakaoMap from '../../utils/kakaoMapLoader';
import axios from 'axios';

const MapContainer: React.FC = () => {
    const [complexes, setComplexes] = useState([]); // 매물 데이터를 상태로 관리
    const [map, setMap] = useState(null); // 지도 객체를 저장
    const [infoWindow, setInfoWindow] = useState(null); // 매물 마커 인포윈도우 상태
    const [facilityInfoWindows, setFacilityInfoWindows] = useState([]); // 여러 시설 마커 인포윈도우 상태 관리
    const [facilityMarkers, setFacilityMarkers] = useState([]); // 생성된 시설 마커들을 저장
    const [rangeCircle, setRangeCircle] = useState(null); // 반투명 원 저장

    // 시설 카테고리 정의 (카테고리 그룹별로 나눔)
    const facilityCategories = {
        living: [
            { category: 'MT1', name: '대형마트' },
            { category: 'CS2', name: '편의점' },
            { category: 'PK6', name: '주차장' },
            { category: 'OL7', name: '주유소, 충전소' },
            { category: 'SW8', name: '지하철역' },
            { category: 'BK9', name: '은행' },
            { category: 'PO3', name: '공공기관' },
        ],
        education: [
            { category: 'PS3', name: '어린이집, 유치원' },
            { category: 'SC4', name: '학교' },
        ],
        leisure: [{ category: 'CT1', name: '문화시설' }],
        health: [
            { category: 'HP8', name: '병원' },
            { category: 'PM9', name: '약국' },
        ],
    };

    useEffect(() => {
        // MySQL에서 데이터를 가져오는 API 호출
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/complexes', {
                    params: { lat: 37.5665, lng: 126.978 },
                });
                setComplexes(data.complexes);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    // 특정 마커 클릭 시 반경 700m 이내의 시설들을 검색하는 함수
    const searchNearbyFacilities = (map, markerPosition) => {
        const places = new window.kakao.maps.services.Places();
        const allCategories = [
            ...facilityCategories.living,
            ...facilityCategories.education,
            ...facilityCategories.leisure,
            ...facilityCategories.health,
        ];

        // 기존 시설 마커 제거
        facilityMarkers.forEach((marker) => {
            marker.setMap(null); // 지도에서 마커 제거
        });
        setFacilityMarkers([]); // 상태 초기화

        // 각 카테고리에 대해 장소 검색 및 아이콘 설정
        allCategories.forEach((facility) => {
            places.categorySearch(
                facility.category,
                (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const newMarkers = result.map((place, index) => {
                            const iconSrc = `/images/icon.png`; // 아이콘 이미지 소스 경로
                            const imageSize = new window.kakao.maps.Size(27, 28); // 아이콘 사이즈
                            const imgOptions = {
                                spriteSize: new window.kakao.maps.Size(72, 208), // 스프라이트 이미지 전체 크기
                                spriteOrigin: getSpriteOrigin(facility.category), // 각 카테고리별 스프라이트 위치 계산
                                offset: new window.kakao.maps.Point(13, 28), // 아이콘 좌표에서 마커 위치 조정
                            };
                            const markerImage = new window.kakao.maps.MarkerImage(iconSrc, imageSize, imgOptions);

                            const marker = new window.kakao.maps.Marker({
                                map: map,
                                position: new window.kakao.maps.LatLng(place.y, place.x),
                                image: markerImage, // 아이콘 적용
                                title: place.place_name,
                            });

                            const uniqueId = `closeInfowindow-${index}`; // 고유 ID 생성

                            // 인포윈도우에 카카오맵 장소 정보를 표시 (테두리 내에 정보와 링크 추가)
                            const infowindow = new window.kakao.maps.InfoWindow({
                                content: `
                            <div style="width: 250px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif;">
                                <!-- 제목과 닫기 버튼을 한 줄에 배치 -->
                                <div style="background-color: #f24444; padding: 10px; color: white; display: flex; justify-content: space-between; align-items: center;">
                                    <!-- 이름에 상세보기 링크 추가 -->
                                    <a href="https://place.map.kakao.com/${
                                        place.id
                                    }" target="_blank" style="color: #fff; text-decoration: none;">
                                        <strong>${place.place_name}</strong>
                                    </a>
                                    <!-- 고유한 닫기 버튼 -->
                                    <span style="cursor: pointer; font-size: 18px; color: white;" id="${uniqueId}">✖</span>
                                </div>
                                <!-- 주소 및 기타 정보 -->
                                <div style="padding: 10px; background-color: white;">
                                    <p style="margin: 0;">${place.address_name}</p>
                                    <p style="font-size: 12px; color: #888; margin-top: 4px;">지번: ${
                                        place.road_address_name
                                    }</p>
                                    <p style="margin: 8px 0 0 0; font-weight: bold; color: #009688;">${
                                        place.phone ? place.phone : '전화번호 없음'
                                    }</p>
                                </div>
                            </div>
                        `,
                            });

                            window.kakao.maps.event.addListener(marker, 'click', () => {
                                // 모든 기존 인포윈도우 닫기
                                facilityInfoWindows.forEach((window) => window.close());

                                infowindow.open(map, marker); // 새로운 인포윈도우 열기
                                setFacilityInfoWindows((prev) => [...prev, infowindow]); // 현재 열린 인포윈도우 상태 업데이트

                                // 인포윈도우에 있는 고유 닫기 버튼 이벤트 처리
                                setTimeout(() => {
                                    const closeBtn = document.getElementById(uniqueId);
                                    if (closeBtn) {
                                        closeBtn.addEventListener('click', () => {
                                            infowindow.close(); // 인포윈도우 닫기
                                        });
                                    }
                                }, 0);
                            });

                            return marker;
                        });
                        setFacilityMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]); // 시설 마커 업데이트
                    }
                },
                {
                    location: markerPosition, // 마커 위치 기준
                    radius: 700, // 반경 700m
                }
            );
        });
    };

    // 각 카테고리별 스프라이트 이미지의 위치를 계산하는 함수 (스프라이트 이미지 내 각 아이콘의 좌표 설정)
    const getSpriteOrigin = (category) => {
        const spritePositions = {
            MT1: new window.kakao.maps.Point(10, 36), // 대형마트
            CS2: new window.kakao.maps.Point(10, 180), // 편의점
            PK6: new window.kakao.maps.Point(45, 0), // 주차장
            OL7: new window.kakao.maps.Point(10, 108), // 주유소, 충전소
            SW8: new window.kakao.maps.Point(45, 36), // 지하철역
            BK9: new window.kakao.maps.Point(10, 0), // 은행
            PO3: new window.kakao.maps.Point(45, 72), // 공공기관
            PS3: new window.kakao.maps.Point(45, 144), // 어린이집, 유치원
            SC4: new window.kakao.maps.Point(45, 108), // 학교
            CT1: new window.kakao.maps.Point(45, 180), // 문화시설
            HP8: new window.kakao.maps.Point(10, 72), // 병원
            PM9: new window.kakao.maps.Point(10, 144), // 약국
        };
        return spritePositions[category] || new window.kakao.maps.Point(0, 0);
    };

    useEffect(() => {
        loadKakaoMap(() => {
            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new window.kakao.maps.LatLng(37.5665, 126.978),
                level: 3,
            };

            const map = new window.kakao.maps.Map(mapContainer, mapOption);
            setMap(map);
            const markers = [];

            // InfoWindow 생성
            const iw = new window.kakao.maps.InfoWindow({ zIndex: 10 });
            setInfoWindow(iw);

            let circle = null; // 반경 원을 담을 변수

            // 매물 데이터로 마커 생성
            complexes.forEach((complex) => {
                const markerPosition = new window.kakao.maps.LatLng(complex.latitude, complex.longitude);
                const marker = new window.kakao.maps.Marker({
                    map: map,
                    position: markerPosition,
                });

                markers.push(marker);

                window.kakao.maps.event.addListener(marker, 'click', () => {
                    // 마커 클릭 시 반경 700m 내의 시설 검색 실행
                    searchNearbyFacilities(map, markerPosition);

                    // 기존 원 제거
                    if (circle) {
                        circle.setMap(null);
                    }

                    // 반투명 원 그리기
                    circle = new window.kakao.maps.Circle({
                        center: markerPosition, // 원의 중심좌표
                        radius: 700, // 반경 700m
                        strokeWeight: 2, // 선의 두께
                        strokeColor: '#75B8FA', // 선의 색
                        strokeOpacity: 0.8, // 선의 불투명도
                        strokeStyle: 'solid', // 선의 스타일
                        fillColor: '#CFE7FF', // 채우기 색깔
                        fillOpacity: 0.5, // 채우기 불투명도
                    });
                    circle.setMap(map); // 원을 지도에 표시

                    // made_year 값을 1990.09.22 형식으로 변환하는 함수
                    const formatMadeYear = (made_year) => {
                        if (!made_year) return made_year; // 유효하지 않으면 그대로 반환

                        const strMadeYear = made_year.toString(); // 숫자가 문자열로 처리되지 않을 가능성 대비
                        if (strMadeYear.length !== 8) return strMadeYear; // 8자리 아닐 경우 그대로 반환

                        const year = strMadeYear.substring(0, 4); // 연도
                        const month = strMadeYear.substring(4, 6); // 월
                        const day = strMadeYear.substring(6, 8); // 일

                        return `${year}.${month}.${day}`; // 변환된 형식으로 반환
                    };

                    // 마커 클릭 시 InfoWindow에 표시할 내용
                    const formattedMadeYear = formatMadeYear(complex.made_year); // 여기서 변환된 값 적용
                    const content = `
                        <div style="padding:15px; width:250px; font-family:Arial, sans-serif; border:1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0,0,0,0.1); position: relative;">
                            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                               <h2 style="font-size:16px; margin:0;">${complex.name}</h2>
                            <span style="font-size:14px; background-color:#f2f2f2; padding:2px 6px; border-radius:4px;">${
                                complex.category
                            }</span>
                            </div>
                            <p style="font-size:13px; color:gray; margin: 5px 0;">
                                ${complex.road_addr}
                            </p>
                            <p style="font-size:13px; color:gray; margin: 10px 0;">
                                ${complex.family_cnt}세대 / 총 ${complex.dong_cnt}동 / ${formattedMadeYear}
                            </p>
                            <p style="font-size:13px; color:gray; margin: 5px 0;">
                                ${complex.min_area}㎡ ~ ${complex.max_area}㎡
                            </p>
                            
                            <p style="font-size:14px; font-weight:bold; margin: 10px 0;">리빙스코어 
                                <span style="color:${getHeartColor(complex.living_score)}; font-size:16px;">❤️</span>
                            </p>
                            <!-- 닫기 버튼 추가 -->
                            <button style="background-color: transparent; border: none; color: #ff0000; cursor: pointer; position: absolute; top: 10px; right: 10px;" onclick="window.closeInfoWindow()">✖</button>
                        </div>`;
                    iw.setContent(content);
                    iw.open(map, marker); // 해당 마커에 인포윈도우 열기

                    // 닫기 버튼 동작 구현
                    window.closeInfoWindow = () => {
                        iw.close(); // 매물 인포윈도우 닫기
                        // 시설 마커 제거
                        facilityMarkers.forEach((marker) => marker.setMap(null));
                        setFacilityMarkers([]); // 상태 초기화
                    };
                });
            });

            // 마커 클러스터러 적용
            const clusterer = new window.kakao.maps.MarkerClusterer({
                map: map,
                averageCenter: true,
                minLevel: 5,
            });
            clusterer.addMarkers(markers);

            // 지도의 빈 공간 클릭 시 모든 인포윈도우 숨기기 및 반투명 원, 시설 마커 제거
            window.kakao.maps.event.addListener(map, 'click', () => {
                iw.close(); // 매물 인포윈도우 닫기
                facilityInfoWindows.forEach((window) => window.close()); // 모든 시설 인포윈도우 닫기
                if (circle) {
                    circle.setMap(null); // 반투명 원 제거
                }
                facilityMarkers.forEach((marker) => marker.setMap(null)); // 시설 마커 제거
                setFacilityMarkers([]); // 상태 초기화
            });
        });
    }, [complexes]);

    // 리빙스코어 점수에 따른 하트 색상 결정
    const getHeartColor = (score) => {
        if (score > 80) return 'red';
        if (score > 60) return 'orange';
        if (score > 40) return 'yellow';
        return 'gray';
    };

    return (
        <>
            <MapWrapper id="map" />
        </>
    );
};

export default MapContainer;
