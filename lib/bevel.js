const CORNERS = Object.freeze({
    TOP_LEFT: "tl",
    TOP_RIGHT: "tr",
    BOTTOM_LEFT: "bl",
    BOTTOM_RIGHT: "br",
})

registerPaint('bevel', class {
	static get contextOptions() {
		return {

			/** Proposed option to force using 1:1 pixel mapping instead of CSS Pixels. */
			// nativePixels: true,

			/** Proposed option to disable the default upscaling via high resolution backing canvas.
			 *
			 *  Note: if animating and crisp lines are less important, disabling scaling
			 *  improves polyfill performance, since it reduces the canvas size by 75%.
			 */
			scaling: false
		};
	}

    static get inputProperties() {
        return ["--bevelFill", "--bevelStroke", "--bevelStrokeWidth", "--bevelInset", "--bevelCorners"];
    }

    /**
     * @param {PaintRenderingContext2D} ctx 
     * @param {PaintSize} geom 
     * @param {PaintProperties} properties 
     */
    paint(ctx, geom, properties) {
        let fill = properties.get("--bevelFill") || "#000";
        let stroke = properties.get("--bevelStroke") || "white";
        let strokeWidth = Number.parseFloat(properties.get("--bevelStrokeWidth")) || 2;
        let inset = Number.parseFloat(properties.get("--bevelInset")) || 10;
        let corners = properties.get("--bevelCorners") || "tl tr bl br";
        
        console.log(corners);
        corners = corners.split(" ");

        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        
        let xMin = strokeWidth / 2
        let xMax = geom.width
        let yMin = strokeWidth / 2
        let yMax = geom.height
        
        ctx.beginPath();

        if (corners.includes(CORNERS.TOP_LEFT)) {
            ctx.moveTo(xMin, yMin + inset);
            ctx.lineTo(xMin + inset, yMin);
        } else {
            ctx.moveTo(xMin, yMin);
        }

        if (corners.includes(CORNERS.TOP_RIGHT)) {
            ctx.lineTo(xMax - inset, yMin);
            ctx.lineTo(xMax, yMin + inset);
        } else {
            ctx.lineTo(xMax, yMin);
        }

        if (corners.includes(CORNERS.BOTTOM_RIGHT)) {
            ctx.lineTo(xMax, yMax - inset);
            ctx.lineTo(xMax - inset, yMax);
        } else {
            ctx.lineTo(xMax, yMax);
        }

        if (corners.includes(CORNERS.BOTTOM_LEFT)) {
            ctx.lineTo(xMin + inset, yMax);
            ctx.lineTo(xMin, yMax - inset);
        } else {
            ctx.lineTo(xMin, yMax);
        }

        if (corners.includes(CORNERS.TOP_LEFT)) {
            ctx.lineTo(xMin, yMin + inset);
        } else {
            ctx.lineTo(xMin, yMin);
        }

        ctx.fill();
        ctx.stroke();
    }
})
