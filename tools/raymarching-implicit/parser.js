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

function EvalObject(postfix, glsl, glslgrad, isNumeric, isPositive = false, isCompatible = true) {
    this.postfix = postfix;
    this.glsl = glsl;
    this.glslgrad = glslgrad;
    this.isNumeric = isNumeric;  // zero gradient
    this.isPositive = isPositive;  // non-negative
    this.isCompatible = isCompatible;  // has no NAN
}

function EvalLatexObject(postfix, latex, precedence) {
    this.postfix = postfix;
    this.latex = latex;
    this.precedence = precedence;
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
        var glsl = this.glsl, glslgrad = this.glslgrad, postfix = [];
        var isNumeric = glslgrad == "vec3(0)";
        var isCompatible = true;
        for (var i = 0; i < args.length; i++) {
            var repv = "%" + (i + 1), repg = "$" + (i + 1);
            postfix = postfix.concat(args[i].postfix);
            glsl = glsl.replaceAll(repv, args[i].glsl);
            glslgrad = glslgrad.replaceAll(repv, args[i].glsl).replaceAll(repg, args[i].glslgrad);
            isNumeric = isNumeric && args[i].isNumeric;
            isCompatible = isCompatible && args[i].isCompatible;
        }
        var result = new EvalObject(
            postfix.concat([new Token('function', names[0])]),
            glsl, glslgrad, isNumeric, false, isCompatible);
        const positiveFunctions = new Set(['fract', 'abs', 'sqrt', 'exp', 'cosh', 'acos', 'acosh']);
        if (positiveFunctions.has(this.names[this.names.length - 1]))
            result.isPositive = true;
        let incompatibleFunctions = new Set(['log', 'ln', 'sqrt']);
        if (incompatibleFunctions.has(this.names[this.names.length - 1]) && !args[0].isPositive)
            result.isCompatible = false;
        incompatibleFunctions = new Set(['asin', 'acos', 'acosh', 'atanh', 'acoth']);
        if (incompatibleFunctions.has(this.names[this.names.length - 1]))
            result.isCompatible = false;
        return result;
    };
    this.subLatex = function (args) {
        if (/%0/.test(this.latex)) {
            var latexes = [];
            for (var i = 0; i < args.length; i++)
                latexes.push(args[i].latex);
            return this.latex.replaceAll("%0", latexes.join(','));
        }
        if (args.length != this.numArgs)
            throw "Incorrect number of arguments for function " + this.names[0];
        var latex = this.latex;
        for (var i = 0; i < args.length; i++) {
            var repv = "%" + (i + 1);
            latex = latex.replaceAll(repv, args[i].latex);
        }
        return latex;
    }
}
const mathFunctions = (function () {
    const funs0 = [
        new MathFunction(['if'], 3, '\\operatorname{if}\\left\\{%1>0:%2,%3\\right\\}', '((%1)>0.?%2:%3)', '((%1)>0.?$2:$3)'),  // not efficient in GLSL because all are evaluated
        new MathFunction(['mod'], 2, '\\operatorname{mod}\\left(%1,%2\\right)', 'mod(%1,%2)', '$1'),
        new MathFunction(['fract', 'frac'], 1, '\\operatorname{frac}\\left(%1\\right)', 'fract(%1)', '$1'),
        new MathFunction(['floor'], 1, '\\lfloor{%1}\\rfloor', 'floor(%1)', 'vec3(0)'),
        new MathFunction(['ceil'], 1, '\\lceil{%1}\\rceil', 'ceil(%1)', 'vec3(0)'),
        new MathFunction(['round'], 1, '\\operatorname{round}\\left(%1\\right)', 'round(%1)', 'vec3(0)'),
        new MathFunction(['abs'], 1, '\\left|%1\\right|', 'abs(%1)', '($1*sign(%1))'),
        new MathFunction(['sign', 'sgn'], 1, '\\operatorname{sign}\\left(%1\\right)', 'sign(%1)', 'vec3(0)'),
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
        new MathFunction(['csch'], 1, '\\mathrm{csch}\\left(%1\\right)', '(1.0/sinh(%1))', '(-$1/(sinh(%1)*tanh(%1)))'),
        new MathFunction(['sech'], 1, '\\mathrm{sech}\\left(%1\\right)', '(1.0/cosh(%1))', '(-$1*tanh(%1)/cosh(%1))'),
        new MathFunction(['coth'], 1, '\\mathrm{coth}\\left(%1\\right)', '(1.0/tanh(%1))', '(-$1/(sinh(%1)*sinh(%1)))'),
        new MathFunction(['arcsin', 'arsin', 'asin'], 1, '\\arcsin\\left(%1\\right)', 'asin(%1)', '($1/sqrt(1.-%1*%1))'),
        new MathFunction(['arccos', 'arcos', 'acos'], 1, '\\arccos\\left(%1\\right)', 'acos(%1)', '(-$1/sqrt(1.-%1*%1))'),
        new MathFunction(['arctan', 'artan', 'atan'], 1, '\\arctan\\left(%1\\right)', 'atan(%1)', '($1/(1.+%1*%1))'),
        new MathFunction(['atan2', 'arctan', 'artan', 'atan'], 2, '\\operatorname{atan2}\\left(%1,%2\\right)', 'atan(%1,%2)', '((%2*$1-%1*$2)/(%1*%1+%2*%2))'),
        new MathFunction(['arccot', 'arcot', 'acot'], 1, '\\mathrm{arccot}\\left(%1\\right)', '(0.5*PI-atan(%1))', '(-($1)/(1.+%1*%1))'),
        new MathFunction(['arcsinh', 'arsinh', 'asinh'], 1, '\\mathrm{arcsinh}\\left(%1\\right)', 'asinh(%1)', '($1/sqrt(%1*%1+1.))'),
        new MathFunction(['arccosh', 'arcosh', 'acosh'], 1, '\\mathrm{arccosh}\\left(%1\\right)', 'acosh(%1)', '($1/sqrt(%1*%1-1.))'),
        new MathFunction(['arctanh', 'artanh', 'atanh'], 1, '\\mathrm{arctanh}\\left(%1\\right)', 'atanh(%1)', '($1/(1.-%1*%1))'),
        new MathFunction(['arccoth', 'arcoth', 'acoth'], 1, '\\mathrm{arccoth}\\left(%1\\right)', 'atanh(1./(%1))', '($1/(1.-%1*%1))'),
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
                args1.push(new EvalObject(
                    args[i].postfix.concat(args[i + 1].postfix).concat([new Token('function', this.names[0])]),
                    glsl, glslgrad, args[i].isNumeric && args[i + 1].isNumeric,
                    this.names[0] == 'max' && (args[i].isPositive || args[i + 1].isPositive),
                    args[i].isCompatible && args[i + 1].isCompatible));
            }
            if (args.length % 2 == 1) args1.push(args[args.length - 1]);
            args = args1;
        }
        return args[0];
    };
    return funs;
})();

