"use strict";


function toReal(x) {
    if (typeof x == "number")
        return x;
    if (x instanceof Complex)
        return x.re;
    var res = [];
    for (var i = 0; i < x.length; i++)
        res.push(toReal(x[i]));
    return res;
}


function Complex(re, im = 0) {
    this.re = re;
    this.im = im;
    this.mag2 = function () {
        return this.re * this.re + this.im * this.im;
    }
    this.abs = function () {
        return Math.sqrt(this.mag2());
    }
    this.conj = function () {
        return new Complex(this.re, -this.im);
    }
    this.add = function (that) {
        return new Complex(this.re + that.re, this.im + that.im);
    }
    this.sub = function (that) {
        return new Complex(this.re - that.re, this.im - that.im);
    }
    this.mul = function (that) {
        return new Complex(
            this.re * that.re - this.im * that.im,
            this.re * that.im + this.im * that.re
        );
    }
    this.div = function (that) {
        var r2 = that.mag2();
        return new Complex(
            (this.re * that.re + this.im * that.im) / r2,
            (this.im * that.re - this.re * that.im) / r2
        );
    }
    this.sin = function () {
        return new Complex(
            Math.sin(this.re) * Math.cosh(this.im),
            Math.cos(this.re) * Math.sinh(this.im)
        );
    }
    this.cos = function () {
        return new Complex(
            Math.cos(this.re) * Math.cosh(this.im),
            -Math.sin(this.re) * Math.sinh(this.im)
        );
    }
    this.log = function () {
        return new Complex(
            0.5 * Math.log(this.mag2()),
            Math.atan2(this.im, this.re)
        );
    }
    this.atan = function () {
        var d = this.re * this.re + (1.0 - this.im) * (1.0 - this.im);
        if (!isFinite(d)) return new Complex((this.re > 0. ? 1 : -1) * (0.5 * Math.PI), 0);
        var t1 = (new Complex(
            (1.0 - this.mag2()) / d,
            -2.0 * this.re / d
        )).log();
        return new Complex(-0.5 * t1.im, 0.5 * t1.re);
    }
    this.sqrt = function () {
        var m = this.abs();
        var s = this.im > 0 ? 1.0 : -1.0;
        return new Complex(
            Math.sqrt(0.5 * (m + this.re)),
            s * Math.sqrt(0.5 * (m - this.re))
        );
    }
}

Complex.prototype.toString = function () {
    var re = String(this.re);
    var im = String(this.im);
    if (im[0] != '-') im = '+' + im;
    return re + im + "i";
}
Complex.prototype.toFixed = function (n) {
    var re = this.re.toFixed(n);
    var im = this.im.toFixed(n);
    if (im[0] != '-') im = '+' + im;
    return re + im + "i";
}


function normComplexVector(v) {
    var sumsqr = 0.0;
    for (var i = 0; i < v.length; i++) {
        sumsqr += v[i].mag2();
    }
    return Math.sqrt(sumsqr);
}
function normalizeComplexVector(v) {
    var sumsqr = new Complex(0);
    var maxv = new Complex(0);
    for (var i = 0; i < v.length; i++) {
        var m2 = v[i].mul(v[i].conj());
        sumsqr = sumsqr.add(m2);
        if (v[i].abs() > maxv.abs())
            maxv = v[i];
    }
    if (maxv.abs() != 0.0) {
        // make the imaginary part of the largest component zero
        var m = new Complex(maxv.abs()).div(sumsqr.sqrt().mul(maxv));
        for (var i = 0; i < v.length; i++)
            v[i] = v[i].mul(m);
        // make the real part of the last element positive (positive z for 3d)
        m = new Complex(v[v.length - 1].re >= 0.0 ? 1.0 : -1.0);
        for (var i = 0; i < v.length; i++)
            v[i] = v[i].mul(m);
    }
    return v;
}


