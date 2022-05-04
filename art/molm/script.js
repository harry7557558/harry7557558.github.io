"use strict";


// rendering related
var renderer = {
    canvas: null,
    gl: null,
    vsSource: "",
    positionBuffer: null,
    renderSource: "",
    renderProgram: null,
    renderTarget: null,
    displaySource: "",
    displayProgram: null,
    texFloor: null,
};

// viewport
var state = {
    width: window.innerWidth,
    height: window.innerHeight,
    rz: -0.1 * Math.PI,
    rx: 0.1 * Math.PI,
    dist: 5.0,
    renderNeeded: true,
    iFrame: 0
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
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw new Error("Shader compile error: " + gl.getShaderInfoLog(shader));
        return shader;
    }
    var vShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    var fShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);
    gl.linkProgram(shaderProgram);
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
    const internalFormat = gl.RGBA32F;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.FLOAT;
    const data = null;
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border,
        format, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
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
    const sampler = createSampleTexture(gl, width, height);
    return {
        texture: tex,
        framebuffer: framebuffer,
        sampler: sampler
    };
}
function destroyRenderTarget(target) {
    let gl = renderer.gl;
    gl.deleteTexture(target.texture);
    gl.deleteFramebuffer(target.framebuffer);
}

function loadTexture(url) {
    let gl = renderer.gl;
    const texture = gl.createTexture();
    // temporary fill a white blank before the image finished download
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 0, 255]);  // black
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border,
        srcFormat, srcType, pixel);

    const image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);
        if ((image.width & (image.width - 1)) == 0 &&
            (image.height & (image.height - 1)) == 0) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // Turn off mips and set wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        state.renderNeeded = true;
    };
    image.onerror = function () {
        alert("Failed to load " + url);
    }
    image.crossOrigin = "";
    image.src = url;
    return texture;
}


// load WebGL
function initWebGL() {
    // get context
    renderer.canvas = document.getElementById("canvas");
    renderer.gl = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");
    if (renderer.gl == null)
        throw new Error("Error: Your browser may not support WebGL 2.");
    if (renderer.gl.getExtension("EXT_color_buffer_float") == null)
        throw new Error("Error: Your device does not support the `EXT_color_buffer_float` extension.");

    // load GLSL source
    console.time("load glsl code");
    renderer.vsSource = "#version 300 es\nin vec4 vertexPosition;out vec2 fragUv;" +
        "void main(){fragUv=vertexPosition.xy;gl_Position=vertexPosition;}";
    renderer.renderSource = loadShaderSource("render-pt.glsl");
    // renderer.renderSource = loadShaderSource("model-sdf.glsl");
    renderer.displaySource = "#version 300 es\nprecision highp float;uniform sampler2D sImage;out vec4 fragColor;" +
        "void main(){fragColor=vec4(texelFetch(sImage,ivec2(gl_FragCoord.xy),0).xyz,1.0);}";
    console.timeEnd("load glsl code");

    // position buffer
    renderer.positionBuffer = renderer.gl.createBuffer();
    renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, renderer.positionBuffer);
    var positions = [-1, 1, 1, 1, -1, -1, 1, -1];
    renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(positions), renderer.gl.STATIC_DRAW);

    // compile shader
    console.time("compile shader");
    try {
        renderer.renderProgram = createShaderProgram(renderer.vsSource, renderer.renderSource);
        renderer.displayProgram = createShaderProgram(renderer.vsSource, renderer.displaySource);
    }
    catch (e) {
        renderer.renderProgram = null;
        renderer.displayProgram = null;
        throw e;
    }
    console.timeEnd("compile shader");

    // textures
    renderer.texFloor = loadTexture("tex-floor.jpg");

    // render targets
    function reloadRenderTargets() {
        state.width = canvas.width = canvas.style.width = window.innerWidth;
        state.height = canvas.height = canvas.style.height = window.innerHeight;
        if (renderer.renderTarget != undefined) {
            renderer.gl.deleteFramebuffer(renderer.renderTarget.framebuffer);
            renderer.gl.deleteTexture(renderer.renderTarget.texture);
        }
        renderer.renderTarget = createRenderTarget(state.width, state.height);
        state.renderNeeded = true;
    }
    reloadRenderTargets();
    window.addEventListener("resize", reloadRenderTargets);
}