// test if the variable name is an independent variable
function isIndependentVariable(name) {
    return name == 'x' || name == 'y' || name == 'z';
}


// ============================ PARSING ==============================

// Balance parenthesis, used to be part of exprToPostfix()
function balanceParenthesis(expr) {
    expr = expr.trim().replace(/\[/g, '(').replace(/\]/g, ')');
    if (expr == "") throw "Empty expression";
    var exprs = [{ str: "", parenCount: 0, absCount: 0 }];
    for (var i = 0; i < expr.length; i++) {
        if (expr[i] == "(") {
            exprs.push({ str: expr[i], parenCount: 1, absCount: 0 });
        }
        else if (expr[i] == ")") {
            if (exprs[exprs.length - 1].parenCount <= 0) throw "Mismatched parenthesis";
            //if (exprs[exprs.length - 1].absCount % 2 != 0) throw "Mismatched absolute value vertical bar";
            var app = exprs[exprs.length - 1].str;
            for (var j = 0; j < exprs[exprs.length - 1].parenCount; j++)
                app += ")";
            exprs.pop();
            exprs[exprs.length - 1].str += app;
        }
        else if (expr[i] == "|") {
            if (exprs[exprs.length - 1].absCount % 2 == 0) {
                exprs[exprs.length - 1].str += "abs(";
                exprs[exprs.length - 1].parenCount += 1;
            }
            else {
                exprs[exprs.length - 1].str += ")";
                exprs[exprs.length - 1].parenCount -= 1;
            }
            exprs[exprs.length - 1].absCount += 1;
        }
        else {
            exprs[exprs.length - 1].str += expr[i];
        }
    }
    while (exprs.length != 0) {
        let back = exprs[exprs.length - 1];
        if (back.parenCount < 0) throw "Mismatched parenthesis";
        while (back.parenCount > 0)
            back.str += ")", back.parenCount -= 1;
        if (exprs.length <= 1) break;
        exprs.pop(); exprs[exprs.length - 1].str += back.str;
    }
    return exprs[0].str;
}

// Parse a human math expression to postfix notation
function exprToPostfix(expr, mathFunctions) {
    expr = balanceParenthesis(expr);

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
            if (expr[i] == '(') {
                eb.s += expr[i];
                eb.pc += 1;
            }
            else if (expr[i] == ')') {
                while (expr1s[expr1s.length - 1].pc == 0) {
                    var s1 = expr1s[expr1s.length - 1].s;
                    if (/^\-/.test(s1)) s1 = "(0" + s1 + ")";
                    expr1s.pop();
                    expr1s[expr1s.length - 1].s += s1;
                }
                eb = expr1s[expr1s.length - 1];
                eb.s += expr[i];
                eb.pc -= 1;
            }
            else eb.s += expr[i];
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
        //console.assert(eb.pc == 0);
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
                else if (!has_ && /[A-Za-z\d\.]/.test(expr1[expr1.length - 1]) && /[A-Za-z]/.test(v[j]) && v[j] != "_")
                    expr1 += "*";
                else if (!has_ && /[A-Za-z]/.test(expr1[expr1.length - 1]) && /\d/.test(v[j]))
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
            if (v[j] == ")" || v[j] == "(") has_ = false;
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
    const operators = {
        '+': 1, '-': 1,
        '*': 2, '/': 2,
        '^': 3
    };
    const isLeftAssociative = {
        '+': true, '-': true, '*': true, '/': true,
        '^': false
    };

    // console.log("preprocessed", expr);

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
            if (!isFinite(Number(token))) throw "Failed to parse number " + token;
            var num = token.trim('0');
            if (num == "") num = "0.";
            if (num[0] == '.') num = "0" + num;
            if (!/\./.test(num)) num += ".";
            queue.push(new Token("number", num));
        }
        // function
        else if (mathFunctions[token] != undefined) {
            var fun = new Token("function", token);
            stack.push(fun);
        }
        // variable name
        else if (/^[A-Za-z](_[A-Za-z0-9]+)?$/.test(token)) {
            var variable = new Token("variable", token);
            queue.push(variable);
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
        // absolute value
        else if (token == "|") {
            var fun = new Token("function", "abs");
            fun.numArgs = 1;
            if (stack.length >= 2 && stack[stack.length - 1].str != "(" && stack[stack.length - 2].str == "|") {
                queue.push(stack[stack.length - 1]);
                stack.pop(); stack.pop();
                queue.push(fun);
            }
            else if (stack.length >= 1 && stack[stack.length - 1].str == "|") {
                stack.pop();
                queue.push(fun);
            }
            else stack.push(new Token(null, token));
        }
        else {
            throw "Unrecognized token " + token;
        }
    }
    while (stack.length != 0) {
        queue.push(stack[stack.length - 1]);
        stack.pop();
    }
    return queue;
}

// Get a list of variables from a postfix notation
function getVariables(postfix, excludeIndependent) {
    var vars = new Set();
    for (var i = 0; i < postfix.length; i++) {
        if (postfix[i].type == 'variable') {
            if (excludeIndependent && isIndependentVariable(postfix[i].str))
                continue;
            vars.add(postfix[i].str);
        }
    }
    return vars;
}