function MatrixS(N, diag = 0.0) {
    this.N = N;  // size
    this.v = [];
    for (var i = 0; i < N; i++) {
        var vi = [];
        for (var j = 0; j < N; j++) vi.push(0.0);
        vi[i] = diag;
        this.v.push(vi);
    }

    // output to other software to compare outputs
    this.toPython = function () {
        var res = [];
        for (var i = 0; i < this.N; i++)
            res.push('[' + this.v[i].slice(0, this.N).join(',') + ']');
        return '[' + res.join(',') + ']';
    }
    this.toOctave = function () {
        var res = [];
        for (var i = 0; i < this.N; i++)
            res.push(this.v[i].slice(0, this.N).join(','));
        return '[' + res.join(';') + ']';
    }

    // type conversion
    this.resize = function (N) {
        var res = new MatrixS(N);
        var mN = Math.min(res.N, this.N);
        for (var i = 0; i < mN; i++)
            for (var j = 0; j < mN; j++)
                res.v[i][j] = this.v[i][j];
        return res;
    }
    this.toComplex = function () {  // real -> complex
        var res = this.copy();
        for (var i = 0; i < this.N; i++)
            for (var j = 0; j < this.N; j++)
                if (!(res.v[i][j] instanceof Complex))
                    res.v[i][j] = new Complex(res.v[i][j]);
        return res;
    }
    this.toReal = function () {  // complex -> real
        var res = this.copy();
        for (var i = 0; i < this.N; i++)
            for (var j = 0; j < this.N; j++)
                if (res.v[i][j] instanceof Complex)
                    res.v[i][j] = res.v[i][j].re;
        return res;
    }
    this.copy = function () {  // real/complex
        var res = new MatrixS(this.N);
        for (var i = 0; i < this.N; i++)
            for (var j = 0; j < this.N; j++)
                res.v[i][j] = this.v[i][j];
        return res;
    }

    // basic arithmetic
    this.mul = function (that) {  // real
        var res = new MatrixS(this.N);
        for (var i = 0; i < this.N; i++) {
            for (var j = 0; j < this.N; j++) {
                res.v[i][j] = 0.0;
                for (var k = 0; k < this.N; k++) {
                    res.v[i][j] += this.v[i][k] * that.v[k][j];
                }
            }
        }
        return res;
    }
    this.cmul = function (that) {  // complex
        var res = new MatrixS(this.N);
        for (var i = 0; i < this.N; i++) {
            for (var j = 0; j < this.N; j++) {
                var v = new Complex(0);
                for (var k = 0; k < this.N; k++) {
                    v = v.add(this.v[i][k].mul(that.v[k][j]));
                }
                res.v[i][j] = v;
            }
        }
        return res;
    }
    this.cvecmul = function (v) {  // complex
        var res = new Array(this.N);
        for (var i = 0; i < this.N; i++) {
            var s = new Complex(0);
            for (var j = 0; j < this.N; j++)
                s = s.add(this.v[i][j].mul(v[j]));
            res[i] = s;
        }
        return res;
    }
    this.transpose = function () {  // real/complex
        var res = new MatrixS(this.N);
        for (var i = 0; i < this.N; i++) {
            for (var j = 0; j < this.N; j++) {
                res.v[i][j] = this.v[j][i];
            }
        }
        return res;
    }

}


// determinant
MatrixS.prototype.determinant = function () {  // complex
    const EPSILON = 1e-12;
    var M = this.toComplex().v;
    var d = new Complex(1);
    for (var i = 0; i < this.N; i++) {
        var P = M[i];
        var maxj = i, maxv = P[i].abs();
        for (var j = i + 1; j < this.N; j++) {
            if (M[j][i].abs() > maxv)
                maxj = j, maxv = M[j][i].abs();
        }
        if (maxj != i) {
            for (var k = i; k < this.N; k++) {
                var t = M[i][k];
                M[i][k] = M[maxj][k];
                M[maxj][k] = t;
            }
            d = d.mul(new Complex(-1));
        }
        d = d.mul(P[i]);
        if (maxv < EPSILON) return d;
        for (var j = i + 1; j < this.N; j++) {
            var Q = M[j];
            if (Q[i].abs() > EPSILON) {
                var m = Q[i].div(P[i]);
                for (var k = i + 1; k < this.N; k++)
                    Q[k] = Q[k].sub(m.mul(P[k]));
            }
        }
    }
    return d;
}


// eigenpairs

