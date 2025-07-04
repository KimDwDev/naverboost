# 문제 분석

1. 입력값을 확인해라 

2. 게임 규칙을 적용한다.

  - 각 배열의 마지막 요소를 찾는다.
  - 카드와 배열 마지막 요소 간 차이가 가장 작은 배열을 선택한다.
  - 차이가 같으면 배열 마지막 값이 더 큰 쪽을 선택한다.
  - 내려놓은 카드가 배열 마지막 값보다 작으면 카드 추가, 그렇지 않으면 해당 배열을 비우고 배열 길이만큼 벌점을 부과한다.
  - 배열이 비어 있으면 해당 배열은 건너뛴다.

3. 게임 종료 조건 및 결과 반환
  - 4개의 배열이 모두 비워지면 게임을 종료한다.
  - 종료 시 각 참가자별 벌점을 Map 형태로 반환한다.

# 공부

1. 자바스크립트에서 배열타입을 확인하는 함수
Array.isArray(arr) => 결과같이 true 또는 false로 나온다.

2. arr.includes(value)
-> 해당 value값이 arr 안에 존재한다면 true값을 내놓고 없다면 false를 내놓는다.

3. new Set(arr)을 이용해서 중복값을 제거할 수 있다.
-> 주의 리터럴 값이기 때문에 리스트로 사용하려면 Array.from을 사용한다.

4. 자바스크립트에서 Map은 클래스 임으로 new Map을 이용해서 선언해야 하고 set함수를 이용해서 키와 값을 추가할 수 있다.

5. 자바스크립트에서는 하나의 const a = 2; b = 3; 처럼 a, b를 이렇게 동시선언 할 수는 없다.

6. 자바스크립트에서 정렬을 하기 위해서는 sort라는 함수를 써야 하고 sort((a, b) => a - b) a-b의 결과에 따라서 a, b가 정렬 
된다. a-b가 음수라면 a가 b보다 앞이고 양수라면 a 가 b보다 뒤이다. 

7. 자바스크립트에서 문자를 숫자로 고치려면 +"1"을 해주면 된다.

8. 자바스크립트는 다른 언어처럼 -1 같은것을 사용할 수 없다.

9. .at()함수를 이용해서 다른 언어처럼 접근이 가능하다. 

10. isNan으로는 null값의 판단 유무를 알수가 없고 NaN의 유무를 파악하기 위한 함수이다.

11. javasript에서 new Map의 keys()함수는 리터럴값을 내보냄으로 배열로 바꾸는 작업이 중요하다.

12. map 함수에서 값을 변경하려면 기존의 값을 꺼낸 후 그 값에 더해서 추가해야 한다.

13. undefined 값은 값을 지정해주지 않아도 된다.

14. javascipt 에서 Array.from은 하나를 더 복사하는것이다.

# 동료를 통해 배운점

1. slice 함수를 이용해서 해당 배열을 바꾸지 않고 복사하는것이 가능하다.

2. 자바스크립트는 해당 배열에 length값을 0으로 하면 비어진다.

3. Infinity는 자바스크립트에서 무한대를 의미하는 거다.

4. Set에 배열을 넣을때 드는 시간 복잡도는 O(n)이다. 

5. 반복적으로 사용되는 함수는 변수를 이용해서 정리하면 좋다.

# 의문점 

1. [10, 30, 50, 80]을 순차 순회하며 검증하는 것과 if문으로 하나씩 검사하는 것, 어느 쪽이 더 이득인가?
  → 초기값이 고정되어 있으므로 시간 복잡도에는 큰 차이가 없을 것으로 판단


# 깨달은 점
1. 가독성을 위해 의미 있는 변수명을 사용해야 한다. (chat gpt 활용)

2. const IndexSortFunc = (cards) => {

  return Array.from(cards)
  .map((_, idx) => idx)
  .sort((a, b) => cards[a] - cards[b]);

} -> cards 대신 arr를 사용해서 계속 오류가 났었다.
-> 자바스크립트 언어는 편하지만 조금은 느슨한 정책으로 인해서 오류를 찾기 힘들 수 있다는 점 
-> 어떻게 해결할지 고민해봐야 함 

3. 변수 선언은 최소화하되, 복잡한 로직에서는 오히려 명확한 변수 사용이 유지보수에 도움이 된다.

# 해결 

1. checkArr로 입력값 예외 처리(3의 배수, 범위, 중복, 금지값).

2. 턴마다 userArr를 3개씩 분할하고, IndexSortFunc로 오름차순 인덱스 정렬.

3. 정렬된 인덱스와 Map 키(A, B, C)를 매핑해 참여자 이름을 찾음.

4. playGame.start()로 카드 추가/벌점 계산.

5. 종료 시점에는 Map에 누적된 벌점을 출력.

# 추가 사항 

1. 전체 시간 복잡도를 계산하고, 최적화 가능 지점 고민하기.

2. 변수명·함수명 가독성 개선.

3. 주석을 명확하고 간결하게 작성.

4. 클린 코드 스타일 적용.