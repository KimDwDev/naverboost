# 문제를 푸는 시점에 컴파일러 동작 방식에 대해 어디까지 알고 있는가 설명합니다.

1. (문제 풀기 전) 컴파일러의 전체적인 작동 과정에 대해 잘 알지 못했고, 각 단계의 명칭이나 역할도 익숙하지 않은 상태였습니다.
2. (문제 푼 후) Lexical Analysis부터 시작해 Syntax Analysis, 그리고 AST 생성까지 전반적인 흐름을 머릿속으로 그릴 수 있게 되었고,
비록 모든 내부 동작을 완벽히 구현하진 못했지만, 기본적인 처리 방식과 구조에 대해서는 숙지하게 되었습니다.

# 아래 제공된 자료 중에서 어떤 자료를 학습하고 이해했는가, 근거 자료를 어디에서 어떻게 더 찾았는지, 어떻게 이해했는지 설명합니다.

1. https://www.youtube.com/watch?v=ZI198eFghJk
  -> 컴파일러하는 전체적인 흐름에 대해서 이해할 수 있었습니다. 


유튜브 영상 강의를 중심으로 학습하였으며, 영어 키워드 (예: "compiler course")로 검색하여 다양한 소스를 참조했습니다.

이해가 잘 가지 않는 부분은 ChatGPT를 통해 예시와 함께 설명을 받아보며 보완하였습니다


  1. 메타프로그래밍 
    - https://www.youtube.com/watch?v=a6BQphLoTag

  2. 오토마타 이론
    - :https://www.youtube.com/watch?v=_otgv2ZmmOM
      :https://www.youtube.com/watch?v=9RGYOBNh-iM&list=PLSN_PltQeOygPrInjCFdQM992AotARlFa
      :https://www.youtube.com/watch?v=WQ8bJooiEeQ&list=PLLOxZwkBK52CTVrHjYa7-SpXlEtef1TqL
      :https://en.wikipedia.org/wiki/Deterministic_finite_automaton 

  3. 컴파일러의 전체적인 과정
    : https://www.youtube.com/watch?v=zIjI8H945T8

  4. LL(1) PARSER
    - :https://www.youtube.com/watch?v=v_wvcuJ6mGY&list=PLBlnK6fEyqRjT3oJxFXRgjPNzeS-LFY-q&index=31

  5. AST 공부
    - :https://www.youtube.com/watch?v=tM_S-pa4xDk&list=PLw5h0DiJ-9PCWamtYU7X220dlBSU94BdD

  6. chomsky 이론
    - :https://www.youtube.com/watch?v=9idnQ2C6HfA&t=237s


# 위에 요구사항 코드 한 줄을 처리하기 위한 AST 구조를 나름 설계해보고, 적절한 데이터 구조를 설명합니다.

1. Lexial analysis

  1-1. 탐색
    var a = new A.init();
    -> [
    'v', 'a', 'r', ' ', 'a',
    ' ', '=', ' ', 'n', 'e',
    'w', ' ', 'A', '.', 'i',
    'n', 'i', 't', '(', ')',
    ';'
    ]

  1-2. 삭제
    공백, whiltspace 삭제
    -> [
      'v', 'a', 'r', 'a', '=',
      'n', 'e', 'w', 'A', '.',
      'i', 'n', 'i', 't', '(',
      ')', ';'
    ]

  1-3. 토큰스트림 생성
    automata theory에 DFG를 활용하여 토큰스트림 생성
    -> [
      {"name": "var", "type": "KEYWORD"},
      {"name": "a", "type": "IDENTIFIER"},
      {"name": "=", "type": "PUNCTUATION"},
      {"name": "new", "type": "KEYWORD"},
      {"name": "A", "type": "IDENTIFIER"},
      {"name": ".", "type": "PUNCTUATION"},
      {"name": "init", "type": "IDENTIFIER"},
      {"name": "(", "type": "PUNCTUATION"},
      {"name": ")", "type": "PUNCTUATION"},
      {"name": ";", "type": "TERMINATOR"}
    ]

2. Syntax Analysis

  2-1. CFGs 제작
    
    N = { <DECL>, <EXPR>, <CLASS_CALL> }
    T = { "var", "new", "=", ".", "(", ")", ";", IDENTIFIER }
    P = {
    <DECL>      → KEYWORD IDENTIFIER = <EXPR> ;
    <EXPR>      → KEYWORD <CLASS_CALL>
    <CLASS_CALL> → IDENTIFIER . IDENTIFIER ()
    }
    S = <DECL>

  2-2. FIRST, FOLLOW 함수, PARSING TABLE 제작 

    FIRST(<DECL>)        = { "var" }
    FIRST(<EXPR>)        = { "new" }
    FIRST(<CLASS_CALL>)  = { IDENTIFIER }

    FOLLOW(<DECL>)        = { $ }
    FOLLOW(<EXPR>)        = { ";" }
    FOLLOW(<CLASS_CALL>)  = { ";" }

  2-3. LL(1) PARSER를 활용해서 CST 제작

    스택: [ $, <DECL> ]
    <DECL>
    ├── "var"
    ├── IDENTIFIER ("a")
    ├── "="
    ├── <EXPR>
    │   ├── "new"
    │   └── <CLASS_CALL>
    │       ├── IDENTIFIER ("A")
    │       ├── "."
    │       ├── IDENTIFIER ("init")
    │       ├── "("
    │       └── ")"
    └── ";"

  2-4. RHS에 기반하여 AST제작
    =
    ├── IDENTIFIER ("a")
    └── new
        └── call
            ├── IDENTIFIER ("A")
            └── IDENTIFIER ("init")


# 이번 미션을 통해 학습한 것과 과정에서 배운 것을 코드, 다이어그램, 그림 등을 통해 종합적/메타적으로 설명해 봅니다.

1. 주요 로직은 main.js, frontend.js에 작성하였으며, 토큰 처리 및 파서 구조 중심으로 구현함.

2. 자세하게 제가 이해하고 공부한 부분에 대해서는 word로는 올리는 방법을 잘 몰라서 아래 링크로 제작을했습니다.

  - https://kimdwan-dev.blogspot.com/2025/06/blog-post_71.html
  - https://kimdwan-dev.blogspot.com/2025/06/blog-post_30.html
