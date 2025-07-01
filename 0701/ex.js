"use strict"


class FileClass{

  constructor() {}

  /**
   * 
   * @param {arr} arr // 파일 리스트 
   */
  GetFileName(arr) {

    // 배열이 아닌경우 컷
    if ( !Array.isArray(arr) ) throw new Error("배열만 들어 올 수 있습니다.");

    return arr.map((value) => {
      return String(value).split("/").at(-1);
    })
  }


  /**
   * 
   * 내가 여기서는 Map을 사용한 이유 나는 프레임 워크를 계획하고 있다 보니 
   * 프레임워크는 특성상 대규모 데이터를 생각할 수 밖에 없다고 생각
   * @param {fileNames} fileNames // 파일 이름 리스트 
   */
  SplitFileName(fileNames) {

    // 배열 확인
    if (!Array.isArray(fileNames)) throw new Error("배열만 들어 올 수 있습니다");
    
    // 문자 데이터를 담는 변수
    const fileData = Array(fileNames.length);

    for (let i = 0; i < fileNames.length; i++) {

      // 문자이름을 지정하고 나눈다.
      const fileName = fileNames[i];
      const fileNameList = String(fileName).split(".");
      if (fileNameList.length !== 2) throw new Error("파일 이름을 확인해주세요");

      // 맵에 지정하고 문자를 입력한다.
      const [ file, exe ] = fileNameList;

      // 가능한 파일 확장자만 남기려고 함 만약 pdf, word 등만 가능하게 할려고 했다면 /^(word|pdf)/
      const regxp = /^[a-z]{2}/;
      const parseExe = exe.match(regxp);

      const fileMap = new Map();
      fileMap.set("file", file);
      fileMap.set("exe", parseExe);
      fileData[i] = fileMap;
    }

    return fileData;
  } 

}
const FileClassObject = new FileClass();


const RegxpFunc = (arr) => {

  if (!Array.isArray(arr)) throw new Error("배열이 아닙니다");

  for (let i = 0; i < arr.length; i++) {

    const fileType = arr[i];

    const allFile = String(fileType).split("/");

    for (let j = 1; j < allFile.length; j++) {

      const fileStr = allFile[j];
      
      // 디렉토리 이름이나 파일 이름은 알파벳 소문자 a-z 중에 하나로 이뤄집니다.      
      const regxp1 = /^[a-z]{1}/;
      if (!fileStr.match(regxp1)) throw new Error("디렉토리 이름이나 파일 이름은 알파벳 소문자 a-z 중에 하나로 이뤄집니다") ;
      
      // 파일 이름에는 .aa 부터 .zz까지 항상 두 자리 확장자(두 글자)가 붙습니다.
      const regxp2 = /\.[a-z]{2}?/;
      if (j === (allFile.length - 1) && !fileStr.match(regxp2)) throw new Error("파일 이름에는 .aa 부터 .zz까지 항상 두 자리 확장자(두 글자)가 붙습니다");

      // 디렉토리 하위에는 /a/b/, /a/c/b/처럼 다른 디렉토리가 포함될 수 있습니다.
      const regxp3 = /^[a-z]$/;
      if ( j < (allFile.length - 1) &&  !fileStr.match(regxp3)) throw new Error("디렉토리 하위에는 /a/b/, /a/c/b/처럼 다른 디렉토리가 포함될 수 있습니다");

      // 파일 이름 뒤에는 _v1, _v2, ... _v9까지 최대 9종류의 버전을 추가로 붙일 수 있습니다.
      const regxp4 = /[a-z](_v[1-9])?\./;
      if ( j === (allFile.length - 1) && !fileStr.match(regxp4)) throw new Error("파일 이름 뒤에는 _v1, _v2, ... _v9까지 최대 9종류의 버전을 추가로 붙일 수 있습니다");

    }
  }
}

/**
 * 
 * @param {files} files // 파일들 모음 
 * @param {lex} lex // 분리할 문자
 */
const LexialFunc = (files, lex) => {

  // 파일이 아닐경우 백
  if ( !Array.isArray(files) ) throw new Error("파일 형태를 확인해주세요");

  const fileObject = {};

  for (let i = 0; i < files.length; i++) {

    const fileMap = files[i];

    if (!( fileMap instanceof Map )) throw new Error("file에 맵이 있는지 확인해 보세요.");

    // 값 꺼내오기
    let file = fileMap.get("file");
    const exe = fileMap.get("exe");

    // 전처리
    const fileExg = String(file).split(lex);
    file = fileExg.at(0);

    const fileOriginName = `${file}.${exe}`
    if ( fileOriginName in fileObject ) {
      fileObject[fileOriginName] += 1;
    } else {
      fileObject[fileOriginName] = 1;
    }
  }

  return fileObject
}

/**
 * 
 * @param {answer} answer // 답으로 사용될 answer
 * @param {fileObject} fileObject // 쓰일 fileObject
 */
const Answer = (answer, fileObject) => {

  if (!( answer instanceof Map)) throw new Error("answer를 다시 확인해주세요");

  if (Object.prototype.toString.call(fileObject) !== "[object Object]") throw new Error("fileObject를 확인하세요");

  for (const obj in fileObject) {

    if ( fileObject[obj] < 2 ) continue;

    answer.set(obj, fileObject[obj]);
  }
}

function match(arr) {

  // 파일의 형식이 맞는지 확인해주는 함수
  RegxpFunc(arr);

  // 정답 배열
  const answer = new Map();

  // 파일 이름들
  let fileNames = FileClassObject.GetFileName(arr);

  // 파일 이름만 있으면 되기때문에 기존에 거는 삭제한다.
  arr = undefined;

  // 파일의 확장자와 이름들을 추출
  let files = FileClassObject.SplitFileName(fileNames);

  // 파일 이름은 필요가 없으니까 삭제
  fileNames = undefined;

  // 전처리 (나는 파일의 개수가 100개 미만인 것을 알고 있음)
  const fileObject = LexialFunc(files, "_");

  // 파일의 종류도 필요없으니 삭제
  files = undefined;

  // 정답
  Answer(answer, fileObject);

  return answer;
}

const readline = require("readline");

const r1 = readline.createInterface({
  input : process.stdin,
  output : process.stdout
})

r1.question('', (que) => {

  const answer = match(que.split(","));
  console.log(answer);
  r1.close();
});