MatrixS.prototype._eigenBalance = function (U = null) {  // real -> null
    // from Numerical Recipes
    let N = this.N, v = this.v;
    while (true) {
        var last = true;
        for (var i = 0; i < N; i++) {
            var r = 0.0, c = 0.0;
            for (var j = 0; j < N; j++) if (j != i)
                c += Math.abs(v[j][i]), r += Math.abs(v[i][j]);
            if (c == 0.0 || r == 0.0) continue;
            var g = 0.5 * r, f = 1.0, s = c + r;
            while (c < g) f *= 2.0, c *= 4.0;
            g = r * 2.0;
            while (c > g) f /= 2.0, c /= 4.0;
            if ((c + r) / f < 0.95 * s) {
                last = false;
                for (var j = 0; j < N; j++) v[i][j] /= f;
                for (var j = 0; j < N; j++) v[j][i] *= f;
                if (U != null)
                    for (var j = 0; j < N; j++) U[j][i] *= f;
            }
        }
        if (last) break;
    }
}

MatrixS.prototype._eigenToHessenberg = function (U = null) {  // real -> null
    let N = this.N, v = this.v;
    for (var i = 1; i < N; i++) {
        // swap with the largest row
        var maxj = i; var maxv = 0.0;
        for (var j = i; j < N; j++)
            if (Math.abs(v[j][i - 1]) > Math.abs(maxv))
                maxv = v[j][i - 1], maxj = j;
        if (maxj != i) {
            var t;
            for (var j = 0; j < N; j++)
                t = v[maxj][j], v[maxj][j] = v[i][j], v[i][j] = t;
            for (var j = 0; j < N; j++)
                t = v[j][maxj], v[j][maxj] = v[j][i], v[j][i] = t;
            if (U != null)
                for (var j = 0; j < N; j++)
                    t = U[j][maxj], U[j][maxj] = U[j][i], U[j][i] = t;
        }
        if (Math.abs(maxv) < 1e-12) continue;
        // Gaussian elimination
        for (var j = i + 1; j < N; j++) {
            var m = v[j][i - 1] / maxv;
            for (var k = 0; k < N; k++)
                v[j][k] -= m * v[i][k];
            for (var k = 0; k < N; k++)
                v[k][i] += m * v[k][j];
            if (U != null)
                for (var k = 0; k < N; k++)
                    U[k][i] += m * U[k][j];
        }
    }
}

MatrixS.prototype._eigenQrStep = function (M, iter, U = null) {  // complex -> null
    let A = this.v;
    let half = new Complex(0.5);
    let one = new Complex(1.0);

    // shift
    var tr = A[M - 2][M - 2].add(A[M - 1][M - 1]);
    var det = A[M - 2][M - 2].mul(A[M - 1][M - 1]).sub(A[M - 1][M - 2].mul(A[M - 2][M - 1]));
    var sqrtdelta = tr.mul(tr).sub(det.mul(new Complex(4))).sqrt();
    var mu1 = tr.add(sqrtdelta).mul(half);
    var mu2 = tr.sub(sqrtdelta).mul(half);
    var mu = mu1.sub(A[M - 1][M - 1]).mag2() < mu2.sub(A[M - 1][M - 1]).mag2() ?
        mu1 : mu2;
    if (iter == 10 || iter == 20) {
        var r1 = Math.abs(A[M - 1][M - 2].re);
        var r2 = M > 2 ? Math.abs(A[M - 2][M - 3].re) : 0.0;
        mu = new Complex(r1 + r2);
        // var a = Math.random() * 2.0 * Math.PI;
        // mu = mu.mul(new Complex(Math.cos(a), Math.sin(a)));
    }
    mu = mu.mul(new Complex(1.0 + 1e-6 * (Math.random() - 0.5)));

    // get working space
    var M0 = M - 3;
    while (M0 > 0 && (A[M0][M0 - 1]).abs() > 1e-12) M0--;
    M0 = Math.max(M0 - 1, 0);
    var M1 = M;  // or this.N while debugging
    M1 = this.N;

    // QR using given rotation
    for (var i = 0; i < M1; i++) A[i][i] = A[i][i].sub(mu);
    var R = this.copy().v;
    for (var i = M0 + 1, j = M0; i < M; i++, j++) {
        if (R[i][j].abs() < 1e-12) continue;
        // console.log([R[j][j], R[j][i], R[i][j], R[i][i]].join(','));
        var a = new Complex(1), b = new Complex(0),
            c = new Complex(0), d = new Complex(1);
        // given rotation
        var theta = R[i][j].div(R[j][j]).atan();
        a = theta.cos(), b = theta.sin();
        c = theta.sin().mul(new Complex(-1)), d = theta.cos();
        // if this fails
        if (Math.sqrt(c.mag2() + d.mag2()) > 1e2) {
            d = R[j][j].div(R[i][j]).mul(new Complex(-1));
            c = new Complex(1);
            b = new Complex(-1);
            a = new Complex(0);
        }
        // apply to R
        for (var k = 0; k < M1; k++) {
            var rjk = R[j][k].mul(a).add(R[i][k].mul(b));
            var rik = R[j][k].mul(c).add(R[i][k].mul(d));
            R[j][k] = rjk, R[i][k] = rik;
        }
        // apply to A
        for (var k = Math.max(j - 1, 0); k < M1; k++) {
            var ajk = A[j][k].mul(a).add(A[i][k].mul(b));
            var aik = A[j][k].mul(c).add(A[i][k].mul(d));
            A[j][k] = ajk, A[i][k] = aik;
        }
        for (var k = 0; k < Math.min(i + 2, M1); k++) {
            var akj = A[k][j].mul(d).sub(A[k][i].mul(c));
            var aki = A[k][i].mul(a).sub(A[k][j].mul(b));
            A[k][j] = akj, A[k][i] = aki;
        }
        // apply to U
        if (U != null)
            for (var k = 0; k < this.N; k++) {
                var ukj = U[k][j].mul(d).sub(U[k][i].mul(c));
                var uki = U[k][i].mul(a).sub(U[k][j].mul(b));
                U[k][j] = ukj, U[k][i] = uki;
            }
    }
    for (var i = 0; i < M1; i++) A[i][i] = A[i][i].add(mu);

    // check
    for (var i = 2; i < this.N; i++)
        for (var j = 0; j < i - 1; j++)
            if (A[i][j].abs() > 1e-8)
                throw new Error("Nonzero element below diagonal " +
                    "(" + i + ',' + j + ',' + A[i][j] + ")");
}

