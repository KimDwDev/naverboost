"use strict";

const checkArr = (arr) => {

  // 배열 타입이 맞는지 확인
  if (!Array.isArray(arr)) {
    return 0;
  }

  // 3의 배수 여부 
  const totalCount = arr.length
  if (totalCount % 3 !== 0 ) {
    return 0;
  }

  // 배열값이 1 ~ 100 사이의 자연수이고 10, 30, 50, 80을 포함하지 않는지
  const forbiddenValues = [10, 30, 50, 80]
  for (let i = 0; i < totalCount; i++) {

    const currentValue = arr[i];

    // 1 ~ 100 사이가 아니라면 
    if (currentValue < 1 || currentValue > 100) {
      return 0;
    }

    // 의문점1 
    // 10, 30, 50, 80 포함 여부
    if (forbiddenValues.includes(currentValue)) return 0; 
  }

  // 중복값이 존재하는지 
  const uniqueValues = Array.from(new Set(arr));
  if (uniqueValues.length !== arr.length) return 0;

  return 1;

}

// 인덱스 배열을 알려주는 함수
const IndexSortFunc = (cards) => {

  return Array.from(cards)
  .map((_, idx) => idx)
  .sort((a, b) => cards[a] - cards[b]);

}

// 게임 진행
class playGame {
  constructor (arr1, arr2, arr3, arr4) {
    this.arr = [arr1, arr2, arr3, arr4];
    this.stop = false;
  }

  start(card) {

    // 차이를 계산
    const arrLen = this.arr.length;
    let swap = false;
    let lowerValue = NaN;
    let lowerIdx = undefined;

    // 차이를 계산
    for (let i = 0; i < arrLen; i++) {

      const arr = this.arr[i];

      if (arr.length === 0) continue;
      
      // 값이 있다면 차이값을 저장해준다.
      const diff = arr.at(-1) - +card;
      swap = true

      // 차이값을 파악후 
      if (isNaN(lowerValue)) {
        lowerValue = diff
        lowerIdx = i;
      }
      else {
        // 차이가 최소면 갱신
        if (Math.abs(lowerValue) > Math.abs(diff)) {
          lowerValue = diff;
          lowerIdx = i;
        }
        // 두 절댓값이 같으나 원래값이 더 크면 갱신 (차이는 같으나 더 크기때문에)
        else if (Math.abs(lowerValue) === Math.abs(diff) && lowerValue < diff) {
          lowerValue = diff;
          lowerIdx = i;
        }; 
      } 
    }
    
    // 스왑이 한번도 이루어지지 않았다는것은 배열안에 모든값이 존재하지 않는다는 의미임으로 게임을 종료한다.
    this.stop = !swap;
    if (this.stop) return 0;
    
    // lowerValue는 사실상 업데이트할 때 사용했음으로 내가 사용할 변수는 lowerIdx이다. 
    
    // 값이 양수이면 벌점은 없고 배열의 값을 추가하고 음수이면 배열을 비우고 비운만큼의 벌점을 부과한다. (
    // 중복은 위에서 걸렀기 때문에 같을수는 없다.)
    if (lowerValue > 0) this.arr[lowerIdx].push(card);
    else {
      const penalty = this.arr[lowerIdx].length;
      this.arr[lowerIdx] = [];
      return penalty;
    }

    return 0;
  }
}

const play = (userArr) => {

  // 리턴할 값
  const result = new Map();
  result.set("A", 0);
  result.set("B", 0);
  result.set("C", 0);


  // 예외 처리
  const arrBool = checkArr(userArr)
  if (!arrBool) return result;

  // 각 배열 
  const arr1 = [10];
  const arr2 = [30];
  const arr3 = [50];
  const arr4 = [80];

  // game 세팅
  const game = new playGame(arr1, arr2, arr3, arr4);
  const resultKeyName = Array.from(result.keys());

  // 게임 시작
  const totalCount = userArr.length; 
  for (let i = 0; i < totalCount; i += 3) {
    
    // a, b, c 변수 설정
    const cards = [ userArr[i], userArr[i+1], userArr[i+2] ]
    
    // 인덱스 정렬 (두번째 배열부터는 인덱스 정렬이 잘 되지 않는 문제 발생)
    const cardIndex = IndexSortFunc(cards);

    // 게임이 끝났다면 스탑 해줘야 한다.
    if (game.stop) break;
    
    // 게임 진행
    const cardLength = cardIndex.length
    for (let j = 0; j < cardLength; j++) {

      // 해당 위치에 card값을 사용
      const cardIdx = cardIndex[j];
      const penalty = game.start(cards[cardIdx]);

      // 게임은 끝났다면 멈춘다.
      if (game.stop) break;

      // 벌금 갱신 // 오류 j 대신 cardIndex[j]을 사용해야 함
      const targetKey = resultKeyName[cardIdx];

      // 값 꺼내기
      const current = result.get(targetKey);

      // 값 다시 갱신
      result.set(targetKey, current + penalty);

    }

  }

  return result;
}


// 입력값을 점검하고 문제가 있다면 예외처리 해준다.
const arr = [55, 8, 29, 13, 7, 61];
console.log(play(arr));