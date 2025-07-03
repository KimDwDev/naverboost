"use strict";
const { STATE } = require("./name");
const { ComputerSystem } = require("./architect");
const { GameClass } = require("./game")

let ComputerState = STATE.OFF;
const Computer = new ComputerSystem();
const Users = [];

function score(arr) {

  // guard -> action -> transition
  if (Computer.Guard[ComputerState](arr)) { 
    Computer.Action[ComputerState] && Computer.Action[ComputerState](arr, Users); // off 상태에서는 유저를 set해야 함으로 (추후 확장성 고려)
    ComputerState = STATE.ON;
  }
  else {
    ComputerState = STATE.ERROR 
  };
  
  // 상태가 ON이면  
  if (ComputerState === STATE.ON) {
    const game = new GameClass(Users);
    game.game();
    return Computer.Answer(Users);
  } 
  
  // 상태가 ERROR이면
  return ["ERROR"];
}

const readline = require("readline");

const r1 = readline.createInterface({
  input : process.stdin,
  output : process.stdout
})

r1.question('', (data) => {
  console.log(score(JSON.parse(data)));
  ComputerState = STATE.OFF;
  r1.close();
})