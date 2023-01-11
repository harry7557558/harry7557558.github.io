/**************** Basic Linear Algebra ****************/
const sin = Math.sin, cos = Math.cos, atan = Math.atan,
    sqrt = Math.sqrt, pow = Math.pow;
function dot(u, v) { return u[0] * v[0] + u[1] * v[1] + u[2] * v[2]; }
function cross(u, v) { return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; }
function veclength(v) { return sqrt(dot(v, v)); }
function vecadd(u, v) { return [u[0] + v[0], u[1] + v[1], u[2] + v[2]]; }
function vecsub(u, v) { return [u[0] - v[0], u[1] - v[1], u[2] - v[2]]; }
function vecmul(v, a) { return [v[0] * a, v[1] * a, v[2] * a]; }
function normalize(v) { return vecmul(v, 1.0 / veclength(v)); }
function matvecmul(m, v) {
    return [m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]];
}
function matmul(m, n) {
    return [[m[0][0] * n[0][0] + m[0][1] * n[1][0] + m[0][2] * n[2][0], m[0][0] * n[0][1] + m[0][1] * n[1][1] + m[0][2] * n[2][1], m[0][0] * n[0][2] + m[0][1] * n[1][2] + m[0][2] * n[2][2]],
    [m[1][0] * n[0][0] + m[1][1] * n[1][0] + m[1][2] * n[2][0], m[1][0] * n[0][1] + m[1][1] * n[1][1] + m[1][2] * n[2][1], m[1][0] * n[0][2] + m[1][1] * n[1][2] + m[1][2] * n[2][2]],
    [m[2][0] * n[0][0] + m[2][1] * n[1][0] + m[2][2] * n[2][0], m[2][0] * n[0][1] + m[2][1] * n[1][1] + m[2][2] * n[2][1], m[2][0] * n[0][2] + m[2][1] * n[1][2] + m[2][2] * n[2][2]]];
}
function muladd(m, p, v) {
    return [m[0][0] * p[0] + m[0][1] * p[1] + m[0][2] * p[2] + v[0], m[1][0] * p[0] + m[1][1] * p[1] + m[1][2] * p[2] + v[1], m[2][0] * p[0] + m[2][1] * p[1] + m[2][2] * p[2] + v[2]];
}
function toAffine(m) {
    return [[m[0][0], m[0][1], m[0][2], 0], [m[1][0], m[1][1], m[1][2], 0], [m[2][0], m[2][1], m[2][2], 0], [0, 0, 0, 1]];
}
function affinemul(M, N) {
    var R = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    for (var m = 0; m < 4; m++) for (var n = 0; n < 4; n++) {
        for (var i = 0; i < 4; i++) R[m][n] += M[m][i] * N[i][n];
    }
    return R;
}
function affinevecmul(M, v) {
    var m = M[3][0] * v[0] + M[3][1] * v[1] + M[3][2] * v[2] + M[3][3];
    v = [(M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2] + M[0][3]) / m,
    (M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2] + M[1][3]) / m,
    (M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2] + M[2][3]) / m];
    return v;
}


/**************** Basic Formatting ****************/

function $(s) { return document.getElementById(s); }

function num2str(n, d) {
    const S_NEG = "−";
    if (n instanceof Complex) {
        var r = num2str(n.re, d);
        var i = num2str(n.im, d);
        if (i == "0") return r;
        if (r == "0") return i + "i";
        if (i.match(S_NEG))
            return r + S_NEG + i.replace(S_NEG, "") + "i";
        else return r + "+" + i + "i";
    }
    if (typeof n == "object") {
        var v = [];
        for (var i = 0; i < n.length; i++)
            v.push(num2str(n[i], d));
        return "(" + v.join(", ") + ")";
    }
    if (isNaN(0 * n)) return "<span style='color:gray'>#</span>";
    var s = "";
    var e = Math.pow(.1, d);
    if (n * n < .25 * e * e) return "0";
    if (n < 0) s = S_NEG, n = -n;
    n += .5 * e;
    var k = [], m = Math.floor(n);
    while (m * m > e * e) {
        k.push(m % 10);
        m = Math.floor(m / 10);
    }
    if (k.length == 0) k.push(0);
    while (k.length != 0) {
        s += k[k.length - 1];
        k.pop();
    }
    m = n - Math.floor(n);
    s += ".";
    for (var i = 0; i < d; i++) {
        m = (10 * m) % 10;
        s += Math.floor(m);
    }
    while (s[s.length - 1] == '0') s = s.substr(0, s.length - 1);
    if (s[s.length - 1] == '.') s = s.substr(0, s.length - 1);
    return s;
}

