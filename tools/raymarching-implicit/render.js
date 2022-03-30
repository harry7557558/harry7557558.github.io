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

function calcTransformMatrix(state) {
    var sc = (state.height / Math.min(state.width, state.height)) / state.scale;
    var transformMatrix = mat4(1.0);
    // move to center of mass
    var control = document.getElementById("control");
    var controlBl = [
        Math.min(Math.max(1.0 - control.offsetLeft / state.width, 0.0), 1.0),
        Math.min(Math.max((control.offsetTop + control.offsetHeight) / state.height, 0.0), 1.0)];
    var controlA = controlBl[0] * controlBl[1];
    var controlC = [
        1.0 - (0.5 - 0.5 * controlA * controlBl[0]) / (1.0 - controlA),
        1.0 - (0.5 - 0.5 * controlA * controlBl[1]) / (1.0 - controlA)];
    transformMatrix = mat4Translate(transformMatrix,
        [2.0 * (controlC[0] - 0.5), 2.0 * (controlC[1] - 0.5), 0.0]);
    // projection
    transformMatrix = mat4Mul(transformMatrix, mat4Perspective(
        0.25 * Math.PI,
        canvas.width / canvas.height,
        0.5 * sc, 10.0 * sc));
    transformMatrix = mat4Translate(transformMatrix, [0, 0, -3.0 * sc]);
    transformMatrix = mat4Rotate(transformMatrix, state.rx, [1, 0, 0]);
    transformMatrix = mat4Rotate(transformMatrix, state.rz, [0, 0, 1]);
    // return transformMatrix;
    return mat4Inverse(transformMatrix);
}

// ============================ WEBGL ==============================

