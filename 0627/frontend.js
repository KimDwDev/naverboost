"use strict"


class Frontend {

  /**
   * 
   * @param {symbolTable} symbolTable // 사용되어 지는 심볼테이블
   * @param {main} main // 프론트엔드에서 처리할 메인 변수 
   */
  constructor(main, symbolTable) {
    this.main = main
    this.symbolTable = symbolTable
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

    console.log("--------------------------------------------");
    console.log("Lexial analysis");
    console.log();

    tokenStream.forEach((value, idx) => {
      console.log(`${idx}번째 토큰: ${JSON.stringify(value)}`);
    })
    console.log("--------------------------------------------");

    // 토큰
    return tokenStream
  }


  /**
   * 
   * @param {tokenStream} tokenStream // cfg를 이용해서 VASP를 만들토큰 스트림 
   */
  CFGs(tokenStream) {

    console.log("토큰스트림을 이용해 NTPS 설계 후 CFG 설정 중..");
    console.log();

    // T정의
    const keywords   = new Set();
    const operators  = new Set();
    const punctuators= new Set();
    const identifiers= new Set();
    const numbers    = new Set();
    for (const tok of tokenStream) {
      switch (tok.type) {
        case 'KEYWORD':    keywords.add(tok.lexeme); break;
        case 'OPERATOR':   operators.add(tok.lexeme); break;
        case 'PUNCTUATOR': punctuators.add(tok.lexeme); break;
        case 'IDENTIFIER': identifiers.add(tok.lexeme); break;
        case 'NUMBER':     numbers.add(tok.lexeme); break;
      }
    }
    const terminals = [
      ...[...keywords].map(k => `KEYWORD(${k})`),
      ...[...operators].map(o => `OPERATOR(${o})`),
      ...[...punctuators].map(p => `PUNCTUATOR(${p})`),
      ...[...identifiers].map(i => `IDENTIFIER(${i})`),
      ...[...numbers].map(n => `NUMBER(${n})`)
    ];

    // N, S 정의
    const nonTerminals = [
      'Program', 'DeclarationList', 'Declaration',
      'Expression','NewExpr','MemberCalls','Primary'
    ];
    const startSymbol = 'Program';

    // P 생성 정의 
    // 문제점 let, const 등과 같은 KEYWORD는 아직 읽지 못한다.
    const productions = new Map([
      ['Program', [
        [ 'DeclarationList' ]
      ]],

      // 왼쪽 재귀를 제거한 DeclarationList
      ['DeclarationList', [
        [ 'Declaration', "DeclarationListPrime" ]
      ]],
      ['DeclarationListPrime', [
        [ 'Declaration', "DeclarationListPrime" ],
        []    // ε
      ]],

      ['Declaration', [[
        `KEYWORD(var)`, `IDENTIFIER(${[...identifiers][0]})`,
        `OPERATOR(=)`, 'Expression', `PUNCTUATOR(;)`
      ]]],

      // 나머지도 필요한 만큼 정의…
      ['Expression',  [[ 'NewExpr' ], [ 'Primary' ]]],
      ['NewExpr',     [[
        `KEYWORD(new)`, `IDENTIFIER(${[...identifiers][1]})`, 'MemberCalls'
      ]]],
      ['MemberCalls', [
        [ `PUNCTUATOR(.)`, `IDENTIFIER(init)`,
          `PUNCTUATOR(()`, `PUNCTUATOR())`, 'MemberCalls' ],
        []  // ε
      ]],
      ['Primary', [
        [ `IDENTIFIER(${[...identifiers][0]})` ],
        [ `NUMBER(${[...numbers][0]})` ]
      ]],
    ]);

    const cfg = { nonTerminals, terminals, startSymbol, productions };
    cfg.nonTerminals = Array.from(cfg.productions.keys());

    // 출력
    for (const [lhs, rhss] of cfg.productions) {
      rhss.forEach(rhs => {
        console.log(`${lhs} → ${rhs.length ? rhs.join(' ') : 'ε'}`);
      });
    }
    console.log('--------------------------------------------');

    return cfg;
  }


