"use strict";


// ============================ MATRICES ==============================


function mat4(v) {
    if (typeof v == 'number') {
        return [[v, 0, 0, 0], [0, v, 0, 0], [0, 0, v, 0], [0, 0, 0, v]];
    }
    return [
        [v[0][0], v[0][1], v[0][2], v[0][3]],
        [v[1][0], v[1][1], v[1][2], v[1][3]],
        [v[2][0], v[2][1], v[2][2], v[2][3]],
        [v[3][0], v[3][1], v[3][2], v[3][3]]
    ]
}

// https://github.com/g-truc/glm/blob/0.9.5/glm/gtc/matrix_transform.inl
function mat4Perspective(fovy, aspect, zNear, zFar) {
    var tanHalfFovy = Math.tan(0.5 * fovy);
    var res = mat4(0.0);
    res[0][0] = 1.0 / (aspect * tanHalfFovy);
    res[1][1] = 1.0 / tanHalfFovy;
    res[2][2] = -(zFar + zNear) / (zFar - zNear);
    res[2][3] = -1.0;
    res[3][2] = -(2.0 * zFar * zNear) / (zFar - zNear);
    return res;
}
function mat4Translate(m, v) {
    var res = mat4(m);
    for (var i = 0; i < 4; i++) {
        res[3][i] = m[0][i] * v[0] + m[1][i] * v[1] + m[2][i] * v[2] + m[3][i];
    }
    return res;
}
function mat4Rotate(m, angle, v) {
    var c = Math.cos(angle), s = Math.sin(angle);
    var axis = [], temp = [];
    for (var i = 0; i < 3; i++) {
        axis.push(v[i] / Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]));
        temp.push(axis[i] * (1.0 - c));
    }
    var rot = [
        [
            c + temp[0] * axis[0],
            temp[0] * axis[1] + s * axis[2],
            temp[0] * axis[2] - s * axis[1],
            0.0],
        [
            temp[1] * axis[0] - s * axis[2],
            c + temp[1] * axis[1],
            temp[1] * axis[2] + s * axis[0],
            0.0],
        [
            temp[2] * axis[0] + s * axis[1],
            temp[2] * axis[1] - s * axis[0],
            c + temp[2] * axis[2],
            0.0],
        [0.0, 0.0, 0.0, 1.0]
    ];
    return mat4Mul(m, rot);
}

function mat4Mul(a, b) {
    var c = mat4(0.0);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            for (var k = 0; k < 4; k++) {
                c[j][i] += a[k][i] * b[j][k];
            }
        }
    }
    return c;
}
function mat4Inverse(m0) {
    var m = mat4(m0);
    var mi = mat4(1.0);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) if (j != i) {
            var c = -m[j][i] / m[i][i];
            for (var k = 0; k < 4; k++) {
                m[j][k] += c * m[i][k];
                mi[j][k] += c * mi[i][k];
            }
        }
        var c = 1.0 / m[i][i];
        for (var k = 0; k < 4; k++) {
            m[i][k] *= c;
            mi[i][k] *= c;
        }
    }
    // console.log(mat4Mul(m0, mi));
    return mi;
}

function mat4ToFloat32Array(m) {
    var arr = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            arr.push(m[i][j]);
        }
    }
    return new Float32Array(arr);
}

// calculate the center of the screen excluding the control box
function calcScreenCenter() {
    let rect = document.getElementById("control").getBoundingClientRect();
    var w = window.innerWidth, h = window.innerHeight;
    var rl = rect.left, rb = h - rect.bottom;
    var cx = 0.5 * w, cy = 0.5 * h;
    if (rl > rb && rl > 0) cx = 0.5 * rl;
    else if (rb > 0) cy = 0.5 * rb;
    var com = [2.0 * (cx / w - 0.5), 2.0 * (cy / h - 0.5)];
    com[0] = Math.max(-0.6, Math.min(0.6, com[0]));
    com[1] = Math.max(-0.6, Math.min(0.6, com[1]));
    return com;
}

function calcTransformMatrix(state) {
    var sc = (state.height / Math.min(state.width, state.height)) / state.scale;
    var transformMatrix = mat4Perspective(
        0.25 * Math.PI,
        canvas.width / canvas.height,
        0.5 * sc, 10.0 * sc);
    transformMatrix = mat4Translate(transformMatrix, [0, 0, -3.0 * sc]);
    transformMatrix = mat4Rotate(transformMatrix, state.rx, [1, 0, 0]);
    transformMatrix = mat4Rotate(transformMatrix, state.rz, [0, 0, 1]);
    // return transformMatrix;
    return mat4Inverse(transformMatrix);
}

