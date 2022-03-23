// parse math equations, generate LaTeX and GLSL code

function MathFunction(names, latex, glsl) {
    this.names = names;
    this.latex = latex;
    this.glsl = glsl;
    this.subLatex = function (arg1) {
        return this.latex.replaceAll("%1", arg1);
    };
    this.subGlsl = function (arg1) {
        return this.glsl.replaceAll("%1", arg1);
    };
}
const mathFunctions = (function () {
    const funs = [
        new MathFunction(['abs'], '\\left|%1\\right|', 'abs(%1)'),
        new MathFunction(['sqrt'], '\\sqrt{%1}', 'sqrt(%1)'),
        new MathFunction(['exp'], '\\exp\\left(%1\\right)', 'exp(%1)'),
        new MathFunction(['log', 'ln'], '\\ln\\left(%1\\right)', 'log(%1)'),
        new MathFunction(['sin'], '\\sin\\left(%1\\right)', 'sin(%1)'),
        new MathFunction(['cos'], '\\cos\\left(%1\\right)', 'cos(%1)'),
        new MathFunction(['tan'], '\\tan\\left(%1\\right)', 'tan(%1)'),
    ];
    return funs;
})();
function isMathFunction(s) {
    for (var i = 0; i < mathFunctions.length; i++) {
        for (var j = 0; j < mathFunctions[i].names.length; j++) {
            if (s == mathFunctions[i].names[j])
                return true;
        }
    }
    return false;
}
function indexMathFunction(s) {
    for (var i = 0; i < mathFunctions.length; i++) {
        for (var j = 0; j < mathFunctions[i].names.length; j++) {
            if (s == mathFunctions[i].names[j])
                return mathFunctions[i];
        }
    }
    return undefined;
}


