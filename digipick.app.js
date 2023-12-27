function drawCircleChunks(boolArray, row, ox, oy, scale) {
    var centerX = g.getWidth() / 2;
    var centerY = g.getHeight() / 2;
    var outerRadius = Math.min(centerX, centerY) - 10 - 16 * row; // leave a small margin
    var innerRadius = outerRadius - 10; // adjust this to change the thickness of the ring
    var chunkAngle = Math.PI * 2 / boolArray.length;

    switch (row) {
        case 0:
            g.setColor(0.878, 0.961, 0.984);
            break;
        case 1:
            g.setColor(0.878, 0.961, 0.984);
            break;
        default:
            g.setColor(0.482, 0.6, 0.69);
    }

    if (row == 0) {
        outerRadius += 8;
        g.drawCircle(centerX * scale + ox, centerY * scale + oy, (outerRadius - 5) * scale);
        console.log((centerX * scale + ox) + (outerRadius - 5) * scale);
    }

    for (var i = 0; i < boolArray.length; i++) {
        if (boolArray[i]) {
            if (row == 0) {
                var startAngle = i * chunkAngle + 0.05;
                var endAngle = (i + 1) * chunkAngle - 0.05;
                var step = chunkAngle / 3;
            }
            else {
                var startAngle = i * chunkAngle;
                var endAngle = (i + 1) * chunkAngle + 0.01; //adding this prevent totally borked rendering
                var step = chunkAngle;
            }
            var points = [];
            for (var angle = startAngle; angle <= endAngle; angle += step) {
                points.push((centerX + outerRadius * Math.cos(angle)) * scale + ox, (centerY + outerRadius * Math.sin(angle)) * scale + oy);
            }
            for (var angle = endAngle; angle >= startAngle; angle -= step) {
                points.push((centerX + innerRadius * Math.cos(angle)) * scale + ox, (centerY + innerRadius * Math.sin(angle)) * scale + oy);
            }
            g.fillPoly(points, true);
        }
    }
}

g.clear();

// array of 4 random arrays
var keyArrays = new Array(4).fill().map(() => new Array(32).fill().map(() => Math.random() > 0.75));
var blockArray = new Array(32).fill().map(() => Math.random() > 0.25);
var blockArray2 = new Array(32).fill().map(() => Math.random() > 0.25);

var inGame = true;
var activeKey = 0;

function draw() {
    g.clear();
    if (inGame) {
        drawCircleChunks(keyArrays[activeKey], 0, 0, 0, 1);
        drawCircleChunks(blockArray, 1, 0, 0, 1);
        drawCircleChunks(blockArray2, 2, 0, 0, 1);
    }
    else {
        drawCircleChunks(keyArrays[0], 0, 18, 18, 0.4);
        drawCircleChunks(keyArrays[1], 0, 128, 18, 0.4);
        drawCircleChunks(keyArrays[2], 0, 18, 128, 0.4);
        drawCircleChunks(keyArrays[3], 0, 128, 128, 0.4);
    }
}

draw();

setWatch(function () {
    // move elements in keyArray forward (last element becomes first)
    keyArrays[activeKey].unshift(keyArrays[activeKey].pop());
    draw();
}, BTN1, { repeat: true, debounce: 50, edge: "rising" });

setWatch(function () {
    // move elements in keyArray backward (first element becomes last)
    keyArrays[activeKey].push(keyArrays[activeKey].shift());
    draw();
}, BTN4, { repeat: true, debounce: 50, edge: "rising" });

setWatch(function () {
    inGame = !inGame;
    draw();
}, BTN3, { repeat: true, debounce: 50, edge: "rising" });

setWatch(_ => load("clock.app.js"),BTN2,{edge:1});