function calcLightDirection(transformMatrix, lightTheta, lightPhi) {
    function dot(u, v) { return u[0] * v[0] + u[1] * v[1] + u[2] * v[2]; }
    // get uvw vectors
    var uvw = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            uvw[i][j] = (transformMatrix[i][j] + transformMatrix[3][j]) / (transformMatrix[i][3] + transformMatrix[3][3]);
        }
    }
    var u = uvw[0], v = uvw[1], w = uvw[2];
    // orthogonalize and normalize the vectors
    var d = dot(w, w);
    for (var i = 0; i < 3; i++) w[i] /= Math.sqrt(d);
    for (var i = 0; i < 2; i++) {
        d = dot(uvw[i], w);
        for (var j = 0; j < 3; j++) uvw[i][j] -= w[j] * d;
        d = dot(uvw[i], uvw[i]);
        for (var j = 0; j < 3; j++) uvw[i][j] /= Math.sqrt(d);
        // note that u and v are not orthonogal due to translation of COM in the matrix
    }
    // calculate light direction
    var ku = Math.cos(lightTheta) * Math.sin(lightPhi);
    var kv = Math.sin(lightTheta) * Math.sin(lightPhi);
    var kw = -Math.cos(lightPhi);
    var l = [0, 0, 0];
    for (var i = 0; i < 3; i++)
        l[i] = ku * u[i] + kv * v[i] + kw * w[i];
    return l;
}

// set legend
function setLegendAxes(state) {
    let axes = [
        document.getElementById("axis-x"),
        document.getElementById("axis-y"),
        document.getElementById("axis-z")
    ];
    let yup = document.getElementById("checkbox-yup").checked;
    var mat = mat4(1.0);
    mat = mat4Rotate(mat, state.rx, [1, 0, 0]);
    mat = mat4Rotate(mat, state.rz, [0, 0, 1]);
    var ij = yup ? [0.01, 2, -1] : [0.01, 1, 2];
    for (var i = 0; i < 3; i++) {
        var j = Math.floor(Math.abs(ij[i]));
        var s = 0.9 * Math.sign(ij[i]) * Math.min(2.0 * state.scale, 1.0);
        axes[i].setAttribute("x2", s * mat[j][0]);
        axes[i].setAttribute("y2", s * mat[j][1]);
    }
}

// ============================ WEBGL ==============================

var renderer = {
    canvas: null,
    gl: null,
    vsSource: "",
    premarchSource: "",
    poolSource: "",
    raymarchSource: "",
    imgGradSource: "",
    aaSource: "",
    positionBuffer: null,
    premarchProgram: null,
    premarchTarget: null,
    poolProgram: null,
    poolTarget: null,
    raymarchProgram: null,
    antiAliaser: null,
    timerExt: null,
};

// request shader sources
function loadShaderSource(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null);
    if (request.status != 200) return "";
    var source = request.responseText;
    return source;
}

// compile shaders and create a shader program
function createShaderProgram(vsSource, fsSource) {
    let gl = renderer.gl;
    function loadShader(gl, type, source) {
        if (location.hostname == "localhost")
            source += "\n#define _TIMESTAMP" + Date.now();  // prevent cache to test compile time
        var shader = gl.createShader(type); // create a new shader
        gl.shaderSource(shader, source); // send the source code to the shader
        gl.compileShader(shader); // compile shader
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) // check if compiled succeed
            throw new Error("Shader compile error: " + gl.getShaderInfoLog(shader));
        return shader;
    }
    var vShader = null, fShader = null;
    try {
        vShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        fShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    }
    catch (e) {
        if (vShader != null) gl.deleteShader(vShader);
        if (fShader != null) gl.deleteShader(fShader);
        throw e;
    }
    // create the shader program
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);
    gl.linkProgram(shaderProgram);
    // if creating shader program failed
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(shaderProgram));
    return shaderProgram;
}

// create texture/framebuffer
function createSampleTexture(width, height) {
    let gl = renderer.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const level = 0;
    const internalFormat = gl.RGBA8;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const data = null;
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border,
        format, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
}
function createRenderTarget(width, height) {
    let gl = renderer.gl;
    const tex = createSampleTexture(width, height);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return {
        texture: tex,
        framebuffer: framebuffer
    };
}
function destroyRenderTarget(target) {
    let gl = renderer.gl;
    gl.deleteTexture(target.texture);
    gl.deleteFramebuffer(target.framebuffer);
}

