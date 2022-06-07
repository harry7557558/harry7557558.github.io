// Shader sources
const VS_BACKGROUND = `precision highp float;
attribute vec4 vertexPosition;
void main() {
    gl_Position = vertexPosition;
}
`;
const FS_BACKGROUND = `precision highp float;
uniform vec2 iResolution;
uniform vec4 iXyminmax;  // xmin, ymin, xmax, ymax
uniform vec4 iRxyzd;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv = mix(iXyminmax.xy, iXyminmax.zw, uv);
    float x = uv.x, y = uv.y;

    const float d_background = 5.6;
    float b_background = 0.5 + 0.5*y / length(vec3(x, y, d_background));
    for (float k = 0.; k <= 2.; k++) {
        b_background += 0.01*exp2(-k)*sin(exp2(k)*(x-y));
    }

    const float n_background = 16.;
    float i_background = floor(b_background*n_background-0.5);
    float t_background = (i_background+0.5)/n_background;
    vec3 c_background = vec3(
        30.*t_background,
        30.+75.*t_background*t_background,
        45.+30.*t_background) / 255.0;

    gl_FragColor = vec4(c_background, 1.0);
}
`;
const VS_STROKE = `precision highp float;
uniform mat4 transformMatrix;
uniform vec2 iResolution;
uniform vec4 iXyminmax;
attribute vec4 aPosition;
attribute vec3 aDirection;
attribute vec3 aColor;
varying vec3 vColor;

void main() {
    // matrix after screen-space translation
    vec2 sct = 1.0 / (iXyminmax.zw-iXyminmax.xy);
    vec2 sc = 2.0 * sct;
    vec2 tr = -2.0*iXyminmax.xy*sct - 1.0;
    mat4 mat = mat4(
        sc.x, 0, 0, 0,
        0, sc.y, 0, 0,
        0, 0, 1, 0,
        tr.x, tr.y, 0, 1
    ) * transformMatrix;

    // add width to stroke
    vec3 p01 = aPosition.xyz;
    vec3 q01 = p01 + aDirection;
    vec4 p1 = mat * vec4(p01,1); p1 /= p1.w;
    vec4 q1 = mat * vec4(q01,1); q1 /= q1.w;
    vec4 pos = p1;
    vec4 dp = q1 - p1;
    pos.xy += normalize(vec2(sc.x,-sc.y))*normalize(dp.yx) / 100.0;
    pos.z = 0.01*pos.z + 0.5;
    gl_Position = pos;

    // color
    vColor = aColor;
}
`;
const FS_STROKE = `precision highp float;
varying vec3 vColor;
void main() {
    gl_FragColor = vec4(vColor, 1.0);
}
`;


// Math functions
const PI = Math.PI,
    cos = Math.cos, sin = Math.sin, asin = Math.asin,
    sqrt = Math.sqrt, exp = Math.exp, pow = Math.pow;

function hsv2rgb(h, s, v) {
    function saturate(x) {
        return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;
    }
    function hue2rgb(t) {
        while (t < 0) t += 6;
        while (t > 6) t -= 6;
        if (t < 1) return t;
        if (t < 3) return 1;
        if (t < 4) return 4 - t;
        return 0;
    }
    if (v == 0) return [0, 0, 0];
    h /= 60;
    var max = v, min = max - s * max;
    var r = min + (max - min) * hue2rgb(h + 2);
    var g = min + (max - min) * hue2rgb(h);
    var b = min + (max - min) * hue2rgb(h - 2);
    return [saturate(r), saturate(g), saturate(b)];
}

// Animation time
let timeStart = performance.now();
function tAnimate() {
    return 0.001 * (performance.now() - timeStart);
}

// Projection
function calcMatrix(viewport) {
    let rx = viewport.rx, ry = viewport.ry, rz = viewport.rz, d = viewport.d;
    var a1 = [
        -cos(ry) * sin(rz) + sin(ry) * sin(rx) * cos(rz),
        cos(ry) * cos(rz) + sin(ry) * sin(rx) * sin(rz),
        -cos(rx) * sin(ry), 0];
    var a2 = [
        -sin(ry) * sin(rz) - sin(rx) * cos(ry) * cos(rz),
        sin(ry) * cos(rz) - sin(rx) * cos(ry) * sin(rz),
        cos(rx) * cos(ry), 0];
    var a3 = [
        cos(rx) * cos(rz), cos(rx) * sin(rz),
        sin(rx), 0];
    var a4 = [-a3[0] / d, -a3[1] / d, -a3[2] / d, 1];
    return [
        a1[0], a2[0], a3[0], a4[0],
        a1[1], a2[1], a3[1], a4[1],
        a1[2], a2[2], a3[2], a4[2],
        a1[3], a2[3], a3[3], a4[3]
    ];
}