// shareable link via URL hash
function exportShareableHash() {
    var res = {};
    // matrix
    var mat = "";
    var n = is3x3() ? 3 : 4;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            var v = $("_" + i + j).value;
            mat += encodeURIComponent(v);
            if (j != n - 1) mat += ",";
        }
        if (i != n - 1) mat += ";";
    }
    res['m'] = mat;
    // model
    res['g'] = $("model").value;
    res['s'] = $("scale").value;
    // visualization toggles
    var toggles = document.getElementsByClassName('toggle');
    for (var i = 0; i < toggles.length; i++) {
        var id = toggles[i].id.split('-');
        id = id[0][0] + id[1][0];
        if (!toggles[i].classList.contains("toggled"))
            res[id] = '0';
    }
    // put them together
    var s = [];
    for (var key in res)
        s.push(key + "=" + res[key]);
    return "#" + s.join('&');
}

function copyShareableLink() {

    // https://stackoverflow.com/a/30810322
    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            alert('Link copy was ' + msg);
        } catch (err) {
            alert('Error copying link: ', err);
        }
        document.body.removeChild(textArea);
    }
    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            alert('Link copied to clipboard');
        }, function (err) {
            alert('Error copying link: ', err);
        });
    }

    var link = window.location.href;
    if (link.search('#', 0) != -1)
        link = link.substring(0, link.search('#', 0));
    link = link + exportShareableHash();
    copyTextToClipboard(link);
}

// attempt to parse a user-input 4x4 matrix
// components will be strings, not numbers
function parseUserInputMatrix(s) {
    var m = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    s = s.replace(/^[\;\,\s]+/, '');
    s = s.replace(/[\;\,\s]+$/, '');
    s = s.split(';');
    for (var i = 0; i < s.length && i < 4; i++) {
        var r = s[i].split(',');
        for (var j = 0; j < r.length && j < 4; j++)
            m[i][j] = r[j];
    }
    return m;
}

var UrlHash = {};
function updateParametersFromHash() {
    // get hash
    try {
        UrlHash = document.location.hash.replace('#', '');
        UrlHash = UrlHash.split('&').reduce(function (res, s) {
            s = s.split('=');
            res[s[0]] = decodeURIComponent(s[1]);
            return res;
        }, {});
    } catch (e) {
        console.error(e);
    }
    document.location.hash = '';
    // matrix
    if (UrlHash.hasOwnProperty('m')) {
        var mat = parseUserInputMatrix(UrlHash['m']);
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                $('_' + i + j).value = mat[i][j];
    }
    // model
    if (UrlHash.hasOwnProperty('g'))
        $("model").value = UrlHash['g'];
    if (UrlHash.hasOwnProperty('s'))
        $("scale").value = UrlHash['s'];
    // visualization toggles
    var toggles = document.getElementsByClassName('toggle');
    for (var i = 0; i < toggles.length; i++) {
        var id = toggles[i].id.split('-');
        id = id[0][0] + id[1][0];
        if (UrlHash.hasOwnProperty(id) && UrlHash[id] === '0')
            toggles[i].classList.remove('toggled');
    }
}


/**************** Matrix Input ****************/

