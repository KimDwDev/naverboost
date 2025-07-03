"use strict";
const { USERState, USERKey, DiceName, DiceValue, Board, BoardPinName, BoardPoint } = require("./name")

class GameClass {

  constructor(Users) {
    this.Users = Users;
    this.GameGuard = Object.freeze({
      [USERState.STOP] : (diceNumber) => this.#GameGuardFunc(diceNumber),
      [USERState.PLAY] : (diceNumber) => this.#GameGuardFunc(diceNumber)
    });
    this.GameAction = Object.freeze({
      [USERState.PLAY] : (i, dice) => this.#GameStart(i, dice)
    })
  }

  /**
   * 
   * @param {diceNumber} diceNumber 주사위 숫자 
   */
  #GameGuardFunc(diceNumber) {
    return ( diceNumber in DiceName ) ? true : false; 
  }

  /**
   * 
   * @param {i} i 번째 유저의 
   * @param {dice} dice 주사위
   */
  #GameStart(i, dice) {
    
    // i번째 유저의 시작과 끝
    let start = this.Users[i][USERKey.START];
    let end = this.Users[i][USERKey.END];
    let point = this.Users[i][USERKey.POINT];
    const plusPoint = DiceValue[dice];

    // 현재상태
    let currentBoard = Board[start][end];

    // 현재 위치가 어디냐에 따라서 다름 (마지막 위치가 아닌 핀 포인트일때 변경) 처음과 끝을 변경
    if (this.Users[i][USERKey.POINT] === currentBoard[BoardPinName.LIMIT] ) {

      // 마지막 지점이 아니라면
      if (end !== BoardPoint.Z) {
        this.Users[i][USERKey.START] = end;
        this.Users[i][USERKey.END] = currentBoard[BoardPinName.BONUS];
      } 
      // 마지막 지점이라면
      else {
        this.Users[i][USERKey.START] = BoardPoint.Z;
        this.Users[i][USERKey.END] = BoardPoint.W;
      }
      
      // 새로 업데이트
      this.Users[i][USERKey.POINT] = 0;
      start = this.Users[i][USERKey.START];
      end = this.Users[i][USERKey.END];
      currentBoard = Board[start][end];
      point = 0;
    } 


    // 정리
    const userPoint = point + plusPoint;
    
    // 포인트 점수에 따라서 다름
    if ( userPoint > currentBoard[BoardPinName.LIMIT] ) {

      // 마지막 지점일 경우 넘어섰으므로 점수 1하고 초기화
      if ( (end === BoardPoint.Z) || (start === Board.X && end === Board.V && userPoint > 5)) {
        this.Users[i][USERKey.START] = BoardPoint.Z;
        this.Users[i][USERKey.END] = BoardPoint.W;
        this.Users[i][USERKey.POINT] = 0;
        this.Users[i][USERKey.SCORE] += 1;
      }

      // 마지막이 아닐경우 common으로 업데이트 하고 point 변경
      else {
        this.Users[i][USERKey.START] = end;
        this.Users[i][USERKey.END] = currentBoard[BoardPinName.COMMON];
        this.Users[i][USERKey.POINT] = (userPoint - currentBoard[BoardPinName.LIMIT] );
      }
    }
    else {
      if (end === BoardPoint.Z && userPoint === currentBoard[BoardPinName.LIMIT]) this.Users[i][USERKey.SCORE] += 1;

      this.Users[i][USERKey.POINT] = userPoint;
    }
  }

  game() {

    for ( let i = 0; i < this.Users.length; i++ ) {

      // i번째 유저의 다이스
      const dices = this.Users[i][USERKey.DICE];

      // i번째 유저의 상태
      let userState = USERState.STOP;

      for ( let j = 0; j < dices.length; j++ ) {

        const dice = dices[j];

        // guard -> transition
        this.GameGuard[userState] && this.GameGuard[userState](dice) ? userState = USERState.PLAY : userState = USERState.ERROR;
        
        // action -> transition
        this.GameAction[userState] && this.GameAction[userState](i, dice);
      }
    }
  }

}

module.exports = {GameClass};