// Parse a human math expression to postfix notation
function exprToPostfix(expr) {

    // parenthesis
    expr = expr.trim().replace(/\[/g, '(').replace(/\]/g, ')');
    var db = (expr.match(/\(/g) || []).length - (expr.match(/\)/g) || []).length;
    if (db < 0) throw "Mismatched parenthesis."
    for (var i = 0; i < db; i++) expr += ")";
    if (expr == "") console.error("empty expression");

    // multiplication sign
    var expr1 = "";
    for (var i = 0; i < expr.length;) {
        var v = "";
        while (i < expr.length && /[A-Za-z_\d\.\(\)]/.test(expr[i])) {
            v += expr[i];
            i++;
        }
        var has_ = false;
        for (var j = 0; j < v.length;) {
            if (expr1.length > 0) {
                if ((/\)/.test(expr1[expr1.length - 1]) && /[A-Za-z_\d\.\(]/.test(v[j]))
                    || (j != 0 && /[A-Za-z_\d\.\)]/.test(v[j - 1]) && /\(/.test(v[j]))) expr1 += "*";
                else if (!has_ && /[A-Za-z\d\.]/.test(expr1[expr1.length - 1]) && /[A-Za-z_]/.test(v[j]))
                    expr1 += "*";
                else if (!has_ && /[A-Za-z]/.test(expr1[expr1.length - 1]) && /[\d\.]/.test(v[j]))
                    expr1 += "_";
            }
            var next_lp = v.substring(j, v.length).search(/\(/);
            if (next_lp != -1) {
                var funName = v.substring(j, j + next_lp);
                if (isMathFunction(funName)) {
                    expr1 += funName;
                    j += funName.length;
                }
            }
            if (v[j] == "_") has_ = true;
            expr1 += v[j];
            j++;
        }
        if (/\s/.test(expr[i])) {
            if (/[A-Za-z_\d]{2}/.test(expr1[expr1.length - 1] + expr[i + 1]))
                expr1 += "*";
            i++;
        }
        else if (i < expr.length) {
            expr1 += expr[i];
            i++;
        }
    }
    expr = expr1;

    // operators
    expr = expr.replace(/\*\*/g, "^");
    var operators = {
        '+': 1, '-': 1,
        '*': 2, '/': 2,
        '^': 3
    };
    var isLeftAssociative = {
        '+': true, '-': true, '*': true, '/': true,
        '^': false
    };

    // preprocessing
    console.log("preprocessed", expr);

    // shunting-yard algorithm
    var queue = [], stack = [];
    for (var i = 0; i < expr.length;) {
        // get token
        var token = "";
        while (i < expr.length && /[A-Za-z0-9_\.]/.test(expr[i])) {
            token += expr[i];
            i++;
        }
        if (token == "") {
            token = expr[i];
            i++;
        }
        // number
        if (/^[0-9]*\.{0,1}[0-9]*$/.test(token) || /^[0-9]*\.{0,1}[0-9]+$/.test(token)) {
            queue.push(token);
        }
        // variable name
        else if (/^[A-Za-z](_[A-Za-z0-9]+)?$/.test(token)) {
            queue.push(token);
        }
        // function
        else if (isMathFunction(token)) {
            stack.push(token);
        }
        // operator
        else if (operators[token] != undefined) {
            while (stack.length != 0 && operators[stack[stack.length - 1]] != undefined &&
                (operators[stack[stack.length - 1]] > operators[token] ||
                    (isLeftAssociative[token] && operators[stack[stack.length - 1]] == operators[token]))) {
                queue.push(stack[stack.length - 1]);
                stack.pop();
            }
            stack.push(token);
        }
        // parenthesis
        else if (token == "(") {
            stack.push(token);
        }
        else if (token == ")") {
            while (stack[stack.length - 1] != '(') {
                queue.push(stack[stack.length - 1]);
                stack.pop();
                console.assert(stack.length != 0);
            }
            stack.pop();
            if (stack.length != 0 && isMathFunction(stack[stack.length - 1])) {
                queue.push(stack[stack.length - 1]);
                stack.pop();
            }
        }
        else {
            console.error(token);
        }
    }
    while (stack.length != 0) {
        var token = stack[stack.length - 1];
        queue.push(token);
        stack.pop();
    }
    return queue;
}

// Convert a post-polish math expression to GLSL code
function postfixToGlsl(queue) {
    var stack = [];
    for (var i = 0; i < queue.length; i++) {
        var token = queue[i];
        // number
        if (/[\d\.]+/.test(token)) {
            if (!/\./.test(token)) token += '.';
            stack.push(token);
        }
        // function
        else if (isMathFunction(token)) {
            var obj = stack[stack.length - 1];
            var fun = indexMathFunction(token);
            stack.pop();
            stack.push(fun.subGlsl(obj));
        }
        // variable
        else if (/[A-Za-z](_[A-Za-z\d]+)?/.test(token)) {
            stack.push(token);
        }
        // operators
        else if (/^[\+\-\*\/]$/.test(token)) {
            var v1 = stack[stack.length - 2];
            var v2 = stack[stack.length - 1];
            stack.pop(); stack.pop();
            var v = "(" + v1 + token + v2 + ")";
            stack.push(v);
        }
        else if (token == "^") {
            var v1 = stack[stack.length - 2];
            var v2 = stack[stack.length - 1];
            stack.pop(); stack.pop();
            var v = "pow(" + v1 + "," + v2 + ")";
            stack.push(v);
        }
        else console.error(token);
    }
    console.assert(stack.length == 1);
    return stack[0];
}


var builtinFunctions = [
    "(2x^2+2y^2+4z^2+x+3)^2-32(x^2+y^2)",
    "(x^2+9/4*y^2+z^2-1)^3-(x^2+9/80*y^2)*z^3",
    "2(x^2+2y^2+z^2)^3-2(9x^2+y^2)z^3-1",
    "4(x^2+2y^2+z^2-1)^2-z(5x^4-10x^2z^2+z^4)-1",
    "2y(y^2-3x^2)(1-z^2)+(x^2+y^2)^2-(9z^2-1)(1-z^2)",
    "x^2+4y^2+(1.15z-0.6(2(x^2+.05y^2+.001)^0.7+y^2)^0.3+0.3)^2-1",
    "x^2+y^2-ln(z+1)^2-0.02",
    ".1sin(10.x)+.1sin(10.y)-z",
    "abs(x)+abs(y)+abs(z)-2+cos(10x)cos(10y)cos(10z)",
    "1/((x-1)^2+y^2+z^2)+1/((x+1)^2+y^2+z^2)-1-0.01cos(50x)cos(50y)cos(50z)",
];
for (var i = 0; i < builtinFunctions.length; i++) {
    let expr = builtinFunctions[i];
    let pf = exprToPostfix(expr);
    postfixToGlsl(pf);
}

// https://math.stackexchange.com/questions/46212/interesting-implicit-surfaces-in-mathbbr3
// https://mathworld.wolfram.com/AlgebraicSurface.html
// http://paulbourke.net/geometry/
builtinFunctions = builtinFunctions.concat([
    "x^2+y^2-(1-z)z^2",
    "2(x^4+y^4+z^4)-3(x^2+y^2+z^2)+2",
    "(x^2(x^2-1)+y^2)^2+(y^2(y^2-1)+z^2)^2-0.1y^2(y^2+1)",
    "(x^2-1)^2+(y^2-1)^2+(z^2-1)^2+4(x^2y^2+x^2z^2+y^2z^2)+12xyz-4(x^2+y^2+z^2)+4",
    "(x^2+y^2+z^2-2)^3+1000(x^2y^2+x^2z^2+y^2z^2)",
]);