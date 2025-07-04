# 방향

1. 내부 구조(버킷, 해시 함수, 충돌 처리 방식 등)를 정확히 파악

2. 공부한 이론과 요구 데이터의 특성에 맞춰 해시 알고리즘을 설계

3. put, get, remove 등 기본 동작을 요구사항에 맞춰 개발

4. 새로운 조건이나 성능·안정성 개선 방안을 읽고, 설계·코드에 반영해 보

# 공부

1. 배열대신 해시를 사용하는 이유:
  
  - 만약 key값이 인덱스가 아니고 특정 값일 경우 배열의 경우는 O(n)이 들지만 해시의 경우 O(1)이 든다.
  - 모든 경우의 수를 이용해서 배열을 만들어서 해당 인덱스의 값을 찾을 수 있다면 배열도 같은 성능을 낼 수도 있지만 
    그럴 경우에는 모든 경우의 수를 찾기도 힘들뿐더러 크기또한 매우 커진다.
  - 만약 중복되는 KEY값일 경우 해시 충돌인데 이를 해결하는게 중요하다.
  - 해시의 크기와 KEY를 어떻게 설정할지에 대해서 자세하게 이해해야 겠다.

2. 해시 function을 만드는 것이 중요한 개념이다.

3. 해시는 bucket size라는 것이 있는데 만약 들어오는 key값이 설정해 놓은것 보다 클때 이 bucketsize를 늘린다.

  - 로드 팩터라는 개념이 존재한다. : 로드팩터 기준을 설정하고 저장항목수 / bucketsize 이 넘어가면 버킷의 수를 늘림

4. 초반 bucket size는 16, 로드팩터는 0.75로 한다.

5. key 값을 utf-8로 인코딩해서 값을 낸다.
  - utf-8이 어떻게 인코딩하는지 공부를 해보야 한다.
  
  -1. 전세계에 대부분의 문자가 저장된 유니코드 표준 에서 해당 문자열의 번호를 찾는다. (16진수)
  -2. 해당 16진수로 표현된 표는 utf-8의 방식에 의해서 4바이트씩 각 배열의 넣는다. (헷갈렸던거 다시 돌아갈려면? 단순 16진수 계산으로는 안된다.)

6. utf-16을 가져와서 해석하는 java방식으로 인코딩을 진행할것이다.
  
  -1. 유니코드 표준 표에서 16진수로된 코드를 10진수로 변형한다.
  -2. 초기값 0이고 hashvalue = hashvalue * 31 + (10진수로 변형한 값) 로 계산한다.
  -3. 이진법으로 표현할 수 있는 최댓값은 (4바이트)32비트이다 따라서  | 0을 이용하면 오버 플로우를 계산 할 수 있다.
  -4. 우리는 양수의 인덱스를 써야 하니까 다시 32비트의 정수로 변환을 해준다.
  -5. bucket size와 우리가 구한 정수와의 이진 계산을 통해서 인덱스를 가져온다.


7. ^은 nor 방식으로 달라야 1을 주는 방식이다.

8. 채이닝 충돌 처리 방식 
  
  -1. 해당 키 위치에 데이터가 있다면 같거나 없을때까지 순환해서 대입한다.
  -2. 만약 끝까지 발견하지 못했다면 마지막에 값을 추가한다.

9. 리사이징 여부

  -1. 데이터의 크기가 만약 특정 조건에 다다르면 리사이징을 해준다.
  -2. 리사이징이 별개 있는게 아니다 다시 key값을 다 꺼내고 다시 정렬해주면 된다.

10. flat() 함수는 자바스크립트에서 평탄화를 시켜주는 함수이다 
  -> 자바스크립트에 []는 flat() 함수를 통해서 평탄화가 진행된다.

11. Array.from({length}, () => [])는 해당 배열을 참조 없이 length길이만큼 만들때 사용되어 진다.

12. splice()를 이용하면 해당 배열에 있는 값을 삭제할 수 있다.

# 고민 

