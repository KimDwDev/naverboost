"use strict";


// 책에 정보를 저장
const Libarary = Array.from([
  "Great true Novel 3.1 2",
  "Laws true Novel 4.8 3",
  "Dracula true Drama 2.3 6",
  "Mario true Drama 3.8 4",
  "House false Magazine 4.4 1",
  "Art1 true Design 4.2 2",
  "Art2 true Design 3.0 3",
  "Wars true Novel 4.6 2",
  "Solo false Poem 4.9 2",
  "Lost false Web 3.2 8",
  "Ocean true Magazine 4.3 1",
]);

// 책에 년도 
const BookYear = Array.from([
  "Great 1970.1~1981.4",
  "Laws 1980.6~1985.7",
  "Wars 1982.4~2003.5",
  "Art1 1985.6~1991.7",
  "House 1987.7~현재",
  "Dracula 1991.5~1996.5",
  "Art2 1995.2~2005.12",
  "Lost 1998.6~현재",
  "Mario 2001.9~2012.11",
  "Ocean 2005.2~2020.6",
  "Solo 2007.3~현재",
])

// 병합 정렬 
class MergeSortClass {
  
  /**
   * 
   * @param {arr} arr // 정렬할 배열 
   */
  constructor(arr) {
    this.arr = arr;
  }

  MergeSortFunc(arr) {


    const arr_len = arr.length;

    if (arr_len <= 1) return;

    const left_arr = arr.slice(0, Math.trunc(arr_len / 2));
    const rigt_arr = arr.slice(Math.trunc(arr_len/2), arr_len + 1);

    this.MergeSortFunc(left_arr);
    this.MergeSortFunc(rigt_arr);

    // 정렬
    this.SortFunc(arr, left_arr, rigt_arr);

  }
  
  SortFunc(arr, left_arr, right_arr) {

    let i = 0, j = 0, k =0;

    while (i < left_arr.length && j < right_arr.length) {

      if (left_arr[i][0] <= right_arr[j][0]) {
        arr[k] = left_arr[i];
        i += 1;
      } else {
        arr[k] = right_arr[j];
        j += 1;
      }
      k += 1;
    }

    while (i < left_arr.length) {
      arr[k] = left_arr[i];
      k += 1;
      i += 1;
    }

    while (j < right_arr.length) {
      arr[k] = right_arr[j];
      k += 1;
      j += 1;
    }
  }

  FinalFunc() {
    this.MergeSortFunc(this.arr);
  }

}

// 클래스로 참조하려고 했는데 좀 위험하다는 생각을 하였다.
const DataJoin = (l, y) => {

  // 초기 설정
  const joinData = new Map();

  // 데이터 정렬 여기서 
  const sortL = Array
  .from(l)
  .map((value) => String(value).split(" "))
  
  // 병합 정렬
  const m = new MergeSortClass(sortL);
  m.FinalFunc();

  // 이분 탐색
  
  
}

/**
 * 
 * @param {param0} param0 // 특정시점(문자열)
 * @param {param1} param1 // 구매권수(정수형)
 */
function find(param0, param1) {

  // 데이터 베이스 join
  DataJoin(Libarary, BookYear);
}

find(0, 1);