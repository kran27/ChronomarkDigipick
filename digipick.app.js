//some of this code is pretty ugly, but it's that way to save space
//comments are used since they're removed in the minification process
var lI = 0; // last inner radius
const c = 119, cA = Math.PI / 16; // center, cy=hunk angle

function dP(a, sA, eA, oR, iR, oX, oY, s, iK) { // draw polygon: angle, start angle, end angle, outer radius, inner radius, offset x, offset y, scale, is key
    const cS = Math.cos(sA + a), sS = Math.sin(sA + a), cC = Math.cos((sA + eA) / 2), sC = Math.sin((sA + eA) / 2), cE = Math.cos(eA - a), sE = Math.sin(eA - a);
    // cosines and sines of the start, center, and end angles
    var p = [
        // Outer radius, start angle
        (c + oR * cS) * s + oX,
        (c + oR * sS) * s + oY
    ];

    if (!iK) {
        // Outer radius, center
        p.push((c + oR * cC) * s + oX);
        p.push((c + oR * sC) * s + oY);
    }

    p = p.concat([
        // Outer radius, end angle
        (c + oR * cE) * s + oX,
        (c + oR * sE) * s + oY,
        // Inner radius, end angle
        (c + iR * cE) * s + oX,
        (c + iR * sE) * s + oY,
        // Inner radius, start angle
        (c + iR * cS) * s + oX,
        (c + iR * sS) * s + oY
    ]);
    g.fillPolyAA(p, true);
}

function dK(i, oX, oY, s) { // draw key: index, offset x, offset y, scale
    let oR = c - 27; // outer radius
    const iR = oR * .88; // inner radius
    lI = iR;

    const cX = c * s + oX, cY = c * s + oY; // center x, center y

    oR += 2;
    g.setColor(.66, .66, .66).drawCircleAA(cX, cY, (oR - 8) * s);
    g.setColor(-1); // -1 is white
    for (let j = 0; j < 32; j++) {
        if (kA[i][j]) {
            const sA = (j - .5) * cA; // start angle
            dP(.08, sA, sA + cA, oR, iR, oX, oY, s, true);
        }
    }
}

function eK() { // erase key, draws over key with background colour
    const oR = 97, iR = 81; // outer radius, inner radius, small as possible to cover key but not waste time drawing
    g.setColor(0);
    for (let i = 0; i < 16; i++) {
        const sA = i * (cA * 2);
        dP(0, sA, sA + cA * 2, oR, iR, 0, 0, 1, true);
    }
}

function dC(r, h) {// draw chunks: radius, is highlighted
    let oR = lI - 4; // outer radius
    const iR = oR * .88; // inner radius
    lI = iR;

    const f = r == 0 ? 0 : r == 1 ? .66 : 1 / r; // fill colour
    const a = h ? .33 : 0; // ideally i'd save space by not declaring a, but that fucks up colours somehow
    g.setColor(f, f, f + a);

    for (let i = 0; i < 32; i++) {
        if (bA[r - 1][i]) {
            const sA = (i - .5) * cA;
            dP(.008 + .004 * r, sA, sA + cA, oR, iR, 0, 0, 1, false);
        }
    }
}

function cF(k, b) { // can fit: key, block
    for (let o = 0; o < 32; o++) { // go through all offsets
        let f = true;
        for (let i = 0; i < 32; i++) { // check all indices
            const j = (i + o) % 32;
            if (k[i] && b[j]) {
                f = false;
                break;
            }
        }
        if (f) {
            return true;
        }
    }
    return false;
}

// blocks
var kA = [, , , ,].fill().map(() => new Array(32).fill().map(() => Math.random() > .8)), bA = [, , , ,].fill().map(() => new Array(32).fill().map(() => Math.random() > .2));

// in game, active key
var iG = true, aK = 0;

function d() { // redraw entire screen
    g.clear();
    if (iG) {
        dK(aK, 0, 0, 1);
        dC(1, cF(kA[aK], bA[0]));
        dC(2, cF(kA[aK], bA[1]));
        dC(3, cF(kA[aK], bA[2]));
        dC(4, cF(kA[aK], bA[3]));
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
    if (iG) {
        eK();
        kA[aK].unshift(kA[aK].pop());
        dK(aK, 0, 0, 1);
    }
    else {
        aK = 1;
        iG = true;
        d();
    }
}, BTN1, { repeat: true, edge: "rising" });

setWatch(_ => {
    // move elements in keyArray backward (first element becomes last)
    if (iG) {
        eK();
        kA[aK].push(kA[aK].shift());
        dK(aK, 0, 0, 1);
    }
    else {
        aK = 0;
        iG = true;
        d();
    }
}, BTN4, { repeat: true, edge: "rising" });

setWatch(_ => {
    if (!iG) {
        aK = 2;
    }
    iG = !iG;
    d();
}, BTN3, { repeat: true, edge: "rising" });

setWatch(_ => {
    if (iG) {
        kA = [, , , ,].fill().map(() => new Array(32).fill().map(() => Math.random() > .8))
        bA = [, , , ,].fill().map(() => new Array(32).fill().map(() => Math.random() > .2))
    }
    else {
        aK = 3;
        iG = true;
    }
    d();
}, BTN2, { repeat: true, edge: "falling" });