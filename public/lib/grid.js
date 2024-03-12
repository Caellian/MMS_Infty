const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
const runRand = Math.random() * 1000;
function xyHash(posX, posY) {
    return cyrb53(posX.toString() + ":" + posY.toString(), runRand)
}

/* global registerPaint */

/**
 * @typedef {CanvasRenderingContext2D} PaintRenderingContext2D
 * 
 * @typedef {object} PaintSize
 * @property {number} width
 * @property {number} height
 * 
 * @typedef {object} PaintProperties
 * @property {(key: string) => CSSUnparsedValue} get
*/

registerPaint('grid', class {
	static get contextOptions() {
		return {
			scaling: false,
            alpha: false,
		};
	}

    static get inputProperties() {
        return ["--time", "--cell-size", "--cursor-x", "--cursor-y"];
    }

    /**
     * @param {PaintRenderingContext2D} ctx 
     * @param {PaintSize} geom 
     * @param {PaintProperties} properties 
     */
    paint(ctx, geom, properties) {
        let cellSize = Number.parseInt(properties.get("--cell-size")?.toString() || "70");
        let strokeColor = "hsla(0deg, 0%, 15%, 100%)";
        let accentColor = "hsla(183.16, 100%, 33.53%, 100%)";
        let time = Number.parseInt(properties.get("--time")?.toString() || "0");
        
        let padX = -cellSize / 2;
        let padY = -cellSize / 2;

        let cursorPos = null;
        if (properties.get("--cursor-x") && properties.get("--cursor-y")) {
            let posX = Number.parseFloat(properties.get("--cursor-x").toString());
            let posY = Number.parseFloat(properties.get("--cursor-y").toString());
            cursorPos = [
                Math.round((posX) / cellSize),
                Math.round((posY) / cellSize),
            ]
        }

        function drawSingle(ctx, posX, posY, color, activity) {
            let strokeColor = color;
            let strokeWidth = 2;
            let halfStroke = strokeWidth / 2;
            let xMin = padX + posX * cellSize + halfStroke;
            let xMax = padX + posX * cellSize + cellSize - halfStroke;
            let yMin = padY + posY * cellSize + halfStroke;
            let yMax = padY + posY * cellSize + cellSize - halfStroke;
            let outset = 0.12;

            ctx.globalAlpha = 1.0;
            ctx.fillStyle = strokeColor;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;

            ctx.beginPath();
            ctx.moveTo(xMin, yMin + cellSize * outset);
            ctx.lineTo(xMin, yMin);
            ctx.lineTo(xMin + cellSize * outset, yMin);
            ctx.stroke();
            ctx.moveTo(xMax, yMax - cellSize * outset);
            ctx.lineTo(xMax, yMax);
            ctx.lineTo(xMax - cellSize * outset, yMax);
            ctx.stroke();

            ctx.globalAlpha = 0.3;
            ctx.lineWidth = strokeWidth / 2.0;

            ctx.beginPath();
            ctx.moveTo(xMin - halfStroke, yMin - halfStroke);
            ctx.lineTo(xMax + strokeWidth, yMin - halfStroke);
            ctx.lineTo(xMax + strokeWidth, yMax + strokeWidth);
            ctx.lineTo(xMin - halfStroke, yMax + strokeWidth);
            ctx.lineTo(xMin - halfStroke, yMin - halfStroke);
            ctx.stroke();

            ctx.globalAlpha = activity * 0.2;
            ctx.fillRect(
                xMin - halfStroke,
                yMin - halfStroke,
                xMax - xMin + strokeWidth,
                yMax - yMin + strokeWidth
            )
        }

        let speed = 5;
        
        for (let h = 0; h < (geom.height / cellSize) + 1; h ++) {
            for (let w = 0; w < (geom.width / cellSize) + 1; w++) {
                let hash = xyHash(w, h);
                let duration = hash % 5000;
                let value = (Math.sin((time / speed) / duration * 2 * Math.PI) + 1.0) / 2.0;
                
                if (cursorPos) {
                    if (cursorPos[0] == w && cursorPos[1] == h) {
                        drawSingle(ctx, w, h, accentColor, 2.0);
                        continue;
                    }
                }
                drawSingle(ctx, w, h, strokeColor, value);
            }
        }
    }
})
