//some of this code is pretty ugly, but it's that way to save space
//comments are used since they're removed in the minification process
// center, chunk angle
// noinspection EqualityComparisonWithCoercionJS

var D = Dickens, m = Math, c = 119, cA = m.PI / 16, lI = 81, bP = { repeat: 1, edge: 1 }, dP = (a, sA, eA, oR, iR, oX, oY, s, iK) => { // draw polygon: angle, start angle, end angle, outer radius, inner radius, offset x, offset y, scale, is key
    var cS = m.cos(sA + a), sS = m.sin(sA + a), cC = m.cos((sA + eA) / 2), sC = m.sin((sA + eA) / 2), cE = m.cos(eA - a), sE = m.sin(eA - a)
    // cosines and sines of the start, center, and end angles
    ,p = [
        // Outer radius, start angle
        (c + oR * cS) * s + oX,
        (c + oR * sS) * s + oY
    ]

    if (!iK) {
        p.push(
            // Outer radius, center
            (c + oR * cC) * s + oX,
            (c + oR * sC) * s + oY
        )
    }

    p.push(
        // Outer radius, end angle
        (c + oR * cE) * s + oX,
        (c + oR * sE) * s + oY,
        // Inner radius, end angle
        (c + iR * cE) * s + oX,
        (c + iR * sE) * s + oY,
        // Inner radius, start angle
        (c + iR * cS) * s + oX,
        (c + iR * sS) * s + oY
    )
    g.fillPolyAA(p, 1)
}, dK = (i, oX, oY, s) => { // draw key: index, offset x, offset y, scale
    var oR = 92
    var iR = 81

    var cX = c * s + oX, cY = c * s + oY // center x, center y

    oR += 2
    g.setColor(.66, .66, .66).drawCircleAA(cX, cY, (oR - 8) * s)
    g.setColor(-1) // -1 is white
    for (var j = 0; j < 32; j++) {
        if (kA[i] & (1 << j)) {
            var sA = (j - .5) * cA // start angle
            dP(.08, sA, sA + cA, oR, iR, oX, oY, s, 1)
        }
    }
}, eK = _ => { // erase keys, draws over key with background colour
    var oR = 97, iR = 81 // outer radius, inner radius, small as possible to cover key but not waste time drawing
    g.setColor(0)
    for (var i = 0; i < 16; i++) {
        var sA = i * (cA * 2)
        dP(0, sA, sA + cA * 2, oR, iR, 0, 0, 1, 1)
    }
}, dC = (c, r, h) => {// draw chunks: radius, is highlighted
    var oR = lI - 4 // outer radius
    var iR = oR * .88 // inner radius
    lI = iR

    var f = r == 0 ? 0 : r == 1 ? .66 : 1 / r // fill colour
    var a = h ? .33 : 0 // ideally i'd save a few chars not declaring a, but that fucks up colours somehow
    g.setColor(f, f, f + a)

    for (var i = 0; i < 32; i++) {
        if (c & (1 << i)) {
            var sA = (i - .5) * cA
            dP(.008 + .004 * r, sA, sA + cA, oR, iR, 0, 0, 1, 0)
        }
    }
}, fO = (k, b, o) => {
    return (k >>> o | k << (32 - o)) & b ? 0 : 1
}, cF = (k, b) => {
    for (var o = 0; o < 32; o++) {
        if (!((k >>> o | k << (32 - o)) & b)) {
            return 1
        }
    }
    return 0
}, pK = _ => { // place key
    if (fO(kA[aK], bA[0], 0)){
        bA[0] |= kA[aK]
        if(bA[0] == -1){
            // end game if all blocks are filled
            if (bA[1] == 0) {
                // brief win cue, then reload to the difficulty menu
                mM = 1 // freeze input during the cue
                g.clear()
                g.setColor(-1).setFontAlign(0, 0).setFont("6x8", 3).drawString("UNLOCKED", c, c)
                return setTimeout(_ => load('digipick.app.js'), 1200)
            }
            bA[0] = bA[1]
            bA[1] = bA[2] || 0
            bA[2] = bA[3] || 0
            bA[3] = 0
        }
        kA = rO(kA, aK)
        // if aK is outside of the possible indices, reduce it
        if(aK >= kA.length){
            aK--
        }
        d()
    }
}, kA, bA, gL = (d) => {
    //generate level // kA = key/pick array, bA = blocks/rings array
    const R = [], P = [], L = dL[d]
    while (R.length < L.r) {
        R.push(-1)
    }
    for (let r = 0; r < L.r; r++) {
        for (let i = 0; i < 2; i++) {
            let pS = L.p[m.floor(m.random() * L.p.length)]
            if (d >= 2 && pS == 1 && P.length > 0 && P[P.length - 1].length == 1) {
                pS = m.floor(m.random() * 2) + 2
            }

            const p = mP(pS, R[r])
            R[r] = ~bV(p) & R[r]
            P.push(p)
        }
    }
    for (let i = 0; i < L.rP.c; i++) {
        const pS = L.rP.s[m.floor(m.random() * L.rP.s.length)], p = mP(pS, -1)
        P.push(p)
    }
    s(P)
    kA = P.map(pick => mR(pick.reduce((current, bit) => current | (1 << bit), 0), m.floor(m.random() * 32)))
    bA= R
}, sI = 0, pI = 0, iG = 0, mM = 1, aK = 0, d = _ => { // redraw entire screen // selected index, page index, in game, active ke
    g.clear()
    lI = 81
    if (iG) {
        D.buttonIcons=["right","tick","circle","left"]
        D.loadSurround()
        dK(aK, 0, 0, 1)
        dC(bA[0], 1, cF(kA[aK], bA[0]))
        dC(bA[1], 2, cF(kA[aK], bA[1]))
        dC(bA[2], 3, cF(kA[aK], bA[2]))
        dC(bA[3], 4, cF(kA[aK], bA[3]))
    }
    else {
        pI = m.min(pI, m.ceil(kA.length / 2) - 1) // keep page in range after keys are removed
        var i = sI == 0 ? "down" : "up", a = sI * 68
        D.buttonIcons=["right","tick",i,"left"]
        D.loadSurround()
        dK(pI * 2, 32, 32, .45)
        dK(pI * 2 + 1, 100, 100, .45)
        g.fillCircle(85 + a, 85 + a, 20)
        g.drawCircleAA(85 + a, 85 + a, 21)
    }
}, dL = {
    0: {r: 2, rP: {c: 0, s: []}, p: [2, 2, 2, 3]},
    1: {r: 2, rP: {c: 2, s: [2, 3]}, p: [2, 2, 2, 3, 3, 4]},
    2: {r: 3, rP: {c: 3, s: [1, 2, 2, 3, 3]}, p: [1, 2, 3, 4]},
    3: {r: 4, rP: {c: 4, s: [1, 2, 2, 2, 3, 3, 3]}, p: [1, 2, 3, 4]},
}, vB = (v) => {
    const b = []
    for (let a = 0; a < 32; a++) {
        if ((v & (1 << a)) !== 0) {
            b.push(a)
        }
    }
    return b
}, mP = (s, r) => {
    const p = [], a = vB(r & 0x55555555) // r is constant in the loop, so compute the bit list once
    while (p.length < s) {
        p.push(a[m.floor(m.random() * a.length)])
    }
    return p
}, s = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = m.floor(m.random() * (i + 1)), t = a[i]
        a[i] = a[j]
        a[j] = t
    }
}, bV = (b) => {
    let v = 0
    for (const a of b) {
        v |= 1 << a
    }
    return v
}, sG = (l) => {
    gL(l)
    iG = 1
    mM = 0
    d()
    D.buttonIcons=["right","tick","circle","left"]
    D.loadSurround()
}, sM = _ => E.showMenu({
        '': {
            title: 'Select Difficulty',
            selected: 0
        },
        'Easy': () => sG(0),
        'Advanced': () => sG(1),
        'Expert': () => sG(2),
        'Master': () => sG(3)
    }, () => load('clock.app.js')),