// Parametric curve/surface to segments
function segmentCurve(fun, t0, t1, ndif) {
    var points = new Array(ndif + 1);
    var colors = new Array(ndif);
    for (var i = 0; i <= ndif; i++) {
        var sample = fun(t0 + (t1 - t0) * (i / ndif));
        points[i] = sample.pos;
        if (i != ndif) colors[i] = sample.color;
    }
    var segments = new Array(ndif);
    for (var i = 0; i < ndif; i++) {
        segments[i] = points[i].concat(points[i + 1]);
    }
    return {
        segments: segments,
        colors: colors
    }
}

// Body parts
function funHood(u, v) {
    var x = pow(cos(0.5 * PI * u), 1.7) * (0.5 + 3 * v)
        - 0.8 * (v + 0.1) * (1 - u * u) * pow(1 - pow(cos(0.5 * PI * u), 2), 0.2) - 0.5;
    var y = 2.0 * u;
    var z = (1.6 * (2 / PI * asin(0.9 * cos(0.5 * PI * u)))
        + cos(0.5 * PI * u) * (0.2 * pow(4 * v * (1 - v), 2.0) - 0.5 * pow(v, 1.5)))
        * (1 + 0.08 * v * sin(2 * PI * tAnimate())) - 0.2 * v - 2.9;
    return {
        pos: [x, y, z],
        color: hsv2rgb(10 + 30 * v + 10 * sin(20 * v), 0.6, 0.6)
    };
}
function generateHood() {
    const n_hood = 10;
    var segments = [], colors = [];
    for (var i = 0; i < n_hood; i++) {
        var v = (i + 0.5) / n_hood;
        var ss = segmentCurve(
            function(u) { return funHood(u, v); },
            -1.0, 1.0, 32);
        segments = segments.concat(ss.segments);
        colors = colors.concat(ss.colors);
    }
    return {
        segments: segments,
        colors: colors
    };
}



// Create shader program
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


// Draw the background
function drawBackground(renderer) {
    let gl = renderer.gl;
    let program = renderer.programs.backgroundRenderer;
    gl.useProgram(program);

    // setup position buffer
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [-1, 1, 1, 1, -1, -1, 1, -1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        var vertexPosition = gl.getAttribLocation(program, "vertexPosition");
        gl.vertexAttribPointer(
            vertexPosition,
            numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(vertexPosition);
    }

    // setup uniforms
    gl.uniform2f(gl.getUniformLocation(program, "iResolution"),
        renderer.viewport.iResolution[0], renderer.viewport.iResolution[1]);
    gl.uniform4f(gl.getUniformLocation(program, "iXyminmax"),
        renderer.viewport.xmin, renderer.viewport.ymin,
        renderer.viewport.xmax, renderer.viewport.ymax);

    // draw
    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
    gl.deleteBuffer(positionBuffer);
}

// Draw lines
// lines are passed as [[x1, y1, z1, x2, y2, z2], ...]
// colors are passed as [[r, g, b], ...]
function drawLines(renderer, lines, colors) {
    let gl = renderer.gl;
    let program = renderer.programs.strokeRenderer;
    gl.useProgram(program);

    // setup buffers
    let n = lines.length;
    let verts = new Array(12 * n);
    let dirs = new Array(12 * n);
    let cols = new Array(12 * n);
    let indices = new Array(6 * n);
    for (var i = 0; i < n; i++) {
        var ai = 12 * i;
        for (var j = 0; j < 3; j++) {
            // positions
            verts[ai + j] = verts[ai + j + 3] = lines[i][j];
            verts[ai + j + 6] = verts[ai + j + 9] = lines[i][j + 3];
            // directions
            dirs[ai + j] = dirs[ai + j + 6] = lines[i][j + 3] - lines[i][j];
            dirs[ai + j + 3] = dirs[ai + j + 9] = -dirs[ai + j];
            // colors
            cols[ai + j] = cols[ai + j + 3] =
                cols[ai + j + 6] = cols[ai + j + 9] = colors[i][j];
        }
        // indices
        ai = 6 * i;
        var ti = 4 * i;
        indices[ai] = ti, indices[ai + 1] = ti + 1, indices[ai + 2] = ti + 2;
        indices[ai + 3] = ti + 3, indices[ai + 4] = ti + 1, indices[ai + 5] = ti + 2;
    }

    // setup uniforms
    gl.uniform2f(gl.getUniformLocation(program, "iResolution"),
        renderer.viewport.iResolution[0], renderer.viewport.iResolution[1]);
    gl.uniform4f(gl.getUniformLocation(program, "iXyminmax"),
        renderer.viewport.xmin, renderer.viewport.ymin,
        renderer.viewport.xmax, renderer.viewport.ymax);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "transformMatrix"),
        false, calcMatrix(renderer.viewport));

    // setup position buffer
    function setVec3Buffer(attribName) {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        var attrib = gl.getAttribLocation(program, attribName);
        gl.vertexAttribPointer(
            attrib,
            numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(attrib);
    }
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    setVec3Buffer("aPosition");

    // setup direction buffer
    let directionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, directionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dirs), gl.STATIC_DRAW);
    setVec3Buffer("aDirection");

    // setup color buffer
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cols), gl.STATIC_DRAW);
    setVec3Buffer("aColor");

    // setup indice buffer + draw elements
    let indiceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    {
        const vertexCount = 6 * n;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // clean up
    gl.deleteBuffer(positionBuffer);
    // gl.deleteBuffer(directionBuffer);
    // gl.deleteBuffer(colorBuffer);
    gl.deleteBuffer(indiceBuffer);
}

