"use strict";

export class StringClass {

  constructor() {}

  /**
   * 
   * @param {context} context // 나눠질 운명인 문맥
   * @param {reg} reg // 정규표현식 
   */
  CutContext(context, reg) {
    const strList = [];
    for ( const m of String(context).matchAll(reg) ) {
      strList.push(m[0]);
    }
    return strList;
  }
  
  /**
   * 깊은 제한을 통해서 변경이 불가능한 객체를 반환
   * @param {string} name // 객체에 이름이 되는 값  
   * @param {Array} contextList // 찾으려는 리스트 
   * @param  {...[string, any, number]} keys // [이름과 정규표현식, 가져오려는 데이터 그룹넘버]  
   * @returns 
   */
  MakeObjectData(name, contextList, ...keys) {

    const DataList = [];

    if (!Array.isArray(contextList)) throw new Error("배열만 대입할 수 있습니다.");

    contextList.forEach((contextData) => {
      const smallObject = {}
      keys.forEach(([keyName, keyReg, groupNum]) => {
        const matchDatas = String(contextData).matchAll(keyReg);
        for (const matchData of matchDatas) smallObject[keyName] = matchData[groupNum];
      })
      DataList.push(Object.freeze(smallObject));
    })
    const DataObject = Object.freeze({
      [name] : Object.freeze(DataList)
    });

    return DataObject;
  }

}
