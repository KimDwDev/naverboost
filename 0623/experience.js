function nextPosition1(current, dice) {
    const next = current + dice;
    if (next == 4) {
        return dice + 10;
    }
    else if (next == 8) {
        return dice + 22;
    }
    else if (next == 21) {
        return dice + 21;
    }
    else if (next == 28) {
        return dice + 48;
    }
    else if (next == 50) {
        return dice + 17;
    }
    else if (next == 71) {
        return dice + 21;
    }
    else if (next == 80) {
        return dice + 19;
    }
    
    return dice;    
}

function nextPosition2(current, dice) {
    const next = current + dice;
    if (next == 32) {
        return dice - 22;
    }
    else if (next == 36) {
        return dice - 30;
    }
    else if (next == 48) {
        return dice - 22;
    }
    else if (next == 62) {
        return dice - 44;
    }
    else if (next == 88) {
        return dice - 64;
    }
    else if (next == 95) {
        return dice - 39;
    }
    else if (next == 97) {
        return dice - 19;
    }
    
    return dice;    
}

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question("시작 위치를 입력하세요: ", (startInput) => {
    const start = parseInt(startInput, 10);
    const dice = Math.floor(Math.random()*6)+1 ;

    let moved = nextPosition1(start, dice);
    moved = nextPosition2(start, moved);

    const next = start + moved;
    console.log(`from=${start}, dice=${dice}, next=${next}`);

    readline.close();
});
