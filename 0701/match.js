"use strict"
const { FileClass } = require("./file")
const FileClassObject = new FileClass();

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