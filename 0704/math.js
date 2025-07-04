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

  // 축의 길이가 가장 길다는게 무슨 의미일까? 만약 길이였다면 두점 사이의 거리를 말했을거고 만약 (0, 0, 0)이었다면 
  // 과 길이 었다면 그냥 단순 X값이 가장 긴걸 물어본것 같다.
  GetMaxValueIndex(point, x, y, z) {
    return Math.max(Math.abs(x[point]), Math.abs(y[point]), Math.abs(z[point]));
  }

}

module.exports = { MathClass };