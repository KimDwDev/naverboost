
/**
 * 
 * @param {*} current 
 * @param {*} dice 
 * @returns 
 */
function nextPosition(current, dice) {
    const next = current + dice;
    
    // 기존 코드 
    // if (next == 4) {
    //     return dice + 10;
    // }
    // else if (next == 8) {
    //     return dice + 22;
    // }
    // else if (next == 28) {
    //     return dice + 48;
    // }
    // else if (next == 21) {
    //     return dice + 42;
    // }
    // else if (next == 50) {
    //     return dice + 17;
    // }
    // else if (next == 71) {
    //     return dice + 92;
    // }
    // else if (next == 80) {
    //     return dice + 19;
    // }
    
    // return dice;    
    // }


    /// 자바스크립트에서는 === 로 구분을 한다. 
    if (next === 4) {
        return dice + 10;
    }
    else if (next === 8) {
        return dice + 22;
    }
    else if (next === 21) { /// 여기서 21일땐 21만 더해야 한다.
        return dice + 21;
    }
    else if (next === 28) { /// 순서를 바꿔서 좀더 이해하기 쉽게 하는게 좋을거로 생각이 든다.
        return dice + 48;
    }
    else if (next === 32) { /// 추가사항 
        return dice - 22;
    }
    else if (next === 36) { /// 추가사항 
        return dice - 30;
    }
    else if (next === 48) {/// 추가사항 
        return dice - 22;
    }
    else if (next === 50) { 
        return dice + 17;
    }
    else if (next === 62) {/// 추가사항 
        return dice - 44;
    }
    else if (next === 71) { /// 여기서 71일땐 21만 더해야 한다.
        return dice + 21;
    }
    else if (next === 80) {
        return dice + 19;
    }
    else if (next === 88) {/// 추가사항 
        return dice - 64;
    }
    else if (next === 95) {/// 추가사항 
        return dice - 39;
    }
    else if (next === 97) {/// 추가사항 
        return dice - 19;
    }
    
    return dice; 
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
  next = start + nextPosition(current, dice);
  if (next >= 100) {
    next = 100;
  }

  // 콘솔 창에 띄우기 
  console.log("from= ", start, "dice= ", dice, "next= ",next);

}
