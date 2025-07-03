"use strict";
// 게임의 룰
const boardName = Object.freeze({
  ZW : "ZW",
  WV : "WV",
  WX : "WX",
  XV : "XV",
  XY : "XY",
  VZ : "VZ",
  VY : "VY",
  YZ : "YZ",
  Z : "Z",
  END : "END"
})

const boardRule = Object.freeze({
  limit : "limit",
  bonus : "bonus",
  common : "common"
})

const board = Object.freeze({
  [boardName.ZW] : {
    [boardRule.limit] : 5,
    [boardRule.bonus] : boardName.WV,
    [boardRule.common] : boardName.WX,
  },
  [boardName.WV] : {
    [boardRule.limit] : 3,
    [boardRule.bonus] : boardName.VZ,
    [boardRule.common] : boardName.VY
  },
  [boardName.WX] : {
    [boardRule.limit] : 5,
    [boardRule.bonus] : boardName.XV,
    [boardRule.common] : boardName.XY
  },
  [boardName.XV] : {
    [boardRule.limit] : 5,
    [boardRule.bonus] : boardName.Z,
    [boardRule.common] : boardName.END
  },
  [boardName.XY] : {
    [boardRule.limit] : 5,
    [boardRule.bonus] : boardName.YZ,
    [boardRule.common] : boardName.YZ
  },
  [boardName.VZ] : {
    [boardRule.limit] : 3,
    [boardRule.bonus] : boardName.Z,
    [boardRule.common] : boardName.END
  },
  [boardName.VY] : {
    [boardRule.limit] : 3,
    [boardRule.bonus] : boardName.YZ,
    [boardRule.common] : boardName.YZ
  }, 
  [boardName.YZ] : {
    [boardRule.limit] : 5,
    [boardRule.bonus] : boardName.Z,
    [boardRule.common] : boardName.END
  },
  [boardName.Z] : {
    [boardRule.limit] : 5,
    [boardRule.bonus] : boardName.WV,
    [boardRule.common] : boardName.WX
  }
})

const gameRule = Object.freeze({
  "MOVE" : Object.freeze({
    "D" : 1,
    "K" : 2,
    "G" : 3,
    "U" : 4,
    "M" : 5
  }),
  "BOARD" : board
})

// 말 상태
const Horse = {
  state : boardName.Z,
  direction : boardName.ZW,
  number : 0
}

// 유저
const User = {
  state : "STOP",
  score : 0,
  dice : "",
  horse : {...Horse}
}

// 유저들
const Users = [];

// 게임의 상태
let GameState = "OFF";

// game과 관련된 object
const GameGuardObject = Object.freeze({
  "OFF" : (arr) => GameStartGuard(arr)
})

const GameActionObject = Object.freeze({
  "ON" : (arr) => InputUserAction(arr),
  "USER SET" : (arr) => PlayGame(arr)
})


////////////////////// GUARD //////////////////////////
/**
 * 
 * 게임시작 코인
 * @param {arr} arr // 게임의 이벤트 발생을 일으킨 배열 
 * @returns 게임 속행 여부
 */
const GameStartGuard = (arr) => {

  // 배열 여부
  if ( !Array.isArray(arr) ) throw new Error("배열이 아닙니다.");

  // 입력값에서 참가자 배열은 최소 2개에서 최대 10개까지 가능합니다. 만약 범위를 벗어난 경우는 "ERROR" 값만 포함하는 배열을 리턴
  if ( arr.length < 2 || arr.length > 10 ) return 'ERROR';

  // 만약 입력 배열에서 던진 횟수가 서로 다른 경우는 오류로 판단하고 "ERROR" 에러값만 포함하는 배열을 리턴합니다.
  for ( let i = 0; i < arr.length - 1; i++ ) {
    if ( String(arr[i]).length !== String(arr[i+1]).length  ) return 'ERROR';
  } 

  return "ON";
}

////////////////////// ACTION //////////////////////////
const InputUserAction = (arr) => {

  arr.forEach((dice) => {
    const copyUser = {...User};
    copyUser.dice = dice;
    Users.push(copyUser);
  });
  return "USER SET";
}


// horse와 관련된 object
const HorseGuardObject = Object.freeze({
  "PLAY" : (dice) => HorseGameGuard(dice)
})
const HorseGameGuard = (dice) => {
  // 입력값 문자 중에 DKGUM가 아닌 경우는 최종 점수는 표시하고 위치값 대신 "ERR"를 출력합니다.
  if (!(dice in gameRule.MOVE)) return "ERROR";
  return "PLAY";
}
const HorseActionObject = Object.freeze({
  "PLAY" : (dice, i) => HorseGameAction(dice, i),
  "ERROR" : (_, i) => HorseErrorAction(i)
})

// i번째 유저
const HorseGameAction = (dice, i) => {
  const currentValue = (+Users[i].horse["number"]) + (+gameRule.MOVE[dice]);

  const currentDirect = Users[i].horse["direction"]

  const rule = gameRule.BOARD[currentDirect]
  
  // 현재 방향의 제한값 보다 넘어선다면?
  if (currentValue > rule.limit) Users[i].horse["direction"] = rule.common;
  else if ( currentValue === rule.limit ) Users[i].horse["direction"] = rule.bonus;

  // 방향에 따라서 나머지 점수, 현재 위치를 업데이트 한다.
  if ( Users[i].horse["direction"] === boardName.END ) {

    Users[i].score += 1;
    Users[i].horse["direction"] = boardName.ZW;
    Users[i].horse["number"] = 0;
    Users[i].horse["state"] = boardName.Z
  } else if ( Users[i].horse["direction"] === boardName.Z ) {

    Users[i].score += 1;
    Users[i].horse["number"] = 0;
    Users[i].horse["state"] = boardName.Z;
  } else {
    // number state
    if (currentValue >= rule.limit ) {
      Users[i].horse["number"] = (currentValue - +rule.limit);
      Users[i].horse["state"] = currentDirect;
    }
    else Users[i].horse["number"] = currentValue;
  }
  return "PLAY"
}

const HorseErrorAction = (i) => {
  Users[i].horse["state"] = "ERR";
  return "ERROR"
}

const PlayGame = (arr) => {

  for ( let i = 0; i < arr.length; i++ ) {

    // i번째 유저는 움직임
    Users[i].state = "PLAY";

    // i번째 유저의 주사위
    const diceVal = Users[i].dice;

    let j = 0;
    while (j < diceVal.length && Users[i].state !== "ERROR" && Users[i].state !== "STOP") {

      const dice = diceVal[j++];

      // 말도 상태에 따라서 event -> guard -> action
      if (HorseGuardObject[Users[i].state]) Users[i].state = HorseGuardObject[Users[i].state](dice);

      if (HorseActionObject[Users[i].state]) Users[i].state = HorseActionObject[Users[i].state](dice, i);
    }

    Users[i].state = "STOP"
  }
  return "END";
}


////////////////////// FUNCTION //////////////////////////
/**
 * 
 * @param {arr} arr // arr라는 이벤트 발생 
 */
const score = (arr) => {

  // arr(event) -> guard -> action
  while (GameState !== "ERROR" && GameState !== "END" ) {    
    if (GameGuardObject[GameState]) GameState = GameGuardObject[GameState](arr);
    if (GameActionObject[GameState]) GameState = GameActionObject[GameState](arr);
  }

  if ( GameState === "ERROR" ) return ["ERROR"];
}

score(["DGD", "MGG"])