// create anti-aliasing object
function createAntiAliaser() {
    let gl = renderer.gl;
    var renderTarget = createRenderTarget(state.width, state.height);
    var imgGradProgram = createShaderProgram(renderer.vsSource, renderer.imgGradSource);
    var imgGradTarget = createRenderTarget(state.width, state.height);
    var aaProgram = createShaderProgram(renderer.vsSource, renderer.aaSource);
    return {
        renderTexture: renderTarget.texture,
        renderFramebuffer: renderTarget.framebuffer,
        imgGradProgram: imgGradProgram,
        imgGradTexture: imgGradTarget.texture,
        imgGradFramebuffer: imgGradTarget.framebuffer,
        aaProgram: aaProgram
    };
}
function destroyAntiAliaser(antiAliaser) {
    let gl = renderer.gl;
    gl.deleteFramebuffer(antiAliaser.renderFramebuffer);
    gl.deleteTexture(antiAliaser.renderTexture);
    gl.deleteProgram(antiAliaser.imgGradProgram);
    gl.deleteFramebuffer(antiAliaser.imgGradFramebuffer);
    gl.deleteTexture(antiAliaser.imgGradTexture);
    gl.deleteProgram(antiAliaser.aaProgram);
}

// call this function to re-render
async function drawScene(screenCenter, transformMatrix, lightDir) {
    if (renderer.raymarchProgram == null) {
        renderer.canvas.style.cursor = "not-allowed";
        return;
    }
    else renderer.canvas.style.cursor = "default";
    let gl = renderer.gl;
    let antiAliaser = renderer.antiAliaser;

    // set position buffer for vertex shader
    function setPositionBuffer(program) {
        var vpLocation = gl.getAttribLocation(program, "vertexPosition");
        const numComponents = 2; // pull out 2 values per iteration
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        const offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, renderer.positionBuffer);
        gl.vertexAttribPointer(
            vpLocation,
            numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(vpLocation);
    }

    // render to target + timer
    var timerQueries = [];
    let timer = renderer.timerExt;
    const countIndividualTime = false;
    function renderPass() {
        if (countIndividualTime && timer != null) {
            let query = gl.createQuery();
            timerQueries.push(query);
            gl.beginQuery(timer.TIME_ELAPSED_EXT, query);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.endQuery(timer.TIME_ELAPSED_EXT);
        }
        else gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    let query = null;
    if (!countIndividualTime && timer != null) {
        query = gl.createQuery();
        timerQueries.push(query);
        gl.beginQuery(timer.TIME_ELAPSED_EXT, query);
    }

    // clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // premarch
    gl.viewport(0, 0, state.premarchWidth, state.premarchHeight);
    gl.useProgram(renderer.premarchProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderer.premarchTarget.framebuffer);
    setPositionBuffer(renderer.premarchProgram);
    gl.uniform1f(gl.getUniformLocation(renderer.premarchProgram, "ZERO"), 0.0);
    gl.uniformMatrix4fv(
        gl.getUniformLocation(renderer.premarchProgram, "transformMatrix"),
        false,
        mat4ToFloat32Array(transformMatrix));
    gl.uniform2f(gl.getUniformLocation(renderer.premarchProgram, "screenCenter"),
        screenCenter[0], screenCenter[1]);
    renderPass();

    // pooling
    gl.useProgram(renderer.poolProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderer.poolTarget.framebuffer);
    setPositionBuffer(renderer.poolProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, renderer.premarchTarget.texture);
    gl.uniform1i(gl.getUniformLocation(renderer.poolProgram, "iChannel0"), 0);
    gl.uniform2i(gl.getUniformLocation(renderer.poolProgram, "iResolution"),
        state.premarchWidth, state.premarchHeight);
    renderPass();

    // render image
    gl.viewport(0, 0, state.width, state.height);
    gl.useProgram(renderer.raymarchProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, antiAliaser.renderFramebuffer);
    setPositionBuffer(renderer.raymarchProgram);
    gl.uniform1f(gl.getUniformLocation(renderer.raymarchProgram, "ZERO"), 0.0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, renderer.poolTarget.texture);
    gl.uniform1i(gl.getUniformLocation(renderer.raymarchProgram, "iChannel0"), 0);
    gl.uniformMatrix4fv(
        gl.getUniformLocation(renderer.raymarchProgram, "transformMatrix"),
        false,
        mat4ToFloat32Array(transformMatrix));
    gl.uniform2f(gl.getUniformLocation(renderer.raymarchProgram, "screenCenter"),
        screenCenter[0], screenCenter[1]);
    gl.uniform1f(gl.getUniformLocation(renderer.raymarchProgram, "uScale"), state.scale);
    gl.uniform3f(gl.getUniformLocation(renderer.raymarchProgram, "LDIR"),
        lightDir[0], lightDir[1], lightDir[2]);
    renderPass();

    // render image gradient
    gl.useProgram(antiAliaser.imgGradProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, antiAliaser.imgGradFramebuffer);
    setPositionBuffer(antiAliaser.imgGradProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, antiAliaser.renderTexture);
    gl.uniform1i(gl.getUniformLocation(antiAliaser.imgGradProgram, "iChannel0"), 0);
    renderPass();

    // render anti-aliasing
    gl.useProgram(antiAliaser.aaProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    setPositionBuffer(antiAliaser.aaProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, antiAliaser.renderTexture);
    gl.uniform1i(gl.getUniformLocation(antiAliaser.aaProgram, "iChannel0"), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, antiAliaser.imgGradTexture);
    gl.uniform1i(gl.getUniformLocation(antiAliaser.aaProgram, "iChannel1"), 1);
    renderPass();

    if (!countIndividualTime && timer != null)
        gl.endQuery(timer.TIME_ELAPSED_EXT);

    // check timer
    function checkTime() {
        if (timerQueries.length == 0) return;
        if (timer == null) {
            for (var i = 0; i < timerQueries.length; i++)
                gl.deleteQuery(timerQueries[i]);
            return;
        }
        let query = timerQueries[timerQueries.length - 1];
        if (!gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) {
            setTimeout(checkTime, 40);
            return;
        }
        var indivTime = [], totTime = 0.0;
        for (var i = 0; i < timerQueries.length; i++) {
            let query = timerQueries[i];
            if (gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) {
                let dt = 1e-6 * gl.getQueryParameter(query, gl.QUERY_RESULT);
                indivTime.push(dt.toFixed(1) + "ms");
                totTime += dt;
            }
            gl.deleteQuery(query);
        }
        if (countIndividualTime) console.log(indivTime.join(' '));
        document.getElementById("fps").textContent = (1000.0 / totTime).toFixed(1) + " fps";
    }
    setTimeout(checkTime, 100);
}


// ============================ MAIN ==============================

var state = {
    width: window.innerWidth,
    height: window.innerHeight,
    screenCenter: [0.0, 0.0],
    defaultScreenCenter: true,
    rz: -0.9 * Math.PI,
    rx: -0.4 * Math.PI,
    scale: 0.5,
    lightTheta: null,
    lightPhi: null,
    renderNeeded: true
};
function resetState(overwrite = true) {
    var state1 = {
        width: window.innerWidth,
        height: window.innerHeight,
        screenCenter: calcScreenCenter(),
        defaultScreenCenter: true,
        rz: -0.9 * Math.PI,
        rx: -0.4 * Math.PI,
        scale: 0.5,
        lightTheta: document.querySelector("#slider-theta").value * (Math.PI / 180.),
        lightPhi: document.querySelector("#slider-phi").value * (Math.PI / 180.),
        renderNeeded: true
    };
    for (var key in state1) {
        if (overwrite || state[key] == undefined)
            state[key] = state1[key];
    }
}

function initWebGL() {
    // get context
    renderer.canvas = document.getElementById("canvas");
    renderer.gl = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");
    if (renderer.gl == null)
        throw ("Error: Your browser may not support WebGL2, which is required to run this tool.<br/>It is recommended to use a Chrome-based browser on a desktop device with an updated graphics driver.");
    canvas.addEventListener("webglcontextlost", function (event) {
        event.preventDefault();
        document.body.innerHTML = "<h1 style='color:red;'>Error: WebGL context lost. Please refresh this page.</h1>";
    });

    // load GLSL source
    console.time("load glsl code");
    renderer.vsSource = "#version 300 es\nin vec4 vertexPosition;out vec2 vXy;" +
        "void main(){vXy=vertexPosition.xy;gl_Position=vertexPosition;}";
    renderer.premarchSource = loadShaderSource("premarch.glsl");
    renderer.poolSource = loadShaderSource("pool.glsl");
    renderer.raymarchSource = loadShaderSource("raymarch.glsl");
    renderer.imgGradSource = loadShaderSource("img-grad.glsl");
    renderer.aaSource = loadShaderSource("aa.glsl");
    console.timeEnd("load glsl code");

    // position buffer
    renderer.positionBuffer = renderer.gl.createBuffer();
    renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, renderer.positionBuffer);
    var positions = [-1, 1, 1, 1, -1, -1, 1, -1];
    renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(positions), renderer.gl.STATIC_DRAW);

    // timer
    renderer.timerExt = renderer.gl.getExtension('EXT_disjoint_timer_query_webgl2');
    if (renderer.timerExt) document.querySelector("#fps").textContent = "Timer loaded.";
    else console.warn("Timer unavailable.");

    // state
    try {
        var initialState = localStorage.getItem("ri_State");
        if (initialState != null) {
            state = JSON.parse(initialState);
            resetState(false);
        }
    }
    catch (e) {
        try { localStorage.removeItem("ri_State"); } catch (e) { }
    }
}

