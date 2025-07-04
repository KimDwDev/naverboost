"use strict";

class MathClass {

  constructor() {}

  /** 백터의 외적을 이용해서 삼각형의 넓이를 구해줌  */
  CrossProductFunction(x, y, z) {

    // 벡터 구하기
    const a = [ y[0] - x[0], y[1] - x[1], y[2] - x[2] ]; 
    const b = [ z[0] - x[0], z[1] - x[1], z[2] - x[2] ];

    // 외적 구하기
    const ccwValue = [ (a[1] * b[2]) - (a[2] * b[1]), (a[2] * b[0]) - (a[0] * b[2]), (a[0] * b[1]) - (a[1] * b[0]) ];

    return (Math.pow(ccwValue[0], 2) + Math.pow(ccwValue[1], 2) + Math.pow(ccwValue[2], 2)) / 2; 
  }

}

module.exports = { MathClass };