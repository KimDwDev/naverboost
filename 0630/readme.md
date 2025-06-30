
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

  