var Mat = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
var Det2 = 1, Det3 = 1, Det4 = 1;
var Eig3 = [
    [1, [1, 0, 0], true],
    [1, [0, 1, 0], true],
    [1, [0, 0, 1], true]
];
var Eig4 = [
    [1, [1, 0, 0, 0]],
    [1, [0, 1, 0, 0]],
    [1, [0, 0, 1, 0]],
    [1, [0, 0, 0, 1]]
];

function is3x3() {
    for (var i = 0; i < 3; i++)
        if (Mat[3][i] != 0 || Mat[i][3] != 0)
            return false;
    if (Mat[3][3] != 1)
        return false;
    return true;
}

// calculating determinants
function calcDet() {
    var MS = new MatrixS(4);
    MS.v = Mat;
    Det2 = MS.resize(2).determinant().re;
    $("det2").innerHTML = "det<sub>2×2</sub> = " + num2str(Det2, 8);
    Det3 = MS.resize(3).determinant().re;
    $("det3").innerHTML = "det<sub>3×3</sub> = " + num2str(Det3, 8);
    Det4 = MS.determinant().re;
    $("det4").innerHTML = "det<sub>4×4</sub> = " + num2str(Det4, 8);
    $("det4").style.display = is3x3() ? "none" : "block";
}
function calcEigen() {
    var MS = new MatrixS(4);
    MS.v = Mat;
    try {
        Eig3 = MS.resize(3).eigs();
        Eig4 = MS.eigs();
    } catch (e) {
        console.error(e);
        $("eigens").title = e;
        $("eigens").innerHTML = "<div class='eigenvals' style='color:orange'>failed to compute eigenpairs</span></div>";
        return;
    }
    if (is3x3()) $("eigens").title = "Eigenpairs of the 3×3 matrix";
    else $("eigens").title = "Eigenpairs of the 4×4 matrix";
    $("eigens").innerHTML = "";
    var eig = is3x3() ? Eig3 : Eig4;
    for (var i = 0; i < eig.length; i++) {
        var showEig = Math.abs(eig[i][0].im) < 1e-6 &&
            (is3x3() || eig[i][1][3].abs() < 1e-6) && is3x3();
        eig[i].push(showEig);
        var opacity = " style='opacity:" + (showEig ? 1.0 : 0.7) + "'";
        var val = num2str(eig[i][0], 6);
        var vec = num2str(eig[i][1], 3);
        $("eigens").innerHTML += "<div class='eigenvals'" + opacity + ">λ<sub>" + (i + 1) + "</sub> = " + val + "</div>";
        $("eigens").innerHTML += "<div class='eigenvecs'" + opacity + ">ξ<sub>" + (i + 1) + "</sub> = " + vec + "</div>";
    }
}

// initialize matrix
function initMat() {
    var mi = $("matrix-input");
    var mat = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    // mat = [[0, -1, 0, 0], [1, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    // mat = [[-2, 0, -1, 2], [1, -2, 0, 1], [0, 0, -4, 0], [0, 0, 0, -2]];
    // mat = [[0, -2, 0, 0], [3, 0, -1, 0], [0, -1, 0, 0], [0, 0, 0, 1]];
    // mat[3] = [0, 1, 0, 1];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            mi.innerHTML += "<input class='ele' id='_" + i + j + "' value='" + mat[i][j] + "' style='background-color:" +
                (i == 3 ? (j == 3 ? "PaleGoldenRod" : "LightSalmon") : (j == 3 ? "PaleGreen" : "SkyBlue")) + ";' spellcheck='false' autocomplete='off' autocorrect='off' oninput='getMat()'/>";
        }
        mi.innerHTML += "<br/>";
    }
    getMat();
}

