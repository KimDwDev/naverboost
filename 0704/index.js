"use strict";
const { FileClass } = require("./file")
const { StringClass } = require("./string")
const { MathClass } = require("./math")
const { STATE, MAP_NAME, VERTICE_NAME, TRIANGLE_NAME, ANSWER_NAME } = require("./name")

class Architect {

  #systemState = STATE.OFF;
  #fileData = undefined;
  #modelData = new Map();
  #parseData = new Map();
  #answer = {
    [ANSWER_NAME.NUMBER1] : undefined,
    [ANSWER_NAME.NUMBER2] : undefined,
    [ANSWER_NAME.NUMBER3] : undefined,
    [ANSWER_NAME.NUMBER4] : undefined
  }

  constructor(fileName) {
    // 파일 다루는 클래스
    this.FileClass = new FileClass(fileName);
    // 문자열 다루는 클래스
    this.StringClass = new StringClass();
    // 수학 문자 사용 클래스
    this.MathClass = new MathClass();
  }

  /** 입력한 파일 이름의 데이터를 가져오는 로직 */
  async #GetFileData() {
    
    // 파일 이름 변환 -> 파일 데이터 읽기 
    if (this.FileClass.ChangeFilePath()) {
      this.#fileData = await this.FileClass.ReadFileData();
      this.#systemState = STATE.ON;
    }
  }

  /** 각각의 파일 데이터를 가져오는 로직 */
  async #GetEachFileData() {
    
    // 정규 표현식으로 각 파일의 이름 가져오기
    const strList = this.StringClass.CutContext(this.#fileData, /path="Objects\/(A|B|C)\.model"\s[a-z]{8}="[1-9]"/g);

    // path가 있는 데이터중 필요한 것만 가져오기
    const parseData = strList.map(async(strTitle) => {

      // path 찾고 첫번째 문자 변형-> 
      let targetPath = strTitle.match(/Objects\/(A|B|C)\.model/g)[0];
      targetPath = targetPath.replace("O", "o");

      // 파일 클래스 사용
      const smallFileData = await this.FileClass.OneQueReadFile(targetPath);

      // key값 설정
      if (smallFileData) {
        const objectKey = strTitle.matchAll(/objectid="([1-9])"/g);
        for (const ok of objectKey) {
          this.#modelData.set(ok[1], smallFileData);
        }
      }
    })

    await Promise.all(parseData);
    return true;
  }

  // 만약 오류가 발생한다면 여기를 의심해봐야 한다.
  #GetVerticleAndTriangle() {

    for (const [dataKey, dataValue] of this.#modelData) {

      // 이들도 객체화 가능하기는 할거다. 좀 고민하면
      const BigData = [];
      const regxpArray = [
        /x="(-)?[0-9]+(\.[0-9]+)?"\sy="(-)?[0-9]+(\.[0-9]+)?"\sz="(-)?[0-9]+(\.[0-9]+)?"/g,
        /v1="[0-9]"\sv2="[0-9]"\sv3="[0-9]"/g
      ]
      const mapName = [MAP_NAME.VERTICES, MAP_NAME.TRIANGLES]
      const regDatas = [
        [VERTICE_NAME.X, /x="((?:-)?[0-9]+(?:\.[0-9]+)?)"/g, 1], [VERTICE_NAME.Y, /y="((?:-)?[0-9]+(?:\.[0-9]+)?)"/g, 1] , [VERTICE_NAME.Z, /z="((?:-)?[0-9]+(?:\.[0-9]+)?)"/g, 1],
        [TRIANGLE_NAME.V1, /v1="([0-9])"/g, 1], [TRIANGLE_NAME.V2, /v2="([0-9])"/g, 1], [TRIANGLE_NAME.V3, /v3="([0-9])"/g, 1]
      ]

      // context로 자르고 object를 만든다.
      for ( let i = 0; i < 2; i++ ) {
        const smallData = this.StringClass.CutContext(
          dataValue,
          regxpArray[i]
        )
        const smallObject = this.StringClass.MakeObjectData(
          mapName[i], smallData, regDatas[i*3], regDatas[i*3 + 1], regDatas[i*3 + 2]  
        )
        BigData.push(smallObject);
      }

      this.#parseData.set(dataKey, { ...BigData[0], ...BigData[1] });
    }
  }

  // 각 삼각형을 돌면서 1 - 4번까지를 한번에 수집하는게 가장 효율적인 루트일것 같다.
  #Answer() {

    for (const [parseKey , parseData] of this.#parseData) {

      // INIT
      const vertices = parseData[MAP_NAME.VERTICES];
      if (!Array.isArray(parseData[MAP_NAME.TRIANGLES]) || !Array.isArray(vertices)) continue;

      // 1. 타겟 데이터 탐색
      parseData[MAP_NAME.TRIANGLES].forEach((triangleData) => {

        // x, y, z 가져오기
        const xyz = [vertices[+triangleData[TRIANGLE_NAME.V1]], vertices[+triangleData[TRIANGLE_NAME.V2]], vertices[+triangleData[TRIANGLE_NAME.V3]] ];

        // x, y, z로 각각 숫자로 사용하게 변경
        const [ x, y, z ] = xyz.map((xyzData) => {
          return [ +xyzData[VERTICE_NAME.X], +xyzData[VERTICE_NAME.Y], +xyzData[VERTICE_NAME.Z]];
        });

        // 넓이 구하기
        const crossNum = this.MathClass.CrossProductFunction(x, y, z)
        
        // 넓이가 0이라는것은 세 점이 한 직선위에 있기 때문에 넓이라고 칠수가 없다. 따라서 삼각형일 때만 문제의 정답을 골라주는 것이다.
        if ( crossNum > 0 ) {

          

        }
      }) 
    }
  }

  async Start() {

    // 파일을 주소로 변경
    await this.#GetFileData();

    // 시스템이 켜졌을때만 반응
    if ( this.#systemState === STATE.ON ) {
      const loadFileBool = await this.#GetEachFileData();
      if (loadFileBool) this.#systemState = STATE.DATA_LOAD;
    }

    // 파일이 다 받아졌을때만 반응
    if (this.#systemState === STATE.DATA_LOAD) {
      this.#GetVerticleAndTriangle();
      this.#systemState = STATE.DATA_SET;
    };

    // 파일이 준비되어졌을때만 반응
    if (this.#systemState === STATE.DATA_SET) {
      this.#Answer();
    }
  }
}

const architect = new Architect("data.model");
architect.Start();