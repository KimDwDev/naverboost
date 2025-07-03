"use strict"

const STATE = Object.freeze({
  OFF : "OFF",
  ON : "ON",
  ERROR : "ERROR"
})

const USERKey = Object.freeze({
  SCORE : "SCORE",
  START : "START", 
  END : "END",
  POINT : "POINT",
  DICE : "DICE",
}) 

const USERState = Object.freeze({
  STOP : "STOP",
  PLAY : "PLAY",
  ERROR : "ERROR"
})

const DiceName = Object.freeze({
  D : "D",
  K : "K",
  G : "G",
  U : "U",
  M : "M"
})

const DiceValue = Object.freeze({
  [DiceName.D] : 1,
  [DiceName.K] : 2,
  [DiceName.G] : 3,
  [DiceName.U] : 4,
  [DiceName.M] : 5
})

const BoardPoint = Object.freeze({
  Z : "Z",
  W : "W",
  X : "X",
  V : "V",
  Y : "Y"
})

const BoardPinName = Object.freeze({
  LIMIT : "LIMIT",
  BONUS : "BONUS",
  COMMON : "COMMON"
})

const Board = Object.freeze({

  [BoardPoint.Z] : {
    [BoardPoint.W] : {
      [BoardPinName.LIMIT] : 5,
      [BoardPinName.BONUS] : BoardPoint.V,
      [BoardPinName.COMMON] : BoardPoint.X
    }
  },

  [BoardPoint.W] : {
    [BoardPoint.V] : {
      [BoardPinName.LIMIT] : 3,
      [BoardPinName.BONUS] : BoardPoint.Z,
      [BoardPinName.COMMON] : BoardPoint.Y
    }, 
    
    [BoardPoint.X] : {
      [BoardPinName.LIMIT] : 5,
      [BoardPinName.BONUS] : BoardPoint.V,
      [BoardPinName.COMMON]: BoardPoint.Y
    }
  },

  [BoardPoint.X] : {
    [BoardPoint.V] : {
      [BoardPinName.LIMIT] : 3,
      [BoardPinName.BONUS] : BoardPoint.Z,
      [BoardPinName.COMMON] : BoardPoint.Z
    },

    [BoardPoint.Y] : {
      [BoardPinName.LIMIT] : 5,
      [BoardPinName.BONUS] : BoardPoint.Z,
      [BoardPinName.COMMON] : BoardPoint.Z
    }
  },

  [BoardPoint.V] : {
    [BoardPoint.Z] : {
      [BoardPinName.LIMIT] : 3,
      [BoardPinName.BONUS] : BoardPoint.Z,
      [BoardPinName.COMMON] : BoardPoint.Z
    },

    [BoardPoint.Y] : {
      [BoardPinName.LIMIT] : 5,
      [BoardPinName.LIMIT] : BoardPoint.Z,
      [BoardPinName.COMMON] : BoardPoint.Z
    }
  },

  [BoardPoint.Y] : {
    [BoardPoint.Z] : {
      [BoardPinName.LIMIT] : 5,
      [BoardPinName.BONUS] : BoardPoint.Z,
      [BoardPinName.COMMON]: BoardPoint.Z
    }
  }

})


module.exports = { STATE, USERKey, USERState, BoardPoint, DiceName, DiceValue, Board, BoardPinName };