"use strict";

// parse math equations, generate LaTeX and GLSL code



// ============================ DEFINITIONS ==============================


function Token(type, str) {
    console.assert(type == 'number' || type == 'variable' ||
        type == 'operator' || type == 'function' || type == null);
    this.type = type;  // type of the token
    this.str = str;  // name of the token represented as a string
    this.numArgs = 0;  // number of arguments for functions
}

function EvalObject(glsl, glslgrad, isNumeric) {
    this.glsl = glsl;
    this.glslgrad = glslgrad;
    this.isNumeric = isNumeric;  // zero gradient
}

function MathFunction(names, numArgs, latex, glsl, glslgrad) {
    this.names = names;
    this.numArgs = numArgs;
    this.latex = latex;
    this.glsl = glsl;
    this.glslgrad = glslgrad;
    this.subGlsl = function (args) {
        if (args.length != this.numArgs)
            throw "Incorrect number of arguments for function " + this.names[0];
        var glsl = this.glsl, glslgrad = this.glslgrad;
        var isNumeric = glslgrad == "vec3(0)";
        for (var i = 0; i < args.length; i++) {
            var repv = "%" + (i + 1), repg = "$" + (i + 1);
            glsl = glsl.replaceAll(repv, args[i].glsl);
            glslgrad = glslgrad.replaceAll(repv, args[i].glsl).replaceAll(repg, args[i].glslgrad);
            isNumeric &= args[i].isNumeric;
        }
        return new EvalObject(glsl, glslgrad, isNumeric);
    };
}
const mathFunctions = (function () {
    const funs0 = [
        new MathFunction(['mod'], 2, '\\mod\\left(%1,%2\\right)', 'mod(%1,%2)', '$1'),
        new MathFunction(['fract'], 1, '\\left\\{%1\\right\\}', 'fract(%1)', '$1'),
        new MathFunction(['floor'], 1, '\\lfloor%1\\rfloor', 'floor(%1)', 'vec3(0)'),
        new MathFunction(['ceil'], 1, '\\lceil%1\\rceil', 'ceil(%1)', 'vec3(0)'),
        new MathFunction(['round'], 1, '\\round\\left(%1\\right)', 'round(%1)', 'vec3(0)'),
        new MathFunction(['abs'], 1, '\\left|%1\\right|', 'abs(%1)', '($1*sign(%1))'),
        new MathFunction(['sign', 'sgn'], 1, '\\sign\\left(%1\\right)', 'sign(%1)', 'vec3(0)'),
        new MathFunction(['max'], 0, '\\max\\left(%0\\right)', 'max(%1,%2)', "(%1>%2?$1:$2)"),
        new MathFunction(['min'], 0, '\\min\\left(%0\\right)', 'min(%1,%2)', "(%1<%2?$1:$2)"),
        new MathFunction(['clamp'], 3, '\\operatorname{clamp}\\left(%1,%2,%3\\right)', 'clamp(%1,%2,%3)', '(%1>%3?$3:%1>%2?$1:$2)'),
        new MathFunction(['lerp', 'mix'], 3, '\\operatorname{lerp}\\left(%1,%2,%3\\right)', 'mix(%1,%2,%3)', '((1.-%3)*$1+(%2-%1)*$3+%3*$2)'),
        new MathFunction(['sqrt'], 1, '\\sqrt{%1}', 'sqrt(%1)', '(.5*$1/sqrt(%1))'),
        new MathFunction(['cbrt'], 1, '\\sqrt[3]{%1}', '(sign(%1)*pow(abs(%1),1./3.))', '($1/(3.*pow(abs(%1),2./3.)))'),
        new MathFunction(['pow'], 2, '\\left(%1\\right)^{%2}', 'pow(%1,%2)', null),
        new MathFunction(['exp'], 1, '\\exp\\left(%1\\right)', 'exp(%1)', '($1*exp(%1))'),
        new MathFunction(['log', 'ln'], 1, '\\ln\\left(%1\\right)', 'log(%1)', '$1/%1'),
        new MathFunction(['log', 'ln'], 2, '\\log_{%1}\\left(%2\\right)', '(log(%2)/log(%1))', '((log(%1)*$2/%2-log(%2)*$1/%1)/(log(%1)*log(%1)))'),
        new MathFunction(['sin'], 1, '\\sin\\left(%1\\right)', 'sin(%1)', '($1*cos(%1))'),
        new MathFunction(['cos'], 1, '\\cos\\left(%1\\right)', 'cos(%1)', '(-$1*sin(%1))'),
        new MathFunction(['tan'], 1, '\\tan\\left(%1\\right)', 'tan(%1)', '($1/(cos(%1)*cos(%1)))'),
        new MathFunction(['csc'], 1, '\\csc\\left(%1\\right)', '(1.0/sin(%1))', '(-$1/(sin(%1)*tan(%1)))'),
        new MathFunction(['sec'], 1, '\\sec\\left(%1\\right)', '(1.0/cos(%1))', '($1*tan(%1)/cos(%1))'),
        new MathFunction(['cot'], 1, '\\cot\\left(%1\\right)', '(1.0/tan(%1))', '(-$1/(sin(%1)*sin(%1)))'),
        new MathFunction(['sinh'], 1, '\\sinh\\left(%1\\right)', 'sinh(%1)', '($1*cosh(%1))'),
        new MathFunction(['cosh'], 1, '\\cosh\\left(%1\\right)', 'cosh(%1)', '($1*sinh(%1))'),
        new MathFunction(['tanh'], 1, '\\tanh\\left(%1\\right)', 'tanh(%1)', '$1/(cosh(%1)*cosh(%1))'),
        new MathFunction(['csch'], 1, '\\csch\\left(%1\\right)', '(1.0/sinh(%1))', '(-$1/(sinh(%1)*tanh(%1)))'),
        new MathFunction(['sech'], 1, '\\sech\\left(%1\\right)', '(1.0/cosh(%1))', '(-$1*tanh(%1)/cosh(%1))'),
        new MathFunction(['coth'], 1, '\\coth\\left(%1\\right)', '(1.0/tanh(%1))', '(-$1/(sinh(%1)*sinh(%1)))'),
        new MathFunction(['arcsin', 'arsin', 'asin'], 1, '\\arcsin\\left(%1\\right)', 'asin(%1)', '($1/sqrt(1.-%1*%1))'),
        new MathFunction(['arccos', 'arcos', 'acos'], 1, '\\arccos\\left(%1\\right)', 'acos(%1)', '(-$1/sqrt(1.-%1*%1))'),
        new MathFunction(['arctan', 'artan', 'atan'], 1, '\\arctan\\left(%1\\right)', 'atan(%1)', '($1/(1.+%1*%1))'),
        new MathFunction(['arctan', 'artan', 'atan'], 2, '\\operatorname{atan2}\\left(%1,%2\\right)', 'atan(%1,%2)', null),
        new MathFunction(['arcsinh', 'arsinh', 'asinh'], 1, '\\arcsinh\\left(%1\\right)', 'asinh(%1)', '($1/sqrt(%1*%1+1.))'),
        new MathFunction(['arccosh', 'arcosh', 'acosh'], 1, '\\arccosh\\left(%1\\right)', 'acosh(%1)', '($1/sqrt(%1*%1-1.))'),
        new MathFunction(['arctanh', 'artanh', 'atanh'], 1, '\\arctanh\\left(%1\\right)', 'atanh(%1)', '($1/(1.-%1*%1))'),
    ];
    var funs = {};
    for (var i = 0; i < funs0.length; i++) {
        for (var j = 0; j < funs0[i].names.length; j++) {
            var name = funs0[i].names[j];
            if (funs[name] == undefined) funs[name] = {};
            funs[name]['' + funs0[i].numArgs] = funs0[i];
        }
    }
    funs['pow']['2'].subGlsl = function (args) {
        if (args.length != 2)
            throw "Incorrect number of arguments for function " + this.names[0];
        return powEvalObjects(args[0], args[1]);
    };
    funs['max']['0'].subGlsl = funs['min']['0'].subGlsl = function (args) {
        if (args.length < 2)
            throw "To few argument for function " + this.names[0];
        while (args.length >= 2) {
            var args1 = [];
            for (var i = 0; i + 1 < args.length; i += 2) {
                var glsl = this.glsl.replaceAll("%1", args[i].glsl).replaceAll("%2", args[i + 1].glsl);
                var glslgrad = this.glslgrad.replaceAll("$1", args[i].glslgrad).replaceAll("$2", args[i + 1].glslgrad).replaceAll("%1", args[i].glsl).replaceAll("%2", args[i + 1].glsl);
                args1.push(new EvalObject(glsl, glslgrad, args[i].isNumeric && args[i + 1].isNumeric));
            }
            if (args.length % 2 == 1) args1.push(args[args.length - 1]);
            args = args1;
        }
        return args[0];
    };
    return funs;
})();


