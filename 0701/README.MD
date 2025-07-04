
## 📁 문제 풀이 요약

### 1. 디렉토리 이름 유효성 검사
- 파일명이 디렉토리 조건(소문자 알파벳 1글자)에 맞는지 정규표현식으로 확인
```js
  const regxp = /^[a-z]{1}$/;
  "a".match(regxp); // true
  "A".match(regxp); // false
```

### 2. 파일명 추출
- 파일 경로에서 마지막 파일명만 추출 (예: a/a/a.aa → a.aa)


### 3. 파일명을 확장자와 아닌걸로 분류한 후 맵으로 처리한다.
- 파일명을 이름/확장자로 분리 후 Map으로 저장
  ```js
  // ex
  a.aa -> Map(a, aa);
  ```

### 4. 파일명별 등장 횟수 기록
- Map 데이터를 바탕으로 {} 객체에 파일명 단위로 카운트 저장
  ```js
  // ex
  Map(a, aa), Map(b, bb) -> { "a.aa" : 1, "b.bb" : 1 };
  ```

### 5. 중복된 파일명 추출
- {} 객체에서 값이 2 이상인 항목만 새로운 Map에 정리
  ```js
  //ex
  {"a.aa" : 2, "b.bb" : 1} -> Map("a.aa", 2);
  ```

## 💡 설계 의도

### 1. Map, {}, 배열의 목적별 사용

  #### 1-1. Map 사용 이유

    - file.js는 프레임워크 구조를 염두에 둔 설계
    - 입력 크기가 커질 수 있는 상황을 대비해, 문자열 해시가 빠른 Map을 사용

  #### 1-2. {} 사용 이유

    - 파일명 등장 횟수 집계에는 입력 수가 작고 구조가 단순하므로, 더 가벼운 {} 객체를 사용
    - 실제 입력 크기가 작다고 확신할 수 있는 경우 최적화 목적

## 😕 아쉬운 점

  ### 1. 파일명 앞에 붙은 " 처리

    - 문자열 앞뒤에 " "가 붙어 있어 매번 수동으로 제거해야 했던 점이 아쉬움

    - 파일명은 일반적으로 규칙이 없고 자유롭기 때문에, " "를 포함하지 않게 미리 필터링하거나 정규식으로 더 정교하게 처리할 수 있는 방법이 있었을 것이라 생각됨


  ### 2. 디렉토리 검증 성능 이슈

    - 현재 디렉토리 검증은 최대 O(n × m × k)의 복잡도가 소요

      - n: 전체 입력 개수

      - m: 디렉토리 깊이 (/ 기준 split)

      - k: 디렉토리 문자열 길이

    - n, m은 피할 수 없더라도, k는 더 최적화할 수 있는 여지가 있었음

    - 하지만 정규표현식을 써야 하는 특성상, 어느 정도의 불가피성도 있었음


## ✅ 요약
| 구분            | 사용한 도구  | 사용 이유         |
| ------------- | ------- | ------------- |
| 디렉토리 유효성 검사   | 정규표현식   | 소문자 1글자 조건 확인 |
| 파일명 카운팅       | `{}` 객체 | 가볍고 빠름        |
| 중복 체크 및 결과 저장 | `Map`   | 프레임워크 확장성 고려  |
