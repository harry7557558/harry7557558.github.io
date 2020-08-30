// extracting latex expressions from Desmos online calculator

// clear all expressions
function clear() {
    s = Calc.getState();
    t = s["expressions"]["list"];
    s["expressions"]["list"] = [];
    Calc.setState(s);
    return t;
}

// convert latex expressions to fit personal preference (might hurt)
// set d0 to 1 for not converting \frac
function convertLatex(s, d0=0) {
    if (typeof (s) != "string")
        return "";
    orig = ["\\frac", "\\left(", "\\right)", "\\phi", "\\sum_"];
    repl = ["\\dfrac", "(", ")", "\\varphi", "\\sum\\limits_"];
    for (var d = d0; d < orig.length; d++) {
        while (s.indexOf(orig[d]) != -1)
            s = s.replace(orig[d], repl[d]);
    }
    for (var d = 0; d < s.length; d++) {
        if (s[d] == '_' || s[d] == '^') {
            if (s[d + 1] == '{' && s[d + 3] == '}') {
                s = s.substring(0, d + 1) + s[d + 2] + s.substring(d + 4, s.length);
                d -= 2;
            }
        }
    }
    return s;
}

// extract all expressions as a string
function extractAll() {
    var t = Calc.getState()["expressions"]["list"];
    var s = "";
    for (i = 0; i < t.length; i++)
        s += t[i].latex + '\n';
    return convertLatex(s);
}

// extract first 9 elements as a 3x3 matrix
function extractMatrix() {
    var t = Calc.getState()["expressions"]["list"];
    var s = "\\begin{bmatrix}";
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            s += convertLatex(t[3 * i + j].latex, 1);
            if (j != 2)
                s += '&';
        }
        if (i != 2)
            s += '\\\\';
    }
    s += "\\end{bmatrix}\n";
    for (var i = 9; i < t.length; i++)
        s += convertLatex(t[i].latex) + '\n';
    return s;
}
function extractDiagMatrix() {
    var t = Calc.getState()["expressions"]["list"];
    var s = "\\mathrm{diag}\\begin{bmatrix}";
    for (var i = 0; i < 3; i++) {
        s += convertLatex(t[3 * i + i].latex, 1);
        if (i != 2)
            s += '\\\\';
    }
    s += "\\end{bmatrix}\n";
    for (var i = 9; i < t.length; i++)
        s += convertLatex(t[i].latex) + '\n';
    return s;
}

extractMatrix();
