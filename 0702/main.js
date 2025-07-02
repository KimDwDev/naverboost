"use strict";

class StateTransition {

  constructor() {
    this.state = "IDLE";
  }
  
  State(state) {
    this.state = state;
  }

  /**
   * 
   * @param {event} event // 이벤트 발생 
   */
  Event(event) {
    
    // IDLE 
    this.state === "IDLE" && this.IDELGuard(event);
    
    // INVITED
    this.state === "INVITED" && this.INVITEDGuard(event);

    // FAILED
    this.state === "FAILED" && this.FAILEDGuard(event);

    // AUTH REQUESTED 
    this.state === "AUTH REQUESTED" && this.AuthRequestedGuard(event);

    // REDIRECTING
    this.state === "REDIRECTING" && this.RedirectingGuard(event);

    // CANCELLING 
    this.state === "CANCELLING" && this.CANCELLINGGuard(event);

    // ACCEPTED
    this.state === "ACCEPTED" && this.ACCEPTEDGuard(event);

    // REDIRECTED 
    this.state === "REDIRECTED" && this.REDIRECTEDGuard(event);

    // ESTABLISHED
    this.state === "ESTABLISHED" && this.ESTABLISHEDGuard(event);

    // CANCELLED
    this.state === "CANCELLED" && this.CANCELLEDGuard(event);

    // CLOSING
    this.state === "CLOSING" && this.CLOSINGGuard(event);

  }

  // ORIGIN 
  IDELGuard(event) {
    event === "INVITE" && this.Action("INVITED");
  }

  // 1
  INVITEDGuard(event) {

    // 1xx 
    /1[0-9]{2}/.test(event) && this.Action("INVITED");

    // 200
    event === '200' && this.Action("ACCEPTED");

    // CANCEL
    event === "CANCEL" && this.Action("CANCELLING");

    // 3xx
    /3[0-9]{2}/.test(event) && this.Action("REDIRECTING");

    // 407 
    event === '407' && this.Action("AUTH REQUESTED");

    // 4xx - 6xx
    event !== '407' && /(4[0-9]{2}|6[0-9]{2})/.test(event) && this.Action("FAILED");
  }


  // 2
  FAILEDGuard(event) {
    event === "ACK" && this.Action("TERMINATED");
  }
  AuthRequestedGuard(event) {
    event === "ACK" && this.Action("INVITED");
  }
  RedirectingGuard(event) {
    event === "ACK" && this.Action("REDIRECTED");
  }
  CANCELLINGGuard(event) {
    event === "200(CANCEL)" && this.Action("CANCELLED");
  }
  ACCEPTEDGuard(event) {
    event === "CANCEL" && this.Action("CANCELLING");
    event === "ACK" && this.Action("ESTABLISHED");
  }


  // 2
  REDIRECTEDGuard(event) {
    event === "INVITE" && this.Action("INVITED");
    event === "<timeout>" && this.Action("TERMINATED");
  }
  ESTABLISHEDGuard(event) {
    event === "BYE" && this.Action("CLOSING");
  }

  //3 
  CANCELLEDGuard(event) {
    event === "487" && this.Action("FAILED");
  }
  CLOSINGGuard(event) {
    event === "BYE" && this.Action("CLOSING");
    event === "200(BYE)" && this.Action("TERMINATED");
  }


  /**
   * 
   * @param {state} state // 변화시킬 상태조건 
   */
  Action(state) {
  // 처음에는 ,를 안달기 위한 조치
  this.state !== "IDLE" && this.state !== state && process.stdout.write(",");
  
  // 변화가 있을때만 프린트 하고 변화를 주겠다.
  this.state !== state && process.stdout.write(`"${state}"`) && this.State(state);
  }

}

// state -> event -> guard -> state
const stateTransition = new StateTransition();

// 출력을 위한 준비
const readline = require("readline");

const r1 = readline.createInterface({
  input : process.stdin,
  output : process.stdout
});

r1.question("", (que) => {

  const queJson = JSON.parse(que);

  process.stdout.write("[");

  queJson.forEach((event) => {
      stateTransition.Event(event);
  });

  process.stdout.write("]");
  console.log();

  r1.close();
})