// Parse console input to postfix notation
function parseInput(input) {
    // split to arrays
    input = input.replaceAll('\r', ';').replaceAll('\n', ';');
    input = input.trim().trim(';').trim().split(';');

    // read each line of input
    let reVarname = /^[A-Za-z]((_[A-Za-z\d]+)|(_?\d[A-Za-z\d]*))?$/;
    var parseFunction = function (funstr) {
        var match = /^([A-Za-z0-9_]+)\s*\(([A-Za-z0-9_\s\,]+)\)$/.exec(funstr);
        if (match == null) return false;
        if (!reVarname.test(match[1])) return false;
        if (match[1] == "e") return false;
        var matches = [match[1]];
        match = match[2].split(',');
        for (var i = 0; i < match.length; i++) {
            var name = match[i];
            if (!reVarname.test(name)) return false;
            if (name.length >= 2 && name[1] != "_")
                name = name[0] + "_" + name.substring(1, name.length);
            matches.push(name);
        }
        return matches;
    };
    var functions_str = {};
    var variables_str = {};
    var mainEqusLr = [];  // main equation left/right
    for (var i = 0; i < input.length; i++) {
        var line = input[i].trim();
        if (/\#/.test(line)) line = line.substring(0, line.search('#')).trim();
        if (line == '') continue;
        if (/\=/.test(line)) {
            var lr = line.split('=');
            var left = lr[0].trim();
            var right = lr[1].trim();
            // variable
            if (reVarname.test(left)) {
                if (left.length >= 2 && left[1] != "_") left = left[0] + "_" + left.substring(1, left.length);
                // main equation
                if (isIndependentVariable(left)) {
                    mainEqusLr.push({ left: balanceParenthesis(left), right: balanceParenthesis(right) });
                }
                // definition
                else {
                    if (variables_str[left] != undefined)
                        throw "Multiple definitions of variable " + left;
                    if (left == "e")
                        throw "You can't use constant 'e' as a variable name.";
                    variables_str[left] = right;
                }
            }
            // function
            else if (parseFunction(left)) {
                var fun = parseFunction(left);
                // main equation
                if (mathFunctions[fun[0]] != undefined) {
                    mainEqusLr.push({ left: left, right: balanceParenthesis(right) });
                }
                // function definition
                else {
                    if (functions_str[fun[0]] != undefined)
                        throw "Multiple definitions of function " + fun[0];
                    functions_str[fun[0]] = {
                        params: fun.slice(1),
                        definition: right
                    };
                }
            }
            // main equation
            else {
                if (Number(right) == '0') mainEqusLr.push({ left: balanceParenthesis(left), right: '0' });
                else mainEqusLr.push({ left: balanceParenthesis(left), right: balanceParenthesis(right) });
            }
        }
        // main equation
        else {
            mainEqusLr.push({ left: line, right: '0' })
        }
    }

    // parse expressions
    var functions = {};
    for (var funname in mathFunctions) functions[funname] = mathFunctions[funname];
    for (var funname in functions_str) {
        let fun = functions_str[funname];
        functions[funname] = {
            'args': fun.params,
            'numArgs': fun.params.length,
            'definition': fun.definition,
            'postfix': null,
            'resolving': false
        }
    }
    for (var funname in functions_str) {
        let fun = functions[funname];
        for (var i = 0; i < fun.numArgs; i++) {
            if (functions_str.hasOwnProperty(fun.args[i]))
                throw "You can't use function name \"" + fun.args[i] + "\" as a function argument name.";
        }
        fun.postfix = exprToPostfix(fun.definition, functions);
    }
    var variables = {};
    for (var varname in variables_str) {
        var postfix = exprToPostfix(variables_str[varname], functions);
        variables[varname] = {
            'postfix': postfix,
            'isFunParam': false,
            'resolving': false
        };
    }
    var mainEqus = [];
    for (var i = 0; i < mainEqusLr.length; i++) {
        mainEqusLr[i].left = exprToPostfix(mainEqusLr[i].left, functions);
        mainEqusLr[i].right = exprToPostfix(mainEqusLr[i].right, functions);
        if (mainEqusLr[i].right.length == 1 && Number(mainEqusLr[i].right[0].str) == 0) {
            mainEqus.push(mainEqusLr[i].left);
        }
        else {
            var left = mainEqusLr[i].left;
            var right = mainEqusLr[i].right;
            mainEqus.push(left.concat(right).concat([new Token('operator', '-')]));
        }
    }

    // resolve dependencies
    function dfs(equ, variables) {
        var stack = [];
        for (var i = 0; i < equ.length; i++) {
            if (equ[i].type == 'number') {
                stack.push([equ[i]]);
            }
            else if (equ[i].type == 'variable') {
                var variable = variables[equ[i].str];
                if (variable == undefined) {
                    stack.push([equ[i]]);
                }
                else if (variable.isFunParam) {
                    stack.push(variable.postfix);  // ???
                }
                else {
                    if (variable.resolving) throw "Recursive definition is not supported.";
                    variable.resolving = true;
                    var res = dfs(variable.postfix, variables)[0];
                    stack.push(res);
                    variable.resolving = false;
                }
            }
            else if (equ[i].type == 'function') {
                // user-defined function
                if (mathFunctions[equ[i].str] == undefined) {
                    let fun = functions[equ[i].str];
                    var variables1 = {};
                    for (var varname in variables)
                        variables1[varname] = variables[varname];
                    if (stack.length < fun.numArgs)
                        throw "No enough arguments for function " + equ[i].str;
                    for (var j = 0; j < fun.numArgs; j++) {
                        variables1[fun.args[j]] = {
                            'postfix': stack[stack.length - fun.numArgs + j],
                            'isFunParam': true,
                            'resolving': false
                        };
                    }
                    for (var j = 0; j < equ[i].numArgs; j++)
                        stack.pop();
                    var res = dfs(fun.postfix, variables1)[0];
                    stack.push(res);
                }
                // built-in function
                else {
                    var params = [];
                    for (var j = equ[i].numArgs; j > 0; j--)
                        params = params.concat(stack[stack.length - j]);
                    for (var j = 0; j < equ[i].numArgs; j++)
                        stack.pop();
                    params.push(equ[i]);
                    stack.push(params);
                }
            }
            else if (equ[i].type == 'operator') {
                if (stack.length < 2) throw "No enough tokens in the stack"
                var expr = stack[stack.length - 2].concat(stack[stack.length - 1]);
                expr.push(equ[i]);
                stack.pop(); stack.pop();
                stack.push(expr);
            }
            else {
                throw "Unrecognized token " + equ[i];
            }
            var totlength = 0;
            for (var j = 0; j < stack.length; j++) totlength += stack[j].length;
            if (totlength >= 65536) {
                throw "Definitions are nested too deeply."
            }
        }
        if (stack.length != 1) throw "Result stack length is not 1";
        return stack;
    }
    for (var i = 0; i < mainEqus.length; i++)
        mainEqus[i] = dfs(mainEqus[i], variables)[0];

    // latex
    var latexList = [];
    for (var i = 0; i < input.length; i++) {
        var line = input[i].trim();
        var comment = "";
        if (/\#/.test(line)) {
            var j = line.search('#');
            comment = '# ' + line.substr(j + 1, line.length).trim();
            line = line.substring(0, j).trim();
        }
        if (line == '' && comment == '') continue;
        if (line != "") {
            var left = line, right = "0";
            if (/\=/.test(line)) {
                var lr = line.split('=');
                left = lr[0].trim(), right = lr[1].trim();
            }
            left = postfixToLatex(exprToPostfix(left, functions));
            right = postfixToLatex(exprToPostfix(right, functions));
            line = left + "=" + right;
        }
        if (comment != "") {
            comment = comment.replaceAll("\\", "\\\\").replaceAll("$", "\\$");
            comment = comment.replaceAll("{", "\\{").replaceAll("}", "\\}");
            comment = "\\color{#5b5}\\texttt{" + comment + "}";
            if (line != "") comment = "\\quad" + comment;
        }
        latexList.push(line + comment);
    }
    return {
        postfix: mainEqus,
        latex: latexList
    }
}


// ============================ EVALUATION ==============================

// operations of EvabObject
function addEvalObjects(a, b) {
    return new EvalObject(
        a.postfix.concat(b.postfix.concat([new Token('operator', '+')])),
        "(" + a.glsl + "+" + b.glsl + ")",
        a.isNumeric ? b.glslgrad : b.isNumeric ? a.glslgrad :
            "(" + a.glslgrad + "+" + b.glslgrad + ")",
        a.isNumeric && b.isNumeric, a.isPositive && b.isPositive, a.isCompatible && b.isCompatible
    );
}
function subEvalObjects(a, b) {
    return new EvalObject(
        a.postfix.concat(b.postfix.concat([new Token('operator', '-')])),
        "(" + a.glsl + "-" + b.glsl + ")",
        b.isNumeric ? a.glslgrad : a.isNumeric ? "(-" + b.glslgrad + ")" :
            "(" + a.glslgrad + "-" + b.glslgrad + ")",
        a.isNumeric && b.isNumeric, false, a.isCompatible && b.isCompatible
    );
}
function mulEvalObjects(a, b) {
    return new EvalObject(
        a.postfix.concat(b.postfix.concat([new Token('operator', '*')])),
        "(" + a.glsl + "*" + b.glsl + ")",
        a.isNumeric ? "(" + a.glsl + "*" + b.glslgrad + ")" :
            b.isNumeric ? "(" + a.glslgrad + "*" + b.glsl + ")" :
                "(" + a.glslgrad + "*" + b.glsl + "+" + a.glsl + "*" + b.glslgrad + ")",
        a.isNumeric && b.isNumeric, a.isPositive && b.isPositive, a.isCompatible && b.isCompatible
    );
}
function divEvalObjects(a, b) {
    return new EvalObject(
        a.postfix.concat(b.postfix.concat([new Token('operator', '/')])),
        "(" + a.glsl + "/" + b.glsl + ")",
        a.isNumeric && b.isNumeric ? "vec3(0)" :
            b.isNumeric ? "(" + a.glslgrad + "/" + b.glsl + ")" :
                a.isNumeric ? "(-" + a.glsl + "*" + b.glslgrad + "/(" + b.glsl + "*" + b.glsl + "))" :
                    "((" + a.glslgrad + "*" + b.glsl + "-" + a.glsl + "*" + b.glslgrad + ")/(" + b.glsl + "*" + b.glsl + "))",
        a.isNumeric && b.isNumeric, a.isPositive && b.isPositive, a.isCompatible && b.isCompatible
    );
}
function powEvalObjects(a, b) {
    if (a.glsl == 'e' || a.glsl == '' + Math.E) {
        return new EvalObject(
            a.postfix.concat(b.postfix.concat([new Token('operator', '^')])),
            "exp(" + b.glsl + ")",
            "(" + b.glslgrad + "*exp(" + b.glsl + "))",
            b.isNumeric, true, b.isCompatible
        )
    }
    var n = Number(b.glsl);
    if (n == 0) return new EvalObject([new Token("number", '1.')], "1.", "vec3(0)", true, true);
    if (n == 1) return a;
    if (n == 2 || n == 3 || n == 4 || n == 5 || n == 6 || n == 7 || n == 8) {
        var arr = [];
        for (var i = 0; i < n; i++) arr.push(a.glsl);
        var glsl = "(" + arr.join('*') + ")";
        arr[0] = a.glslgrad;
        var glslgrad = a.isNumeric ? "vec3(0)" : "(" + n + ".*" + arr.join('*') + ")";
        return new EvalObject(
            a.postfix.concat(b.postfix.concat([new Token('operator', '^')])),
            glsl, glslgrad,
            a.isNumeric, n % 2 == 0, a.isCompatible
        )
    }
    return new EvalObject(
        a.postfix.concat(b.postfix.concat([new Token('operator', '^')])),
        "pow(" + a.glsl + "," + b.glsl + ")",
        a.isNumeric && b.isNumeric ? "vec3(0)" :
            a.isNumeric ? "(pow(" + a.glsl + "," + b.glsl + ")*log(" + a.glsl + ")*" + b.glslgrad + ")" :
                b.isNumeric ? "(" + b.glsl + "*pow(" + a.glsl + "," + b.glsl + "-1.)*" + a.glslgrad + ")" :
                    "(" + b.glsl + "*pow(" + a.glsl + "," + b.glsl + "-1.)*" + a.glslgrad +
                    "+pow(" + a.glsl + "," + b.glsl + ")*log(" + a.glsl + ")*" + b.glslgrad + ")",
        a.isNumeric && b.isNumeric, a.isPositive, a.isPositive
    )
}

// Convert a post-polish math expression to GLSL code
function postfixToGlsl(queue) {
    // subtree counter
    var subtreesLength = 0;
    var subtrees = {};
    var intermediates = [];
    function addSubtree(evalobj) {
        let postfix = evalobj.postfix;
        var key = [];
        for (var i = 0; i < postfix.length; i++) key.push(postfix[i].str);
        key = key.join(',');
        if (!subtrees.hasOwnProperty(key)) {
            var id = '' + subtreesLength;
            subtrees[key] = {
                id: id,
                length: postfix.length,
                postfix: postfix,
            };
            intermediates.push({
                id: id,
                glsl: evalobj.glsl,
                glslgrad: evalobj.glslgrad
            });
            subtreesLength += 1;
        }
        return subtrees[key].id;
    }
    // postfix evaluation
    var stack = [];  // EvalObject objects
    for (var i = 0; i < queue.length; i++) {
        var token = queue[i];
        // number
        if (token.type == 'number') {
            var s = token.str;
            if (!/\./.test(s)) s += '.';
            stack.push(new EvalObject([token], s, "vec3(0)", true, !/-/.test(s), true));
        }
        // variable
        else if (token.type == "variable") {
            var s = token.str;
            var grad = "vec3(0)";
            var isNumeric = false;
            if (isIndependentVariable(token.str)) {
                if (token.str == 'x') grad = "vec3(1,0,0)";
                if (token.str == 'y') grad = "vec3(0,1,0)";
                if (token.str == 'z') grad = "vec3(0,0,1)";
            }
            else if (token.str == "e") {
                s = '' + Math.E;
                isNumeric = true;
            }
            else {
                throw "Undeclared variable " + token.str;
            }
            stack.push(new EvalObject([token], s, grad, grad == "0", isNumeric, true));
        }
        // operators
        else if (token.type == "operator") {
            var v = null;
            if (token.str == "^") {
                var v1 = stack[stack.length - 2];
                var v2 = stack[stack.length - 1];
                stack.pop(); stack.pop();
                v = powEvalObjects(v1, v2);
            }
            else {
                var v1 = stack[stack.length - 2];
                var v2 = stack[stack.length - 1];
                stack.pop(); stack.pop();
                if (token.str == "+") v = addEvalObjects(v1, v2);
                if (token.str == "-") v = subEvalObjects(v1, v2);
                if (token.str == "*") v = mulEvalObjects(v1, v2);
                if (token.str == "/") v = divEvalObjects(v1, v2);
            }
            var id = addSubtree(v);
            v.postfix = [new Token('variable', id)];
            v.glsl = "v" + id;
            v.glslgrad = "g" + id;
            stack.push(v);
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
            var v = fun.subGlsl(args);
            var id = addSubtree(v);
            v.postfix = [new Token('variable', id)];
            v.glsl = "v" + id;
            v.glslgrad = "g" + id;
            stack.push(v);
        }
        else {
            throw "Unrecognized token " + equ[i];
        }
    }
    if (stack.length != 1) throw "Result stack length is not 1";
    // get result
    var result = {
        glsl: [],
        glslgrad: [],
        isCompatible: stack[0].isCompatible
    };
    for (var i = 0; i < intermediates.length; i++) {
        let intermediate = intermediates[i];
        var v = "float v" + intermediate.id + " = " + intermediate.glsl + ";";
        var g = "vec3 g" + intermediate.id + " = " + intermediate.glslgrad + ";";
        result.glsl.push(v);
        result.glslgrad.push(v);
        result.glslgrad.push(g);
    }
    result.glsl.push("return " + stack[0].glsl + ";");
    result.glsl = result.glsl.join('\n');
    result.glslgrad.push("return " + stack[0].glslgrad + ";");
    result.glslgrad = result.glslgrad.join('\n');
    return result;
}

// Convert a post-polish math expression to LaTeX code
function postfixToLatex(queue) {
    const operators = {
        '-': 1, '+': 1,
        '*': 2, '/': 2,
        '^': 3
    };
    function varnameToLatex(varname) {
        if (varname.length >= 2 && varname[1] != "_")
            varname = varname[0] + "_" + varname.substring(1, varname.length);
        if (/_/.test(varname)) {
            var j = varname.search('_');
            varname = varname.substring(0, j + 1) + "{" + varname.substring(j + 1, varname.length) + "}";
        }
        return varname;
    }
    var stack = [];
    for (var i = 0; i < queue.length; i++) {
        var token = queue[i];
        // number
        if (token.type == 'number') {
            var s = token.str.replace(/\.$/, "");
            if (s == "" || s[0] == ".") s = "0" + s;
            stack.push(new EvalLatexObject([token], s, Infinity));
        }
        // variable
        else if (token.type == "variable") {
            var s = varnameToLatex(token.str);
            if (s == "e") s = "\\operatorname{e}";
            //else if (!isIndependentVariable(s)) s = "{\\color{red}{" + s + "}}";
            stack.push(new EvalLatexObject([token], s, Infinity));
        }
        // operators
        else if (token.type == "operator") {
            var precedence = operators[token.str];
            var v1 = stack[stack.length - 2];
            var v2 = stack[stack.length - 1];
            stack.pop(); stack.pop();
            var tex1 = v1.latex, tex2 = v2.latex;
            if (token.str != "/" && !(token.str == "^" && tex1 == "\\operatorname{e}")) {
                if (precedence > v1.precedence)
                    tex1 = "\\left(" + tex1 + "\\right)";
                if (precedence >= v2.precedence)
                    tex2 = "\\left(" + tex2 + "\\right)";
            }
            var latex = "";
            if (token.str == "-") {
                if (v1.latex == "0") latex = "-" + tex2;
                else latex = tex1 + "-" + tex2;
            }
            else if (token.str == "+") {
                latex = tex1 + "+" + tex2;
            }
            else if (token.str == "*") {
                if (/^[\{\s]*[\d\.]/.test(tex2))
                    latex = "{" + tex1 + "}\\cdot{" + tex2 + "}";
                else latex = "{" + tex1 + "}{" + tex2 + "}";
            }
            else if (token.str == "/") {
                latex = "\\frac{" + tex1 + "}{" + tex2 + "}";
            }
            else if (token.str == "^") {
                latex = "{" + tex1 + "}^{" + tex2 + "}";
            }
            else throw "Unrecognized operator" + token.str;
            var obj = new EvalLatexObject(
                v1.postfix.concat(v2.postfix).concat([token]),
                latex, precedence);
            stack.push(obj);
        }
        // function
        else if (token.type == 'function') {
            var numArgs = token.numArgs;
            var args = [];
            for (var j = numArgs; j > 0; j--)
                args.push(stack[stack.length - j]);
            for (var j = 0; j < numArgs; j++)
                stack.pop();
            var fun = mathFunctions[token.str];
            if (fun != undefined) {
                if (fun['' + numArgs] == undefined) fun = fun['0'];
                else fun = fun['' + numArgs];
                if (fun == undefined) throw "Incorrect number of function arguments for " + token.str;
                stack.push(new EvalLatexObject(
                    args.concat([token]), fun.subLatex(args), Infinity));
            }
            else {
                var argsLatex = [];
                for (var j = 0; j < numArgs; j++) argsLatex.push(args[j].latex);
                stack.push(new EvalLatexObject(
                    args.concat([token]),
                    varnameToLatex(token.str) + "\\left(" + argsLatex.join(',') + "\\right)",
                    Infinity
                ));
            }
        }
        else {
            throw "Unrecognized token " + equ[i];
        }
    }
    if (stack.length != 1) throw "Result stack length is not 1";
    return stack[0].latex;
}


// ============================ BUILT-IN ==============================


var builtinFunctions = [
    ["A6 Heart", "(x^2+9/4*y^2+z^2-1)^3=(x^2+9/80*y^2)*z^3"],
    ["A6 Fox", "2(x^2+2y^2+z^2)^3-2(9x^2+y^2)z^3=1"],
    ["A5 Star", "4(x^2+2y^2+z^2-1)^2-z(5x^4-10x^2z^2+z^4)=1"],
    ["A7 Genus 2", "2y(y^2-3x^2)(1-z^2)+(x^2+y^2)^2-(9z^2-1)(1-z^2)"],
    ["A4 Goursat", "2(x^4+y^4+z^4)-3(x^2+y^2+z^2)+2"],
    ["A4 Genus 3", "(x^2-1)^2+(y^2-1)^2+(z^2-1)^2+4(x^2y^2+x^2z^2+y^2z^2)+8xyz-2(x^2+y^2+z^2)"],
    ["A4 Crescent", "(2x^2+2y^2+4z^2+x+3)^2=32(x^2+y^2)"],
    ["A6 Spiky 1", "(x^2+y^2+z^2-2)^3+2000(x^2y^2+x^2z^2+y^2z^2)=10"],
    ["A6 Spiky 2", "z^6-5(x^2+y^2)z^4+5(x^2+y^2)^2z^2-2(x^4-10x^2y^2+5y^4)xz-1.002(x^2+y^2+z^2)^3+0.2"],
    ["A6 Barth", "4(x^2-y^2)(y^2-z^2)(z^2-x^2)-3(x^2+y^2+z^2-1)^2"],
    ["A3 Ding-Dong", "x^2+y^2=(1-z)z^2"],
    ['A3 Bridge', "x^2+y^2z+z^2=0.01"],
    ["Radical Heart", "x^2+4y^2+(1.15z-0.6(2(x^2+.05y^2+.001)^0.7+y^2)^0.3+0.3)^2=1"],
    ["Ln Wineglass", "x^2+y^2-ln(z+1)^2-0.02"],
    ["Spheres", "(sin(2x)sin(2y)sin(2z)-0.9)e^(x+y)"],
    ["Noisy Sphere", "x^2+y^2+z^2=1+0.1sin(10x)sin(10y)sin(10z)"],
    ["Noisy Octahedron", "abs(x)+abs(y)+abs(z)-2+cos(10x)cos(10y)cos(10z)"],
    ["Noisy Peanut", "1/((x-1)^2+y^2+z^2)+1/((x+1)^2+y^2+z^2)-1-0.01(cos(30x)+cos(30y)cos(30z))"],
    ["Sin Terrace", "z=0.25round(4sin(x)sin(y))"],
    ["Tan Cells", "z=1/((tan(x)tan(y))^2+1)-1/2"],
    ["Tan Forest", "z=.2tan(asin(cos(5x)cos(5y)))+.5sin(10z)"],
    ["Sin Field", "z=100sin(x-sqrt(x^2+y^2))^8sin(y+sqrt(x^2+y^2)-z)^8/(x^2+y^2+50)"],
    ["Sin Tower 1", "4z+6=1/((sin(4x)sin(4y))^2+0.4sqrt(x^2+y^2+0.02))-sin(4z)"],
    ["Sin Tower 2", "4z+6=1/((sin(4x)sin(4y))^2+0.4sqrt(x^2+y^2+0.005z^2))-4sin(8z)"],
    ["Atan2 Drill", "max(cos(atan(y,x)-20e^((z-1)/4)),x^2+y^2+z/2-1)"],
    ["Atan2 Flower", "a=atan2(y,x);(x^2+y^2)^2+16z^2=2(x^2+y^2)(sin(2.5a)^2+0.5sin(10a)^2)"],
    ["Log2 Spheres", "m=max(|x|,|y|,|z|);k=3/2-m;n=ceil(log(2,k))-2;(3*2^n-k)^2+(x^2+y^2+z^2-m^2)=4^n"],
    ["Lerp Example", "lerp(max(|x|,|y|,|z|),sqrt(x^2+y^2+z^2),-1)-0.3"],
    ["If Example", "z=if(sin(2x),1/5sin(2y),1/2cos(2y))"],
    ["Eyes", "a=3(z+x+1);b=3(z-x+1);sin(min(a*sin(b),b*sin(a)))-cos(max(a*cos(b),b*cos(a)))=(3-2z)/9+((2x^2+z^2)/6)^3+100y^2"],
    ["Spiral 1", "k=0.14;r=1/k*ln(sqrt(x^2+y^2));10((k(xcos(r)+ysin(r))-0.5^2(x^2+y^2))^2+z^2)=x^2+y^2"],
    ["Spiral 2", "k=0.15;r=1/k*ln(sqrt(x^2+y^2));n=0.5^2(x^2+y^2)-0.001sqrt(x^2+y^2)exp(sin(40atan(y,x)))/(z^2+0.01);(k*(xcos(r)+ysin(r))-n)^2+z^2=0.1(x^2+y^2)^1.4"],
    ["Spiral 3", "k=0.3;r=1/k*ln(sqrt(x^2+y^2));(k*(xcos(r)+ysin(r)))^2+z^2=0.1tanh(x^2+y^2+0.3)-0.01(x^2+y^2)"],
    ["Spiral 4", "k=0.14;r=sqrt(x^2+y^2+0.01^2);r1=1/k*ln(r);10((k(xcos(r1)+ysin(r1))-(0.5r)^2)^2+((z+0.5r-0.5)(r^2+0.1))^2)=r^2"],
    ["Atan2 Spiral", "k=0.15&ensp;#&ensp;r=e^kt;p=3.1415926&ensp;#&ensp;pi;#&ensp;polar&ensp;coordinates;r=2sqrt(x^2+y^2);a=atan(y,x);#&ensp;index&ensp;of&ensp;spiral&ensp;layer;n=min((log(r)/k-a)/(2p),1);#&ensp;distance&ensp;to&ensp;logarithmic&ensp;spiral;d(n)=abs(e^(k*(2pn+a))-r);d1=min(d(floor(n)),d(ceil(n)));sqrt(d1^2+4z^2)=0.4r^0.7(1+0.01sin(40a))"],
    ["Atomic Orbitals", "r2(x,y,z)=x^2+y^2+z^2;r(x,y,z)=sqrt(r2(x,y,z));x1(x,y,z)=x/r(x,y,z);y1(x,y,z)=y/r(x,y,z);z1(x,y,z)=z/r(x,y,z);d(r0,x,y,z)=r0^2-r2(x,y,z);r00(x,y,z)=d(0.28,x,y,z);r10(x,y,z)=d(-0.49y1(x,y,z),x,y,z);r11(x,y,z)=d(0.49z1(x,y,z),x,y,z);r12(x,y,z)=d(-0.49x1(x,y,z),x,y,z);r20(x,y,z)=d(1.09x1(x,y,z)y1(x,y,z),x,y,z);r21(x,y,z)=d(-1.09y1(x,y,z)z1(x,y,z),x,y,z);r22(x,y,z)=d(0.32(3z1(x,y,z)^2-1),x,y,z);r23(x,y,z)=d(-1.09x1(x,y,z)z1(x,y,z),x,y,z);r24(x,y,z)=d(0.55(x1(x,y,z)^2-y1(x,y,z)^2),x,y,z);max(r00(x,y,z-1.5),r10(x+1,y,z-0.4),r11(x,y,z-0.4),r12(x-1,y,z-0.4),r20(x+2,y,z+1),r21(x+1,y,z+1),r22(x,y,z+1),r23(x-1,y,z+1),r24(x-2,y,z+1))"],
    ["Value Noise", "h(x,y)=fract(126sin(12x+33y+98))-0.5;s(x)=3x^2-2x^3;v00=h(floor(x),floor(y));v01=h(floor(x),floor(y)+1);v10=h(floor(x)+1,floor(y));v11=h(floor(x)+1,floor(y)+1);f(x,y)=mix(mix(v00,v01,s(fract(y))),mix(v10,v11,s(fract(y))),s(fract(x)));v(x,y)=f(x,y)+f(2x,2y)/2+f(4x,4y)/4+f(8x,8y)/8+f(16x,16y)/16;z=ln(1+exp(40(v(x,y)-(0.05(x^2+y^2))^2)))/40"],
    ["Fractal Roots", "u(x,y)=x^2-y^2+z;v(x,y)=2xy;u1(x,y)=u(u(x,y)+x,v(x,y)+y);v1(x,y)=v(u(x,y)+x,v(x,y)+y);u2(x,y)=u(u1(x,y)+x,v1(x,y)+y);v2(x,y)=v(u1(x,y)+x,v1(x,y)+y);log(u2(x,y)^2+v2(x,y)^2)=0"],
    ["Spiky Fractal", "u(x,y,z)=yz;v(x,y,z)=xz;w(x,y,z)=xy;u1(x,y,z)=u(u(x,y,z)+x,v(x,y,z)+y,w(x,y,z)+z);v1(x,y,z)=v(u(x,y,z)+x,v(x,y,z)+y,w(x,y,z)+z);w1(x,y,z)=w(u(x,y,z)+x,v(x,y,z)+y,w(x,y,z)+z);u2(x,y,z)=u(u1(x,y,z)+x,v1(x,y,z)+y,w1(x,y,z)+z);v2(x,y,z)=v(u1(x,y,z)+x,v1(x,y,z)+y,w1(x,y,z)+z);w2(x,y,z)=w(u1(x,y,z)+x,v1(x,y,z)+y,w1(x,y,z)+z);u3(x,y,z)=u(u2(x,y,z)+x,v2(x,y,z)+y,w2(x,y,z)+z);v3(x,y,z)=v(u2(x,y,z)+x,v2(x,y,z)+y,w2(x,y,z)+z);w3(x,y,z)=w(u2(x,y,z)+x,v2(x,y,z)+y,w2(x,y,z)+z);log(u3(x,y,z)^2+v3(x,y,z)^2+w3(x,y,z)^2)=log(0.01)"],
    ["Mandelbrot", "u(x,y)=x^2-y^2;v(x,y)=2xy;u1(x,y)=u(u(x,y)+x,v(x,y)+y);v1(x,y)=v(u(x,y)+x,v(x,y)+y);u2(x,y)=u(u1(x,y)+x,v1(x,y)+y);v2(x,y)=v(u1(x,y)+x,v1(x,y)+y);u3(x,y)=u(u2(x,y)+x,v2(x,y)+y);v3(x,y)=v(u2(x,y)+x,v2(x,y)+y);u4(x,y)=u(u3(x,y)+x,v3(x,y)+y);v4(x,y)=v(u3(x,y)+x,v3(x,y)+y;u5(x,y)=u(u4(x,y)+x,v4(x,y)+y);v5(x,y)=v(u4(x,y)+x,v4(x,y)+y);u6(x,y)=u(u5(x,y)+x,v5(x,y)+y);v6(x,y)=v(u5(x,y)+x,v5(x,y)+y);log(u6(x-1/2,sqrt(y^2+z^2))^2+v6(x-1/2,sqrt(y^2+z^2))^2)=0"],
    ["Burning Ship", "u(x,y)=x^2-y^2;v(x,y)=2abs(xy);u1(x,y)=u(u(x,y)+x,v(x,y)+y);v1(x,y)=v(u(x,y)+x,v(x,y)+y);u2(x,y)=u(u1(x,y)+x,v1(x,y)+y);v2(x,y)=v(u1(x,y)+x,v1(x,y)+y);u3(x,y)=u(u2(x,y)+x,v2(x,y)+y);v3(x,y)=v(u2(x,y)+x,v2(x,y)+y);u4(x,y)=u(u3(x,y)+x,v3(x,y)+y);v4(x,y)=v(u3(x,y)+x,v3(x,y)+y;u5(x,y)=u(u4(x,y)+x,v4(x,y)+y);v5(x,y)=v(u4(x,y)+x,v4(x,y)+y);u6(x,y)=u(u5(x,y)+x,v5(x,y)+y);v6(x,y)=v(u5(x,y)+x,v5(x,y)+y);z=(u6((x-1)/1.5,(y-1/2)/1.5)^2+v6((x-1)/1.5,(y-1/2)/1.5)^2)^-0.1-1"],
    ["Mandelbulb", "n=8;r=sqrt(x^2+y^2+z^2);a=atan(y,x);b=atan(sqrt(x^2+y^2),z);u(x,y,z)=r^n*sin(nb)cos(na);v(x,y,z)=r^n*sin(nb)sin(na);w(x,y,z)=r^n*cos(nb);u1(x,y,z)=u(u(x,y,z)+x,v(x,y,z)+y,w(x,y,z)+z);v1(x,y,z)=v(u(x,y,z)+x,v(x,y,z)+y,w(x,y,z)+z);w1(x,y,z)=w(u(x,y,z)+x,v(x,y,z)+y,w(x,y,z)+z);u2(x,y,z)=u(u1(x,y,z)+x,v1(x,y,z)+y,w1(x,y,z)+z);v2(x,y,z)=v(u1(x,y,z)+x,v1(x,y,z)+y,w1(x,y,z)+z);w2(x,y,z)=w(u1(x,y,z)+x,v1(x,y,z)+y,w1(x,y,z)+z);log(u2(x/2,y/2,z/2)^2+v2(x/2,y/2,z/2)^2+w2(x/2,y/2,z/2)^2)=0"],
    ["Conch (slow)", "p=3.1415926&ensp;#&ensp;pi;a_o=0.16*p&ensp;#&ensp;half&ensp;of&ensp;opening&ensp;angle;b=0.6&ensp;#&ensp;r=e^bt;s_min(a,b,k)=-1/k*ln(e^-ka+e^-kb)&ensp;#&ensp;smoothed&ensp;minimum;;#&ensp;Cross&ensp;section;C_m(u,v)=1-(1-0.01e^sin(12p(u+2v)))e^-(5v)^2&ensp;&ensp;#&ensp;mid&ensp;rod;C_s(u,v)=(sqrt((u-e^-16v)^2+(v(1-0.2exp(-4sqrt(u^2+0.1^2)))-0.5+0.5e^(-v)sin(4u)+0.2cos(2u)e^-v)^2)-0.55)tanh(5sqrt(2u^2+(v-1.2)^2))+0.01sin(40u)sin(40v)exp(-(u^2+v^2));C0(u,v)=abs(C_s(u,v))C_m(u,v)&ensp;#&ensp;single&ensp;layer;n1(u,v)=log(sqrt(u^2+v^2))/b+2&ensp;#&ensp;index&ensp;of&ensp;layer;a1(u,v)=atan(v,u)/a_o&ensp;#&ensp;opening&ensp;angle,&ensp;0-1;d1(u,v,s_d)=0.5sqrt(u^2+v^2)*C0(if(n1(u,v),n1(u,v)-s_d,fract(n1(u,v))-s_d),a1(u,v));C(u,v)=min(d1(u,v,0.5),d1(u,v,1.5))&ensp;#&ensp;cross&ensp;section;;#&ensp;Spiral;l_p(x,y)=exp(b*atan(y,x)/(2p))&ensp;#&ensp;a&ensp;multiplying&ensp;factor;U(x,y,z)=exp(log(-z)+b*atan(y,x)/(2p))&ensp;#&ensp;xyz&ensp;to&ensp;cross&ensp;section&ensp;u;V(x,y,z)=sqrt(x^2+y^2)*l_p(x,y)&ensp;#&ensp;xyz&ensp;to&ensp;cross&ensp;section&ensp;v;S_s(x,y,z)=C(U(x,y,z),V(x,y,z))/l_p(x,y)&ensp;#&ensp;body;S_o(x,y,z)=sqrt((C(exp(log(-z)-b/2),-x*exp(-b/2))*exp(b/2))^2+y^2)&ensp;#&ensp;opening;S_t(x,y,z)=d1(-z,sqrt(x^2+y^2),0.5)&ensp;#&ensp;tip;S_a(x,y,z)=if(-z,min(S_s(x,y,z),S_o(x,y,z)),S_t(x,y,z))&ensp;#&ensp;body+tip;S0(x,y,z)=S_a(x,y,z)-0.01-0.01(x^2+y^2+z^2)^0.4-0.02sqrt(x^2+y^2)exp(cos(8atan(y,x)))-0.007*(0.5-0.5tanh(10(z+1+8sqrt(3x^2+y^2))))&ensp;#&ensp;subtract&ensp;thickness;S(x,y,z)=-s_min(-S0(x,y,z),z+1.7,10)&ensp;#&ensp;clip&ensp;bottom;r_a=-0.05sin(3z)tanh(2(x^2+y^2-z-1.5))&ensp;#&ensp;distortion;S(0.4(x-r_a*y),0.4(y+r_a*x),0.4z-0.7)=0"]
];
if (0) builtinFunctions = [ // debug
    ['debug', "z=-e^-(x^2+y^2"],
    // ['bridge', "x^2+y^2z+z^2=0.01"],
    // ["A6 Heart", "(x^2+9/4*y^2+z^2-1)^3=(x^2+9/80*y^2)*z^3"],
    // ["test", "g(x,y)=tanh(x)*tanh(y);g(x+y,x-y)-z"],
    // ["test", "a=x^2+y^2;f(x)=sin(2x)+cos(2x);g(x,y)=tanh(x)*tanh(y);f(x)+f(y)=g(x+y,x-y)"],
    // ["A6 Barth 2", "4(2x^2-y^2)(2y^2-z^2)(2z^2-x^2)-4(x^2+y^2+z^2-1)^2"],
    // ["Globe", "a=atan(sqrt(x^2+y^2),z);t=atan(y,x);r=sqrt(x^2+y^2+z^2);1-0.01sin(a)(max(cos(12t)^2,cos(18a)^2)^40-1)=r"],
    // ["Atomic Orbitals f", "r2=x^2+y^2+z^2;r=sqrt(r2);x1=x/r;y1=y/r;z1=z/r;d(r0)=r0^2-r2;r00(x,y,z)=d(0.28);r10(x,y,z)=d(-0.49y1);r11(x,y,z)=d(0.49z1);r12(x,y,z)=d(-0.49x1);r20(x,y,z)=d(1.09x1y1);r21(x,y,z)=d(-1.09y1z1);r22(x,y,z)=d(0.32(3z1^2-1));r23(x,y,z)=d(-1.09x1z1);r24(x,y,z)=d(0.55(x1^2-y1^2));r30(x,y,z)=d(-0.59y1(3x1^2-y1^2));r31(x,y,z)=d(2.89x1y1z1);r32(x,y,z)=d(-0.46y1(5z1^2-1));r33(x,y,z)=d(0.37z1(5z1^2-3));r34(x,y,z)=d(-0.46x1(5z1^2-1));r35(x,y,z)=d(1.44z1(x1^2-y1^2));r36(x,y,z)=d(0.59x1(x1^2-3y1^2));s(x,y,z)=max(r00(x,y,z-2.5),r10(x+1,y,z-1.5),r11(x,y,z-1.5),r12(x-1,y,z-1.5),r20(x+2,y,z-0.2),r21(x+1,y,z-0.2),r22(x,y,z-0.2),r23(x-1,y,z-0.2),r24(x-2,y,z-0.2),r30(x-3,y,z+1.3),r31(x-2,y,z+1.3),r32(x-1,y,z+1.3),r33(x,y,z+1.3),r34(x+1,y,z+1.3),r35(x+2,y,z+1.3),r36(x+3,y,z+1.3));s(1.4x,1.4y,1.4z)"],
    // ["2D Mandelbrot", "u(x,y)=x^2-y^2;v(x,y)=2xy;u1(x,y)=u(u(x,y)+x,v(x,y)+y);v1(x,y)=v(u(x,y)+x,v(x,y)+y);u2(x,y)=u(u1(x,y)+x,v1(x,y)+y);v2(x,y)=v(u1(x,y)+x,v1(x,y)+y);u3(x,y)=u(u2(x,y)+x,v2(x,y)+y);v3(x,y)=v(u2(x,y)+x,v2(x,y)+y);u4(x,y)=u(u3(x,y)+x,v3(x,y)+y);v4(x,y)=v(u3(x,y)+x,v3(x,y)+y);z=0.5(u4(x,y)^2+v4(x,y)^2)^-0.1-1/2"],
    // ["Mandelbulb 3", "n=8;r=sqrt(x^2+y^2+z^2);a=atan(y,x);b=atan(sqrt(x^2+y^2),z);u(x,y,z)=r^n*sin(nb)cos(na);v(x,y,z)=r^n*sin(nb)sin(na);w(x,y,z)=r^n*cos(nb);u1(x,y,z)=u(u(x,y,z)+x,v(x,y,z)+y,w(x,y,z)+z);v1(x,y,z)=v(u(x,y,z)+x,v(x,y,z)+y,w(x,y,z)+z);w1(x,y,z)=w(u(x,y,z)+x,v(x,y,z)+y,w(x,y,z)+z);u2(x,y,z)=u(u1(x,y,z)+x,v1(x,y,z)+y,w1(x,y,z)+z);v2(x,y,z)=v(u1(x,y,z)+x,v1(x,y,z)+y,w1(x,y,z)+z);w2(x,y,z)=w(u1(x,y,z)+x,v1(x,y,z)+y,w1(x,y,z)+z);u3(x,y,z)=u(u2(x,y,z)+x,v2(x,y,z)+y,w2(x,y,z)+z);v3(x,y,z)=v(u2(x,y,z)+x,v2(x,y,z)+y,w2(x,y,z)+z);w3(x,y,z)=w(u2(x,y,z)+x,v2(x,y,z)+y,w2(x,y,z)+z);log(u3(x,y,z)^2+v3(x,y,z)^2+w3(x,y,z)^2)=0"],
    // ["Iteration", "f(t)=t^3-3t^2+3t-1;f(f(f(f(f(f(f(f(f(f(f(f(x)f(y)f(z)"]
];
if (typeof (window) === "undefined") {  // debug in node.js
    var t0 = performance.now();
    for (var i = 0; i < builtinFunctions.length; i++) {
        let name = builtinFunctions[i][0];
        let expr = builtinFunctions[i][1];
        var tt0 = performance.now();
        let parsed = parseInput(expr);
        // console.log(parsed.postfix);
        let glsl = postfixToGlsl(parsed.postfix[0]);
        // console.log(glsl);
        console.log(parsed.latex);
        console.log(name, performance.now() - tt0);
    }
    var dt = performance.now() - t0;
    console.log("All built-in functions parsed in", dt, "ms");
}