function updateBuffers() {
    state.width = canvas.width = canvas.style.width = window.innerWidth;
    state.height = canvas.height = canvas.style.height = window.innerHeight;
    state.premarchWidth = Math.round(state.width / 4);
    state.premarchHeight = Math.round(state.height / 4);

    var oldPremarchTarget = renderer.premarchTarget;
    renderer.premarchTarget = createRenderTarget(state.premarchWidth, state.premarchHeight);
    if (oldPremarchTarget) destroyRenderTarget(oldPremarchTarget);

    var oldPoolTarget = renderer.poolTarget;
    renderer.poolTarget = createRenderTarget(state.premarchWidth, state.premarchHeight);
    if (oldPoolTarget) destroyRenderTarget(oldPoolTarget);

    var oldAntiAliaser = renderer.antiAliaser;
    renderer.antiAliaser = createAntiAliaser();
    if (oldAntiAliaser) destroyAntiAliaser(oldAntiAliaser);

    state.renderNeeded = true;
}

// Initialize renderer, call updateShaderFunction() once before calling this
function initRenderer() {
    let canvas = renderer.canvas;
    let gl = renderer.gl;

    updateBuffers();
    //resetState();

    // rendering
    var oldScreenCenter = [-1, -1];
    function render() {
        var screenCenter = state.defaultScreenCenter ? calcScreenCenter() : state.screenCenter;
        state.screenCenter = screenCenter;
        if ((screenCenter[0] != oldScreenCenter[0] || screenCenter[1] != oldScreenCenter[1])
            || state.renderNeeded) {
            state.width = canvas.width = canvas.style.width = window.innerWidth;
            state.height = canvas.height = canvas.style.height = window.innerHeight;
            try {
                localStorage.setItem("ri_State", JSON.stringify(state));
            } catch (e) { }
            var transformMatrix = calcTransformMatrix(state);
            var lightDir = calcLightDirection(transformMatrix, state.lightTheta, state.lightPhi);
            drawScene(screenCenter, transformMatrix, lightDir);
            setLegendAxes(state);
            state.renderNeeded = false;
        }
        oldScreenCenter = screenCenter;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // interactions
    var fingerDist = -1;
    canvas.addEventListener("wheel", function (event) {
        if (renderer.raymarchProgram == null)
            return;
        var sc = Math.exp(0.0002 * event.wheelDeltaY);
        state.scale *= sc;
        state.renderNeeded = true;
    }, { passive: true });
    var mouseDown = false;
    canvas.addEventListener("contextmenu", function (event) {
        if (event.shiftKey) {
            console.log("Shift");
            event.preventDefault();
            state.defaultScreenCenter = true;
            state.renderNeeded = true;
        }
    });
    canvas.addEventListener("pointerdown", function (event) {
        //event.preventDefault();
        document.getElementById("help-menu").style.visibility = "hidden";
        canvas.setPointerCapture(event.pointerId);
        mouseDown = true;
    });
    window.addEventListener("pointerup", function (event) {
        event.preventDefault();
        mouseDown = false;
    });
    canvas.addEventListener("pointermove", function (event) {
        if (renderer.raymarchProgram == null)
            return;
        if (mouseDown) {
            var dx = event.movementX, dy = event.movementY;
            if (event.shiftKey) { // center
                state.defaultScreenCenter = false;
                state.screenCenter[0] += 1.5 * dx / state.width;
                state.screenCenter[1] -= 1.5 * dy / state.height;
            }
            else {  // rotate
                var k = fingerDist > 0. ? 0.001 : 0.01;
                state.rx += k * dy;
                state.rz += k * dx;
            }
            state.renderNeeded = true;
        }
    });
    canvas.addEventListener("touchstart", function (event) {
        if (event.touches.length == 2) {
            var fingerPos0 = [event.touches[0].pageX, event.touches[0].pageY];
            var fingerPos1 = [event.touches[1].pageX, event.touches[1].pageY];
            fingerDist = Math.hypot(fingerPos1[0] - fingerPos0[0], fingerPos1[1] - fingerPos0[1]);
        }
    }, { passive: true });
    canvas.addEventListener("touchend", function (event) {
        fingerDist = -1.0;
    }, { passive: true });
    canvas.addEventListener("touchmove", function (event) {
        if (renderer.raymarchProgram == null)
            return;
        if (event.touches.length == 2) {
            var fingerPos0 = [event.touches[0].pageX, event.touches[0].pageY];
            var fingerPos1 = [event.touches[1].pageX, event.touches[1].pageY];
            var newFingerDist = Math.hypot(fingerPos1[0] - fingerPos0[0], fingerPos1[1] - fingerPos0[1]);
            if (fingerDist > 0. && newFingerDist > 0.) {
                var sc = newFingerDist / fingerDist;
                state.scale *= Math.max(Math.min(sc, 2.0), 0.5);
            }
            fingerDist = newFingerDist;
            state.renderNeeded = true;
        }
    }, { passive: true });
    window.addEventListener("resize", updateBuffers);

    let sliderTheta = document.querySelector("#slider-theta");
    let sliderPhi = document.querySelector("#slider-phi");
    function updateUniforms() {
        state.lightTheta = sliderTheta.value * (Math.PI / 180.);
        state.lightPhi = sliderPhi.value * (Math.PI / 180.);
        state.renderNeeded = true;
    }
    sliderTheta.addEventListener("input", updateUniforms);
    sliderPhi.addEventListener("input", updateUniforms);
    updateUniforms();
}

function updateShaderFunction(funCode, funGradCode, params) {

    function sub(shaderSource) {
        shaderSource = shaderSource.replaceAll("{%FUN%}", funCode);
        shaderSource = shaderSource.replaceAll("{%FUNGRAD%}", funGradCode);
        shaderSource = shaderSource.replaceAll("{%STEP_SIZE%}", params.sStep);
        shaderSource = shaderSource.replaceAll("{%V_RENDER%}", params.bTransparency ? "vAlpha" : "vSolid");
        shaderSource = shaderSource.replaceAll("{%COLOR%}", "" + params.sColor);
        shaderSource = shaderSource.replaceAll("{%Y_UP%}", params.bYup ? "1" : "0");
        shaderSource = shaderSource.replaceAll("{%GRID%}", params.bGrid ? "1" : "0");
        shaderSource = shaderSource.replaceAll("{%ANALYTICAL_GRADIENT%}", params.bAnalyGrad ? "1" : "0");
        shaderSource = shaderSource.replaceAll("{%DISCONTINUITY%}", params.bDiscontinuity ? "1" : "0");
        return shaderSource;
    }
    console.time("compile shader");

    // pooling program
    var poolProgram = createShaderProgram(renderer.vsSource, renderer.poolSource);
    if (renderer.poolProgram != null)
        renderer.gl.deleteProgram(renderer.poolProgram);
    renderer.poolProgram = poolProgram;

    if (renderer.premarchProgram != null)
        renderer.gl.deleteProgram(renderer.premarchProgram);
    if (renderer.raymarchProgram != null)
        renderer.gl.deleteProgram(renderer.raymarchProgram);
    try {
        // premarching program
        var premarchSource = sub(renderer.premarchSource, funCode, funGradCode);
        var premarchProgram = createShaderProgram(renderer.vsSource, premarchSource);
        renderer.premarchProgram = premarchProgram;
        // raymarching program
        var raymarchSource = sub(renderer.raymarchSource, funCode, funGradCode);
        var raymarchProgram = createShaderProgram(renderer.vsSource, raymarchSource);
        renderer.raymarchProgram = raymarchProgram;
    }
    catch (e) {
        console.error(e);
        renderer.premarchProgram = null;
        renderer.raymarchProgram = null;
        if (funCode != null) throw e;
    }

    console.timeEnd("compile shader");
    state.renderNeeded = true;
}