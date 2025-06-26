"use strict";

class HashMap {

  /**
   * 맵의 크기는 16, 로드팩터의 사이즈는 0.75이다.
   * @param {size} size // size는 초반에 정할 사이즈이다. ( 2의 거듭제곱을 기준으로 설정 )
   */
  constructor(size = 16) {
    this.mapSize = 0;
    this.map = Array.from({length : size}, () => []);
    this.keys = Array.from({length : size}, () => []);
    this.roadfactor = 0.75;
  }

  /**
   * 
   * @param {key} key // 인덱싱화 할 값 
   */
  TranslateKeyFunc(key) {

    // 키가 비어있다면 0을 준다.
    if (key === null || key === undefined) return 0;

    // 차례로 키의 문자, 총 값 (32진수의 해쉬값으로 변환)
    const keyStr =  typeof key === "object" ? JSON.stringify(key) : String(key);
    let hashValue = 0;

    for (let i = 0; i < keyStr.length; i++) {

      // 유니코드 표준 표에서 값을 가져온다.
      hashValue = (hashValue * 31 + keyStr.charCodeAt(i)) | 0; 
    }

    // 32 진수 정수로 변환
    const parseHash = hashValue >>> 0;

    // 용량 가져오기 
    const capacity = this.map.length;

    return parseHash & ( capacity - 1 );
  }


  /**
   * 
   * 대입할
   * @param {key} key // key 값
   * @param {idx} idx // idx 값
   * @param {value} value // value 값
   */
  InputValueFunc(key, idx, value) {

    // 충돌 여부 확인
    if ( this.keys[idx].length === 0 ) {
      this.keys[idx].push(key);
      this.map[idx].push(value);
      this.mapSize += 1;
      return;
    } 

    // 기존에 값에 있는가 확인
    for (let i = 0; i < this.keys[idx].length; i++) {
      if (this.keys[idx][i] === key) {
        this.map[idx][i] = value;
        return;
      }
    }

    // 마지막 까지 발견을 못하면 
    this.keys[idx].push(key);
    this.map[idx].push(value);
    this.mapSize += 1;
  }

  /**
   * 배열의 크기를 다시 리사이징 해준다.
   */
  Resize() {

    // key값을 모두 빼온다.
    const keys = this.keys.flat();
    const values = this.map.flat();

    // key와 map의 리사이징
    const keyMapSize = this.keys.length * 2 ;
    this.keys = Array.from({length : keyMapSize}, () => []);
    this.map = Array.from({length : keyMapSize}, () => []);
    this.mapSize = 0;

    // 재배정
    keys.forEach((key, idx) => {
      const keyIdx = this.TranslateKeyFunc(key);
      this.InputValueFunc(key, keyIdx, values[idx]);
    })
  }

  /**
   * 해시함수에 들어오는 
   * @param {key} key // key값 
   * @param {value} value // value 값
   */
  put(key, value) {

    // key를 인덱싱화 해야함
    const keyIdx = this.TranslateKeyFunc(key);
    
    // key값에 데이터를 넣음
    this.InputValueFunc(key, keyIdx, value);

    // 리사이징 여부
    if ((this.mapSize / this.map.length) > this.roadfactor ) this.Resize();
  }

  /** 전체 맵을 초기화 해주는 함수 */
  clear() {
    const size = 16;
    this.map = Array.from({ length : size }, () => []);
    this.keys = Array.from({ length : size }, () => []);
    this.mapSize = 0;
  }

  /**
   * 확인하려는
   * @param {key} key // key의 값 
   */
  containsKey(key) {

    // 인덱스 변환
    const keyIdx = this.TranslateKeyFunc(key);
    
    // 값이 존재하는지 확인
    const candidateKeyBox = this.keys[keyIdx]; 
    for (let i = 0; i < candidateKeyBox.length; i++) {
      if (key === candidateKeyBox[i]) return true;
    }

    return false;
  }

  /**
   * 매치되는 값 확인
   * @param {key} key 키값 
   */
  get(key) {

    // 인덱스 계산
    const keyIdx = this.TranslateKeyFunc(key);

    // 값 찾기
    const candidateKeyBox = this.keys[keyIdx];
    for (let candidateI = 0; candidateI < candidateKeyBox.length; candidateI++) {

      if (candidateKeyBox[candidateI] === key) return this.map[keyIdx][candidateI]; 
    }
    return undefined;
  }

  /**
   * 비어 있는지 여부를 확인
   */
  isEmpty(){
    if (this.mapSize === 0) return true;
    return false;
  }

  /**
   * 
   * 모든 키값을 알려줌
   */
  Keys() {
    return this.keys.flat();
  }

  /**
   * 
   * @param {key} key // 해당 key값을 삭제 
   */
  remove(key) {

    // 인덱스 위치 확인
    const keyIdx = this.TranslateKeyFunc(key);

    // 값 찾기
    const candidateKeyBox = this.keys[keyIdx];
    for (let candidateI = 0; candidateI < candidateKeyBox.length; candidateI++) {
      if (candidateKeyBox[candidateI] === key) {
        this.keys[keyIdx].splice(candidateI, 1);
        this.map[keyIdx].splice(candidateI, 1);
        this.mapSize -= 1;
        break;
      }
    } 
  }
  
  size() {return this.mapSize;}

}

const hashmap = new HashMap();
hashmap.put("김동완", 4);
hashmap.put("김완동", 2);
hashmap.put({"1": 2}, 3);
hashmap.put([1, 2, 3], 3);
console.log(hashmap.Keys());