async function run() {
    // Polyfill za requestAnimationFrame
    if (window.requestAnimationFrame === undefined) {
        window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
    }

    // Polyfill za: https://drafts.css-houdini.org/css-paint-api/
    await import("./polyfill/houdini.js");

    // Inject a tiny tranpiler to make IE11+ behave nicely:
    try {
        eval('class F {}');
    }
    catch(e) {
        await import("./polyfill/transpilerLite.js");
        CSS.paintWorklet.transpile = window.transpilerLite;
    }
    
    function loadModule(name) {
        var p = CSS.paintWorklet.addModule(`/MMS_Infty/lib/${name}.js`);
        if (p) {
            p
            .then(() => console.info(`Houdini '${name}' registered.`))
            .catch((err) => {
                console.error(`Houdini '${name}' errored!`, err)
            });
        } else {
        }
    }
    
    loadModule("grid");
    loadModule("bevel");
}

run();
