"use strict";

/**
 * 초기 배열의 원소를 분석한 후 오류가 있다면 걸러내기 위한 함수
 * @param {arr} arr // 초기 배열 
 * @returns 
 */
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

/**
 * 카드 게임을 진행하게 해주는 클래스
 */
class playGame {
  /**
   * 
   * @param {pile1} arr1 // 첫 번째 카드 줄
   * @param {pile2} arr2 // 두 번째 카드 줄
   * @param {pile3} arr3 // 세 번째 카드 줄
   * @param {pile4} arr4 // 네 번째 카드 줄
   */
  constructor (pile1, pile2, pile3, pile4) {
    this.piles = [pile1, pile2, pile3, pile4];
    this.stop = false;
  }

  start(cardValue) {

    // 총 pile(줄)의 개수
    const pileCount = this.piles.length;
    // 유효한 pile이 하나라도 있는지 여부
    let hasCandidate = false;
    // 현재까지 찾은 최적의 차이값
    let closestDifference = NaN;
    // 그 차이가 발생한 pile의 인덱스 
    // undefined 값은 굳이 설정하지 않다는 점을 알 수 있다.
    let selectedPileIndex;

    // 차이를 계산
    for (let pileIndex = 0; pileIndex < pileCount; pileIndex++) {

      const pile = this.piles[pileIndex];

      if (pile.length === 0) continue;
      
      // 값이 있다면 차이값을 저장해준다.
      const diff = pile.at(-1) - +cardValue;
      hasCandidate = true;

      // 각 pile의 마지막 카드와 비교해 차이를 계산
      // 여기에 분명 좀 더 좋은 코드가 있을것이다.
      if (isNaN(closestDifference)) {
        closestDifference = diff;
        selectedPileIndex = pileIndex;
      }
      else {
        // 절댓값이 더 작으면 갱신
        if (Math.abs(closestDifference) > Math.abs(diff)) {
          closestDifference = diff;
          selectedPileIndex = pileIndex;
        }
        // 절댓값이 같고, 원래값이 더 크면 갱신
        else if (Math.abs(closestDifference) === Math.abs(diff) && closestDifference < diff) {
          closestDifference = diff;
          selectedPileIndex = pileIndex;
        }; 
      } 
    }
    
    // 스왑이 한번도 이루어지지 않았다는것은 배열안에 모든값이 존재하지 않는다는 의미임으로 게임을 종료한다.
    this.stop = !hasCandidate;
    if (this.stop) return 0;
    
    // 여기도 더 좋은 로직이 있을수 있다. 
    // 양수 차이 → 해당 pile에 카드 추가
    if (closestDifference > 0) this.piles[selectedPileIndex].push(cardValue);
    // 음수 차이 → 해당 pile 비우고 페널티 부과
    else {
      const penalty = this.piles[selectedPileIndex].length;
      this.piles[selectedPileIndex] = [];
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
  // 사용 메모리 정수 4 * 10 = 40 byte 예상
  // 시간 복잡도 O(1) 예상
  // 개선한다면 메모리를 줄이는 쪽으로 생각해보자 
  const arrBool = checkArr(userArr)
  if (!arrBool) return result;

  // 각 배열 
  const arr1 = [10];
  const arr2 = [30];
  const arr3 = [50];
  const arr4 = [80];

  // game 세팅
  // 
  const game = new playGame(arr1, arr2, arr3, arr4);
  const resultKeyName = Array.from(result.keys());

  // 게임 시작
  /** 
  변수 많고 복사한 배열도 많음 -> 배열을 여러번 복사하고 확인하고 하는 등 너무 난잡하게 사용했다 이부분을 
  개선하는 방향으로 가보자.
  */
  /**
  시간복잡도 O(n) 예상 -> 유저가 입력한 배열을 돌리는 부분이라서 사실상 시간 복잡도를 줄이는 방향은
  떠오르지 않는다 따라서 이부분에서는 개선할 부분이 생각나지 않는다.  
  */ 
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
// 데이터 입력/출력 부분
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputs = [];
rl.on('line', (line) => {
  inputs.push(line);
  if (inputs.length === 1) {
    rl.close();
  }
});

rl.on('close', () => {
  const numArray = inputs[0].split(',').map(Number);
  const answer = play(numArray);
  for (const [key, value] of answer){
    console.log(key+"="+value);
  }
  rl.close();
});