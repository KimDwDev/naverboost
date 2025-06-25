function play(param0) {
  const result = new Map([['A', 0], ['B', 0], ['C', 0]]);
  const arrays = [[10], [30], [50], [80]];
  if (param0.length % 3 !== 0) {
    return result;
  }

  // 매 턴 진행
  for (let i = 0; i < param0.length; i += 3) { 
    const positions = { 'A': i, 'B': i + 1, 'C': i + 2 }; // a, b, c 위치 저장
    const inputs = param0.slice(i, i + 3).sort((a, b) => b - a); // a, b, c 숫자 값 내림 차순정렬

    while (inputs.length) {
      const num = inputs.pop();
      let target = [-1, 99, false];

      // 각 숫자 카드 내림 가능 여부 확인
      let count = 0;
      for (let j = 0; j < arrays.length; j += 1) {
        if (arrays[j].length === 0) {
          count += 1;
          continue;
        }
        
        const diff = Math.abs(num - arrays[j][arrays[j].length - 1]);
        if (target[1] >= diff) { // 조건 A
          if (target[1] === diff && arrays[j][arrays[j].length - 1] > arrays[target[0]][arrays[target[0]].length - 1]) {
            target[0] = [j];
          } else {
            target = [j, diff];
          }

          if (num < arrays[j][arrays[j].length - 1]) { // 조건 B
            target[2] = true;
          } else {
            target[2] = false;
          }
        }
      }
      if (count === 4) { // 모든 배열이 빈 경우 조기 종료
        return result;
      }
      
      // 삽입 or 배열 비우기
      if (target[2]) {
        arrays[target[0]].push(num);
      } else {
        for (let key of result.keys()) {
          if (param0[positions[key]] === num) {
            result.set(key, result.get(key) + arrays[target[0]].length);
            arrays[target[0]] = [];
            break;
          }
        }
      }
    }
  }

  return result;
}


// test
let iunput;
/* inputs = [
  [21, 9, 4],
  [1, 2, 3],
  [51, 12, 11, 15, 9, 61],
];
for (let i = 0; i < inputs.length; i++) {
  console.log(`------------------------------ test #${i + 1} ------------------------------`);
  console.log(`input = ${inputs[i]}`);
  console.log('result =', play(inputs[i]));
} */

// input test
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  outupt: process.output,
});

inputs = [];
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