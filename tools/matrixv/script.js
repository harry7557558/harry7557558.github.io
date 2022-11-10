/**************** Basic Linear Algebra ****************/
const sin = Math.sin, cos = Math.cos, atan = Math.atan,
    sqrt = Math.sqrt, pow = Math.pow;
function dot(u, v) { return u[0] * v[0] + u[1] * v[1] + u[2] * v[2]; }
function cross(u, v) { return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; }
function length(v) { return sqrt(dot(v, v)); }
function vecadd(u, v) { return [u[0] + v[0], u[1] + v[1], u[2] + v[2]]; }
function vecmin(u, v) { return [u[0] - v[0], u[1] - v[1], u[2] - v[2]]; }
function vecmul(v, a) { return [v[0] * a, v[1] * a, v[2] * a]; }
function normalize(v) { return vecmul(v, 1.0 / length(v)); }
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
function getHash() {
    try {
        var hash = document.location.hash.replace('#', '');
        return hash.split('&').reduce(function (res, s) {
            s = s.split('=');
            res[s[0]] = decodeURIComponent(s[1]);
            return res;
        }, {});
    } catch (e) {
        console.error(e);
        return {};
    }
}
function exportHash() {
    var res = {};
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
    link = link + exportHash();
    copyTextToClipboard(link);
}