1. 어떻게 하면 해시맵의 배열의 크기는 최소화 하면서 속도를 빠르게 할 수 있을까?

  - 기존에 다른 사람이 이미 많들어 놓은 해시 맵이 있기에 획기적인걸 만드는 건 짧은시간에 쉽지 않을것이다.
  - 나름 타당한 이유의 함수를 만들어서 인덱스화 하자.

2. 가장 간단한것 부터 만들면서 이해를 해보자

3. 이게 뭐야 내가 모르는 건가? 자바스크립트에 Map클래스는 해시 충돌을 그냥 교체로 바꿨는데? 뭐지 혼란스럽다.
나는 어떻게 처리해야 할까? 
  -> 인덱스가 같을데 충돌이 일어나는거지 같은 키값은 당연히 교체하는게 맞다.

4. 수많은 입력값을 내가 어떻게 조정할 수 있단 말인가? 그래 이미 정해진 아스키코드를 이용해서 정해보자.

5. 지금 당장 고민되는 부분은 두가지 이다. 

  - 수많은 인풋값을 내가 어떻게 다 정의할수 있을지? -> 버킷 크기라는것을 생각해봐야 겠다. 
  - 그 인풋값을 어떻게 변형해서 저장할지? -> 어떻게 인덱싱화 하는지 이해해야 겠다.

5-1. 버킷크기, 로드팩터 자바에서는 각각 16, 0.75라고 한다. 이유가 있지 않을까?
  - 16으로 지정하고 2배씩 늘리는 이유 비트연산자를 이용하기 때문이다. 
  - 로드팩터를 0.75로 한것은 경험적으로 정해졌다고 한다. (리사이징 + 탐색률 O(1)에 가깝게 하기에 가장 효율)

5-2. 키값 계산 방법 31 * (이전) + (새로운 유티코드값) => 누적 

6. 충돌이 일어났을때와 key값을 어떻게 정리할지
  
  - 여러가지 방법이 있었다. (체이닝 or 오픈 어드레싱)
  - 나는 체이닝 방식을 선택해야 할것 같다 
    : 이유 
    1. java에서 하는 비트마스킹 형식의 계산은 2배 리사이징을 고려한것이 그 이유인데 체이닝이 리사이징이 간단하기 때문
    2. 클러스트링, 자주 값이 변하는 것에 안정적이기 때문에 이걸 선택

7. 해싱 소수화 문제가 있을수 있음으로 
  : 작은값 1132310000000000, 12300000000000 은 같은걸로 나올 수 도 있음 
  : 중간을 기준으로 왼쪽으로 많이 가기 위해서 기존의 hashValue에 16칸을 왼쪽으로 밀고 두개를 바꾼다. 
  

# 해결

1. java가 키의 hashCode()로 32비트 해시값을 얻고 버킷 수가 2의 거듭제곱이므로 hash & (capacity − 1) 연산으로 배열 인덱스를 산출

2. 산출한 인덱스 위치에 이미 엔트리가 있는지 확인

3. 충돌이 일어날 경우 체인방식을 통한 처리

4. java의 기준에 (현재 엔트리 수 / 버킷 수) > loadFactor(0.75)일 때 버킷 수를 2배로 늘리고 모든 키·값을 재해싱하여 새 배열에 재배치


# 추가 

1. 인덱스화 하는 방식이 비트마스크 말고도 나머지 방식이 있음을 확인 이를 이용해서 해시맵도 고려해보자

2. 충돌을 처리하는 방식이 체이닝 말고도 개방 주소법도 존재 이를 연구해보자

# 동료에게 배운점

1. 개방 주소법을 이용해서 충돌을 방지하기 위해서는 이중 해싱법을 이용해서 처리한다.

2. 이중 해싱을 이용해서 두 값을 더해서 인덱싱화 하는 방법이 있다. 

3. 이중 해싱은 두 해싱이 서로소 일때 더 좋은 효과를 가진다. 

4. 개방 주조법은 만약 충돌이 나면 해당 값에 추가를 해서 충돌을 막는다. 