  /**
   * 
   * @param {cfg} cfg // parsing table제작에 사용되는 cfgs 
   */
  MakeParsingTable(cfg) {

    console.log("CFG를 이용해서 parsing table 제작 중...");
    console.log();

    // ε, 입력 끝
    const EPS = "ε", END = "$";

    // FIRST 함수
    function computeFirst() {
      // 초기설정 터미널 and 논터미널
      const FIRST = new Map();
      cfg.nonTerminals.forEach(NT => FIRST.set(NT, new Set()));
      cfg.terminals.forEach(T  => FIRST.set(T,  new Set([T])));

      let changed;
      do {
        changed = false;
        for (const [A, rhss] of cfg.productions) {
          const firstA = FIRST.get(A);
          for (const rhs of rhss) {
            if (rhs.length === 0) {
              if (!firstA.has(EPS)) {
                firstA.add(EPS);
                changed = true;
              }
              continue;
            }

            let nullableAll = true;
            for (const sym of rhs) {
              if (!FIRST.has(sym)) {
                FIRST.set(sym, new Set([sym]));
              }
              const firstSym = FIRST.get(sym);

              for (const t of firstSym) {
                if (t !== EPS && !firstA.has(t)) {
                  firstA.add(t);
                  changed = true;
                }
              }
              if (!firstSym.has(EPS)) {
                nullableAll = false;
                break;
              }
            }

            if (nullableAll && !firstA.has(EPS)) {
              firstA.add(EPS);
              changed = true;
            }
          }
        }
      } while (changed);

      return FIRST;
    }

    // FOLLOW 함수
    function computeFollow(FIRST) {
      const FOLLOW = new Map();
      cfg.nonTerminals.forEach(NT => FOLLOW.set(NT, new Set()));
      FOLLOW.get(cfg.startSymbol).add(END);

      let changed;
      do {
        changed = false;
        for (const [A, rhss] of cfg.productions) {
          for (const rhs of rhss) {
            for (let i = 0; i < rhs.length; i++) {
              const B = rhs[i];
              if (!cfg.nonTerminals.includes(B)) continue;

              const followB = FOLLOW.get(B);
              let nullableSuffix = true;

              for (let j = i + 1; j < rhs.length; j++) {
                const X = rhs[j];
                const firstX = FIRST.get(X) || new Set([X]);
                for (const t of firstX) {
                  if (t !== EPS && !followB.has(t)) {
                    followB.add(t);
                    changed = true;
                  }
                }
                if (!firstX.has(EPS)) {
                  nullableSuffix = false;
                  break;
                }
              }

              if (nullableSuffix) {
                for (const t of FOLLOW.get(A)) {
                  if (!followB.has(t)) {
                    followB.add(t);
                    changed = true;
                  }
                }
              }
            }
          }
        }
      } while (changed);

      return FOLLOW;
    }

    // 실제 호출
    const FIRST  = computeFirst(cfg);
    const FOLLOW = computeFollow(FIRST);

    console.log("FIRST 집합:");
    for (const [X, s] of FIRST) {
      console.log(`  FIRST(${X}) = { ${[...s].join(", ")} }`);
    }
    console.log();

    console.log("FOLLOW 집합:");
    for (const [A, s] of FOLLOW) {
      console.log(`  FOLLOW(${A}) = { ${[...s].join(", ")} }`);
    }
    console.log();

    // parsing table 제작

    // RHS 함수 제작
    function firstOfSequence(rhs) {
      const result = new Set();
      let nullableAll = true;

      for (const sym of rhs) {
        const firstSym = FIRST.get(sym) || new Set([sym]);
        for (const t of firstSym) {
          if (t !== EPS) result.add(t);
        }
        if (!firstSym.has(EPS)) {
          nullableAll = false;
          break;
        }
      }
      if (nullableAll) result.add(EPS);
      return result;
    }

    // 사용할 테이블
    const parsingTable = new Map();
    cfg.nonTerminals.forEach(NT => parsingTable.set(NT, new Map()));

    for (const [A, rhss] of cfg.productions) {
      const row = parsingTable.get(A);
      for (const rhs of rhss) {
        const firstSeq = firstOfSequence(rhs);
        for (const a of firstSeq) {
          if (a === EPS) continue;
          row.set(a, rhs);
        }
        if (firstSeq.has(EPS)) {
          for (const b of FOLLOW.get(A)) {
            row.set(b, rhs);
          }
        }
      }
    }

    // 테이블 출력
    console.log("Parsing Table:");
    for (const NT of cfg.nonTerminals) {
      const row = parsingTable.get(NT);
      for (const term of [...cfg.terminals, END]) {
        if (row.has(term)) {
          const prodRhs = row.get(term);
          const rhsStr  = prodRhs.length ? prodRhs.join(" ") : EPS;
          console.log(`  M[${NT}, ${term}] = ${NT} → ${rhsStr}`);
        }
      }
    }
    console.log("--------------------------------------------");

    return parsingTable
  }