var renderer = {
    canvas: null,
    gl: null,
    vsSource: "",
    fsSource: "",
    imgGradSource: "",
    aaSource: "",
    shaderProgram: null,
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
function createShaderProgram(gl, vsSource, fsSource) {
    function loadShader(gl, type, source) {
        var shader = gl.createShader(type); // create a new shader
        gl.shaderSource(shader, source); // send the source code to the shader
        gl.compileShader(shader); // compile shader
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) // check if compiled succeed
            throw "Shader compile error: " + gl.getShaderInfoLog(shader);
        return shader;
    }
    var vShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    var fShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
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
function createSampleTexture(gl, width, height) {
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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    return tex;
}
function createRenderTarget(gl, width, height) {
    const tex = createSampleTexture(gl, width, height);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return {
        texture: tex,
        framebuffer: framebuffer
    };
}



// call this function to re-render
async function drawScene(positionBuffer, transformMatrix) {
    let gl = renderer.gl;
    let shaderProgram = renderer.shaderProgram;
    let antiAliaser = renderer.antiAliaser;

    // set position buffer for vertex shader
    function setPositionBuffer(program) {
        var vpLocation = gl.getAttribLocation(program, "vertexPosition");
        const numComponents = 2; // pull out 2 values per iteration
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        const offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(
            vpLocation,
            numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(vpLocation);
    }

    // render to target
    var timerQueries = [];
    function renderPass() {
        let timer = renderer.timerExt;
        if (timer != null) {
            let query = gl.createQuery();
            timerQueries.push(query);
            gl.beginQuery(timer.TIME_ELAPSED_EXT, query);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.endQuery(timer.TIME_ELAPSED_EXT);
        }
        else gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // clear the canvas
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // render image
    gl.useProgram(shaderProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, antiAliaser.renderFramebuffer);
    setPositionBuffer(shaderProgram);
    gl.uniformMatrix4fv(
        gl.getUniformLocation(shaderProgram, "transformMatrix"),
        false,
        mat4ToFloat32Array(transformMatrix));
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

    // check timer
    function checkTime() {
        var indivTime = [], totTime = 0.0;
        for (var i = 0; i < timerQueries.length; i++) {
            let query = timerQueries[i];
            if (gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) {
                let dt = 1e-6 * gl.getQueryParameter(query, gl.QUERY_RESULT);
                indivTime.push(dt.toFixed(1) + "ms");
                totTime += dt;
                gl.deleteQuery(query);
            }
        }
        if (totTime > 0.0) {
            console.log(indivTime.join(' '));
            document.getElementById("fps").textContent = Math.round(totTime) + " ms";
        }
        else setTimeout(checkTime, 40);
    }
    setTimeout(checkTime, 100);
}


// ============================ MAIN ==============================

var state = {
    width: window.innerWidth,
    height: window.innerHeight,
    rz: -0.9 * Math.PI,
    rx: -0.4 * Math.PI,
    scale: 0.5,
    renderNeeded: true
};

function initWebGL() {
    // get context
    renderer.canvas = document.getElementById("canvas");
    renderer.gl = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");
    if (renderer.gl == null) throw ("Error: `canvas.getContext(\"webgl2\")` returns null. Your browser may not support WebGL 2.");

    // load GLSL source
    console.time("load glsl code");
    renderer.vsSource = "#version 300 es\nin vec4 vertexPosition;out vec2 vXy;" +
        "void main(){vXy=vertexPosition.xy;gl_Position=vertexPosition;}";
    renderer.fsSource = loadShaderSource("fs-source.glsl");
    renderer.imgGradSource = loadShaderSource("img-grad.glsl");
    renderer.aaSource = loadShaderSource("aa.glsl");
    console.timeEnd("load glsl code");

    // timer
    renderer.timerExt = renderer.gl.getExtension('EXT_disjoint_timer_query_webgl2');
    if (renderer.timerExt) document.querySelector("#fps").textContent = "Timer loaded.";
    else console.warn("Timer unavailable.");
}

function mainRenderer() {
    let canvas = renderer.canvas;
    let gl = renderer.gl;

    // create anti-aliasing object
    function createAntiAliaser() {
        var renderTarget = createRenderTarget(gl, state.width, state.height);
        var imgGradProgram = createShaderProgram(gl, renderer.vsSource, renderer.imgGradSource);
        var imgGradTarget = createRenderTarget(gl, state.width, state.height);
        var aaProgram = createShaderProgram(gl, renderer.vsSource, renderer.aaSource);
        return {
            renderTexture: renderTarget.texture,
            renderFramebuffer: renderTarget.framebuffer,
            imgGradProgram: imgGradProgram,
            imgGradTexture: imgGradTarget.texture,
            imgGradFramebuffer: imgGradTarget.framebuffer,
            aaProgram: aaProgram
        }
    };
    renderer.antiAliaser = createAntiAliaser();

    // position buffer
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [-1, 1, 1, 1, -1, -1, 1, -1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // rendering
    let then = 0;
    function render(now) {
        if (state.renderNeeded) {
            state.width = canvas.width = canvas.style.width = window.innerWidth;
            state.height = canvas.height = canvas.style.height = window.innerHeight;
            var transformMatrix = calcTransformMatrix(state);
            drawScene(positionBuffer, transformMatrix);
            state.renderNeeded = false;
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // interactions
    var fingerDist = -1;
    canvas.addEventListener("wheel", function (e) {
        e.preventDefault();
        var sc = Math.exp(0.0002 * e.wheelDeltaY);
        state.scale *= sc;
        state.renderNeeded = true;
    }, { passive: false });
    var mouseDown = false;
    canvas.addEventListener("pointerdown", function (event) {
        //event.preventDefault();
        mouseDown = true;
    });
    window.addEventListener("pointerup", function (event) {
        event.preventDefault();
        mouseDown = false;
    });
    canvas.addEventListener("pointermove", function (event) {
        if (mouseDown) {
            var dx = event.movementX, dy = event.movementY;
            var k = fingerDist > 0. ? 0.001 : 0.01;
            state.rx += k * dy;
            state.rz += k * dx;
            state.renderNeeded = true;
        }
    });
    canvas.addEventListener("touchstart", function (event) {
        if (event.touches.length == 2) {
            var fingerPos0 = [event.touches[0].pageX, event.touches[0].pageY];
            var fingerPos1 = [event.touches[1].pageX, event.touches[1].pageY];
            fingerDist = Math.hypot(fingerPos1[0] - fingerPos0[0], fingerPos1[1] - fingerPos0[1]);
        }
    });
    canvas.addEventListener("touchend", function (event) {
        fingerDist = -1.0;
    });
    canvas.addEventListener("touchmove", function (event) {
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
    });
    window.addEventListener("resize", function (event) {
        state.width = canvas.width = canvas.style.width = window.innerWidth;
        state.height = canvas.height = canvas.style.height = window.innerHeight;
        var oldAntiAliaser = renderer.antiAliaser;
        renderer.antiAliaser = createAntiAliaser();
        gl.deleteFramebuffer(oldAntiAliaser.renderFramebuffer);
        gl.deleteTexture(oldAntiAliaser.renderTexture);
        gl.deleteProgram(oldAntiAliaser.imgGradProgram);
        gl.deleteFramebuffer(oldAntiAliaser.imgGradFramebuffer);
        gl.deleteTexture(oldAntiAliaser.imgGradTexture);
        gl.deleteProgram(oldAntiAliaser.aaProgram);
        state.renderNeeded = true;
    });
}

function updateShaderFunction(funCode, funGradCode) {
    console.time("compile shader");
    var fsSource = renderer.fsSource;
    fsSource = fsSource.replaceAll("{%FUN%}", funCode);
    fsSource = fsSource.replaceAll("{%FUNGRAD%}", funGradCode);
    var shaderProgram = createShaderProgram(renderer.gl, renderer.vsSource, fsSource);
    if (renderer.shaderProgram != null)
        renderer.gl.deleteProgram(renderer.shaderProgram);
    renderer.shaderProgram = shaderProgram;
    console.timeEnd("compile shader");
    state.renderNeeded = true;
}