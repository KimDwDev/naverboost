"use strict"


class Frontend {

  /**
   * 
   * @param {main} main // 프론트엔드에서 처리할 메인 변수 
   */
  constructor(main) {
    this.main = main
  }


  /**
   * 
   * @param {string} stringArr // lexer 단계에서 삭제하는 거
   */
  LexerRemove(stringArr) {

    // 주석 삭제
    stringArr = stringArr.replace(/\/\/.*$/gm, '');

    // 여러줄 주석 삭제
    stringArr = stringArr.replace(/\/\*[\s\S]*?\*\//g, '');

    // whitespace 삭제
    const clearString =  [...stringArr].filter((ch) => !/\s/.test(ch));

    return clearString;
  }

  /**
   * 
   * @param {tokenStream} tokenStream // 추가할 tokenStream
   * @param {clearString} clearString // 스캐닝과 삭제까지 마친 문자열 데이터 
   */
  LexerAnalysis(tokenStream, clearString) {

    // 상태는 식별자, 상수, 연산자 
    // 추후 delimiter 추가해야함
    const States = {
      START:    0,
      IDENT:    1,
      NUMBER:   2,
      OPERATOR: 3,
      PUNCT:    4, 
    };
    

    // token stream에는 이런식으로 저장할 예정
    // 추가로 차원, size, 문자열의 길이 등등 많은 정보를 추가해야한다.
    const Accepting = {
      [States.IDENT]:    "IDENTIFIER",
      [States.NUMBER]:   "NUM_LITERAL",
      [States.OPERATOR]: "OPERATOR",
      [States.PUNCT]:    "PUNCTUATOR",  
    };


    // 오토마타 이론인 NFA를 이용한 DFA를 사용해서 판단할것이다.
    // 추후 mDFA에 대해서도 학습해야 한다.
    const dfa = {
      [States.START]: {
        LETTER:    States.IDENT,
        DIGIT:     States.NUMBER,
        OP:        States.OPERATOR,
        PUNCT:  States.PUNCT
      },
      [States.IDENT]: {
        LETTER:    States.IDENT,
        DIGIT:     States.IDENT,  
      },
      [States.NUMBER]: {
        DIGIT:     States.NUMBER, 
      },
      [States.OPERATOR]: {
    
        OP:        States.OPERATOR,
      },
      [States.PUNCT]: {}
    };
    
    // 정규표현식을 이용한 if else 함수
    // 추가로 var, new 등은 다르게 인식하도록 해야 한다. -> 어떤식으로 추가하는지 연구해야겠음
    function charClass(ch) {
      if (/[A-Za-z_]/.test(ch))      return "LETTER";
      if (/[0-9]/.test(ch))          return "DIGIT";
      if (/[\+\-\*\/=<>!&|]/.test(ch)) return "OP";
      if (/[\.\,\;\:\(\)\{\}\[\]]/.test(ch)) return "PUNCT";  // . , ; : ( ) { } [ ]
      return "OTHER";
    }

    // 따로 keyword를 추가해서 이 문자가 됬을때 넘어가도록 한다.
    // 잘 안되는거 보니 DFA가 잘못되었다고 생각한다. 이를 연구하자.
    const Keywords = new Set([
      "var",
      "let",
      "const",
      "new",
    ]);

    // 이 구문 자체를 이해하는게 쉽지가 않다.... 
    // 연구를 해야함
    try {
      // DFA 돌면서 lexeme 생성 -> 
      let state = States.START;
      let lexeme = "";

      // automata theory에 DFA를 사용
      // mDFA는 추후 학습을 통해 인지한다.
      for (let i = 0; i < clearString.length; i++) {
        
        const ch  = clearString[i];
        const cls = charClass(ch);
        const next = dfa[state]?.[cls];

        // 최장 문자열을 따른다.
        // else if 로 변수일때는 크기를 정한다던지 이런걸 해야 한다.
        if (next !== undefined) {
          
          // 초반에 keyword라면 넘어가도록 설정
          if (
              state === States.IDENT &&
              Keywords.has(lexeme) &&
              !/[A-Za-z0-9_]/.test(clearString[i+1] || '')
            ) {
              tokenStream.push({ type: "KEYWORD", lexeme });
              state  = States.START;
              lexeme = "";
            }

            state = next;
            lexeme += ch;
          continue;
        } 
        
        // 전이가 불가능 → “지금까지 쌓인 lexeme”이 완전한 토큰인지 검사
        if (Accepting[state]) {

          // 키워드라면 여기서 추가한다.
          let type = Accepting[state];

          // IDENTIFIER 였다면 키워드 재분류
          if (type === "IDENTIFIER" && Keywords.has(lexeme)) {
            type = "KEYWORD";
          }
          
          // 1) 토큰 확정
          tokenStream.push({
            type:  Accepting[state],
            lexeme
          });

          // 2) 상태·lexeme 리셋
          state  = States.START;
          lexeme = "";

          // 3) 이 문자는 아직 처리되지 않았으니 재처리
          i--;
        } else {
          // 지금은 알수 없는 토큰에만 오류를 발생했다.
          throw new Error(`알 수 없는 토큰: "${lexeme + ch}" at pos ${i}`);
        }
      }

      if (lexeme && Accepting[state]) {
        tokenStream.push({
          type:  Accepting[state],
          lexeme
        });
      }

    } catch(err){
      console.log(`컴파일 에러: ${err}`);
      throw err;
    }
  }

  /** 문자열을 토큰으로 파싱해주는 작업 */
  Lexer() {
    
    // 토큰 스트림
    // 인덱스, 이름, 타입, matrix... 
    const tokenStream = [];

    // 스캐닝
    let stringArr = String(this.main);

    // 삭제 
    const clearString = this.LexerRemove(stringArr);

    // 분석 
    this.LexerAnalysis(tokenStream, clearString);

    // 토큰
    return tokenStream
  }

  /**
   * 
   * @param {tokenStream} tokenStream // lexer를 통해 파싱한 토큰이 들어있음 
   */
  Parser(tokenStream) {

    

  }

  /** AST의 의미를 분석하는 작업 */
  SementicAnalySis() {

  }

  /** AST를 IR CODE로 바꾸는 작업 */
  MakeIrCode() {

  }

}

module.exports = { Frontend };