// Draw the scene, main rendering function
function drawScene(renderer) {
    let canvas = renderer.canvas;
    let gl = renderer.gl;

    // clear the canvas
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // background
    gl.disable(gl.DEPTH_TEST);
    drawBackground(renderer);

    gl.clearDepth(-1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.GEQUAL);

    // axes
    if (1) {
        let coords = [
            [0, 0, 0, 10, 0, 0],
            [0, 0, 0, 0, 10, 0],
            [0, 0, 0, 0, 0, 10]];
        let cols = [[1, 0, 0], [0, 0.5, 0], [0, 0, 1]];
        drawLines(renderer, coords, cols);
    }

    // body parts
    let hood = generateHood();
    drawLines(renderer, hood.segments, hood.colors);
}

window.onload = function () {

    // load WebGL
    var webgl_failed = function (error) {
        console.error(error);
        document.write("<h1 style='color:red;'>" + error + "</h1>");
    };
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");
    if (gl == null) {
        webgl_failed(gl);
        return;
    }
    canvas.addEventListener("webglcontextlost", function (e) {
        webgl_failed("WebGL Context Lost");
    });

    var renderer = {
        canvas: canvas,
        gl: gl,
        programs: {
            backgroundRenderer: null,
            pointRenderer: null,
            strokeRenderer: null
        },
        viewport: {
            iResolution: [0, 0],
            xmin: -13.75,
            ymin: -11.54,
            xmax: 5.53,
            ymax: 7.14,
            // original Desmos graph
            rx: -0.13,
            rz: 1.2,
            ry: -0.27,
            d: 10.0,
        },
    };

    // Compile shaders
    try {
        console.time("compile shaders");
        renderer.programs.backgroundRenderer = initShaderProgram(gl, VS_BACKGROUND, FS_BACKGROUND);
        renderer.programs.strokeRenderer = initShaderProgram(gl, VS_STROKE, FS_STROKE);
        console.timeEnd("compile shaders");
    } catch (e) {
        webgl_failed(e);
        return;
    }

    function render_main() {
        try {
            drawScene(renderer);
        } catch (e) {
            webgl_failed(e);
            return;
        }
        requestAnimationFrame(render_main);
    }
    requestAnimationFrame(render_main);

    // window resize
    function onresize() {
        let viewport = renderer.viewport;
        var w = window.innerWidth, h = window.innerHeight;
        viewport.iResolution[0] = w;
        viewport.iResolution[1] = h;
        canvas.width = w, canvas.style.width = w + "px";
        canvas.height = h, canvas.style.height = h + "px";
        var canw = 8.0 * w / Math.sqrt(w * h), canh = canw * h / w;
        viewport.xmin = -3.0 - canw, viewport.xmax = -3.0 + canw;
        viewport.ymin = -0.0 - canh, viewport.ymax = -0.0 + canh;
    }
    onresize();
    window.addEventListener("resize", onresize);
    
    // mouse interaction
    var mouseDown = false;
    canvas.addEventListener('pointerdown', function (event) {
        mouseDown = true;
    });
    window.addEventListener('pointerup', function (event) {
        mouseDown = false;
    });
    canvas.addEventListener('pointermove', function (event) {
        if (mouseDown) {
            renderer.viewport.rz -= 0.01 * event.movementX;
            renderer.viewport.rx += 0.01 * event.movementY;
        }
    });

}