  /**
   * CST를 제작하기 위한 함수
   * @param {tokenStream} tokenStream // automata이론을 적용한 토큰 스트림
   * @param {parsingTable} parsingTable // cfg를 이용해서 만든 파싱테이블
   * @param {cfg} cfg // 어떤 식으로 공식을 세웠는지 알기 위해서 사용
   */
  MakeParserTree(tokenStream, parsingTable, cfg) {

    console.log("Parser Tree (CST) 제작 중");
    console.log();

    // LL1 파서를 진행할 계획

    // CST 노드 초기 설정
    class Node {
      constructor(symbol) {
        this.symbol = symbol;        
        this.lexeme = null;         
        this.children = [];       
      }
    };

    // 심볼에 이름으로 사용될 예정
    function tokenSymbol(tok) {
      switch (tok.type) {
        case 'KEYWORD':    return `KEYWORD(${tok.lexeme})`;
        case 'OPERATOR':   return `OPERATOR(${tok.lexeme})`;
        case 'PUNCTUATOR': return `PUNCTUATOR(${tok.lexeme})`;
        case 'IDENTIFIER': return `IDENTIFIER(${tok.lexeme})`;
        case 'NUMBER':     return `NUMBER(${tok.lexeme})`;
        default:           return tok.type;  
      }
    }

    // 사용되는 스택 기호
    const EPS = "ε", END = "$";

    // 입력될값
    const input = [...tokenStream, { type: END, lexeme: END }];
    let ip = 0;
    
    // LL1 parser 진행
    
    // 파싱 스택
    const symbolStack = [END, cfg.startSymbol];
    // 노드 스택
    const nodeStack = [new Node(END), new Node(cfg.startSymbol)];
    const root = nodeStack[1];
    while (symbolStack.length) {
      const X = symbolStack.pop();
      const node = nodeStack.pop();
      const a = tokenSymbol(input[ip]);

      // 종료
      if (X === END && a === END) break;

      // 터미널 또는 종료 기호 처리
      if (cfg.terminals.includes(X) || X === END) {
        if (X === a) {
          node.lexeme = input[ip].lexeme;
          if (this.symbolTable && this.symbolTable.has(node.lexeme)) {
            node.attributes = this.symbolTable.get(node.lexeme);
          }
          ip++;
        } else {
          throw new Error(`파싱 오류: 예상 ${X}, 입력 ${a} at position ${ip}`);
        }
      } else {
        // 비터미널 처리
        const row = parsingTable.get(X);
        const rhs = row.get(a);
        if (!rhs) {
          throw new Error(`파싱 테이블 누락 M[${X}, ${a}]`);
        }
        // 자식 노드 생성
        const children = rhs.length ? rhs.map(sym => new Node(sym)) : [];
        node.children = children;
        for (let j = children.length - 1; j >= 0; j--) {
          const sym = rhs[j];
          if (sym !== EPS) {
            symbolStack.push(sym);
            nodeStack.push(children[j]);
          }
        }
      }
    }

    // 트리를 보기위한 함수
    function printCST(node, indent = 0) {
      const lex = node.lexeme != null ? ` (${node.lexeme})` : '';
      console.log(' '.repeat(indent) + node.symbol + lex);
      
      for (const child of node.children) {
        printCST(child, indent + 2);
      }
    }

    printCST(root);
    console.log("--------------------------------------------")
    return root;
  }