mL = (a, o) => ((a >>> o) | (a << 32 - o)),
mR = (a, o) => ((a << o) | (a >>> 32 - o)),
rO = (a, o) => a.slice(0, o).concat(a.slice(o + 1))

sM()

setWatch(_ => { // right
    if (iG) {
        eK()
        kA[aK] = mR(kA[aK], 1)
        dK(aK, 0, 0, 1)
    }
    else if (!mM) {
        pI = m.min(pI + 1, m.ceil(kA.length / 2) - 1)
        d()
    }
}, BTN1, bP)

setWatch(_ => { // left
    if (iG) {
        eK()
        kA[aK] = mL(kA[aK], 1)
        dK(aK, 0, 0, 1)
    }
    else if (!mM) {
        pI = m.max(pI - 1, 0)
        d()
    }
}, BTN4, bP)

setWatch(_ => { // circle
    if (!iG && !mM) {
        sI = !sI
        d()
    }
    else if (!mM){
        iG = 0
        d()
    }
}, BTN3, bP)

setWatch(_ => { // tick
    if (iG) {
        pK()
    }
    else if (!mM && kA[pI * 2 + sI]) {
        // guard against the empty slot on an odd last page (decoys can make pick count odd)
        aK = pI * 2 + sI
        iG = 1
        d()
    }
}, BTN2, bP)