// get matrix input
function getMat() {
    var matrix = $("matrix-input");
    var ele = matrix.getElementsByClassName("ele");
    var R = true;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var tm = ele[4 * i + j];
            if (MATHJS_LOADED) {
                // support expressions like "sqrt(3)/2"
                try {
                    var t = math.eval(tm.value);
                    if (isNaN(0 * t)) throw (t);
                    Mat[i][j] = t;
                    tm.style.borderColor = "White";
                } catch (d) {
                    tm.style.borderColor = "Red";
                    R = false;
                }
            }
            else {
                var t = Number(tm.value);
                if (isNaN(0 * t) || tm.value.length == 0) tm.style.borderColor = "Red", R = false;
                else Mat[i][j] = t, tm.style.borderColor = "White";
            }
        }
    }
    if (!R) return;
    redraw();
    return R;
}


/**************** Models ****************/

function decodeModelMatrix(s, isNumeric = true) {
    var rows = s.split(';');
    for (var i = 0; i < rows.length; i++) {
        rows[i] = rows[i].replaceAll(',', ' ').split(' ');
        if (isNumeric) rows[i] = rows[i].map(x => Number(x));
    }
    return rows;
}

// models for previewing transform
var MODELS = {
    "list": [],
    "frame": {
        "vertices": decodeModelMatrix("-1,-1,-1;-1,1,-1;1,1,-1;1,-1,-1;-1,-1,1;-1,1,1;1,1,1;1,-1,1"),
        "edges": decodeModelMatrix("0,1;1,2;0,3;2,3;0,4;1,5;2,6;3,7;4,5;5,6;4,7;6,7")
    }
};
function initModels() {
    var req = new XMLHttpRequest();
    var nocache = new String(Math.floor(Date.now() / 3600000));
    req.open("GET", "matrixv/models.json?nocache=" + nocache);
    req.onload = function () {
        if (this.status != 200) {
            alert("Failed to load models.");
            return;
        }
        var content = JSON.parse(req.response);
        for (var i = 0; i < content.length; i++) {
            // add model to list
            var model = content[i];
            MODELS.list.push(model.name);
            MODELS[model.name] = {};
            MODELS[model.name].vertices = decodeModelMatrix(model.vertices);
            MODELS[model.name].edges = decodeModelMatrix(model.edges);
            // add model to selector
            var option = document.createElement("option");
            option.value = model.name;
            option.innerHTML = model.name;
            if (model.name == UrlHash['g'])
                option.selected = true;
            $("model").appendChild(option);
        }
        redraw();
    };
    req.onerror = function () {
        alert("Failed to load models.");
    };
    req.send();
}

// scaling of the models
function initModelScale() {
    var defaultScale = 2.0;
    let scales = [0.1, 0.2, 0.5, 1, 2, 2.5, 3, 4, 5, 8, 10];
    for (var i = 0; i < scales.length; i++) {
        var option = document.createElement("option");
        option.value = scales[i];
        option.innerHTML = scales[i] + "×";
        if (scales[i] == defaultScale)
            option.selected = true;
        $("scale").appendChild(option);
    }
    if (UrlHash.hasOwnProperty('s')) {
        $("scale").value = UrlHash['s'];
        Scale /= Number(UrlHash['s'] / defaultScale);
    }
}


/**************** Rendering ****************/

function isToggled(id) {
    return $("toggle-" + id).classList.contains("toggled");
}