// ============================ PARSING ==============================


// Parse a human math expression to postfix notation
function exprToPostfix(expr) {

    // parenthesis
    expr = expr.trim().replace(/\[/g, '(').replace(/\]/g, ')');
    var db = (expr.match(/\(/g) || []).length - (expr.match(/\)/g) || []).length;
    if (db < 0) throw "Mismatched parenthesis."
    for (var i = 0; i < db; i++) expr += ")";
    if (expr == "") console.error("empty expression");

    // subtraction sign
    var expr1s = [{ s: "", pc: 0 }];
    var prev_c = null;
    for (var i = 0; i < expr.length; i++) {
        let eb = expr1s[expr1s.length - 1];
        if (expr[i] == "-" && (prev_c == null || /[\(\+\-\*\/\^\,]/.test(prev_c))) {
            expr1s.push({
                s: expr[i],
                pc: 0
            });
        }
        else if (/[A-Za-z_\d\.\(\)\^]/.test(expr[i]) || eb.pc > 0) {
            eb.s += expr[i];
            if (expr[i] == '(') eb.pc += 1;
            if (expr[i] == ')') eb.pc -= 1;
        }
        else if (/^\-/.test(eb.s)) {
            var e1 = "(0" + eb.s + ")" + expr[i];
            expr1s.pop();
            expr1s[expr1s.length - 1].s += e1;
        }
        else {
            eb.s += expr[i];
        }
        if (!/\s/.test(expr[i])) prev_c = expr[i];
    }
    while (expr1s.length > 1) {
        var eb = expr1s[expr1s.length - 1];
        expr1s.pop();
        console.assert(eb.pc == 0);
        if (/^\-/.test(eb.s)) eb.s = "(0" + eb.s + ")";
        expr1s[expr1s.length - 1].s += eb.s;
    }
    expr = expr1s[0].s;

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
                if (mathFunctions[funName] != undefined) {
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
    var queue = [], stack = [];  // Token objects
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
            var number = new Token("number", token);
            queue.push(number);
        }
        // variable name
        else if (/^[A-Za-z](_[A-Za-z0-9]+)?$/.test(token)) {
            var variable = new Token("variable", token);
            queue.push(variable);
        }
        // function
        else if (mathFunctions[token] != undefined) {
            var fun = new Token("function", token);
            stack.push(fun);
        }
        // comma to separate function arguments
        else if (token == ",") {
            while (stack[stack.length - 1].str != '(') {
                queue.push(stack[stack.length - 1]);
                stack.pop();
                if (stack.length == 0)
                    throw ("Comma encountered without a function.");
            }
            stack.pop();
            if (stack.length == 0 || stack[stack.length - 1].type != "function")
                throw ("Comma encountered without a function.");
            stack[stack.length - 1].numArgs += 1;
            stack.push(new Token(null, '('));
        }
        // operator
        else if (operators[token] != undefined) {
            while (stack.length != 0 && stack[stack.length - 1].type == "operator" &&
                (operators[stack[stack.length - 1].str] > operators[token] ||
                    (isLeftAssociative[token] && operators[stack[stack.length - 1].str] == operators[token]))) {
                queue.push(stack[stack.length - 1]);
                stack.pop();
            }
            stack.push(new Token("operator", token));
        }
        // parenthesis
        else if (token == "(") {
            stack.push(new Token(null, token));
        }
        else if (token == ")") {
            while (stack[stack.length - 1].str != '(') {
                queue.push(stack[stack.length - 1]);
                stack.pop();
                console.assert(stack.length != 0);
            }
            stack.pop();
            if (stack.length != 0 && stack[stack.length - 1].type == "function") {
                var fun = stack[stack.length - 1];
                stack.pop();
                fun.numArgs += 1;
                queue.push(fun);
            }
        }
        else {
            console.error(token);
        }
    }
    while (stack.length != 0) {
        queue.push(stack[stack.length - 1]);
        stack.pop();
    }
    return queue;
}


