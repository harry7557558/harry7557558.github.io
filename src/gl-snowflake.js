"use strict";

function setupSnowflakeRenderer() {
    var webgl_failed = function (error) {
        console.error(error);
        document.getElementById("webgl-message").textContent = "Failed to load WebGL";
        canvas.remove();
        resetWordStyle();
    };

    // load WebGL
    const canvas = document.getElementById("gl-canvas");
    const gl = canvas.getContext("webgl");
    if (gl == null) {
        webgl_failed(gl);
        return;
    }
    canvas.addEventListener("webglcontextlost", function (e) {
        webgl_failed("WebGL Context Lost");
    });

    const glowEffects = [
        [0, 0, -1, -1],  // pink
        [1, 0, -1, -1],  // pink + glow
        [1, 1, -1, -1],  // hue + glow
    ];
    var glowEffectI = 0;

    var renderer = {
        canvas: canvas,
        gl: gl,
        extentions: {},
        programs: {
            renderProgram: null
        },
        uniforms: {
            iResolution: [0, 0],
            iTime: 0.0,
            iMouse: { x: 0, y: 0, z: -1 },
            glowEffect: glowEffects[glowEffectI]
        },
        buffers: {
            positionBuffer: null,
        },
        textures: {},
        framebuffers: {},
        renderNeeded: true
    };

    // vertex and fragment shader code
    const vsSource = "attribute vec4 aVertexPosition;void main(void){gl_Position=aVertexPosition;}";
    var request = new XMLHttpRequest();
    request.open("GET", "./src/gl-snowflake.glsl", false);
    request.send(null);
    var fsSource = request.responseText;

    // start time
    var start_time = 100.0 * (2000 * Math.random() - 1000);

    // create shader program(s)
    function initShaderProgram(vsSource, fsSource) {
        function loadShader(gl, type, source) {
            var shader = gl.createShader(type);  // create a new shader
            gl.shaderSource(shader, source);  // send the source code to the shader
            gl.compileShader(shader);  // compile shader
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))  // check if compiled succeed
                throw new Error(gl.getShaderInfoLog(shader));  // compile error message
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
    try {
        console.time("compile shader");
        renderer.programs.renderProgram = initShaderProgram(vsSource, fsSource);
        if (renderer.programs.renderProgram == null)
            throw renderer.programs.renderProgram;
        console.timeEnd("compile shader");
    } catch (e) {
        webgl_failed(e);
        return;
    }

    // initialize buffers
    try {
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var positions = [-1, 1, 1, 1, -1, -1, 1, -1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        renderer.buffers.positionBuffer = positionBuffer;
    } catch (e) {
        webgl_failed(e);
        return;
    }

    // rendering
    function drawScene() {

        /* Render Pass */
        var program = renderer.programs.renderProgram;
        gl.useProgram(program);

        // clear the canvas
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // setup position buffer
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, renderer.buffers.positionBuffer);
            var vertexPosition = gl.getAttribLocation(program, "aVertexPosition");
            gl.vertexAttribPointer(
                vertexPosition,
                numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(vertexPosition);
        }

        // setup uniforms
        gl.uniform2f(gl.getUniformLocation(program, "iResolution"),
            renderer.uniforms.iResolution[0] = canvas.clientWidth,
            renderer.uniforms.iResolution[1] = canvas.clientHeight);
        gl.uniform1f(gl.getUniformLocation(program, "iTime"),
            renderer.uniforms.iTime = 0.001 * (performance.now() - start_time));
        gl.uniform3f(gl.getUniformLocation(program, "iMouse"),
            renderer.uniforms.iMouse[0],
            renderer.uniforms.iMouse[1],
            renderer.uniforms.iMouse[2]);
        gl.uniform4i(gl.getUniformLocation(program, "glowEffect"),
            renderer.uniforms.glowEffect[0],
            renderer.uniforms.glowEffect[1],
            renderer.uniforms.glowEffect[2],
            renderer.uniforms.glowEffect[3]);

        // draw
        {
            const offset = 0;
            const vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    }

    function render_main(now) {
        var w = window.innerWidth, h = window.innerHeight;
        canvas.width = w, canvas.style.width = w + "px";
        canvas.height = h, canvas.style.height = h + "px";
        try {
            drawScene();
        } catch (e) {
            webgl_failed(e);
            return;
        }
        requestAnimationFrame(render_main);
    }
    requestAnimationFrame(render_main);

    // interactions
    var mouseDown = false;
    canvas.addEventListener('mousedown', function (event) {
        mouseDown = true;
        renderer.uniforms.iMouse[0] = event.clientX;
        renderer.uniforms.iMouse[1] = canvas.height - event.clientY;
        renderer.uniforms.iMouse[2] = 1.0;
    });
    window.addEventListener('mouseup', function (event) {
        mouseDown = false;
        renderer.uniforms.iMouse[2] = -1.0;
    });
    canvas.addEventListener('mousemove', function (event) {
        if (mouseDown) {
            renderer.uniforms.iMouse[0] = event.clientX;
            renderer.uniforms.iMouse[1] = canvas.height - event.clientY;
        }
    });

    // click "WebGL"
    document.getElementById("glow-effect-button").addEventListener("click", function (event) {
        let n = glowEffects.length;
        if (event.shiftKey) glowEffectI = (glowEffectI + n - 1) % n;
        else glowEffectI = (glowEffectI + 1) % n;
        renderer.uniforms.glowEffect = glowEffects[glowEffectI];
    });

    // set emoji
    let container = document.getElementById("snowflake-emoji");
    container.innerHTML = container.innerHTML.replaceAll('❄️', '<img src="https://twemoji.maxcdn.com/v/13.1.0/svg/2744.svg" alt="❄️" style="height:1.2em;padding-top:0.15em"/>&nbsp;')
}