MatrixS.prototype.eigs = function () {  // real -> complex
    var A = this.toReal().copy();
    var U = new MatrixS(this.N, 1.0);
    A._eigenBalance(U.v);
    A._eigenToHessenberg(U.v);
    A = A.toComplex();
    U = U.toComplex();
    // console.log(A.toOctave());

    const EPSILON = 1e-12 * Math.max(Math.pow(
        Math.abs(A.determinant().abs()), 1.0 / this.N), 1.0);
    var eigs = [];
    var M = A.N;

    // calculate eigenvector from eigenvalue and append it to `eigs`
    function pushEigen(U, eigval, M, N) {
        var eigvec = new Array(N);
        for (var i = 0; i < N; i++)
            eigvec[i] = new Complex(0);
        // construct A-λI
        var A1 = A.resize(M);
        for (var i = 0; i < M; i++)
            A1.v[i][i] = A.v[i][i].sub(eigval);
        var H = A1.v;
        // reduce to upper triangular
        var zeroDiagonals = [];
        for (var i = 0; i < M - 1; i++) {
            if (H[i][i].abs() < EPSILON) {
                var j = i + 1;
                if (H[j][i].abs() < EPSILON) {
                    zeroDiagonals.push(i);
                    continue;
                }
                else {
                    for (var k = 0; k < M; k++) {
                        var t = H[i][k];
                        H[i][k] = H[j][k];
                        H[j][k] = t;
                    }
                }
            }
            var j = i + 1;
            var m = H[j][i].div(H[i][i]);
            for (var k = 0; k < M; k++) {
                H[j][k] = H[j][k].sub(m.mul(H[i][k]));
            }
        }
        // reduce to row-echolon
        if (zeroDiagonals.length > 0) {
            var goods = [], bads = [];
            // console.log(A1.toOctave());
            for (var i = 0, h = 0; i < M; i++, h++) {
                // swap with the largest row
                var maxj = 0, maxv = 0.0;
                for (var j = h; j <= i; j++) {
                    if (H[j][i].abs() > maxv)
                        maxj = j, maxv = H[j][i].abs();
                }
                if (maxv < EPSILON) {
                    bads.push([--h, i]);
                    continue;
                }
                for (var k = i; k < M; k++) {
                    var t = H[h][k];
                    H[h][k] = H[maxj][k];
                    H[maxj][k] = t;
                }
                // row transform
                for (var j = 0; j <= i; j++) if (j != h) {
                    var m = H[j][i].div(H[h][i]);
                    for (var k = i; k < M; k++) {
                        H[j][k] = H[j][k].sub(m.mul(H[h][k]));
                    }
                }
                var h1 = i;
                while (H[h1][i].abs() < EPSILON && h1 >= h) h1--;
                if (h1 >= h || goods.length == 0)
                    goods.push([h = h1, i]);
                else bads.push([h = h1, i]);
            }
            // console.log(A1.toOctave());
            // console.log(goods, bads);
            var i1 = bads[bads.length - 1][1];
            eigvec[i1] = new Complex(1);
            for (var _ = 0; _ < goods.length; _++) {
                var h = goods[_][0], i = goods[_][1];
                eigvec[i] = H[h][i1].div(H[h][i]).mul(new Complex(-1));
            }
        }
        // solve upper triangular
        else {
            eigvec[M - 1] = new Complex(1);
            for (var i = M - 2; i >= 0; i--) {
                var v = new Complex(0);
                for (var j = M - 1; j > i; j--)
                    v = v.sub(H[i][j].mul(eigvec[j]));
                eigvec[i] = v.div(H[i][i]);
            }
        }
        // check calculation
        if (1) {
            var v2 = 0.0, Av2 = 0.0;
            for (var i = 0; i < M; i++) {
                v2 += eigvec[i].mag2();
                var s = new Complex(0);
                for (var j = 0; j < M; j++)
                    s = s.add(A1.v[i][j].mul(eigvec[j]));
                Av2 += s.mag2();
            }
            var err = Math.sqrt(Av2 / v2);
            // console.log("Av/v " + err);
            if (err > 1000. * EPSILON) throw new Error(
                "Failed to assert Ax=λx (err=" + err + ")");
        }
        // transform back
        eigvec = U.cvecmul(eigvec);
        eigvec = normalizeComplexVector(eigvec);
        eigs.unshift([eigval, eigvec]);
    }

    // iteration with deflation
    var MAXITER = 1000 * A.N;
    for (var totiter = 0, iter = 0; totiter < MAXITER; totiter++, iter++) {
        // console.log(iter + ' ' + A.toOctave());
        while (M > 1 && A.v[M - 1][M - 2].abs() < EPSILON) {
            pushEigen(U, A.v[M - 1][M - 1], M, this.N);
            M--;
            iter = 0;
        }
        if (M == 1) {
            pushEigen(U, A.v[0][0], M, this.N);
            // console.log("Eigenvalues calculated in " + totiter + " iterations.");
            break;
        }
        if (iter > 1000) {
            // 99% guaranteed to be a bug if this happens with a small A
            throw new Error("Maximum number of iterations exceeded. " +
                "(|subdiag|=" + A.v[M - 1][M - 2].abs() + ")");
        }
        A._eigenQrStep(M, iter, U.v);
        for (var i = 2; i < M; i++)
            A.v[i][i - 2] = new Complex(0.0);
    }
    return eigs;
}



