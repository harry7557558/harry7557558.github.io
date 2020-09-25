function fun(t) {

    var A = [
        [-cos(iRy) * sin(iRz) + sin(iRy) * sin(iRx) * cos(iRz),
        cos(iRy) * cos(iRz) + sin(iRy) * sin(iRx) * sin(iRz),
        -cos(iRx) * sin(iRy)],
        [-sin(iRy) * sin(iRz) - cos(iRy) * sin(iRx) * cos(iRz),
        sin(iRy) * cos(iRz) - cos(iRy) * sin(iRx) * sin(iRz),
        cos(iRx) * cos(iRy)]
    ];
    //for (var i = 0; i < 2; i++) for (var j = 0; j < 3; j++)
    //    A[i][j] += sin(100 * i + 25) * cos(247 * j + 37);

    var t0 = atan2(-A[0][2], A[1][2]);
    var t1 = t0 + PI / 2;
    //if (t < t0 || t > t1) return [NaN, NaN];

    // a function that can be very ill-conditioned
    var ct = cos(t), st = sin(t);
    var a1 = A[0][0] * ct + A[1][0] * st;
    var a2 = A[0][1] * ct + A[1][1] * st;
    var a3 = A[0][2] * ct + A[1][2] * st;
    var a1_ = -A[0][0] * st + A[1][0] * ct;
    var a2_ = -A[0][1] * st + A[1][1] * ct;
    var a3_ = -A[0][2] * st + A[1][2] * ct;
    var ku = sqrt(a1 * a1 + a2 * a2);
    var cu = a1 / ku, su = a2 / ku;
    var ku_ = cu * a1_ + su * a2_;
    var cu_ = (a1_ * ku - a1 * ku_) / (ku * ku);
    var su_ = (a2_ * ku - a2 * ku_) / (ku * ku);
    var kv = sqrt(a3 * a3 + ku * ku);
    var cv = ku / kv, sv = a3 / kv;
    var kv_ = cv * ku_ + sv * a3_;
    var cv_ = (ku_ * kv - ku * kv_) / (kv * kv);
    var sv_ = (a3_ * kv - a3 * kv_) / (kv * kv);
    var Rr = iR - ir * cv;
    var Rr_ = -ir * cv_;

    // value
    var P = [cu * Rr, su * Rr, -ir * sv];
    P = [
        A[0][0] * P[0] + A[0][1] * P[1] + A[0][2] * P[2],
        A[1][0] * P[0] + A[1][1] * P[1] + A[1][2] * P[2]
    ];

    // analytical derivative
    var P_ = [cu * Rr_ + cu_ * Rr, su * Rr_ + su_ * Rr, -ir * sv_];
    P_ = [
        A[0][0] * P_[0] + A[0][1] * P_[1] + A[0][2] * P_[2],
        A[1][0] * P_[0] + A[1][1] * P_[1] + A[1][2] * P_[2]
    ];

    //return P_;
    return P_[0] * P_[0] + P_[1] * P_[1];
}


function fun1(t) {
    //if (t < 0 || t > 1) return NaN;

    var C0 = [1.29, -1.09];
    var C1 = [-0.7, -1.29];
    var C2 = [-0.95, 0.01];
    var C3 = [-0.73, 1.47];

    var P = [
        (1 - t) ** 3 * C0[0] + 3 * t * (1 - t) ** 2 * C1[0] + 3 * t * t * (1 - t) * C2[0] + t ** 3 * C3[0],
        (1 - t) ** 3 * C0[1] + 3 * t * (1 - t) ** 2 * C1[1] + 3 * t * t * (1 - t) * C2[1] + t ** 3 * C3[1]
    ];

    var P0 = [iRx, iRz];
    var dP = [P[0] - P0[0], P[1] - P0[1]];
    return sqrt(dP[0] * dP[0] + dP[1] * dP[1]);
}

function hash(x) {
    var h = function (x) {
        var x = 12345.6789 * sin(234.567 * x + 345.678);
        return x - floor(x);
    }
    return h(x);
    var s = function (x) {
        return x * x * (3 - 2 * x);
    }
    var n = function (x) {
        var ss = s(x - floor(x));
        return (1 - ss) * h(floor(x)) + ss * h(ceil(x));
    }
    var a = iR, b = iR;
    var sum = 0;
    for (var i = 0; i < 20; i++) {
        sum += pow(a, -i) * n(pow(b, i) * (x + h(i)));
    }
    return sum;
}

