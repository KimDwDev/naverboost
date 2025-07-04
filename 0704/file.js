"use strict"

import * as fs from "fs/promises";
import * as path from "path";

// 파일을 다루는 클래스
export class FileClass {

  constructor(filePath) {
    this.filePath = filePath;
  }

  /**입력한 파일이름을 경로로 변경해줌 */
  ChangeFilePath() {
    this.filePath = path.join(process.cwd(), this.filePath);
    return true;
  }

  /**파일의 데이터를 읽음 */
  async ReadFileData() {
    try {
      const file = await fs.readFile(this.filePath, "utf-8");
      return file;
    } catch (err) {
      throw err;
    } 
  }

  /**
   * 
   * @param {fileName} fileName 이름만 넣어도 바로 주소랑 파일을 읽는 올인원 함수 
   * @returns 
   */
  async OneQueReadFile(fileName) {

    const filePath = path.join(process.cwd(), fileName);
    
    try {
      const fileData = await fs.readFile(filePath, "utf-8");

      return fileData;
    } catch (err) {
      throw err;
    }
  }
  
}