/* TESTING */

function PRNG(seed) {
    this.seed = Math.round(Number(seed));
    this.randi = function () {  // from Numerical Recipes
        this.seed = (Math.imul(this.seed, 1664525) + 1013904223) % 4294967296;
        return this.seed + (this.seed < 0 ? 4294967296 : 0);
    }
    this.randb = function () {
        return ((this.randi() >> 15) & 1) == 1;
    }
    this.randf = function () {
        return (this.randi() + 0.5) / 4294967296;
    }
    this.randn = function () {
        var u = this.randf(), v = this.randf();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);
    }
    this.randTestMatrix = function () {
        var allInteger = this.randb();
        var N = 1 + this.randi() % 5;
        var A = new MatrixS(N);
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                var v = this.randn();
                if (allInteger) v = Math.trunc(2.0 * v);
                A.v[i][j] = v;
            }
        }
        return A;
    }
}

function _testCase(A) {
    let N = A.N;
    var det = A.determinant();
    var eigs = A.eigs();

    const EPSILON = 1e-8;
    function _assert(x, message) {
        if (!x) throw new Error(message);
    }
    function _assertEqual(x1, x2, message) {
        _assert(Math.abs(x2 - x1) < EPSILON ||
            (x2 - x1 * (1.0 + EPSILON)) * (x2 - x1 * (1.0 - EPSILON)) < 0.0,
            message + " (" + x1 + ", " + x2 + ")");
    }
    function _assertEqualC(x1, x2, message) {
        _assertEqual(x1.re, x2.re, message);
        _assertEqual(x1.im, x2.im, message);
    }

    // product of eigenvalues equals determinant
    // sum of eigenvalues equals trace
    _assert(eigs.length == N, "N eigenvalues");
    var eigProd = new Complex(1),
        eigSum = new Complex(0),
        trace = 0.0;
    for (var i = 0; i < N; i++) {
        eigProd = eigProd.mul(eigs[i][0]);
        eigSum = eigSum.add(eigs[i][0]);
        trace += A.v[i][i];
    }
    _assertEqualC(eigProd, det, "∏λ ≠ det");
    _assertEqualC(eigSum, new Complex(trace), "∑λ ≠ trace");

    // AP=PD
    var D = new MatrixS(N).toComplex();
    var P = new MatrixS(N, new Complex(0));
    for (var i = 0; i < N; i++) {
        D.v[i][i] = eigs[i][0];
        P.v[i] = eigs[i][1];
    }
    P = P.transpose();
    var AP = A.toComplex().cmul(P);
    var PD = P.cmul(D);
    function hashMat(mat) {
        var s = 0.0;
        var prng = new PRNG(100);
        for (var i = 0; i < N; i++)
            for (var j = 0; j < N; j++) {
                if (prng.randb())
                    s += Math.abs(mat.v[i][j].re + 0.5) +
                        Math.asinh(mat.v[i][j].im - 0.3);
                else
                    s += Math.abs(mat.v[i][j].im - 0.8) +
                        Math.atan(mat.v[i][j].re + 0.2);
            }
        return s;
    }
    _assertEqual(hashMat(AP), hashMat(PD), "AP ≠ PD");
}

