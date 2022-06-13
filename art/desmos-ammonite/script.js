"use strict";

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
uniform float iThickness;
attribute vec4 aPosition;
attribute vec4 aDirection;
attribute vec4 aColor;
varying vec4 vColor;

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
    vec3 q01 = p01 + aDirection.xyz;
    vec4 p1 = mat * vec4(p01,1); p1 /= p1.w;
    vec4 q1 = mat * vec4(q01,1); q1 /= q1.w;
    vec4 pos = p1;
    vec2 dp = normalize(q1.xy - p1.xy);
    float ca = cos(aDirection.w), sa = sin(aDirection.w);
    pos.xy += iThickness*sc*(mat2(ca,sa,-sa,ca)*dp+0.15*dp);
    pos.z = 0.01*pos.z + 0.5;
    gl_Position = pos;

    // color
    vColor = clamp(aColor, 0.0, 1.0);
}
`;
const FS_STROKE = `precision highp float;
varying vec4 vColor;
void main() {
    gl_FragColor = vColor;
}
`;


// Math functions
const PI = Math.PI,
    cos = Math.cos, sin = Math.sin, asin = Math.asin, tanh = Math.tanh,
    sqrt = Math.sqrt, exp = Math.exp, pow = Math.pow,
    max = Math.max, min = Math.min, round = Math.round;
const k_fibonacci = 2.39996322973;  // 2*pi/1.618^2

function hash(x) {  // should be consistent on the CPU
    var y = sin(12.9898 * x + 4.0) * 43758.5453;
    return y < 0.0 ? y % 1.0 + 1.0 : y % 1.0;
}

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
    // h  = max(min(h, 360), 0) / 60;  // Desmos does this
    h = h / 60;
    var max = v, min = max - s * max;
    var r = min + (max - min) * hue2rgb(h + 2);
    var g = min + (max - min) * hue2rgb(h);
    var b = min + (max - min) * hue2rgb(h - 2);
    return [saturate(r), saturate(g), saturate(b)];
}

// Animation time
let timeStart = performance.now();
function tAnimate() {
    var t = 0.001 * (performance.now() - timeStart);
    return 0.5 * t;
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
        points: points,
        segments: segments,
        colors: colors
    }
}


// Hood
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
            function (u) { return funHood(u * u * u, v); },
            -1.0, 1.0, 32);
        segments = segments.concat(ss.segments);
        colors = colors.concat(ss.colors);
    }
    return {
        segments: segments,
        colors: colors
    };
}

// Tentacles
function funTentacle(i, n, t) {
    var p_a = [cos(k_fibonacci * i), sin(k_fibonacci * i)];
    var p = [sqrt(i / n) * p_a[0], sqrt(i / n) * p_a[1]];
    var l = 3 + 5 * hash(i + 0.1);
    var theta = 2.0 * PI * hash(i + 0.2);
    var a = (0.5 + 0.5 * hash(i + 0.3)) / sqrt(n);
    var f = 1 + 2 * hash(i + 0.4);
    var phi = 2 * PI * hash(i + 0.5);
    var v = 2 * PI * round(2 + 2 * hash(i + 0.6));
    var w = a * sin(2 * PI * f * t - (phi + v * tAnimate()));
    var x = -1 + l * t - 0.5 * p[1];
    var y0 = (1.5 + 1.2 * t * t) * (p[0] + cos(theta) * w);
    var z0 = (1.5 + 1.2 * t * t) * (p[1] + sin(theta) * w);
    var d_f = 0.5 + 0.5 * tanh(4 * (t - 0.4));
    var r_m = (1 - 6 * (t - 0.5) * exp(-12 * pow(t - 0.5 + 0.05 * sin(2 * PI * tAnimate()), 2)));
    r_m = [r_m * p_a[0], r_m * p_a[1]];
    var y = r_m[0] * (1 - d_f) + y0 * d_f;
    var z = r_m[1] * (1 - d_f) + z0 * d_f - 4 - 0.2 * t;
    return {
        pos: [x, y, z],
        color: hsv2rgb(30 * hash(i + 0.8), 0.7, 0.5)
    };
}
function generateTentacles() {
    const n_tentacles = 24;
    var segments = [], colors = [];
    for (var i = 1; i <= n_tentacles; i++) {
        var ss = segmentCurve(
            function (t) { return funTentacle(i, n_tentacles, t); },
            0.0, 1.0, 32);
        segments = segments.concat(ss.segments);
        colors = colors.concat(ss.colors);
    }
    return {
        segments: segments,
        colors: colors
    };
}

// Eyes
function funEye(i, n) {
    i = i - 0.5;
    var z = 2.0 * i / n - 1.0;
    var x = sqrt(1 - z * z) * cos(k_fibonacci * i);
    var y = sqrt(1 - z * z) * sin(k_fibonacci * i);
    var eyewhite = [0.7 + 0.3 * x, 1.4 + 0.1 * y, -3.4 + 0.25 * z];
    var eyeblack = [0.7 + 0.05 * x, 1.53 + 0.05 * y, -3.4 + 0.05 * z];
    return {
        eyewhite1: eyewhite,
        eyeblack1: eyeblack,
        eyewhite2: [eyewhite[0], -eyewhite[1], eyewhite[2]],
        eyeblack2: [eyeblack[0], -eyeblack[1], eyeblack[2]]
    };
}
function generateEyes() {
    const n_eye = 32;
    var res = [
        { points: new Array(n_eye), color: [120 / 255, 150 / 255, 150 / 255, 0.8] },
        { points: new Array(n_eye), color: [0, 0, 0, 0.5] },
        { points: new Array(n_eye), color: [70 / 255, 120 / 255, 120 / 255, 0.8] },
        { points: new Array(n_eye), color: [0, 0, 0, 0.5] },
    ];
    for (var i = 0; i < n_eye; i++) {
        var sp = funEye(i + 1, n_eye);
        res[0].points[i] = sp.eyewhite1;
        res[1].points[i] = sp.eyeblack1;
        res[2].points[i] = sp.eyewhite2;
        res[3].points[i] = sp.eyeblack2;
    }
    return res;
}

// Shell
function funShellPos(u, v) {
    var u1 = 2 * pow(1.0 - u, 0.3) - 1.0 + 0.03 * cos(2 * PI * v);
    var s = 0.5 * exp(1.5 * u1) * tanh(u1 + 1);
    var o = 1.8 + cos(2 * PI * v);
    var z = s * (cos(3 * PI * u1) * o + 0.05 * cos(40 * PI * u1));
    var x = -s * (sin(3 * PI * u1) * o + 0.05 * sin(40 * PI * u1));
    var y = s * (sin(2 * PI * v) + 0.05 * sin(10 * PI * v));
    return [x, y, z];
}
function funShellPosNGrad(u, v) {
    const h = 0.001;
    var u1 = funShellPos(u + h, v);
    var u0 = funShellPos(u - h, v);
    var v1 = funShellPos(u, v + h);
    var v0 = funShellPos(u, v - h);
    var du = [u1[0] - u0[0], u1[1] - u0[1], u1[2] - u0[2]];
    var dv = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
    var n = [
        du[1] * dv[2] - du[2] * dv[1],
        du[2] * dv[0] - du[0] * dv[2],
        du[0] * dv[1] - du[1] * dv[0]
    ];
    var m = 1.0 / sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
    return [m * n[0], m * n[1], m * n[2]];
}
function funShellAlbedo(u, v) {
    var u1 = 2 * pow(1.0 - u, 0.3) - 1.0 + 0.03 * cos(2 * PI * v);
    var cf1 = cos(150 * u1);
    var cf2 = cos(64 * u1) + 0.1;
    var ct = (cf1 + (cf2 - cf1) * (0.8 - 0.5 * tanh(1 - 3 * sin(v) * sin(v))) + 0.5 - 0.6 * cos(v)) * 8 + 0.5;
    var r0 = 0.8 - 0.2 * max(0, min(1, ct));
    var g0 = 0.7 - 0.4 * max(0, min(1, ct));
    var b0 = 0.6 - 0.4 * max(0, min(1, ct));
    return [r0, g0, b0];
}
function funShell(u, v) {
    var p = funShellPos(u, v);
    var n = funShellPosNGrad(u, v);
    var albedo = funShellAlbedo(u, v);
    var light = [0.5, 0.5, 1.0];
    var mlight = 1.0 / sqrt(light[0] * light[0] + light[1] * light[1] + light[2] * light[2]);
    light = [mlight * light[0], mlight * light[1], mlight * light[2]];
    var dif = max(n[0] * light[0] + n[1] * light[1] + n[2] * light[2], 0);
    var sh = pow(0.25 + 0.1 * n[1] + 0.7 * dif + 0.1 * pow(dif, 10), 1.3);
    var r = 0.85 * albedo[0] * sh;
    var g = 1.1 * albedo[1] * sh;
    var b = 1.2 * albedo[2] * sh;
    return {
        pos: [p[0], p[1], p[2] + 0.0],
        color: [r, g, b]
    };
}
function generateShell() {
    const m = 64, n = 24;
    var points = new Array((m + 1) * n);
    var colors = new Array((m + 1) * n);
    for (var i = 0; i <= m; i++) {
        for (var j = 0; j < n; j++) {
            var sample = funShell(i / m, j / n);
            points[i * n + j] = sample.pos;
            colors[i * n + j] = sample.color;
        }
    }
    var uSegs = new Array(m * n), uCols = new Array(m * n);
    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            var i0 = i * n + j, i1 = (i + 1) * n + j;
            uSegs[i0] = points[i0].concat(points[i1]);
            uCols[i0] = colors[i0];
        }
    }
    var vSegs = new Array((m + 1) * n), vCols = new Array((m + 1) * n);
    for (var i = 0; i <= m; i++) {
        for (var j = 0; j < n; j++) {
            var i0 = i * n + j, i1 = i * n + (j + 1) % n;
            vSegs[i0] = points[i0].concat(points[i1]);
            vCols[i0] = colors[i0];
        }
    }
    return {
        points: points,
        pcolors: colors,
        segments: uSegs.concat(vSegs),
        colors: uCols.concat(vCols)
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
    gl.bindBuffer(gl.ARRAY_BUFFER, renderer.buffers.positionBuffer);
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
}

// A general VBO drawing function that uses the stroke drawing program
// obj is returned by rasterLines() or rasterPoints()
function drawVbo(renderer, obj) {
    let vertexCount = obj.vertexCount,
        verts = obj.verts,
        dirs = obj.dirs,
        cols = obj.cols,
        indices = obj.indices,
        thickness = obj.radius;
    let gl = renderer.gl;
    let program = renderer.programs.strokeRenderer;
    gl.useProgram(program);

    // setup uniforms
    gl.uniform2f(gl.getUniformLocation(program, "iResolution"),
        renderer.viewport.iResolution[0], renderer.viewport.iResolution[1]);
    gl.uniform4f(gl.getUniformLocation(program, "iXyminmax"),
        renderer.viewport.xmin, renderer.viewport.ymin,
        renderer.viewport.xmax, renderer.viewport.ymax);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "transformMatrix"),
        false, calcMatrix(renderer.viewport));
    gl.uniform1f(gl.getUniformLocation(program, "iThickness"), thickness);

    // setup buffers
    function setVec3Buffer(attribName, numComponents) {
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
    let positionBuffer = renderer.buffers.positionBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    setVec3Buffer("aPosition", 4);
    let directionBuffer = renderer.buffers.directionBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, directionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dirs), gl.STATIC_DRAW);
    setVec3Buffer("aDirection", 4);
    let colorBuffer = renderer.buffers.colorBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cols), gl.STATIC_DRAW);
    setVec3Buffer("aColor", 4);
    let indiceBuffer = renderer.buffers.indiceBuffer;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
}

// Concatenate two objects passed to drawVbo
function concatObjects(obj1, obj2) {
    if (obj1.radius != obj2.radius)
        throw new Error("Unable to concatenate two objects with different radius.");
    var obj = {};
    obj.vertexCount = obj1.vertexCount + obj2.vertexCount;
    obj.verts = obj1.verts.concat(obj2.verts);
    obj.dirs = obj1.dirs.concat(obj2.dirs);
    obj.cols = obj1.cols.concat(obj2.cols);
    obj.indices = obj1.indices.concat(obj2.indices);
    for (var i = 0; i < obj2.indices.length; i++)
        obj.indices[obj1.indices.length + i] += obj1.verts.length / 4;
    obj.radius = obj1.radius;
    return obj;
}

// Convert line segments to triangles
// lines are passed as [[x1, y1, z1, x2, y2, z2], ...]
// colors are passed as [[r, g, b], ...]
function rasterLines(lines, colors) {
    let n = lines.length;
    let verts = new Array(16 * n).fill(0);
    let dirs = new Array(16 * n).fill(0);
    let cols = new Array(16 * n).fill(0.9);
    let indices = new Array(6 * n);
    for (var i = 0; i < n; i++) {
        var ai = 16 * i;
        for (var j = 0; j < 3; j++) {
            // positions
            verts[ai + j] = verts[ai + j + 4] = lines[i][j];
            verts[ai + j + 8] = verts[ai + j + 12] = lines[i][j + 3];
            // directions
            var dir = lines[i][j + 3] - lines[i][j];
            dirs[ai + j + 0] = dirs[ai + j + 4] = -dir;
            dirs[ai + j + 8] = dirs[ai + j + 12] = dir;
            // colors
            cols[ai + j] = cols[ai + j + 4] =
                cols[ai + j + 8] = cols[ai + j + 12] = colors[i][j];
        }
        dirs[ai + 3] = 0.5 * PI;
        dirs[ai + 7] = -0.5 * PI;
        dirs[ai + 11] = 0.5 * PI;
        dirs[ai + 15] = -0.5 * PI;
        if (colors[i].length > 3) {
            for (var j = 3; j < 16; j += 4)
                cols[ai + j] = colors[i][3];
        }
        // indices
        ai = 6 * i;
        var ti = 4 * i;
        indices[ai] = ti, indices[ai + 1] = ti + 1, indices[ai + 2] = ti + 2;
        indices[ai + 3] = ti, indices[ai + 4] = ti + 2, indices[ai + 5] = ti + 3;
    }
    return {
        vertexCount: 6 * n,
        verts: verts,
        dirs: dirs,
        cols: cols,
        indices: indices,
        radius: 0.05
    };
}

// Convert points to triangles
// points are passed as [[x, y, z], ...]
// colors are passed as [[r, g, b], ...]
function rasterPoints(points, colors, radius, connectLines = true) {

    // call drawLines() to draw lines connecting the points
    // if (connectLines) {
    //     let lines = new Array(points.length - 1);
    //     for (var i = 0; i + 1 < points.length; i++)
    //         lines[i] = points[i].concat(points[i + 1]);
    //     drawLines(renderer, lines, colors);
    // }

    // draw points
    let n = points.length;
    const m = 8;  // number of vertices of the polygon
    let verts = new Array(4 * m * n).fill(0);
    let dirs = new Array(4 * m * n).fill(0);
    let cols = new Array(4 * m * n).fill(0.9);
    let indices = new Array(3 * m * n);
    for (var i = 0; i < n; i++) {
        var ai = 4 * m * i;
        for (var j = 0; j < m; j++) {
            var aj = ai + 4 * j;
            for (var k = 0; k < 3; k++) {
                verts[aj + k] = points[i][k];
                dirs[aj + k] = [1, 0, 0][k];
                cols[aj + k] = colors[i][k];
            }
            if (colors[i].length > 3) cols[aj + 3] = colors[i][3];
            dirs[aj + 3] = 2 * PI * j / m;
        }
        // indices
        ai = 3 * m * i;
        for (var j = 0; j < m; j++) {
            var aj = ai + 3 * j;
            indices[aj + 0] = m * i;
            indices[aj + 1] = m * i + j;
            indices[aj + 2] = m * i + (j + 1) % m;
        }
    }
    return {
        vertexCount: 3 * m * n,
        verts: verts,
        dirs: dirs,
        cols: cols,
        indices: indices,
        radius: radius
    };
}


// Layout the scene
function Scene() {
    // static parts
    let shell = generateShell();
    this.shellPoints = rasterPoints(shell.points, shell.pcolors, 0.15);
    this.shellLines = rasterLines(shell.segments, shell.colors);
    let eyes = generateEyes();
    this.eyePoints = null;
    for (var i = 0; i < 4; i++) {
        var colors = new Array(eyes[i].points.length).fill(eyes[i].color);
        var obj = rasterPoints(eyes[i].points, colors, 0.2, true);
        if (this.eyePoints == null) this.eyePoints = obj;
        else this.eyePoints = concatObjects(this.eyePoints, obj);
    }
    this.axesLines = rasterLines([
        [0, 0, 0, 10, 0, 0],
        [0, 0, 0, 0, 10, 0],
        [0, 0, 0, 0, 0, 10]
    ], [[1, 0, 0], [0, 0.5, 0], [0, 0, 1]]);

    // moving parts
    this.update = function () {
        let tentacles = generateTentacles();
        this.tentacleLines = rasterLines(tentacles.segments, tentacles.colors);
        let hood = generateHood();
        this.hoodLines = rasterLines(hood.segments, hood.colors);
    };
    this.update();

    // draw function
    this.draw = function (renderer) {
        let canvas = renderer.canvas;
        let gl = renderer.gl;

        // clear the canvas
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(-1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // background
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        gl.colorMask(true, true, true, true);
        drawBackground(renderer);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.colorMask(true, true, true, false);

        // shell
        drawVbo(renderer, this.shellPoints);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.GEQUAL);
        drawVbo(renderer, this.shellLines);

        // body parts
        drawVbo(renderer, this.tentacleLines);
        drawVbo(renderer, this.hoodLines);
        drawVbo(renderer, this.eyePoints);

        // axes
        if (0) drawVbo(renderer, this.axesLines);
    };
}


// Main
window.onload = function () {

    // load WebGL
    var webgl_failed = function (error) {
        console.error(error);
        document.write("<h1 style='color:red;'>Error: " + error + "</h1>");
    };
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false
    });
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
        buffers: {
            positionBuffer: gl.createBuffer(),
            directionBuffer: gl.createBuffer(),
            colorBuffer: gl.createBuffer(),
            indiceBuffer: gl.createBuffer(),
        }
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

    let scene = new Scene();
    function render_main() {
        try {
            scene.update();
            scene.draw(renderer);
        } catch (e) {
            webgl_failed(e);
            return;
        }
        requestAnimationFrame(render_main);
    }
    requestAnimationFrame(render_main);

    // window resize
    function initResize() {
        let viewport = renderer.viewport;
        let w = window.innerWidth, h = window.innerHeight;
        canvas.width = viewport.iResolution[0] = w, canvas.style.width = w + "px";
        canvas.height = viewport.iResolution[1] = h, canvas.style.height = h + "px";
        let cx = -3.5, cy = -1.8, sc = 9.0;
        var canw, canh;
        if (w < 0.8 * h) canw = sc, canh = canw * h / w;
        else canh = 0.8 * sc, canw = canh * w / h;
        viewport.xmin = cx - canw, viewport.xmax = cx + canw;
        viewport.ymin = cy - canh, viewport.ymax = cy + canh;
    }
    function onResize() {
        let viewport = renderer.viewport;
        let oldW = viewport.iResolution[0], oldH = viewport.iResolution[1];
        let w = window.innerWidth, h = window.innerHeight;
        canvas.width = viewport.iResolution[0] = w, canvas.style.width = w + "px";
        canvas.height = viewport.iResolution[1] = h, canvas.style.height = h + "px";
        let cx = 0.5 * (viewport.xmin + viewport.xmax),
            cy = 0.5 * (viewport.ymin + viewport.ymax);
        // var sc = sqrt(oldW * oldH) / sqrt(w * h);
        var sc = min(oldW, oldH) / min(w, h);
        var canw = 0.5 * (viewport.xmax - viewport.xmin) * sc * (w / oldW),
            canh = 0.5 * (viewport.ymax - viewport.ymin) * sc * (h / oldH);
        viewport.xmin = cx - canw, viewport.xmax = cx + canw;
        viewport.ymin = cy - canh, viewport.ymax = cy + canh;
    }
    initResize();
    window.addEventListener("resize", onResize);

    // mouse interaction
    var mouseDown = false;
    var fingerDist = -1;
    canvas.addEventListener('pointerdown', function (event) {
        canvas.setPointerCapture(event.pointerId);
        mouseDown = true;
    });
    window.addEventListener('pointerup', function (event) {
        event.preventDefault();
        mouseDown = false;
    });
    canvas.addEventListener('pointermove', function (event) {
        if (mouseDown) {
            var k = fingerDist > 0. ? 0.0001 : 0.01;
            renderer.viewport.rz -= k * event.movementX;
            renderer.viewport.rx += k * event.movementY;
        }
    });
    function zoomIn(scrX, scrY, sc) {
        let viewport = renderer.viewport;
        var x = viewport.xmin + (viewport.xmax - viewport.xmin) * (scrX / viewport.iResolution[0]);
        var y = viewport.ymin + (viewport.ymax - viewport.ymin) * (1.0 - scrY / viewport.iResolution[1]);
        viewport.xmax = x + (viewport.xmax - x) * sc;
        viewport.ymax = y + (viewport.ymax - y) * sc;
        viewport.xmin = x + (viewport.xmin - x) * sc;
        viewport.ymin = y + (viewport.ymin - y) * sc;
    }
    canvas.addEventListener("wheel", function (event) {
        var sc = Math.exp(-0.0005 * event.wheelDeltaY);
        zoomIn(event.clientX, event.clientY, sc);
    }, { passive: true });
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
                var sc = Math.max(Math.min(fingerDist / newFingerDist, 2.0), 0.5);
                var scrX = 0.5 * (fingerPos0[0] + fingerPos1[0]);
                var scrY = 0.5 * (fingerPos0[1] + fingerPos1[1]);
                zoomIn(scrX, scrY, sc);
            }
            fingerDist = newFingerDist;
        }
    }, { passive: true });

}