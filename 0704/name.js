"use strict";

const STATE = Object.freeze({
  ON : "ON",
  OFF : "OFF",
  DATA_LOAD : "DATA LOAD",
  DATA_SET : "DATA SET",
  ERROR : "ERROR"
})

const MAP_NAME = Object.freeze({
  VERTICES : "vertices",
  TRIANGLES : "triangles"
})

const VERTICE_NAME = Object.freeze({
  X : "x", 
  Y : "y",
  Z : "z"
})

const TRIANGLE_NAME = Object.freeze({
  V1 : "v1",
  V2 : "v2",
  V3 : "v3"
})

const ANSWER_NAME = Object.freeze({
  NUMBER1 : "NUMBER1",
  NUMBER2 : "NUMBER2",
  NUMBER3 : "NUMBER3",
  NUMBER4 : "NUMBER4"
})

module.exports = { STATE, VERTICE_NAME, TRIANGLE_NAME, MAP_NAME, ANSWER_NAME };