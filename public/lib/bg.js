var p = CSS.paintWorklet.addModule('./lib/paints.js');
if (p) {
	p.then(() => console.info('./lib/paints.js registered'));
} else {
    console.error("paints errored")
}