// ============================ EVALUATION ==============================

function addEvalObjects(a, b) {
    return new EvalObject(
        "(" + a.glsl + "+" + b.glsl + ")",
        a.isNumeric ? b.glslgrad : b.isNumeric ? a.glslgrad :
            "(" + a.glslgrad + "+" + b.glslgrad + ")",
        a.isNumeric && b.isNumeric
    );
}
function subEvalObjects(a, b) {
    return new EvalObject(
        "(" + a.glsl + "-" + b.glsl + ")",
        b.isNumeric ? a.glslgrad : a.isNumeric ? "(-" + b.glslgrad + ")" :
            "(" + a.glslgrad + "-" + b.glslgrad + ")",
        a.isNumeric && b.isNumeric
    );
}
function mulEvalObjects(a, b) {
    return new EvalObject(
        "(" + a.glsl + "*" + b.glsl + ")",
        a.isNumeric ? "(" + a.glsl + "*" + b.glslgrad + ")" :
            b.isNumeric ? "(" + a.glslgrad + "*" + b.glsl + ")" :
                "(" + a.glslgrad + "*" + b.glsl + "+" + a.glsl + "*" + b.glslgrad + ")",
        a.isNumeric && b.isNumeric
    );
}
function divEvalObjects(a, b) {
    return new EvalObject(
        "(" + a.glsl + "/" + b.glsl + ")",
        a.isNumeric && b.isNumeric ? "vec3(0)" :
            b.isNumeric ? "(" + a.glslgrad + "/" + b.glsl + ")" :
                a.isNumeric ? "(-" + a.glsl + "*" + b.glslgrad + "/(" + b.glsl + "*" + b.glsl + "))" :
                    "((" + a.glslgrad + "*" + b.glsl + "-" + a.glsl + "*" + b.glslgrad + ")/(" + b.glsl + "*" + b.glsl + "))",
        a.isNumeric && b.isNumeric
    );
}
function powEvalObjects(a, b) {
    if (a.glsl == 'e') {
        return new EvalObject(
            "exp(" + b.glsl + ")",
            "(" + b.glslgrad + "*exp(" + b.glsl + "))",
            b.isNumeric
        )
    }
    var n = Number(b.glsl);
    if (n == 0) return new EvalObject("0", "vec3(0)", true);
    if (n == 1) return a;
    if (n == 2 || n == 3 || n == 4 || n == 5 || n == 6 || n == 7 || n == 8) {
        var arr = [];
        for (var i = 0; i < n; i++) arr.push(a.glsl);
        var glsl = "(" + arr.join('*') + ")";
        arr[0] = a.glslgrad;
        var glslgrad = a.isNumeric ? "vec3(0)" : "(" + n + ".*" + arr.join('*') + ")";
        return new EvalObject(
            glsl, glslgrad,
            a.isNumeric
        )
    }
    return new EvalObject(
        "pow(" + a.glsl + "," + b.glsl + ")",
        a.isNumeric && b.isNumeric ? "vec3(0)" :
            a.isNumeric ? "(pow(" + a.glsl + "," + b.glsl + ")*log(" + a.glsl + ")*" + b.glslgrad + ")" :
                b.isNumeric ? "(" + b.glsl + "*pow(" + a.glsl + "," + b.glsl + "-1.)*" + a.glslgrad + ")" :
                    "(" + b.glsl + "*pow(" + a.glsl + "," + b.glsl + "-1.)*" + a.glslgrad +
                    "+pow(" + a.glsl + "," + b.glsl + ")*log(" + a.glsl + ")*" + b.glslgrad + ")",
        a.isNumeric && b.isNumeric
    )
}

