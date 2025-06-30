
# 데이터 구조

유저들이 행동할때 수집해야 하는 데이터의 MAP 구조 
{
  "Email" : string, 
  "StartClientDate" :datetime , 
  "StartServerDate" :datetime, 
  "Page" : string , 
  "SpecialNumber" : number, 
  "Action" : string, 
  "PageId" : uuid, 
  "EndClientDate" : datetime,
  "EndServerDate" : datetime
}

- 데이터 설명  

  Email : 유저의 이메일
  StartClientDate : 유저가 클라이언트에서 행동할때 시간
  StartServerDate : 유저가 요청을 보냈을때 서버가 행동을 시작한 시간
  Page : 페이지 이름
  SpecialNumber : 페이지의 종류 번호
  Action : 유저가 한 행동
  PageId : 해당 페이지의 아이디
  EndClientDate : 유저가 페이지에서 해당 행동을 끝냈을때의 클라이언트 시간
  EndServerDate : 유저가 페이지에서 해당 행동을 끝내는 값을 저장할때 클라이언트 시간

- 예시: 메인화면에 들어옴 

  - 클라이언트: 클라이언트 시간 2025-06-30 xx시xx분 xx초에 main페이지에서 view행동을 했음  
    -> { "StartClientDate" : "2025-06-30 xx시xx분 xx초", "Page" : "main", "action" : "view" }
  - 서버: 서버 시간 2025-06-30 xx시xx분 xx초에 이메일 "xxx"이 페이지에서 view음 페이지 아이디는 랜덤으로 uuid를 구하고 쿠키로 보냄
    -> += { "email" : "xxx", "StartServerDate" : "2025-06-30 xx시xx분 xx초", "PageId" : "000000000-00000-00000" }
    -> 쿠키(lax) PageId : "000000000-00000-00000"


- 데이터 수집 방법 

  1. url을 활용 
    - 예시: (홈페이지url)/event&page=1 -> event페이지에 page 1번을 보고 있음
    - &을 이용해서 url을 split할 예정

  2. 쿠키를 활용
    - 예시: PageId -> "000000000-00000-000000" -> 해당 페이지에 아이디에 해당 행동을 할예정
    - Lax라서 페이지마다 다르게 적용됨
  
  3. 이벤트 활용
    - 예시: document.querySelector("button").event("click") -> click이라는 행동을 했을때 무조건 적으로 이 수집 로직을 작성하도록 
      방침

- 데이터 구조 설계 이유

  1. Map 사용 이유
    : 모든 페이지에서 수집할 수 있는 데이터가 일정하지 않기 떄문에 배열, heap, tree구조를 사용하기에는 무리가 있다 따라서 Map구조를 
      활용하여 원하는 데이터를 빠르게 수집후 빠르게 찾을 수 있게 하기 위함

  2. 데이터 설계 이유
    : 유저가 행동을 할때 마다 데이터를 수집할때 누가(Email, PageId), 언제(StartClientDate, EndClientDate, StartServerDate, EndServerDate),
    어디서(Page, SpecialNumber), 무엇을(Action)을 저장하고자 하기 위함

  3. Email, PageId를 각각 사용하여 저장하는 이유 
    : 로그인 페이지 처럼 이메일 없이 저장하는 데이터도 있고 EndDate처럼 처음에 저장한 값을 추적하기에 용이하게 하기 위해서
      다른 열로 지정함

  4. Client, Server 시간을 다르게 하는 이유
    : 클라이언트에서 수행하는 시간과 서버에서 수행하는 시간은 엄밀히 다르기 때문에 유저가 얼마나 클라이언트에 머물러 있었는지 
      상세히 계산 하기 위해서 또는 서버에 성능을 늘리기 위해서 계산 하거나 등 용도에 맞게 따로 저장하기 위해서

  5. SpecialNumber을 설정한 이유 
    : 같은 url 페이지 에서도 여러개의 페이지가 존재할 수 있기 때문에 (예시: 이벤트 페이지) 그렇다.

  6. 쿠키 사용 이유
    : LAX를 사용하여 같은 url에서 해당 페이지에 대한 아이디를 가져오기 위함


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


