# 📊 데이터 설계


## 1. 데이터 구조 및 설명

| NAME             | TYPE     | DESCRIPTION                                                      |
|------------------|----------|------------------------------------------------------------------|
| Email            | string   | 유저의 이메일                                                   |
| ClientStartTime  | datetime | 유저가 클라이언트에서 행동을 시작한 시간                        |
| ServerStartTime  | datetime | 유저가 요청을 보냈을 때 서버가 행동을 시작한 시간               |
| PageName         | string   | 페이지 이름                                                     |
| PageTypeCode     | string   | 페이지의 종류를 나타내는 코드 번호                              |
| Action           | string   | 유저가 수행한 행동                                              |
| PageId           | uuid     | 해당 페이지의 고유 아이디                                       |
| ClientEndTime    | datetime | 유저가 해당 행동을 끝냈을 때의 클라이언트 측 종료 시간          |
| ServerEndDate    | datetime | 유저가 행동을 끝낸 후 서버에 값을 저장한 시점 (클라이언트 기준) |


## 2. 예시 시나리오: 유저의 페이지 진입 (view 행동)

  1. 유저가 페이지에 진입한 시점 

    - 사용자는 2025-06-30 xx시 xx분 xx초에 main 페이지에서  view   행동을 수행합니다.
    
  2. 클라이언트에서 데이터 생성 및 요청 전송

    - 클라이언트는 다음과 같은 JSON 데이터를 생성하여 서버에 요청을 보냅니다:
  ``` js
  {
    "StartClientDate": "2025-06-30 xx:xx:xx",
    "Page": "main",
    "Action": "view"
  }

  ```

  3. 서버에서 요청 수신 및 처리

    - 서버는 요청을 수신한 시점 (2025-06-30 xx:xx:xx)의 서버 시간을 기준으로 다음과 같은 처리를 수행합니다:
      
      * 요청한 유저의 이메일: "xxx"

      * 페이지 이름: "main"

      * 수행된 행동: "view"

      * 페이지 ID는 UUID로 랜덤 생성되며, 예:
      PageId: "550e8400-e29b-41d4-a716-446655440000" 


![alt text](image.png)

## 3. 데이터 수집 방법

### ✅ 1. URL 활용

  - 페이지 정보를 URL 파라미터에서 추출하여 수집합니다.
  - 예시: https://example.com/event&page=1 -> event 페이지의 1번 페이지를 보고 있음
  - & 구분자를 활용해 파싱 처리 예정

### ✅ 2. 쿠키 활용

  - 페이지 방문 시 생성된 PageId를 쿠키로 저장하여 추적합니다
  - SameSite=Lax 정책을 사용하여 페이지 간 요청에도 안정적으로 유지됩니다.
  - PageId=550e8400-e29b-41d4-a716-446655440000

### ✅ 3. 이벤트 리스너 활용

  - 특정 사용자 행동을 감지하여 수집 로직을 트리거합니다.
  - 예시:
    ``` js
      document.querySelector("button").addEventListener("click", () => {/** 수집 로직 */});
    ```

## 4. 데이터 구조 설계 이유

  1. Map 자료구조 사용 이유

    페이지마다 수집 항목이 다를 수 있기 때문에, 유연하고 빠르게 키-값 접근이 가능한 Map 구조를 사용합니다.

  2. 설계 목적

    사용자 행동을 추적할 때 누가(Email, PageId), 언제(Start/EndClient/ServerDate),어디서(PageName, PageTypeCode), 무엇을(Action) 수행했는지를 정밀하게 기록하기 위함입니다.

  3. Email / PageId 분리 이유

    로그인하지 않은 페이지도 고려하며, EndServerDate와의 연동 시 추적의 유연성을 위해 별도 필드로 유지합니다.

  4. Client vs Server 시간 분리 이유

    클라이언트 체류 시간 분석, 서버 지연 계산, 사용자 UX 측정 등을 위해 양쪽 시간을 모두 기록합니다.

  5. PageTypeCode 필드 이유

    동일한 URL이라도 페이지 구성(탭/뷰 등)에 따라 다른 식별이 필요할 수 있어 타입 분리를 위해 사용합니다.

  6. 쿠키 사용 이유

    LAX 쿠키를 통해 페이지 간 데이터 추적이 가능하며, 동일 페이지 내 행동 식별에 유리합니다.

