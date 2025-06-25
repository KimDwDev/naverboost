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

/**
 * 
 * @param {timeData} timeData // 객체로 사용할 변수
 * @param {date} date // 파싱할 데이터 
 */
const ParsingDate = (timeData, date) => {

  if (date === "현재") return [timeData.getFullYear(), timeData.getMonth() + 1];

  // 값이 존재한다면
  const dateArr = String(date).split(".")

  // .으로 나누어진 데이터를 파싱하는 방법과 YYYYMM으로 나누어진 데이터를 파싱하는 방법 나누어서 한다.
  if (dateArr.length > 1) return dateArr.map((dateValue) => parseInt(dateValue)); 
  else return [ parseInt(dateArr[0].slice(0, 4)),  parseInt(dateArr[0].slice(4, 6))];
}

/**
 * 
 * @param {targetDateValue} targetDateValue // 목표가 되는 데이터의 시간 값 
 * @param {startYear} startYear // 시작 년도  
 * @param {startMonth} startMonth // 시작 달
 * @param {endYear} endYear // 끝나는 년도 
 * @param {endMonth} endMonth // 끝나는 달
 */
const CheckDate = (targetDateValue, startYear, startMonth, endYear, endMonth) => {

  const startDateValue = new Date(startYear, startMonth - 1);
  const endDateValue = new Date(endYear, endMonth - 1);

  if (targetDateValue >= startDateValue && targetDateValue <= endDateValue) return 1;
  else return 0;
}

/**
 * return 값으로 책의 이름을 준다. 
 * @param {date} date // 특정시점 
 */
const FindBook = (date) => {

  // 초기 설정 순서대로 책을 담을 배열, Date클래스 생성, 대입한 값의 년도와 월을 채집
  const findBooks = Array.from([]);
  const timeData = new Date();
  const [ targetYear, targetMonth ] = ParsingDate(timeData, date);
  const targetDateValue = new Date(targetYear, targetMonth - 1);

  BookYear.forEach((bookStr) => {
    
    // 책의 정보와 년도를 분리
    const bookStats = String(bookStr).split(" ");

    const bookName = bookStats[0];
    const bookDate = bookStats[1];

    // 책의 시작년도와 마지막 년도를 분리 
    const bookDates = bookDate.split("~");
    const startDate = bookDates[0];
    const endDate = bookDates[1];

    // 의문점1 
    // 년도와 월을 계산
    const [ startYear, startMonth ] = ParsingDate(timeData, startDate);
    const [ endYear, endMonth ] = ParsingDate(timeData, endDate);

    // 조건 비교
    const checkBool = CheckDate(targetDateValue, startYear, startMonth, endYear, endMonth);
    if (checkBool) findBooks.push(bookName);
  })

  return findBooks
}

/**
 * 힙 정렬을 구현함
 */
class HeapSortClass {
  /**
   * 
   * @param {arr} arr // [idx, name]으로 구성된 배열 
   */
  constructor (arr) {
    this.arr = arr;
  }

  HeapFy(i, upper) {

    while (1) {
      
      let largest = i;
      let left = 2 * i + 1, right = 2 * i + 2;

      if (left < upper && this.arr[largest][1] < this.arr[left][1]) largest = left;
      if (right < upper && this.arr[largest][1] < this.arr[right][1]) largest = right;

      if (largest !== i) {
        const prevVal = this.arr[i];
        this.arr[i] = this.arr[largest];
        this.arr[largest] = prevVal;
        i = largest;
      } else {
        break;
      }
    }
  }

  HeapSortFunc() {

    const arrLen = this.arr.length;

    for (let i = Math.trunc(arrLen/2) - 1; i > -1; i-- ) {
      this.HeapFy(i, arrLen);
    }

    for (let i = arrLen - 1; i > 0; i--) {
      const prevVal = this.arr[0];
      this.arr[0] = this.arr[i];
      this.arr[i] = prevVal;
      this.HeapFy(0, i);
    }
  }

}

/**
 * 책이름이 중복되는 것도 따지고자 한다면 여기를 건드려야 한다.
 * @param {bookName} bookName 찾고자 하는 이름
 * @param {idxDatas} idxDatas [ idx, 이름 ]으로 이루어진 데이터
 */
const BinarySearchBook = (bookName, idxDatas) => {

  const idxDataLen = idxDatas.length;
  let start = 0, end = idxDataLen - 1;

  while (start <= end) {

    const mid = Math.trunc(( start + end ) / 2);

    if ( idxDatas[mid][1] === bookName ) return idxDatas[mid][0];

    else if (idxDatas[mid][1] > bookName) end = mid - 1;

    else start = mid + 1;
  } 
}

/**
 * 
 * @param {findBooks} findBooks // 찾아야 하는 책의 이름이 담긴 데이터 
 */
const SearchBooks = (findBooks) => {

  // 초기 설정
  const searchBooks = Array.from([]);

  // 복사 
  const indexArr = Libarary.map((value, idx) => { return [ idx, String(value).split(" ")[0] ]; })

  // 이름에 따라서 힙정렬 (메모리 변환 없이 바꾸는 방법 1)
  const h = new HeapSortClass(indexArr);
  h.HeapSortFunc();

  // 이진탐색
  findBooks.forEach((bookName) => {

    const targetIdx = BinarySearchBook(bookName, indexArr);

    if (targetIdx !== undefined && targetIdx >= 0) {
      searchBooks.push(Libarary[targetIdx]);
    }
  })

  return searchBooks;
}

/**
 * 
 * @param {searchBooks} searchBooks // 후보가 되는 책들 
 * @param {payCount} payCount // 구매해야 하는 권수  
 */
const Answer = (searchBooks, payCount) => {

  // 초기 설정
  const answerArray = Array.from([]);

  // 완전 탐색을 하면서 영리하게 정렬하고 싶다.(추가 사항)

  // 하지만 떠오르지 않기에 일단 조건에 맞는 경우를 찾자
  const seachBooksLen = searchBooks.length;
  for (let i = 0; i < seachBooksLen; i++) {

    const searchBook = searchBooks[i];

    const [ bookName, bookBool, bookType, bookScore, bookCount ] = String(searchBook).split(" ")

    // 1. 판매권수 이상이어야 한다.
    if ( +bookCount < payCount ) continue;

    let answerStr = bookName;

    // 2. 절판인지 확인
    if (bookBool === "true") answerStr += "*";

    answerStr += `(${bookType})`;

    answerArray.push([bookScore, answerStr]);
  }

  if (answerArray.length === 0) return "!EMPTY";

  // 정렬 (지우는 방법이 있을거야 분명...)
  answerArray.sort((a, b) => {return b[0] - a[0]});

  // 정답 
  let answer = "";
  answerArray.forEach((ans, idx) => {
    if (idx > 0) answer += ", ";
    answer += `${ans[1]} ${String(ans[0])}`;
  })

  return answer;
}

/**
 * 도서를 찾아주는 함수
 * @param {param0} param0 // 특정시점(문자열)
 * @param {param1} param1 // 구매권수(정수형)
 */
function find(param0, param1) {

  // 특정 시점에 해당하는 책의 이름 검색 
  const findBooks = FindBook(param0);

  // 특정 시점에 해당하는 책의 정보를 검색
  const searchBooks = SearchBooks(findBooks);

  // 조건에 맞는 책을 찾아주자  
  return Answer(searchBooks, param1);

}

find("200008", 6);