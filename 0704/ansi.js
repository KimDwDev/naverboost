"use strict";
import chalk from "chalk";

export class ChalkClass {
  /**
   * @param {number} width - 진행바 너비(기본 30)
   */
  constructor(width = 30) {
    this.width = width;
  }

  /**
   * percentage에 따라 콘솔에 진행바를 그립니다.
   * 호출할 때마다 같은 줄을 덮어씁니다.
   * @param {number} percentage - 0~100 사이 값
   */
  ProgressBar(percentage) {
    const pct = Math.max(0, Math.min(100, percentage));
    const filled = Math.round((this.width * pct) / 100);
    const empty = this.width - filled;

    // 채워진 부분은 녹색, 비어있는 부분은 회색 배경으로 표시
    const bar =
      chalk.bgGreen(" ".repeat(filled)) +
      chalk.bgGray(" ".repeat(empty));

    // ": " 앞의 \r로 같은 줄을 덮어쓰기
    process.stdout.write(`\r[${bar}] ${String(pct.toFixed(0)).padStart(3)}%`);

    // 100% 도달 시 줄 바꿈
    if (pct >= 100) {
      process.stdout.write("\n");
    }
  }
}

