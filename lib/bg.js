function loadModule(name) {
    var p = CSS.paintWorklet.addModule(`./${name}.js`);
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
