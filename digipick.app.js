var lI = 0;
const c = 119, cA = Math.PI / 16;

function dP(a, sA, eA, oR, iR, oX, oY, s) {
    const cS = Math.cos(sA + a), sS = Math.sin(sA + a), cC = Math.cos((sA + eA) / 2), sC = Math.sin((sA + eA) / 2), cE = Math.cos(eA - a), sE = Math.sin(eA - a);

    const p = [
        // Outer radius, start angle
        (c + oR * cS) * s + oX,
        (c + oR * sS) * s + oY,
        // Outer radius, center
        (c + oR * cC) * s + oX,
        (c + oR * sC) * s + oY,
        // Outer radius, end angle
        (c + oR * cE) * s + oX,
        (c + oR * sE) * s + oY,
        // Inner radius, end angle
        (c + iR * cE) * s + oX,
        (c + iR * sE) * s + oY,
        // Inner radius, start angle
        (c + iR * cS) * s + oX,
        (c + iR * sS) * s + oY
    ];
    g.fillPolyAA(p, true);
}

function dK(i, oX, oY, s) {
    let oR = c - 27;
    const iR = oR * .88;
    lI = iR;

    const cX = c * s + oX, cY = c * s + oY;

    oR += 2;
    g.setColor(.66, .66, .66).drawCircleAA(cX, cY, (oR - 8) * s);
    g.setColor(-1);
    for (let j = 0; j < 32; j++) {
        if (kA[i][j]) {
            const sA = (j - .5) * cA;
            dP(.08, sA, sA + cA, oR, iR, oX, oY, s);
        }
    }
}

function eK() {
    const oR = 96, iR = 80;
    g.setColor(0);
    for (let i = 0; i < 16; i++) {
        const sA = i * (cA * 2);
        dP(0, sA, sA + cA * 2, oR, iR, 0, 0, 1);
    }
}

function dC(r) {
    let oR = lI - 4;
    const iR = oR * .88;
    lI = iR;

    const f = r == 0 ? 0 : r == 1 ? .66 : 1 / r;
    g.setColor(f, f, f);

    for (let i = 0; i < 32; i++) {
        if (bA[r - 1][i]) {
            const sA = (i - .5) * cA;
            dP(.008 + .004 * r, sA, sA + cA, oR, iR, 0, 0, 1);
        }
    }
}

// array of 4 random arrays
var kA = [,,,,].fill().map(() => new Array(32).fill().map(() => Math.random() > .8)), bA = [,,,,].fill().map(() => new Array(32).fill().map(() => Math.random() > .2));

var iG = true, aK = 0;

function d() {
    g.clear();
    if (iG) {
        dK(aK, 0, 0, 1);
        dC(1);
        dC(2);
        dC(3);
        dC(4);
    }
    else {
        dK(0, 18, 18, .4);
        dK(1, 128, 18, .4);
        dK(2, 18, 128, .4);
        dK(3, 128, 128, .4);
    }
    lI = 0;
}

d();
//Dickens.loadSurround();

setWatch(_ => {
    // move elements in keyArray forward (last element becomes first)
    eK();
    kA[aK].unshift(kA[aK].pop());
    dK(aK, 0, 0, 1);
}, BTN1, { repeat: true, debounce: 50, edge: "rising" });

setWatch(_ => {
    // move elements in keyArray backward (first element becomes last)
    eK();
    kA[aK].push(kA[aK].shift());
    dK(aK, 0, 0, 1);
}, BTN4, { repeat: true, debounce: 50, edge: "rising" });

setWatch(_ => {
    iG = !iG;
    draw();
}, BTN3, { repeat: true, debounce: 50, edge: "rising" });

setWatch(_ => load("clock.app.js"), BTN2, { edge: "falling" });