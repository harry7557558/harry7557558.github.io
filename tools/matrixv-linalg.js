"use strict";


const EPSILON = 1e-6;

function isZero(x) {
    return Math.abs(x) < EPSILON;
}
function isReal(x) {
    if (typeof x == "number")
        return true;
    if (x instanceof Complex)
        return isZero(x.im);
    for (var i = 0; i < x.length; i++) {
        if (!isReal(x[i])) return false;
    }
    return true;
}
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
    this.isZero = function () {
        return this.mag2() < EPSILON * EPSILON;
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
        // if (!isFinite(d)) return new Complex((this.re > 0. ? 1 : -1) * (0.5 * Math.PI), 0);
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
    return String(this.re) + "+" + String(this.im) + "i";
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
        for (var i = 0; i < N; i++)
            for (var j = 0; j < N; j++)
                if (!(res.v[i][j] instanceof Complex))
                    res.v[i][j] = new Complex(res.v[i][j]);
        return res;
    }
    this.toReal = function () {  // complex -> real
        var res = this.copy();
        for (var i = 0; i < N; i++)
            for (var j = 0; j < N; j++)
                if (res.v[i][j] instanceof Complex)
                    res.v[i][j] = res.v[i][j].re;
        return res;
    }
    this.copy = function () {  // real/complex
        var res = new MatrixS(this.N);
        for (var i = 0; i < N; i++)
            for (var j = 0; j < N; j++)
                res.v[i][j] = this.v[i][j];
        return res;
    }

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
    this.transpose = function () {  // real/complex
        var res = new MatrixS(this.N);
        for (var i = 0; i < this.N; i++) {
            for (var j = 0; j < this.N; j++) {
                res.v[i][j] = this.v[j][i];
            }
        }
        return res;
    }

    this.determinant = function () {  // real
        var M = this.toReal().v;
        var d = 1.0;
        for (var i = 0; i < this.N; i++) {
            var P = M[i];
            if (isZero(P[i])) {
                for (var j = i + 1; j < this.N; j++) {
                    if (!isZero(M[j][i])) {
                        for (var k = i; k < this.N; k++) {
                            var t = M[i][k];
                            M[i][k] = M[j][k];
                            M[j][k] = t;
                        }
                        d *= -1.0;
                        break;
                    }
                }
            }
            d *= P[i];
            if (isZero(d)) return d;
            for (var j = i + 1; j < this.N; j++) {
                var Q = M[j];
                if (!isZero(Q[i])) {
                    var m = Q[i] / P[i];
                    for (var k = i + 1; k < this.N; k++)
                        Q[k] = Q[k] - m * P[k];
                }
            }
        }
        return d;
    }

    this.eigenvalues = function (tries = 1) {  // real -> complex
        var A = this.toReal().copy();
        var eigs = new Array(this.N).fill(0);
        for (var iter = 0, cont_count = 0; iter < 1000; iter++) {
            // QR
            var R = A;
            for (var i = 0; i < this.N; i++) {
                for (var j = 0; j < i; j++) {
                    if (R.v[i][j] == 0.0) continue;
                    var theta = Math.atan(R.v[i][j] / R.v[j][j]);
                    var c = Math.cos(theta), s = Math.sin(theta);
                    var M = new MatrixS(this.N, 1.0);
                    M.v[i][i] = c, M.v[j][j] = c;
                    M.v[i][j] = -s, M.v[j][i] = s;
                    R = M.mul(R);
                    A = M.mul(A).mul(M.transpose());
                }
            }
            // eigs
            var v = A.toComplex().v;
            var newEigs = new Array(this.N).fill(0);
            var i = 0;
            while (i < this.N) {
                if (i == this.N - 1 || v[i + 1][i].isZero()) {
                    newEigs[i] = v[i][i];
                    i += 1;
                }
                else {
                    var ds = v[i][i].add(v[i + 1][i + 1]).mul(new Complex(0.5));
                    var dd = v[i][i].sub(v[i + 1][i + 1]);
                    var d = (dd.mul(dd).add(v[i][i + 1].mul(v[i + 1][i]).mul(new Complex(4))));
                    d = d.sqrt().mul(new Complex(0.5));
                    if (d.im < 0.) d = d.mul(new Complex(-1, 0));
                    newEigs[i] = ds.add(d);
                    newEigs[i + 1] = ds.sub(d);
                    i += 2;
                }
            }
            // error
            var maxdif = 0.0;
            for (var i = 0; i < this.N; i++) {
                var dif = (newEigs[i].sub(eigs[i])).abs();
                maxdif = Math.max(maxdif, dif);
            }
            eigs = newEigs;
            if (maxdif < 1e-14) {
                if (cont_count++ > 20) return eigs;
            }
            else cont_count = 0;
        }
        if (tries > 0) {
            return this.transpose().eigenvalues(tries - 1);
        }
        else {
            console.warn("Maximum number of eigenvalue iterations exceeded.");
            return eigs;
        }
    }

    this.find_eigenvectors = function (eigenvalue, num_eigenvectors) {  // real -> complex
        var A0 = this.toComplex().v;
        var A = this.toComplex().v;
        for (var i = 0; i < this.N; i++) {
            A0[i][i] = A0[i][i].sub(eigenvalue);
            A[i][i] = A[i][i].sub(eigenvalue);
        }
        // elimination
        var es = [], i, d;
        for (i = 0, d = 0; d < this.N; i++, d++) {
            if (A[i][d].isZero()) {
                for (var j = i + 1; j < this.N; j++) {
                    if (!A[j][d].isZero()) {
                        for (var k = 0; k < this.N; k++) {
                            var t = A[i][k];
                            A[i][k] = A[j][k];
                            A[j][k] = t;
                        }
                        break;
                    }
                }
            }
            if (A[i][d].isZero()) {
                es.push([--i, d]);
                continue;
            }
            for (var j = 0; j < this.N; j++) if (j != i) {
                var m = A[j][d].div(A[i][d]);
                for (var k = 0; k < this.N; k++) {
                    A[j][k] = A[j][k].sub(m.mul(A[i][k]));
                }
            }
            var m = A[i][d];
            for (var k = 0; k < this.N; k++)
                A[i][k] = A[i][k].div(m);
        }
        // find eigvecs
        var eigvecs = [];
        for (var ei = 0; ei < Math.min(es.length, num_eigenvectors); ei++) {
            var i = es[ei][0], d = es[ei][1];
            var eigvec = (new Array(this.N)).fill(new Complex(0));
            eigvec[d] = new Complex(1.0);
            for (var j = 0; j <= i; j++)
                eigvec[j] = A[j][d].mul(new Complex(-1));
            // normalize/orthogonalize
            var sumsqr = 0.0;
            for (var i = 0; i < this.N; i++) sumsqr += eigvec[i].mag2();
            var m = new Complex(1.0 / Math.sqrt(sumsqr));
            for (var i = 0; i < this.N; i++) eigvec[i] = m.mul(eigvec[i]);
            eigvecs.push(eigvec);
            // check
            var err = 0.0;
            for (var i = 0; i < this.N; i++) {
                var s = new Complex(0);
                for (var j = 0; j < this.N; j++)
                    s = s.add(A0[i][j].mul(eigvec[j]));
                err += s.mag2();
            }
            err = Math.sqrt(err);
            // console.log("RMSE", err);
        }
        return eigvecs;
    }
    this.eigs = function () {  // real -> complex
        var eigenvalues = this.eigenvalues();
        eigenvalues.sort((a, b) => Math.sign(a.re) * a.abs() - Math.sign(b.re) * b.abs());
        var pairs = [];
        for (var i = 0; i < this.N;) {
            var j = i + 1;
            while (j < this.N && (eigenvalues[j].sub(eigenvalues[i])).isZero()) j++;
            var eigvecs = this.find_eigenvectors(eigenvalues[i], j - i);
            for (var k = 0; k < eigvecs.length; k++)
                pairs.push([eigenvalues[i], eigvecs[k]]);
            i = j;
        }
        return pairs;
    }
}


// debug
if (0) {
    var M = new MatrixS(4);
    M.v = [[1.62434536, -0.61175641, -0.52817175, -1.07296862],
    [0.86540763, -2.3015387, 1.74481176, -0.7612069],
    [0.3190391, -0.24937038, 1.46210794, -2.06014071],
    [-0.3224172, -0.38405435, 1.13376944, -1.09989127]];
    M.v = [[1.62434536, -0.61175641, 1.01258895, -0.],
    [0.86540763, -2.3015387, -1.43613107, -0.],
    [0.3190391, -0.24937038, 0.06966872, -0.],
    [-0.3224172, -0.38405435, -0.70647156, -0.]];
    M.v = [[1, 2, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    M.v = [[1, 0, 1, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 1]];
    M.v = [[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    // M = M.toComplex();
    console.log(M.determinant());
    // console.log(M.mul(M).v);
    console.log("" + M.eigs());
}