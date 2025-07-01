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
      const fileMap = new Map();
      fileMap.set("file", file);
      fileMap.set("exe", exe);
      fileData[i] = fileMap;
    }

    return fileData;
  } 

}

module.exports = { FileClass };