// Convert a post-polish math expression to GLSL code
function postfixToGlsl(queue) {
    var stack = [];  // EvalObject objects
    for (var i = 0; i < queue.length; i++) {
        var token = queue[i];
        // number
        if (token.type == 'number') {
            var s = token.str;
            if (!/\./.test(s)) s += '.';
            stack.push(new EvalObject(s, "vec3(0)", true));
        }
        // function
        else if (token.type == 'function') {
            var fun = mathFunctions[token.str];
            var numArgs = token.numArgs;
            var args = [];
            for (var j = numArgs; j > 0; j--)
                args.push(stack[stack.length - j]);
            for (var j = 0; j < numArgs; j++)
                stack.pop();
            if (fun['' + numArgs] == undefined) fun = fun['0'];
            else fun = fun['' + numArgs];
            if (fun == undefined)
                throw "Incorrect number of arguments for function " + token.str;
            stack.push(fun.subGlsl(args));
        }
        // variable
        else if (token.type == "variable") {
            var s = token.str;
            var grad = "vec3(0)";
            if (token.str == 'x') grad = "vec3(1,0,0)";
            if (token.str == 'y') grad = "vec3(0,1,0)";
            if (token.str == 'z') grad = "vec3(0,0,1)";
            stack.push(new EvalObject(s, grad, grad == "0"));
        }
        // operators
        else if (/^[\+\-\*\/]$/.test(token.str)) {
            var v1 = stack[stack.length - 2];
            var v2 = stack[stack.length - 1];
            stack.pop(); stack.pop();
            var v = null;
            if (token.str == "+") v = addEvalObjects(v1, v2);
            if (token.str == "-") v = subEvalObjects(v1, v2);
            if (token.str == "*") v = mulEvalObjects(v1, v2);
            if (token.str == "/") v = divEvalObjects(v1, v2);
            stack.push(v);
        }
        else if (token.str == "^") {
            var v1 = stack[stack.length - 2];
            var v2 = stack[stack.length - 1];
            stack.pop(); stack.pop();
            stack.push(powEvalObjects(v1, v2));
        }
        else console.error(token);
    }
    console.assert(stack.length == 1);
    console.log("glsl", stack[0].glsl);
    console.log("glslgrad", stack[0].glslgrad);
    return stack[0];
}