# 🖼 시각적 예시

![alt text](image-1.png)

## 결과 찾는 방법

## 결과 찾는 방법

### 1. 하루 동안 얼마나 많은 사용자들이 <로그인 화면>에 접속하는가
  
  #### 1-1. 데이터수집 로그
  - 사용자가 로그인 화면(/(홈페이지)/login)에 접근합니다.

  - 이벤트 리스너가 실행되며, 클라이언트는 다음 데이터를 백엔드에 전송합니다.
  ```js
  {
    "ClientStartTime" : "2025-06-30 HH:MM:SS",
    "PageName" : "login",
    "Action" : "view"
  }
  ```
  - 백엔드는 서버 기준 시간과 PageId를 추가하여 DB에 저장합니다.
  ```js
  {
    "ServerStartTime" : "2025-06-30 HH:MM:SS",
    "PageId" : "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
  - 최종적으로 다음과 같은 데이터가 저장됩니다.
  ```js
  {
    "ClientStartTime" : "2025-06-30 HH:MM:SS",
    "PageName" : "login",
    "Action" : "view",
    "ServerStartTime" : "2025-06-30 HH:MM:SS",
    "PageId" : "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
  
  #### 1-2. 데이터 사용 방법

  - 로그인 화면에 view 행동을 한 사용자의 수를 집계합니다.
  ``` sql
  SELECT count(*) AS 사용자수 FROM users u
  WHERE 
    DATE(u.ClientStartTime) = '2025-06-20' AND
    u.PageName = 'login' AND
    u.Action = 'view';
  ```

### 2. <이벤트 광고> 화면을 가장 많이 본 사용자는 누구인가

  #### 2-1. 데이터수집 로그
  - 메인화면에서 유저가 이벤트 버튼을 클릭합니다.

  - 클라이언트는 1~5 사이의 숫자를 무작위로 선택하여 모달을 띄우고, 다음 정보를 백엔드로 전송합니다.
  ``` js
  {
    "ClientStartTime" : "2025-06-30 HH:MM:SS",
    "PageName" : "mainModal",
    "PageTypeCode" : "1" ~ "5",
    "Action" : "view",
  }
  ```
  - 함께 전송되는 쿠키에는 PageId와 JWT 토큰이 포함됩니다.

  - 백엔드는 Email, Server 시간, PageId를 추가하여 최종 저장합니다.
  ```js
  {
    "Email" : "xxx",
    "ServerStartTime" : "2025-06-30 HH:MM:SS",
    "PageId" : "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
  - 최종
  ```js
  {
    "ClientStartTime" : "2025-06-30 HH:MM:SS",
    "PageName" : "mainModal",
    "PageTypeCode" : "1" ~ "5",
    "Action" : "view",
    "Email" : "xxx",
    "ServerStartTime" : "2025-06-30 HH:MM:SS",
    "PageId" : "550e8400-e29b-41d4-a716-446655440000"
  }
  ```

  #### 2-2. 데이터 사용 방법

  - PageName이 mainModal이고 Action이 view인 데이터를 Email 기준으로 그룹핑하여 가장 많이 본 사용자를 찾습니다.

  ```sql
  SELECT email, count(*) AS "count" FROM users u
  WHERE u.PageName = 'mainModal' AND u.Action = 'view'
  GROUP BY u.email;
  ```

### 3. <메인 화면>을 가장 많이 보는 시간대는 하루 중에 언제인가

  #### 3-1. 데이터수집 로그
  - 메인 화면 진입 시 아래와 같은 데이터가 저장됩니다.
  
  ```js
  { 
    "Email" : "xxx",
    "ClientStartTime" : "2025-06-30 HH:MM:SS",
    "PageName" : "main",
    "Action" : "view",
    "ServerStartTime" : "2025-06-30 HH:MM:SS",
    "PageId" : "550e8400-e29b-41d4-a716-446655440000"
  }
  ```

  - 사용자가 다른 페이지로 이동할 경우, 해당 PageId에 대한 종료 시간을 업데이트합니다.
  ```sql
  UPDATE users 
  SET ClientEndTime = '2025-06-30 HH:MM:SS',
  ServerEndDate = '2025-06-30 HH:MM:SS'
  WHERE email = 'xxx' AND PageId = '550e8400-e29b-41d4-a716-446655440000' ;
  ```

  #### 3-2. 데이터 사용 방법

  - ClientStartTime을 기준으로 시간 단위 그룹을 하고, PageId별로 행동 시간(초)을 계산하여 집계합니다.
  ```sql
  SELECT DATE_FORMAT(u.ClientStartTime, '%Y-%m-%d %H:00:00') as "date", 
        TIMESTAMPDIFF(SECOND, u.ClientStartTime, u.ClientEndTime) as "value"
   FROM users u
   WHERE u.ClientEndTime IS NOT NULL AND 
   u.ClientStartTime IS NOT NULL
   GROUP BY DATE_FORMAT(u.ClientStartTime, '%Y-%m-%d %H:00:00')
   , u.PageId;

  ```

### 4. 메뉴 1-2-3 화면 중에서 가장 전환을 많이하는 화면은 어디서/어디로 전환하는 경우인가.

  #### 4-1. 데이터수집 로그

  - 유저가 메뉴 버튼을 클릭하면 "이전페이지-다음페이지" 형식으로 PageTypeCode에 저장하여 전환을 기록합니다. 
  ```js
  {
    "Email" : "xxx",
    "ClientStartTime" : "2025-06-30 HH:MM:SS",
    "PageName" : "menu 1 ~ 3",
    "PageTypeCode" : "main~3-1~3",
    "Action" : "click",
    "ServerStartTime" : "2025-06-30 HH:MM:SS",
    "PageId" : "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
  
  #### 4-2. 데이터 사용 방법

  - PageName이 menu1 ~ menu3이고 Action이 click인 데이터를 PageTypeCode로 그룹핑하여 전환 경로를 집계합니다
  ```sql
  SELECT PageTypeCode, count(*) AS "count" FROM users
  WHERE PageName LIKE 'menu%' 
  AND PageName REGEXP '^menu[1-3]$'
  AND Action = 'click'
  GROUP BY PageTypeCode; 
  ```

### 5. 지난 일주일 동안 메뉴 2 마지막 화면에서 값을 저장하고 <메인 화면>으로 이동한 횟수는 몇 번인가

  #### 5-1. 데이터수집 로그

  - 메뉴2에서의 시작 행동은 다음과 같은 형태로 저장됩니다.
  ```js
  {
    "PageTypeCode" : "aewqpo1230-r1-0-vaj9cj2e12-1eqwdw"
  } 
  ```

  - 메인화면(back)으로 돌아올 때 다음과 같은 데이터가 저장되며, 쿠키에 있는 PageTypeCode로 기존 시작 데이터를 찾아 종료 시간을 업데이트합니다.
  ```js
  {
    "Email" : "xxx",
    "ClientStartTime" : "2025-06-30 HH:MM:SS",
    "PageName" : "menu2Start",
    "PageTypeCode" : "aewqpo1230-r1-0-vaj9cj2e12-1eqwdw",
    "Action" : "click",
    "ServerStartTime" : "2025-06-30 HH:MM:SS",
    "PageId" : "550e8400-e29b-41d4-a716-446655440000"
  }
  ```

  ```js
  {
    "Email" : "xxx",
    "ClientStartTime" : "2025-06-30 HH:MM:SS",
    "PageName" : "menu2End",
    "PageTypeCode" : "aewqpo1230-r1-0-vaj9cj2e12-1eqwdw",
    "Action" : "click",
    "ServerStartTime" : "2025-06-30 HH:MM:SS",
    "PageId" : "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
  ```sql
  UPDATE users
  SET ServerEndTime = '2025-06-30 HH:MM:SS',
  ClientEndTime = '2025-06-30 HH:MM:SS'
  WHERE PageTypeCode = 'aewqpo1230-r1-0-vaj9cj2e12-1eqwdw'
  AND email = 'xxx' AND PageId = '550e8400-e29b-41d4-a716-446655440000'
  ```

#### 5-2. 데이터 사용 방법

  - menu2Start이며 ClientStartTime, ClientEndTime이 모두 존재하고, 행동 시간 차가 7일 이내인 데이터들을 PageTypeCode로 그룹핑합니다.

  ```sql
    SELECT PageTypeCode, COUNT(*) AS "count"
    FROM users
    WHERE 
      Action = 'click' AND 
      PageName = 'menu2Start' AND 
      ClientStartTime IS NOT NULL AND 
      ClientEndTime IS NOT NULL AND 
      TIMESTAMPDIFF(HOUR, ClientStartTime, ClientEndTime) < 168
    GROUP BY PageTypeCode;
  ```

### 6. 하루 동안 메뉴 3 마지막 화면에서 ON/OFF 설정을 선택한 사용자는 몇 명인가


  #### 6-1. 데이터수집 로그

  - menu3NextOn, menu3NextOff 페이지에서 ON 또는 OFF를 선택하면 아래와 같이 저장됩니다.
  ```js
  {
    "Email" : "xxx",
    "ClientStartTime" : "2025-06-30 HH:MM:SS",
    "PageName" : "menu3NextOn" or "menu3NextOff",
    "Action" : "click",
    "ServerStartTime" : "2025-06-30 HH:MM:SS",
    "PageId" : "550e8400-e29b-41d4-a716-446655440000"
  }
  ```


  #### 6-2. 데이터 사용 방법

  - 오늘 날짜 기준으로, 해당 두 페이지에서 click한 사용자를 Email 기준으로 그룹핑하여 한 명만 조회합니다.

  ```sql
    SELECT Email, COUNT(*) AS count
    FROM users
    WHERE 
      DATE(ClientStartTime) = CURDATE() AND
      Action = 'click' AND 
      PageName IN ('menu3NextOn', 'menu3NextOff')
    GROUP BY Email
    LIMIT 1;
   ```

### 7. 최근 일주일 기간에 가장 화면 노출이 적은 화면은 어느 화면인가
  
  #### 7-1. 데이터수집 로그
  
  - 모든 페이지 진입 시 "view" 액션과 함께 로그가 저장됩니다.
  ```js
  {
    "Email" : "xxx",
    "ClientStartTime" : "2025-06-30 HH:MM:SS",
    "PageName" : "",
    "Action" : "view",
    "ServerStartTime" : "2025-06-30 HH:MM:SS",
    "PageId" : "550e8400-e29b-41d4-a716-446655440000"
  }
  ```

  #### 7-2. 데이터 사용 방법
  
  - 최근 7일 이내 Action = 'view'인 데이터를 PageName으로 그룹핑하여 노출 횟수를 집계합니다.
  ```sql
    SELECT PageName, count(*) AS "count" FROM users
    WHERE TIMESTAMPDIFF(HOUR, ClientStartTime, NOW()) 
    < 7 * 24 AND Action = 'view'
    GROUP BY PageName;
  ```


# 📝 표현 방식 및 도구 선택 이유

  ## 1. 중복 행동에 대한 시각적 요약
    
    동일한 행동이나 반복적인 페이지 이동이 많기 때문에, 각각의 페이지 정보를 나열하기보다는 **"어떤 행동에서 어떤 전환이 발생하는지"**를 중심으로 요약하여 표현하였습니다.
    이를 통해 불필요한 상세 설명을 줄이고 사용자 흐름과 구조를 더 효과적으로 전달하고자 했습니다.
___

  ## 2. 시각 자료 도구 선택 이유
    
    PPT:
    직관적인 도형 구성과 화살표 배치가 쉬워서 복잡한 데이터 흐름이나 구조를 그릴 때 유용했습니다.

    draw.io:
    다양한 다이어그램 템플릿을 제공하며, Google Drive와 연동되어 협업에도 용이합니다.
    간단한 UI/UX 흐름, 페이지 관계도를 그릴 때 특히 효과적이라 판단하였습니다.

___

  ## 3. README.md의 중요성 인식
    
    README.md는 개발자라면 누구나 피할 수 없는 필수 문서이며,
    결국 반드시 작성하고 잘 활용해야 하는 숙명이라고 생각합니다.
    이번 작업을 통해 Markdown 문법을 기반으로 가독성 높은 문서를 만들기 위해 꾸준히 연습하고 개선하였습니다.
___

  ## 4. GitHub와의 연계성
    개발 과정에서 GitHub를 자주 사용하는 만큼,
    README.md를 통해 데이터 흐름, 구조, 사용자 행동 등을 명확하게 표현할 수 있다면
    팀원 간의 협업이나 프로젝트 이해도가 훨씬 높아질 것이라 생각했습니다.
    이러한 이유로 README를 시각화와 함께 문서화하는 방향을 선택하였습니다.