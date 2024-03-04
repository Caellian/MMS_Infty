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
    return cyrb53("" + cyrb53(posX.toString()) + cyrb53(posY.toString()), runRand)
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

			/** Proposed option to force using 1:1 pixel mapping instead of CSS Pixels. */
			// nativePixels: true,

			/** Proposed option to disable the default upscaling via high resolution backing canvas.
			 *
			 *  Note: if animating and crisp lines are less important, disabling scaling
			 *  improves polyfill performance, since it reduces the canvas size by 75%.
			 */
			scaling: false,
            alpha: true,
		};
	}

    static get inputProperties() {
        return ["--time"];
    }

    /**
     * @param {PaintRenderingContext2D} ctx 
     * @param {PaintSize} geom 
     * @param {PaintProperties} properties 
     */
    paint(ctx, geom, properties) {
        let size = 70;
        let strokeColor = "hsla(0deg, 0%, 15%, 100%)";
        let time = Number.parseInt(properties.get("--time").toString() || "0");
        
        let padX = -size / 2;
        let padY = -size / 2;

        function drawSingle(ctx, posX, posY, color, activity) {
            let strokeColor = color;
            let strokeWidth = 2;
            let halfStroke = strokeWidth / 2;
            let xMin = padX + posX * size + halfStroke;
            let xMax = padX + posX * size + size - halfStroke;
            let yMin = padY + posY * size + halfStroke;
            let yMax = padY + posY * size + size - halfStroke;
            let outset = 0.12;

            ctx.globalAlpha = 1.0;
            ctx.fillStyle = strokeColor;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;

            ctx.beginPath();
            ctx.moveTo(xMin, yMin + size * outset);
            ctx.lineTo(xMin, yMin);
            ctx.lineTo(xMin + size * outset, yMin);
            ctx.stroke();
            ctx.moveTo(xMax, yMax - size * outset);
            ctx.lineTo(xMax, yMax);
            ctx.lineTo(xMax - size * outset, yMax);
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

        let speed = 3;
        
        for (let h = 0; h < (geom.height / size) + 1; h ++) {
            for (let w = 0; w < (geom.width / size) + 1; w++) {
                let hash = xyHash(w, h);
                console.log(hash);
                let duration = hash % 5000;
                let value = (Math.sin((time / 1000 / speed) % duration) + 1.0) / 2.0
                drawSingle(ctx, w, h, strokeColor, value);
            }
        }
    }
})