// ============================ BUILT-IN ==============================


var builtinFunctions = [
    "(x^2+9/4*y^2+z^2-1)^3-(x^2+9/80*y^2)*z^3",
    "2(x^2+2y^2+z^2)^3-2(9x^2+y^2)z^3-1",
    "4(x^2+2y^2+z^2-1)^2-z(5x^4-10x^2z^2+z^4)-1",
    "2y(y^2-3x^2)(1-z^2)+(x^2+y^2)^2-(9z^2-1)(1-z^2)",
    "2(x^4+y^4+z^4)-3(x^2+y^2+z^2)+2",
    "(x^2(x^2-1)+y^2)^2+(y^2(y^2-1)+z^2)^2-0.1y^2(y^2+1)",
    "(x^2-1)^2+(y^2-1)^2+(z^2-1)^2+4(x^2y^2+x^2z^2+y^2z^2)+8xyz-2(x^2+y^2+z^2)",
    "(2x^2+2y^2+4z^2+x+3)^2-32(x^2+y^2)",
    "(x^2+y^2+z^2-2)^3+10000(x^2y^2+x^2z^2+y^2z^2)-10",
    "4(x^2-y^2)(y^2-z^2)(z^2-x^2)-3(x^2+y^2+z^2-1)^2",
    "4(2x^2-y^2)(2y^2-z^2)(2z^2-x^2)-4(x^2+y^2+z^2-1)^2",
    "x^2+y^2-(1-z)z^2",
    "x^2+4y^2+(1.15z-0.6(2(x^2+.05y^2+.001)^0.7+y^2)^0.3+0.3)^2-1",
    "x^2+y^2-ln(z+1)^2-0.02",
    "abs(x)+abs(y)+abs(z)-2+cos(10x)cos(10y)cos(10z)",
    "1/((x-1)^2+y^2+z^2)+1/((x+1)^2+y^2+z^2)-1-0.01cos(50x)cos(50y)cos(50z)",
    "0.25round(4sin(x)sin(y))-z",
    "1/((tan(x)tan(y))^2+1)-z-1/2",
    ".2tan(asin(cos(5x)cos(5y)))-z+.5sin(10z)",
    "100sin(x-sqrt(x^2+y^2))^8sin(y+sqrt(x^2+y^2)-z)^8/(x^2+y^2+50)-z",
    "1/((sin(4x)sin(4y))^2+0.4sqrt(x^2+y^2+0.02))-4z-6-sin(4z)",
    "1/((sin(4x)sin(4y))^2+0.4sqrt(x^2+y^2+0.005z^2))-4z-6-4sin(8z)",
    "lerp(max(abs(x),abs(y),abs(z)),sqrt(x^2+y^2+z^2),-1)-0.3",
    "mix(abs(x)+abs(y)+abs(z),max(abs(x),abs(y),abs(z)),1.2)-0.5",
    //"(6-y)/15+((8x^2+4(y-3)^2)/200)^3+cos(max((x+y)cos(y-x),(y-x)cos(x+y)))-sin(min((x+y)sin(y-x),(y-x)sin(x+y)))+20z^2"
];
for (var i = 0; i < builtinFunctions.length; i++) {
    let expr = builtinFunctions[i];
    let pf = exprToPostfix(expr);
    postfixToGlsl(pf);
}