function redrawGraphics() {
    let canvas = $("canvas");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(16,20,23)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // calculate transformation matrix
    var rx = Rx, rz = Rz; if (Is2D) rx = rz = 0.0;
    var M = matmul([[1, 0, 0], [0, cos(rx), -sin(rx)], [0, sin(rx), cos(rx)]],
        [[cos(rz), -sin(rz), 0], [sin(rz), cos(rz), 0], [0, 0, 1]]);
    M = toAffine(M);
    if (!Is2D) {
        const p = .0000 * Scale;  // doesn't make it better
        M = affinemul([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, -p, 1]], M);
    }
    M = affinemul([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1. / Scale]], M);

    // calculate the position of the origin on screen
    var win_w = canvas.width, win_h = canvas.height;
    var control = $("control"),
        ctr_w = Math.min(control.offsetWidth + 20, win_w), ctr_h = Math.min(control.offsetHeight + 20, win_h);
    var Center = [win_w * win_w * win_h - ctr_w * ctr_w * ctr_h, win_w * win_h * win_h - ctr_w * ctr_h * ctr_h];
    var A = 0.5 / (win_w * win_h - ctr_w * ctr_h);
    Center[0] *= A, Center[1] *= A; Center[1] = Center[1];
    M = affinemul([[1, 0, 0, Center[0]], [0, -1, 0, Center[1]], [0, 0, 1, 0], [0, 0, 0, 1]], M);

    function drawLine(p1_, p2_, recurseRemain = 12) {
        var isInitialCall = (recurseRemain == 12);
        var p1 = affinevecmul(M, p1_);
        var p2 = affinevecmul(M, p2_);
        // check break due to perspective
        var pm_ = vecadd(vecmul(p1_, 0.5), vecmul(p2_, 0.5));
        var pm = affinevecmul(M, pm_);
        p1 = [p1[0], p1[1]], p2 = [p2[0], p2[1]], pm = [pm[0], pm[1]];
        var isOnScreen = (p) =>
            p[0] >= 0 && p[0] <= canvas.width &&
            p[1] >= 0 && p[1] <= canvas.height;
        isOnScreen = isOnScreen(p1) || isOnScreen(p2) || isOnScreen(pm);
        // start line
        if (isInitialCall) {
            if (!isOnScreen) return;
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
        }
        var vecdiff = (u, v) =>
            Math.hypot(u[0] - v[0], u[1] - v[1]);
        var shortEnough1 = (vecdiff(p1, pm) < 10);
        var shortEnough2 = (vecdiff(pm, p2) < 10);
        if (recurseRemain == 0 && !(shortEnough1 && shortEnough2) || !isOnScreen) {
            // break line
            ctx.lineTo(p1[0], p1[1]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p2[0], p2[1]);
            if (!isOnScreen) return;
        }
        else {
            // recursively divide line
            if (!shortEnough1) drawLine(p1_, pm_, recurseRemain - 1);
            if (!shortEnough2) drawLine(pm_, p2_, recurseRemain - 1);
        }
        // end line
        if (isInitialCall) {
            ctx.lineTo(p2[0], p2[1]);
            ctx.closePath();
            ctx.stroke();
        }
    }
    function drawTriangle(p1, p2, p3) {
        p1 = affinevecmul(M, p1);
        p2 = affinevecmul(M, p2);
        p3 = affinevecmul(M, p3);
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.lineTo(p3[0], p3[1]);
        ctx.closePath();
        ctx.stroke();
    }
    function drawVector(d) {
        var p0 = affinevecmul(M, [0, 0, 0]);
        var p1 = affinevecmul(M, d);
        var dp = vecsub(p1, p0), pm = sqrt(dp[0] * dp[0] + dp[1] * dp[1]);
        if (!(pm >= 1.0)) return;
        var ang = Math.atan2(dp[1], dp[0]), da = 0.3;
        var h = 10 * Math.min(Math.abs(pm / dp[2]), 1);
        ctx.beginPath();
        ctx.moveTo(p0[0], p0[1]);
        ctx.lineTo(p1[0], p1[1]);
        ctx.moveTo(p1[0] - h * cos(ang - da), p1[1] - h * sin(ang - da));
        ctx.lineTo(p1[0], p1[1]);
        ctx.lineTo(p1[0] - h * cos(ang + da), p1[1] - h * sin(ang + da));
        ctx.closePath();
        ctx.stroke();
    }

    // perspective clipping
    var scale = Number($("scale").value);
    var nCut = Mat[3].slice(0, 3), dCut = Mat[3][3];
    function isClipped(p1, p2) {
        var d1 = dot(nCut, p1) * scale + dCut;
        var d2 = dot(nCut, p2) * scale + dCut;
        return d1 * d2 <= 1e-12;
    }
    function clipSegment(p1, p2) {
        p1 = vecmul(p1, scale), p2 = vecmul(p2, scale);
        var pd = vecsub(p2, p1);
        // p(t) = p1 + pd t
        // dot(n, p1) + dot(n, pd) t + d = 0
        // t = (-d - dot(n, p1)) / dot(n, pd)
        var t = (-dCut - dot(nCut, p1)) / dot(nCut, pd);
        return vecadd(p1, vecmul(pd, t));
    }
    function clipCube() {
        // get points
        var vertices = MODELS.frame.vertices;
        var edges = MODELS.frame.edges;
        var points = [];
        for (var i = 0; i < edges.length; i++) {
            var p1 = vertices[edges[i][0]];
            var p2 = vertices[edges[i][1]];
            if (!isClipped(p1, p2)) continue;
            var p = clipSegment(p1, p2);
            var already = false;
            for (var k = 0; k < points.length; k++)
                if (veclength(vecsub(p, points[k])) < 1e-6) {
                    already = true; break;
                }
            if (!already) points.push(p);
        }
        // get the convex hull
        var segments = [];
        for (var i = 0; i < points.length; i++)
            for (var j = 0; j < i; j++) {
                var p1 = points[i], p2 = points[j];
                var n = cross(vecsub(p2, p1), normalize(nCut));
                var mind = 0.0, maxd = 0.0;
                for (var k = 0; k < points.length; k++) {
                    var d = dot(points[k], n) - dot(p1, n);
                    mind = Math.min(mind, d), maxd = Math.max(maxd, d);
                }
                if (mind * maxd > -1e-10)
                    segments.push([p1, p2]);
            }
        return segments;
    }

    function drawView(cx, cy, cz, cf, cc_good, cc_cut) {
        // Axes with arrows
        ctx.strokeStyle = cx;
        var s = 3.0 * scale;
        var al = 1.08 * s, aw = 0.03 * s;
        drawLine([-s, 0, 0], [s, 0, 0]);
        drawTriangle([al, 0, 0], [s, aw, 0], [s, -aw, 0]);
        ctx.strokeStyle = cy;
        drawLine([0, -s, 0], [0, s, 0]);
        drawTriangle([0, al, 0], [aw, s, 0], [-aw, s, 0]);
        ctx.strokeStyle = cz;
        drawLine([0, 0, -s], [0, 0, s]);
        drawTriangle([0, 0, al], [aw, 0, s], [-aw, 0, s]);

        var lines = [];

        function addModel(model, color) {
            var vertices = model.vertices;
            var edges = model.edges;
            for (var i = 0; i < edges.length; i++) {
                var p1 = vecmul(vertices[edges[i][0]], scale);
                var p2 = vecmul(vertices[edges[i][1]], scale);
                lines.push([p1, p2, color]);
            }
        }

        // object
        var obj = $("model").value;
        if (MODELS.hasOwnProperty(obj)) {
            var model = MODELS[obj];
            var edges_good = [], edges_cut = [];
            if (isToggled("breakline")) {
                for (var i = 0; i < model.edges.length; i++) {
                    var p1 = model.vertices[model.edges[i][0]];
                    var p2 = model.vertices[model.edges[i][1]];
                    if (isClipped(p1, p2)) edges_cut.push(model.edges[i]);
                    else edges_good.push(model.edges[i]);
                }
                addModel({ vertices: model.vertices, edges: edges_good }, cc_good);
                if (cc_good != cc_cut)
                    addModel({ vertices: model.vertices, edges: edges_cut }, cc_cut);
            }
            else addModel(model, cc_good);
        }

        // frame
        if (isToggled("frame"))
            addModel(MODELS.frame, cf);

        // draw lines
        for (var i = 0; i < lines.length; i++) {
            var c = vecmul(vecadd(lines[i][0], lines[i][1]), 0.5);
            var z = affinevecmul(M, c)[2];
            lines[i].push(z);
        }
        lines.sort((a, b) => a[3] - b[3]);
        var t0 = performance.now();
        for (var i = 0; i < lines.length; i++) {
            ctx.strokeStyle = lines[i][2];
            drawLine(lines[i][0], lines[i][1]);
        }
        var t1 = performance.now();
        // console.log(t1 - t0);
    };

    // reference object
    ctx.lineWidth = 1;
    drawView("rgb(192,128,128)", "rgb(64,96,64)", "rgb(128,128,232)",
        "rgb(255,192,128)", "rgb(128,128,128)", "rgb(64,180,100)");

    // cut
    if (isToggled("breakline")) {
        var segs = clipCube();
        ctx.strokeStyle = "#5ac";
        for (var i = 0; i < segs.length; i++)
            drawLine(segs[i][0], segs[i][1]);
    }

    // transformed object
    var M_old = M;
    M = affinemul(M, Mat);
    ctx.lineWidth = 1;
    drawView("rgb(255,0,0)", "rgb(0,160,0)", "rgb(0,64,255)",
        "rgb(255,160,0)", "rgb(255,255,128)", "rgb(255,255,128)"
        //"rgb(160,255,160)"
    );
    M = M_old;

    // eigenvectors - note that now the matrix is transformed
    if (isToggled('eigens')) {
        var cZero = 'rgba(128,192,128,0.8)',
            cPositive = 'rgba(255,0,255,0.8)',
            cNegative = 'rgba(0,192,255,0.7)';
        var vectors = [];
        var eig = is3x3() ? Eig3 : Eig4;
        for (var i = 0; i < eig.length; i++) {
            if (!eig[i][2]) continue;
            var l = scale * toReal(eig[i][0]) / Mat[3][3];
            var color = l > 0 ? cPositive : cNegative;
            if (Math.abs(l) < 1e-6) l = 0.5 * scale, color = cZero;
            var v = vecmul(normalize(toReal(eig[i][1].slice(0, 3))), l);
            var order = affinevecmul(M, v)[2];
            vectors.push([v, color, order]);
        }
        vectors.sort((a, b) => a[2] - b[2]);
        for (var i = 0; i < vectors.length; i++) {
            ctx.lineWidth = 5;
            ctx.strokeStyle = vectors[i][1];
            drawVector(vectors[i][0]);
        }
    }

    return;
}

