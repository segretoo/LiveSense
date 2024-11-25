


from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException, WebDriverException
from datetime import datetime
import mysql.connector
from mysql.connector import Error

# ChromeDriver 자동 설치 및 실행
print("Script started")

try:
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    print("ChromeDriver started successfully")
except Exception as e:
    print(f"Error starting ChromeDriver: {e}")
    input("Press Enter to continue...")

NAVER_URL = "https://new.land.naver.com/complexes/"
log_fname = "naver_log_" + datetime.now().strftime("%Y%m%d%H%M%S") + ".log"

# MySQL 연결 함수
def connect_to_db():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='real_estate',
            user='root',
            password='qwerty1234'  # 비밀번호 입력
        )
        if connection.is_connected():
            print("Connected to MySQL")
        return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None

# 지역 정보 표준화
REGIONs = {
    '서울시': '서울특별시', '대구시': '대구광역시', '인천시': '인천광역시', '부산시': '부산광역시',
    '광주시': '광주광역시', '대전시': '대전광역시', '울산시': '울산광역시', '세종시': '세종특별자치시',
    '제주도': '제주특별자치도'
}

SELECT_REGION_KEY = """
    SELECT region_key FROM region_info
    WHERE region_name=%s AND level=3
    AND upper_region=(SELECT region_key FROM region_info
                      WHERE level=2 AND region_name=%s
                      AND upper_region=(SELECT region_key FROM region_info
                                        WHERE level=1 AND region_name=%s))
"""

def adjust_complex_info(data):
    connection = connect_to_db()
    if not connection:
        return None

    # 주소를 공백으로 분리하여 리스트로 저장
    addrs = data['address'].split(' ')
    if len(addrs) < 3:
        return None

    # 주소 형식 변경 (시, 구, 동이 포함된 형태로 변경)
    if addrs[2][-1] == '구' and addrs[1][-1] == '시' and len(addrs) > 3:
        addrs[1] = addrs[1][:-1] + addrs[2]
        addrs[2] = addrs[3]

    data['region1'] = addrs[0]  # 시/도
    data['region2'] = addrs[1]  # 구/군
    data['region3'] = addrs[2]  # 동/읍/면

    # 지번 정보 분리 (지번1, 지번2)
    tmp = addrs[-1].split('-')
    data['jibun1'] = tmp[0]
    data['jibun2'] = tmp[1] if len(tmp) > 1 else 0

    # region_key는 지번을 제외한 시/도, 구/군, 동/읍/면을 합쳐서 설정
    data['region_key'] = f"{data['region1']} {data['region2']} {data['region3']}"

    # 나머지 데이터 처리
    data['family'] = int(data['family']) if 'family' in data else 0
    data['dong'] = int(data['dong']) if 'dong' in data else 0
    data['made_year'] = int(data['made_year']) if 'made_year' in data else 0

    connection.close()



# MySQL에 데이터 저장 함수 (중복 데이터 처리 추가)
def save_to_mysql(data):
    connection = connect_to_db()
    if not connection:
        return

    sql_insert_query = """
    INSERT INTO naver_complex_info (id, category, name, family_cnt, dong_cnt, made_year, min_area, max_area, region_key, jibun1, jibun2, road_addr)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        category=VALUES(category),
        name=VALUES(name),
        family_cnt=VALUES(family_cnt),
        dong_cnt=VALUES(dong_cnt),
        made_year=VALUES(made_year),
        min_area=VALUES(min_area),
        max_area=VALUES(max_area),
        region_key=VALUES(region_key),
        jibun1=VALUES(jibun1),
        jibun2=VALUES(jibun2),
        road_addr=VALUES(road_addr)
    """
    
    record = (
        data['id'], data['cate'], data['name'], data['family'], data['dong'], data['made_year'],
        data['min_area'], data['max_area'], data['region_key'], data['jibun1'], data['jibun2'], data['road_addr']
    )
    
    try:
        cursor = connection.cursor()
        cursor.execute(sql_insert_query, record)
        connection.commit()
        print(f"Record inserted or updated for ID: {data['id']}")
        cursor.close()
    except Error as e:
        print(f"Failed to insert or update record into MySQL table: {e}")
    finally:
        if connection.is_connected():
            connection.close()


# 네이버 크롤링 함수
def get_naver_complex(id):
    data = {}
    try:
        print(f"Opening URL for ID {id}")
        driver.get(NAVER_URL + str(id))
        print(f"URL opened for ID {id}")

        data['id'] = id

        category = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "label--category"))
        ).text
        data['cate'] = category
        print(f"Category extracted: {category}")

        title = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "complexTitle"))
        ).text
        data['name'] = title
        print(f"Title extracted: {data['name']}")

       # 세대 수와 동 수 추출
        features = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "#summaryInfo > .complex_feature > dd"))
        )
        data['family'] = features[0].text  # 세대 수
        data['family'] = int(data['family'][:-2])  # '세대' 제거 후 정수 변환
        data['dong'] = int(features[1].text[2:-1])  # '총 '과 '동' 제거 후 숫자 변환

        print(f"Family count: {data['family']}, Dong count: {data['dong']}")

        try:
            data['approved'] = features[2].text
            if data['approved'] != '-':
                # 점을 제거하고 'YYYYMMDD' 형식으로 변환
                data['made_year'] = int(data['approved'].replace('.', ''))
            else:
                data['made_year'] = "정보 없음"
            print(f"Made year: {data['made_year']}")
        except (IndexError, ValueError):
            data['made_year'] = "정보 없음"
            print(f"Made year not found for ID {id}, setting default value.")

        try:
            areas = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//dt[text()='면적']/following-sibling::dd"))
            ).text
            areas = areas.replace("㎡", "")
            if " ~ " in areas:
                min_area, max_area = areas.split(" ~ ")
            else:
                min_area = max_area = areas.strip()
            data['min_area'] = min_area.strip()
            data['max_area'] = max_area.strip()
            print(f"Min area: {data['min_area']}, Max area: {data['max_area']}")
        except TimeoutException:
            data['min_area'] = "정보 없음"
            data['max_area'] = "정보 없음"
            print(f"Min/Max area not found for ID {id}, setting default value.")

        try:
            for button in WebDriverWait(driver, 5).until(EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, "#summaryInfo > .complex_summary_info > .complex_detail_link > button"))):
                cmd = button.get_attribute("data-nclk")
                if cmd == "CID.complex":
                    button.click()
                    break

            addresses = ['address', 'road_addr']
            i = 0
            for address in WebDriverWait(driver, 5).until(EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, "#detailContents1 > .detail_box--complex .address"))):
                data[addresses[i]] = address.text.strip()
                i += 1

            print(f"Address extracted: {data['address']}, Road address: {data['road_addr']}")
            adjust_complex_info(data)

        except TimeoutException:
            data['address'] = "정보 없음"
            data['road_addr'] = "정보 없음"
            print(f"Address not found for ID {id}, setting default value.")

        return data

    except (NoSuchElementException, TimeoutException, WebDriverException) as e:
        print(f"Error occurred for ID {id}: {e}")
        return None


# 크롤링 작업 실행 및 로그 기록
begin = 1
end = 10

for id in range(begin, end + 1):
    try:
        data = get_naver_complex(id)
        if data is None:
            log_msg = f"{id} : No data or failed"
        else:
            save_to_mysql(data)
            log_msg = f"{id} : success"
    except Exception as e:
        log_msg = f"Error with ID {id}: {e}"
    finally:
        # 로그 파일에 기록
        with open(log_fname, 'a') as log_f:
            log_f.write(log_msg + "\n")
