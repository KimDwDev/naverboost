"use strict"
const { Frontend } = require("./frontend.js")

class Compile {

  /**
   * 
   * @param {Main} Main 실행시킬 함수 
   */
  constructor(Main) {
    this.main = Main;
    this.symbolTable = new Map();
  }

  // 프런트엔드
  FrontEnd() {

    const frontend = new Frontend(this.main);
    console.log("컴파일 중......");

    // Lexer: 문자 -> 토큰 파싱
    const tokenStream = frontend.Lexer();

    // Parser: 토큰 -> 파서트리 -> AST 변환
    const ast = frontend.Parser(tokenStream);

    // SementicAnalyses: AST의미 분석
    frontend.SementicAnalySis(ast);

    // MakeIrCode: AST를 IRCODE로 변환
    frontend.MakeIrCode();
  }

  // 미들엔드

  // 백엔드

  // 
  compile() {

    this.FrontEnd();

  }
}

const compile = new Compile(`var a = new A.init();`);
compile.compile();