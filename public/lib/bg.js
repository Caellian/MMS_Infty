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
