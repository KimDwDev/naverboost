// 추가 생각

const nextPosition = (start, dice) => {

  // 다이스에 정보가 담겨 있는 리스트 인덱스 -> 옮길 주사위 수 
  const dice_list = new Array(101).fill(0);

  // 특수 케이스 +
  const plus_idx_list = [4, 8, 21, 28, 50, 71, 80];
  const plus_value_list = [10, 22, 21, 48, 17, 21, 19];
  Array.from(plus_idx_list).forEach((idx, value_idx) => {
    dice_list[idx] = plus_value_list[value_idx];
  })

  // 특수 케이스 -
  const minus_idx_list = [32, 36, 48, 62, 88, 95, 97];
  const minus_value_list = [-22, -30, -22, -44, -64, -39, -19];
  Array.from(minus_idx_list).forEach((idx, value_idx) => {
    dice_list[idx] = minus_value_list[value_idx];
  })

  let next = start + dice;

  if (next >= 100) {
    next = 100;
  }

  return dice_list[next] + dice;
}

// 초기값
let start = 1;
let next = 1;

while (next < 100) {

  // 초기값 세팅
  start = next;

  // 주사위 굴리기
  const dice = Math.floor(Math.random() * 6 ) + 1;

  // 주사위 움직이기 
  next = start + nextPosition(start, dice);
  if (next >= 100) {
    next = 100;
  }

  // 콘솔 창에 띄우기 
  console.log("from= ", start, "dice= ", dice, "next= ",next);

}