function redraw() {
    // render text
    var display = "none";
    if (isToggled('eigens')) {
        calcDet();
        calcEigen();
        display = "block";
    }
    $("determinant").style.display = display;
    $("eigens").style.display = display;
    var hrs = $("control").getElementsByTagName("hr");
    for (var i = 0; i < hrs.length; i++)
        hrs[i].style.display = display;
    // render graphics
    setTimeout(redrawGraphics, 0);
}


/**************** Interaction ****************/

var MouseDown = false, FingerDist = -1.0;
var Is2D = false;  // if is in 2d view
var Cursor = [NaN, NaN], PrevCursor = [NaN, NaN];
var Rx = -1.3, Rz = -0.55;
function initCanvasAttitudes() {
    let canvas = $("canvas");
    canvas.style.touchAction = "none";
    canvas.addEventListener('pointerdown', function (event) {
        canvas.setPointerCapture(event.pointerId);
        MouseDown = true;
        PrevCursor = [event.clientX, canvas.height - event.clientY];
    });
    window.addEventListener('pointerup', function (event) {
        event.preventDefault();
        MouseDown = false;
        PrevCursor = [NaN, NaN];
    });
    canvas.addEventListener('pointermove', function (event) {
        event.preventDefault();
        if (FingerDist >= 0.0) return;
        Cursor = [event.clientX, canvas.height - event.clientY];
        if (MouseDown && !Is2D) {	// click and drag to rotate the view
            var dx = Cursor[0] - PrevCursor[0], dy = PrevCursor[1] - Cursor[1];
            dx /= 100, dy /= 120;
            Rx += dy, Rz += dx;
            redraw();
            PrevCursor = Cursor;
        }
    });
    function zoomIn(d) {
        const MAX = 500000, MIN = 0.01;
        if (Scale * d > MAX) d = MAX / Scale;
        else if (Scale * d < MIN) d = MIN / Scale;
        Scale *= d;
    }
    canvas.addEventListener("wheel", function (event) {
        zoomIn(Math.exp(-0.0005 * event.deltaY));
        redraw();
    }, { passive: true });
    canvas.addEventListener("touchstart", function (event) {
        if (event.touches.length == 2) {
            var fingerPos0 = [event.touches[0].pageX, event.touches[0].pageY];
            var fingerPos1 = [event.touches[1].pageX, event.touches[1].pageY];
            FingerDist = Math.hypot(fingerPos1[0] - fingerPos0[0], fingerPos1[1] - fingerPos0[1]);
        }
    }, { passive: true });
    canvas.addEventListener("touchend", function (event) {
        FingerDist = -1.0;
    }, { passive: true });
    canvas.addEventListener("touchmove", function (event) {
        if (event.touches.length == 2) {
            var fingerPos0 = [event.touches[0].pageX, event.touches[0].pageY];
            var fingerPos1 = [event.touches[1].pageX, event.touches[1].pageY];
            var newFingerDist = Math.hypot(fingerPos1[0] - fingerPos0[0], fingerPos1[1] - fingerPos0[1]);
            if (FingerDist > 0. && newFingerDist > 0.) {
                var sc = Math.max(Math.min(FingerDist / newFingerDist, 2.0), 0.5);
                zoomIn(1.0 / sc);
                redraw();
            }
            FingerDist = newFingerDist;
        }
    }, { passive: true });
}

