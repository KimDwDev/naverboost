"use strict";
const { STATE, USERKey, BoardPoint } = require("./name")

class ComputerSystem {
  #User = Object({
      [USERKey.SCORE] : 0,
      [USERKey.START] : BoardPoint.Z,
      [USERKey.END] : BoardPoint.W,
      [USERKey.POINT] : 0,
      [USERKey.DICE] : "",
    });

  constructor() {
    this.Guard = Object.freeze({
      [STATE.OFF] : (arr) => this.#ComputerGuardFunc(arr),
      [STATE.ON] : (arr) => this.#ComputerGuardFunc(arr)
    })

    this.Action = Object.freeze({
      [STATE.OFF] : (arr, Users) => this.#ComputerActionUserSetGuard(arr, Users)
    })
  }

  #ComputerGuardFunc(arr) {

    // 배열 여부 확인
    if ( !Array.isArray(arr) ) throw new Error("배열이 아닙니다");

    // 입력값에서 참가자 배열은 최소 2개에서 최대 10개까지 가능합니다
    if ( arr.length < 2 || arr.length > 10 ) return false;

    // 만약 입력 배열에서 던진 횟수가 서로 다른 경우는 오류로 판단
    for ( let i = 0; i < arr.length - 1; i++ ) {
      if ( String(arr[i]).length !== String(arr[i+1]).length ) return false;
    }

    return true;
  }

  #ComputerActionUserSetGuard(arr, Users) {
    arr.forEach((dice) => {
      this.#User[USERKey.DICE] = dice;
      Users.push({ ...this.#User });
    })
  }

}

module.exports = { ComputerSystem }  