function _batchTest() {
    const NUM_TESTS = 10000;
    for (var seed = 1; seed <= NUM_TESTS; seed++) {
        if (seed % 100 == 0)
            console.log(seed + "/" + NUM_TESTS);
        var A = new PRNG(seed).randTestMatrix();
        try {
            _testCase(A);
        } catch (e) {
            console.error(e);
            console.log("seed = " + seed);
            console.log("A = " + A.toPython());
            console.log("A = " + A.toOctave());
        }
    }
}

if (typeof window === "undefined") {
    _batchTest();

    var M = new MatrixS(4);
    // M.v = [[1.62434536, -0.61175641, -0.52817175, -1.07296862],
    // [0.86540763, -2.3015387, 1.74481176, -0.7612069],
    // [0.3190391, -0.24937038, 1.46210794, -2.06014071],
    // [-0.3224172, -0.38405435, 1.13376944, -1.09989127]];
    // M.v = [[1.62434536, -0.61175641, 1.01258895, -0.],
    // [0.86540763, -2.3015387, -1.43613107, -0.],
    // [0.3190391, -0.24937038, 0.06966872, -0.],
    // [-0.3224172, -0.38405435, -0.70647156, -0.]];
    // M.v = [[1, 2, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    // M.v = [[1, 0, 1, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 1]];
    // M.v = [[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    // M.v = [[0, 0, 1, 0], [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1]];
    M.v = [[0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1], [10000, -1000, 0, 0]];
    // M.v = [[1, -1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1]];
    // M = M.resize(3);
    // M.N = 2, M.v = [[0, -1], [1, 0]];
    // M.N = 4, M.v = [[0, -1, 0, 0], [1, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    // M.v = [[-2, 0, -1, 2], [1, -2, 0, 1], [0, 0, -4, 0], [0, 0, 0, -2]];
    // M.N = 3, M.v = [[0, -3, 0], [0, 0, 0], [-1, 0, -1]];
    // M.N = 3, M.v = [[0, 1, 0], [0, 1, -1], [1, 1, 0]];
    M.v = [[2, -1, 0, 2], [0, 2, -2, 1], [0, 2, 0, 0], [-1, 1, 0, 1]];
    M.N = 3, M.v = [[0, -2, 0], [3, 0, -1], [0, -1, 0]];
    console.log("matrix", M.toOctave());
    console.log("det", M.determinant().re);

    var eigs = M.eigs();
    for (var i = 0; i < eigs.length; i++) {
        let d = 6;
        console.log(eigs[i][0].toFixed(d),
            eigs[i][1].map((x) => x.toFixed(d)).join(','));
    }
}