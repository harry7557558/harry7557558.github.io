"use strict";

// initialize WebGL: load and compile shader, initialize buffers
function initWebGL(gl) {

    // load vertex and fragment shader sources
    function loadGLSLSource(path) {
        var request = new XMLHttpRequest();
        request.open("GET", path, false);
        request.send(null);
        if (request.status == 200) {
            return request.responseText;
        }
        return "";
    }
    console.time("request glsl code");
    var vsSource = loadGLSLSource("vs-source.glsl");
    var fsSource = loadGLSLSource("egg-texture.glsl") + loadGLSLSource("fs-source.glsl");
    console.timeEnd("request glsl code");

    // compile shaders
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
    console.time("compile shader");
    var shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    console.timeEnd("compile shader");

    // initialize buffers
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [-1, 1, 1, 1, -1, -1, 1, -1];  // square
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // return a JSON object
    var programInfo = {
        program: shaderProgram,
        attribLocations: {  // attribute variables, receive values from buffers
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {  // uniform variables
            uRotate: gl.getUniformLocation(shaderProgram, 'uRotate'),
            uDist: gl.getUniformLocation(shaderProgram, 'uDist'),
            uResolution: gl.getUniformLocation(shaderProgram, "uResolution"),
            uEggParameters: gl.getUniformLocation(shaderProgram, "uEggParameters"),
            uEggOrientation: gl.getUniformLocation(shaderProgram, "uEggOrientation"),
            uEggTranslation: gl.getUniformLocation(shaderProgram, "uEggTranslation"),
        },
        // buffers
        buffers: {
            positionBuffer: positionBuffer,
        },
    };
    return programInfo;
}


// call this function to re-render
function drawScene(gl, programInfo, variables) {

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
        gl.bindBuffer(gl.ARRAY_BUFFER, programInfo.buffers.positionBuffer);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // make sure it uses the program
    gl.useProgram(programInfo.program);

    // set shader uniforms
    // https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
    gl.uniform2f(programInfo.uniformLocations.uRotate, variables.uRx, variables.uRz);
    gl.uniform1f(programInfo.uniformLocations.uDist, variables.uDist);
    gl.uniform2f(programInfo.uniformLocations.uResolution, canvas.clientWidth, canvas.clientHeight);
    gl.uniform3fv(programInfo.uniformLocations.uEggParameters, variables.uEggParameters);
    gl.uniformMatrix3fv(programInfo.uniformLocations.uEggOrientation, false, variables.uEggOrientation);
    gl.uniform3fv(programInfo.uniformLocations.uEggTranslation, variables.uEggTranslation);

    // render
    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}


// return the three control parameters of the egg
function randomEgg() {
    var u = 2.0 * Math.PI * Math.random();
    var v = 2.0 * Math.random() - 1.0;
    var w = Math.cbrt(Math.random());
    var x = w * Math.sqrt(1 - v * v) * Math.cos(u)
    var y = w * Math.sqrt(1 - v * v) * Math.sin(u);
    var z = w * v;
    const mu = [0.05048232509261819, 1.1917245785944626, -0.2113612433670313];
    const eig1 = [-0.11211907456861894, 0.8662805303219393, -0.16592978179513765],
        eig2 = [0.05143550009089445, 0.0009434329853603692, -0.02982962425271538],
        eig3 = [0.021209126749381683, 0.00980936323090463, 0.03688134011888825];
    return [mu[0] + x * eig1[0] + y * eig2[0] + z * eig3[0],
    mu[1] + x * eig1[1] + y * eig2[1] + z * eig3[1],
    mu[2] + x * eig1[2] + y * eig2[2] + z * eig3[2]];
}


// find the orientation to minimize the egg's potential energy
function calcEggOrientation(params) {
    var a = params[0], b = params[1], c = params[2];
    const sin = Math.sin, cos = Math.cos, exp = Math.exp, sqrt = Math.sqrt;

    // numerical quadrature in one dimension
    var integrate = function (fun, a, b) {
        const GL12_S = [.00921968287664037465, .04794137181476257166, .11504866290284765648, .20634102285669127635, .31608425050090990312, .43738329574426554226, .56261670425573445773, .68391574949909009687, .79365897714330872364, .88495133709715234351, .95205862818523742833, .99078031712335962534], GL12_W = [.02358766819325591359, .05346966299765921548, .08003916427167311316, .10158371336153296087, .11674626826917740438, .12457352290670139250, .12457352290670139250, .11674626826917740438, .10158371336153296087, .08003916427167311316, .05346966299765921548, .02358766819325591359];
        var s = 0.0;
        for (var i = 0; i < 12; i++) {
            var x = a + GL12_S[i] * (b - a);
            s += fun(x) * GL12_W[i];
        }
        return s * (b - a);
    };

    // calculate the center of mass, assuming uniform density
    // z=w*cos(v), dV=w**2*sin(v), COM.z = integrate(z*dV, (w, 0, r), (v, 0, pi)) / integrate(dV, (w, 0, r), (v, 0, pi))
    var r = function (t) {
        return 1.0 - sin(t) * sin(t) * (a + b * exp(-t) + c * cos(t));
    };
    var intC = 2.0 * Math.PI * integrate(function (v) {
        return integrate(function (w) {
            var z = w * cos(v), dV = w * w * sin(v);
            return z * dV;
        }, 0.0, r(v));
    }, 0.0, Math.PI);
    var intV = 2.0 * Math.PI * integrate(function (v) {
        return integrate(function (w) {
            return w * w * sin(v);
        }, 0.0, r(v));
    }, 0.0, Math.PI);
    var cz = intC / intV;  // z-coordinate of center of mass

    // numerical optimization
    var goldenSectionSearch = function (fun, x0, x1) {
        const g1 = 0.6180339887498949, g0 = 1.0 - g1;
        var t0 = g1 * x0 + g0 * x1;
        var t1 = g0 * x0 + g1 * x1;
        var y0 = fun(t0), y1 = fun(t1);
        for (var i = 0; i < 64; i++) {
            if (y0 < y1) {
                x1 = t1, y1 = y0;
                t1 = t0, t0 = g1 * x0 + g0 * x1;
                y0 = fun(t0);
            }
            else {
                x0 = t0, y0 = y1;
                t0 = t1, t1 = g0 * x0 + g1 * x1;
                y1 = fun(t1);
            }
            if (x1 - x0 < 1e-12) break;
        }
        return y0 < y1 ? t0 : t1;
    };

    // find angle to minimize the height of center of mass
    var energy = function (a) {
        const eps = 1e-3;
        var x = r(a) * sin(a), y = r(a) * cos(a);
        var dx = r(a + eps) * sin(a + eps) - r(a - eps) * sin(a - eps);
        var dy = r(a + eps) * cos(a + eps) - r(a - eps) * cos(a - eps);
        var p = [x, y - cz];
        var n = [-dy / Math.hypot(dx, dy), dx / Math.hypot(dx, dy)];
        //console.log(p[0] * n[1] - p[1] * n[0]);  // should approach 0
        return p[0] * n[0] + p[1] * n[1];
    };
    var min_a = goldenSectionSearch(energy, 0, Math.PI);
    var min_h = energy(min_a);

    // return position and orientation
    // pretty sure I have a bug here
    var ra = -(Math.PI - min_a);
    var R = [
        [1, 0, 0],
        [0, cos(ra), -sin(ra)],
        [0, sin(ra), cos(ra)]
    ];
    var p = [R[0][2] * cz, R[1][2] * cz, R[2][2] * cz];
    var translate = [0, -p[1], -p[2] + min_h];
    return {
        orientation: [R[0][0], R[1][0], R[2][0], R[0][1], R[1][1], R[2][1], R[0][2], R[1][2], R[2][2]],
        position: translate,
    }
}


// window.onload
function main() {

    // graphing variables
    //var eggParameters = [0.04988658352024161, 1.1173188904187898, -0.16022814144952918];
    var eggParameters = randomEgg(); console.log(eggParameters);
    var eggOrientation = calcEggOrientation(eggParameters);
    var variables = {
        uRx: 0.2,
        uRz: -0.5,
        uDist: 8.0,
        uEggParameters: eggParameters,
        uEggOrientation: eggOrientation.orientation,
        uEggTranslation: eggOrientation.position,
    };

    // load WebGL
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");
    var programInfo = initWebGL(gl);

    // rendering
    let then = 0;
    var render_needed = true;
    function render_main(now) {
        if (render_needed) {
            // display fps
            now *= 0.001;
            var time_delta = now - then;
            then = now;
            if (time_delta != 0) {
                document.getElementById("fps").textContent = (1.0 / time_delta).toFixed(1) + " fps";
            }

            canvas.width = canvas.style.width = window.innerWidth;
            canvas.height = canvas.style.height = window.innerHeight;
            drawScene(gl, programInfo, variables);

            render_needed = false;
        }
        requestAnimationFrame(render_main);
    }
    requestAnimationFrame(render_main);


    // interactions
    canvas.oncontextmenu = function (e) {
        //e.preventDefault();
    };
    canvas.addEventListener("wheel", function (e) {
        e.preventDefault();
        var sc = Math.exp(0.0002 * e.deltaY);
        variables.uDist *= sc;
        render_needed = true;
    }, { passive: false });

    var mouseDown = false;
    canvas.onmousedown = function (event) {
        event.preventDefault();
        mouseDown = true;
    };
    window.onmouseup = function (event) {
        event.preventDefault();
        mouseDown = false;
    };
    window.onresize = function (event) {
        canvas.width = canvas.style.width = window.innerWidth;
        canvas.height = canvas.style.height = window.innerHeight;
        render_needed = true;
    }
    canvas.onmousemove = function (e) {
        if (mouseDown) {
            variables.uRx += 0.01 * e.movementY;
            variables.uRz -= 0.01 * e.movementX;
            render_needed = true;
        }
    };

}