// call this function to re-render
async function drawScene() {
    let gl = renderer.gl;

    // set position buffer for vertex shader
    function setPositionBuffer(program) {
        var vpLocation = gl.getAttribLocation(program, "vertexPosition");
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0, offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, renderer.positionBuffer);
        gl.vertexAttribPointer(
            vpLocation,
            numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(vpLocation);
    }

    // clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // render image
    gl.viewport(0, 0, state.width, state.height);
    gl.useProgram(renderer.renderProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderer.renderTarget.framebuffer);
    setPositionBuffer(renderer.renderProgram);
    gl.uniform1i(gl.getUniformLocation(renderer.renderProgram, "ZERO"), 0);
    gl.uniform1i(gl.getUniformLocation(renderer.renderProgram, "iFrame"), state.iFrame);
    gl.uniform2f(gl.getUniformLocation(renderer.renderProgram, "uResolution"),
        state.width, state.height);
    gl.uniform2f(gl.getUniformLocation(renderer.renderProgram, "uRotate"),
        state.rx, state.rz);
    gl.uniform1f(gl.getUniformLocation(renderer.renderProgram, "uDist"),
        state.dist = Math.min(Math.max(state.dist, 2.5), 200));
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, renderer.renderTarget.sampler);
    gl.uniform1i(gl.getUniformLocation(renderer.renderProgram, "sSelf"), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, renderer.texFloor);
    gl.uniform1i(gl.getUniformLocation(renderer.renderProgram, "texFloor"), 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindTexture(gl.TEXTURE_2D, renderer.renderTarget.sampler);
    gl.copyTexImage2D(gl.TEXTURE_2D,
        0, gl.RGBA32F, 0, 0, state.width, state.height, 0);

    gl.viewport(0, 0, state.width, state.height);
    gl.useProgram(renderer.displayProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    setPositionBuffer(renderer.displayProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, renderer.renderTarget.texture);
    gl.uniform1i(gl.getUniformLocation(renderer.displayProgram, "sImage"), 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

// load renderer/interaction
function initRenderer() {
    let canvas = renderer.canvas;
    let gl = renderer.gl;

    // rendering
    function render() {
        if (state.renderNeeded) state.iFrame = 0;
        if (state.iFrame < 1000) {
            // console.log("iFrame", state.iFrame);
            state.width = canvas.width = canvas.style.width = window.innerWidth;
            state.height = canvas.height = canvas.style.height = window.innerHeight;
            drawScene();
            state.iFrame += 1;
        }
        state.renderNeeded = false;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // interactions
    var mouseDown = false;
    var fingerDist = -1;
    window.addEventListener("resize", function (event) {
        state.renderNeeded = true;
    });
    canvas.addEventListener("wheel", function (event) {
        var sc = Math.exp(-0.0002 * event.wheelDeltaY);
        state.dist *= sc;
        state.renderNeeded = true;
    }, { passive: true });
    canvas.addEventListener("pointerdown", function (event) {
        //event.preventDefault();
        canvas.setPointerCapture(event.pointerId);
        mouseDown = true;
    });
    window.addEventListener("pointerup", function (event) {
        event.preventDefault();
        mouseDown = false;
    });
    canvas.addEventListener("pointermove", function (event) {
        if (mouseDown) {  // rotate
            var dx = event.movementX, dy = event.movementY;
            var k = fingerDist > 0. ? 0.0005 : 0.005;
            state.rx += k * dy;
            state.rz += k * dx;
            // state.rx = Math.min(Math.max(state.rx, 0.0), Math.PI);
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
        if (event.touches.length == 2) {
            var fingerPos0 = [event.touches[0].pageX, event.touches[0].pageY];
            var fingerPos1 = [event.touches[1].pageX, event.touches[1].pageY];
            var newFingerDist = Math.hypot(fingerPos1[0] - fingerPos0[0], fingerPos1[1] - fingerPos0[1]);
            if (fingerDist > 0. && newFingerDist > 0.) {
                var sc = newFingerDist / fingerDist;
                state.dist /= Math.max(Math.min(sc, 2.0), 0.5);
            }
            fingerDist = newFingerDist;
            state.renderNeeded = true;
        }
    }, { passive: true });

}