  /**
   * 
   * @param {cfg} cfg // 타입을 만들 cfg 생성 
   */
  MakeNodeType(cfg) {
    const classes = {};
    // 기본 AST 타입
    classes.ProgramNode = class {
      constructor(body) {
        this.type = 'Program';
        this.body = body;
      }
    };
    classes.VariableDeclarationNode = class {
      constructor(name, init) {
        this.type = 'VariableDeclaration';
        this.name = name;
        this.init = init;
      }
    };
    classes.BinaryExpressionNode = class {
      constructor(operator, left, right) {
        this.type = 'BinaryExpression';
        this.operator = operator;
        this.left = left;
        this.right = right;
      }
    };
    classes.IdentifierNode = class {
      constructor(name) {
        this.type = 'Identifier';
        this.name = name;
      }
    };
    classes.LiteralNode = class {
      constructor(value) {
        this.type = 'Literal';
        this.value = value;
      }
    };

    // 추가 
    classes.ExpressionNode = class {
      constructor(expr) {
        this.type = 'Expression';
        this.expr = expr;
      }
    };

    classes.DeclarationListNode = class {
      constructor(list) {
        this.type = 'DeclarationList';
        this.list = list;  
      }
    };

    classes.DeclarationListPrimeNode = class {
      constructor(list) {
        this.type = 'DeclarationListPrime';
        this.list = list;  
      }
    };
    return classes;
  }


  /**
   * 
   * @param {parserTree} parserTree // 후위 순회할 cst 
   * @param {cfgNodeClass} cfgNodeClass // 순회한 후 클래스로 바꿀 객체
   */
  PostOrderCst(parserTree, cfgNodeClass) {
    function traverse(node) {
      const childrenAST = node.children.map(traverse).filter(n => n != null);

      switch (node.symbol) {
        case 'Program':
          return new cfgNodeClass.ProgramNode(
            childrenAST[0]
          );

        case 'DeclarationList': {
          const [firstDecl, restDecls] = childrenAST;
          const list = [ firstDecl ];
          if (Array.isArray(restDecls)) {
            list.push(...restDecls);
          }
          return new cfgNodeClass.DeclarationListNode(list);
        }

        case 'DeclarationListPrime': {
          if (childrenAST.length === 0) {
            return [];           // ε
          }
          const [ decl, rest ] = childrenAST;
          return [ decl ].concat(rest || []);
        }

        case 'Declaration': {
          const idLex   = node.children[1].lexeme;       
          const initAST = traverse(node.children[3]);    
          return new cfgNodeClass.VariableDeclarationNode(idLex, initAST);
        }

        case 'Expression': {
          const childAST = childrenAST[0];
          return new cfgNodeClass.ExpressionNode(childAST);
        }

        case 'Primary': {
          const child = node.children[0];
          if (child.symbol.startsWith('IDENTIFIER')) {
            return new cfgNodeClass.IdentifierNode(child.lexeme);
          }
          if (child.symbol.startsWith('NUMBER')) {
            return new cfgNodeClass.LiteralNode(Number(child.lexeme));
          }
          return null;
        }
        default:
          return childrenAST[0] || null;
      }
    }

    return traverse(parserTree);
  }


  /**
   * 
   * @param {parserTree} parserTree // CST이다. 
   * @param {cfg} cfg // cfg이다.
   */
  MakeAST(parserTree, cfg) {

    // 문법 살핀 후 노드 타입 목록 설정
    const cfgNodeClass = this.MakeNodeType(cfg);

    // 후위 순회를 통해서 CST를 AST로 제작
    console.log("AST 제작중..");
    console.log();
    const ast = this.PostOrderCst(parserTree, cfgNodeClass);
    console.log(JSON.stringify(ast, null, 2));
    console.log("--------------------------------------------")
  }

  /**
   * 
   * @param {tokenStream} tokenStream // lexer를 통해 파싱한 토큰이 들어있음 
   */
  Parser(tokenStream) {

    // former grammer의 규칙을 설정 
    // chomsky의 type2를 활용한 CFG로 토큰 스트림을 나눌예정
    const cfg = this.CFGs(tokenStream);

    // CFGs를 활용해서 parsing table을 생성할 예정
    const parsingTable = this.MakeParsingTable(cfg);

    // LL(1) parser를 진행하여 파서트리(CST)를 생성
    // parsing table이랑 tokenStream을 활용
    const parserTree = this.MakeParserTree(tokenStream, parsingTable, cfg);

    // AST 제작
    const ast = this.MakeAST(parserTree, cfg);

    return ast;
  }

  /**
   * 
   * @param {ast} ast // ast 대입
   */
  SementicAnalySis(ast) {
  }

  /** AST를 IR CODE로 바꾸는 작업 */
  MakeIrCode() {

  }

}

module.exports = { Frontend };