var PreviousWindowSize, Scale;
function resizeCanvas() {
    let canvas = $("canvas");
    var w = Math.floor(window.innerWidth), h = Math.floor(window.innerHeight);
    var prevw = PreviousWindowSize[0], prevh = PreviousWindowSize[1];
    //Scale *= Math.sqrt((w * h) / (prevw * prevh));
    //Scale *= Math.min(w, h) / Math.min(prevw, prevh);
    Scale *= 0.5 * (Math.sqrt((w * h) / (prevw * prevh)) + Math.min(w, h) / Math.min(prevw, prevh));
    PreviousWindowSize = [w, h];
    if ((canvas.width !== w) || (canvas.height !== h)) {
        canvas.width = w, canvas.height = h;
        canvas.style.width = w + "px", canvas.style.height = h + "px";
    }
    redraw();
}
window.addEventListener("load", function () {
    // init geometry
    initMat();
    updateParametersFromHash();
    window.addEventListener("hashchange", function (event) {
        var oldHash = event.oldURL.slice((event.oldURL + '#').search('#'));
        var newHash = event.newURL.slice((event.newURL + '#').search('#'));
        if (oldHash != newHash && newHash != '#') {
            updateParametersFromHash();
            getMat(); redraw();
        }
    });
    getMat();
    initModels();

    var w = window.innerWidth, h = window.innerHeight;
    PreviousWindowSize = [w, h, 0];
    Scale = 0.08 * Math.min(w, h);
    initModelScale();
    initCanvasAttitudes();
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // init toggles
    var toggles = document.getElementsByClassName("toggle");
    for (var i = 0; i < toggles.length; i++)
        (function (ele) {
            ele.addEventListener("click", function () {
                if (ele.classList.contains("toggled"))
                    ele.classList.remove("toggled");
                else ele.classList.add("toggled");
                redraw();
            });
        })(toggles[i]);

    // init footer
    $("footer").style.display = 'block';
    setTimeout(function () {
        $("footer").innerHTML = Is2D ? "2D view" : "3D view";
    }, 5000);
    $("footer").onclick = function (event) {
        if (Is2D) Is2D = false, $("footer").innerHTML = "3D view";
        else Is2D = true, $("footer").innerHTML = "2D view";
        redraw();
    };
});
