"use strict";

class StateTransition {
  #history = [];

  constructor() {
    this.state = "IDLE";
    this.#history =[];
    this.EventMap = {
      "IDLE" : (event) => this.IDELGuard(event),
      "INVITED" : (event) => this.INVITEDGuard(event),
      "FAILED" : (event) => this.FAILEDGuard(event),
      "AUTH REQUESTED" : (event) => this.AuthRequestedGuard(event),
      "REDIRECTING" : (event) => this.RedirectingGuard(event),
      "CANCELLING" : (event) => this.CANCELLINGGuard(event),
      "ACCEPTED" : (event) => this.ACCEPTEDGuard(event),
      "REDIRECTED" : (event) => this.REDIRECTEDGuard(event),
      "ESTABLISHED" : (event) => this.ESTABLISHEDGuard(event),
      "CANCELLED" : (event) => this.CANCELLEDGuard(event),
      "CLOSING" : (event) => this.CLOSINGGuard(event),
      "TERMINATED" : (event) => this.TERMINATEDGuard(event)
    }
  }
  
  /**
   * 
   * @param {state} state // 전환할 상태 
   */
  State(state) {
    this.state = state;
  }

  /**
   * 
   * @param {event} event // 이벤트 발생 
   */
  Event(event) {
    this.EventMap[this.state](event);
  }

  ////////////// GUARD ////////////////////////////////
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

  // 4 
  TERMINATEDGuard(_) {

  }


  /**
   * action
   * @param {state} state // 변화시킬 상태조건 
   */
  Action(state) {
    // 상태과 변화할때 마다 기록하고 전환 시킨다.
    this.state !== state && this.#history.push(state) && this.State(state);
  }

  GetHistory() {
    return this.#history;
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

  queJson.forEach((event) => {
      stateTransition.Event(event);
  });
  console.log(JSON.stringify(stateTransition.GetHistory()));
  r1.close();
})