// attempt to parse a matrix represented as a string
// component will be strings, not numbers
function parseMatrix(s) {
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

function updateParametersFromHash() {
    var hash = getHash();
    if (hash.hasOwnProperty('m')) {
        var mat = parseMatrix(hash['m']);
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                $('_' + i + j).value = mat[i][j];
    }
    document.location.hash = '';
}


/**************** Matrix Input ****************/

var Mat = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
var Det2 = 1, Det3 = 1, Det4 = 1;
var Eig3 = [
    [1, [1, 0, 0]],
    [1, [0, 1, 0]],
    [1, [0, 0, 1]]
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
        var val = num2str(eig[i][0], 6);
        var vec = num2str(eig[i][1], 3);
        $("eigens").innerHTML += "<div class='eigenvals'>λ<sub>" + (i + 1) + "</sub> = " + val + "</div>";
        $("eigens").innerHTML += "<div class='eigenvecs'>ξ<sub>" + (i + 1) + "</sub> = " + vec + "</div>";
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
    calcDet();
    calcEigen();
    redraw();
    return R;
}


/**************** Models ****************/

function decodeMatrix(s, isNumeric = true) {
    var rows = s.split(';');
    for (var i = 0; i < rows.length; i++) {
        rows[i] = rows[i].replaceAll(',', ' ').split(' ');
        if (isNumeric) rows[i] = rows[i].map(x => Number(x));
    }
    return rows;
}

var MODELS = {
    "list": [],
    "frame": {
        "vertices": decodeMatrix("-1,-1,-1;-1,1,-1;1,1,-1;1,-1,-1;-1,-1,1;-1,1,1;1,1,1;1,-1,1"),
        "edges": decodeMatrix("0,1;1,2;0,3;2,3;0,4;1,5;2,6;3,7;4,5;5,6;4,7;6,7")
    }
};
(function (path) {
    var req = new XMLHttpRequest();
    req.open("GET", path);
    req.onload = function () {
        if (this.status != 200) {
            alert("Failed to load models.");
            return;
        }
        var content = JSON.parse(req.response);
        for (var i = 0; i < content.length; i++) {
            var model = content[i];
            MODELS.list.push(model.name);
            MODELS[model.name] = {};
            MODELS[model.name].vertices = decodeMatrix(model.vertices);
            MODELS[model.name].edges = decodeMatrix(model.edges);
        }
        redraw();
    };
    req.onerror = function () {
        alert("Failed to load models.");
    };
    req.send();
})("matrixv/models.json");


/**************** Rendering ****************/

function redraw() {
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

    function drawLine(p1_, p2_, rec_remain = 12) {
        if (rec_remain < 0) return;
        var p1 = affinevecmul(M, p1_);
        var p2 = affinevecmul(M, p2_);
        // check break due to perspective
        var pm_ = vecadd(vecmul(p1_, 0.5), vecmul(p2_, 0.5));
        var pm = affinevecmul(M, pm_);
        p1 = [p1[0], p1[1]], p2 = [p2[0], p2[1]], pm = [pm[0], pm[1]];
        var isOnScreen = (p) =>
            p[0] >= 0 && p[0] <= canvas.width &&
            p[1] >= 0 && p[1] <= canvas.height;
        if (!isOnScreen(p1) && !isOnScreen(p2) && !isOnScreen(pm))
            return;
        var vecdiff = (u, v) =>
            Math.hypot(u[0] - v[0], u[1] - v[1]);
        if (!(vecdiff(p1, pm) < 10 && vecdiff(pm, p2) < 10)) {
            drawLine(p1_, pm_, rec_remain - 1);
            drawLine(pm_, p2_, rec_remain - 1);
            return;
        }
        // draw
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.closePath();
        ctx.stroke();
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
        var dp = vecmin(p1, p0), pm = sqrt(dp[0] * dp[0] + dp[1] * dp[1]);
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

    const SC = 2;  // scaling factor

    function drawView(cx, cy, cz, cf, cc) {
        // Axis with an arrow
        ctx.strokeStyle = cx;
        var s = 3.0 * SC;
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
                lines.push([
                    vecmul(vertices[edges[i][0]], SC),
                    vecmul(vertices[edges[i][1]], SC),
                    color]);
            }
        }

        // object
        if (MODELS.hasOwnProperty("cube")) {
            addModel(MODELS['cube'], cc);
        }

        // Frame
        // addModel(MODELS.frame, cf);

        // draw lines
        for (var i = 0; i < lines.length; i++) {
            var c = vecadd(vecmul(lines[i][0], 0.5), vecmul(lines[i][1], 0.5));
            var z = affinevecmul(M, c)[2];
            lines[i].push(z);
        }
        lines.sort((a, b) => a[3] - b[3]);
        for (var i = 0; i < lines.length; i++) {
            ctx.strokeStyle = lines[i][2];
            drawLine(lines[i][0], lines[i][1]);
        }
    };

    // reference cube
    ctx.lineWidth = 1;
    drawView("rgb(192,128,128)", "rgb(64,96,64)", "rgb(128,128,232)",
        "rgb(255,192,128)", "rgb(128,128,128)");
    //return;

    // transformed cube
    var M_old = M;
    M = affinemul(M, Mat);
    ctx.lineWidth = 1;
    drawView("rgb(255,0,0)", "rgb(0,160,0)", "rgb(0,64,255)",
        "rgb(255,160,0)", "rgb(255,255,128)");
    M = M_old;

    // eigenvectors - note that now the matrix is transformed
    if (is3x3()) {
        var cZero = 'rgba(128,192,128,0.8)',
            cPositive = 'rgba(255,0,255,0.8)',
            cNegative = 'rgba(0,192,255,0.7)';
        var vectors = [];
        for (var i = 0; i < Eig3.length; i++) {
            if (Math.abs(Eig3[i][0].im) > 1e-6) continue;
            var l = SC * toReal(Eig3[i][0]);
            var color = l > 0 ? cPositive : cNegative;
            if (Math.abs(l) < 1e-6) l = 1.0, color = cZero;
            var v = vecmul(normalize(toReal(Eig3[i][1])), l);
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


/**************** Interaction ****************/

var MouseDown = false;
var Is2D = false;  // if is in 2d view
var Cursor = [NaN, NaN], PrevCursor = [NaN, NaN];
var Rx = -1.3, Rz = -0.55;
function initCanvasAttitudes() {
    let canvas = $("canvas");
    canvas.onmousedown = function (event) {
        MouseDown = true;
        PrevCursor = [event.clientX, canvas.height - event.clientY];
    };
    canvas.oncontextmenu = function (event) {
        event.preventDefault();
        if (Is2D) Is2D = false, $("footer").innerHTML = "3D view", Rx = Rz = 0;
        redraw();
    };
    document.onmousemove = function (event) {
        Cursor = [event.clientX, canvas.height - event.clientY];
        if (MouseDown && !Is2D) {	// click and drag to rotate the view
            var dx = Cursor[0] - PrevCursor[0], dy = PrevCursor[1] - Cursor[1];
            dx /= 100, dy /= 120;
            Rx += dy, Rz += dx;
            redraw();
            PrevCursor = Cursor;
        }
    };
    document.onmouseup = function (event) {
        MouseDown = false;
        PrevCursor = [NaN, NaN];
    };
    canvas.addEventListener("wheel", function (event) {
        event.preventDefault();
        const MAX = 500, MIN = 0.5;
        var d = Math.exp(-0.0005 * event.deltaY);
        //if (Scale * d > MAX) d = MAX / Scale;
        //else if (Scale * d < MIN) d = MIN / Scale;
        Scale *= d;
        redraw();
    });
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
    initMat();
    updateParametersFromHash();
    getMat();

    var w = window.innerWidth, h = window.innerHeight;
    PreviousWindowSize = [w, h, 0];
    Scale = 0.08 * Math.min(w, h);
    initCanvasAttitudes();
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

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
