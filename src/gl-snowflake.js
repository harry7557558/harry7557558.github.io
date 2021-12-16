function setupSnowflakeRenderer() {
    var webgl_failed = function (error) {
        console.error(error);
        document.getElementById("webgl-message").textContent = "Failed to load WebGL";
        canvas.remove();
        resetWordStyle();
    };

    // load WebGL
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");
    if (gl == null) {
        webgl_failed(gl);
        return;
    }

    // vertex and fragment shader code
    var vsSource = "attribute vec4 aVertexPosition;void main(void){gl_Position=aVertexPosition;}";
    var request = new XMLHttpRequest();
    request.open("GET", "./src/gl-snowflake.glsl", false);
    request.send(null);
    var fsSource = request.responseText;

    var iTime = 0.0, t0 = 100.0 * (2000 * Math.random() - 1000);
    var iMouse = [0, 0, -1];

    // initialize a shader program
    function initShaderProgram(gl, vsSource, fsSource) {
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
    var shaderProgram = null;
    try {
        console.time("compile shader");
        shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        if (shaderProgram == null) throw (shaderProgram);
        console.timeEnd("compile shader");
    } catch (e) {
        webgl_failed(e);
        return;
    }

    // look up the locations that WebGL assigned to inputs
    const programInfo = {
        program: shaderProgram,
        attribLocations: {  // attribute variables, receive values from buffers
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {  // uniform variables, similar to JS global variables
            iResolution: gl.getUniformLocation(shaderProgram, "iResolution"),
            iTime: gl.getUniformLocation(shaderProgram, "iTime"),
            iMouse: gl.getUniformLocation(shaderProgram, "iMouse"),
        },
    };

    // initialize buffers
    function initBuffers(gl) {
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // vec2[4], coordinates from -1 to 1
        var positions = [-1, 1, 1, 1, -1, -1, 1, -1];

        // pass the list of positions into WebGL to build the shape
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        return { position: positionBuffer, };
    }
    var buffers = {};
    try {
        buffers = initBuffers(gl);
    } catch (e) {
        webgl_failed(e);
        return;
    }

    // rendering
    function drawScene(gl, programInfo, buffers) {

        // clear the canvas
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        {
            const numComponents = 2;  // pull out 2 values per iteration
            const type = gl.FLOAT;  // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0; // how many bytes to get from one set of values to the next
            const offset = 0; // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        }

        // make sure it uses the program
        gl.useProgram(programInfo.program);

        // set shader uniforms
        gl.uniform2f(programInfo.uniformLocations.iResolution, canvas.clientWidth, canvas.clientHeight);
        gl.uniform1f(programInfo.uniformLocations.iTime, iTime = 0.001 * (performance.now() - t0));
        gl.uniform3f(programInfo.uniformLocations.iMouse, iMouse[0], iMouse[1], iMouse[2]);

        // render
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
            drawScene(gl, programInfo, buffers);
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
        iMouse[2] = 1.0;
    });
    window.addEventListener('mouseup', function (event) {
        mouseDown = false;
        iMouse[2] = -1.0;
    });
    canvas.addEventListener('mousemove', function (e) {
        if (mouseDown) {
            iMouse[0] = e.clientX;
            iMouse[1] = canvas.height - e.clientY;
        }
    });
}