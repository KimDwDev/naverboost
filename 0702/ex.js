"use strict";

const data = {
  number1 : 1,
  number2 : 2,
  number3 : 3
}

const Data = {

  data : {
    number1 : data.number1,
    number2 : data.number2,
    number3 : data.number3
  }

}

data.number1 = 2;
console.log(Data);