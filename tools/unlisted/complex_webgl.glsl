// fragment shader for WebGL complex grapher

precision highp float;
varying vec2 vPos;

float brightness = 0.5;


#define sinh(x) (0.5*(exp(x)-exp(-x)))
#define cosh(x) (0.5*(exp(x)+exp(-x)))
//#define tanh(x) (1.0-2./(exp(2.*x)+1))
#define tanh(x) (sinh(x)/cosh(x))

// complex arithmetic
float Mag(vec2 a) { return length(a); }
float Arg(vec2 a) { return atan(a.y, a.x); }
float logMag(vec2 a) { return 0.5*log(dot(a,a)); }
vec2 ADD(vec2 a, vec2 b) { return a + b; }
vec2 SUB(vec2 a, vec2 b) { return a - b; }
vec2 MUL(vec2 a, vec2 b) { return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x); }
vec2 DIV(vec2 a, vec2 b) { return (1.0/dot(b,b)) * vec2(a.x*b.x+a.y*b.y, a.y*b.x-a.x*b.y); }
vec2 POW(vec2 e, vec2 t) {
    float a = Arg(e), r = logMag(e), c = exp(t.x*r-t.y*a), s = t.x*a+t.y*r;
    return c * vec2(cos(s), sin(s));
}
vec2 EXP(vec2 e) { return exp(e.x) * vec2(cos(e.y),sin(e.y)); }
vec2 LOG(vec2 e) { return vec2(logMag(e), Arg(e)); }
vec2 SQR(vec2 e) {
    float m = Mag(e);
    return e.y>0. ? vec2(sqrt(0.5*(m+e.x)), sqrt(0.5*(m-e.x))) :
        vec2(sqrt(0.5*(m+e.x)), -sqrt(0.5*(m-e.x)));
}
vec2 INV(vec2 e) { return (1./dot(e,e)) * vec2(e.x, -e.y); }

vec2 SIN(vec2 e) { return vec2(sin(e.x)*cosh(e.y), cos(e.x)*sinh(e.y)); }
vec2 COS(vec2 e) { return vec2(cos(e.x)*cosh(e.y), -sin(e.x)*sinh(e.y)); }
vec2 TAN(vec2 e) {
    float a = 2.*e.x, b = 2.*e.y, d = cos(a)+cosh(b);
    return (1./d) * vec2(sin(a), sinh(b));
}
vec2 COT(vec2 e) {
    float a = 2.*e.x, b = 2.*e.y, d = cos(a)-cosh(b);
    return (1./d) * vec2(-sin(a), sinh(b));
}
vec2 SEC(vec2 e) {
    float a = e.x, b = e.y, d = 0.5*cosh(2.*b) + 0.5*cos(2.*a);
    return (1./d) * vec2(cos(a)*cosh(b), sin(a)*sinh(b));
}
vec2 CSC(vec2 e) {
    float a = e.x, b = e.y, d = 0.5*cosh(2.*b) - 0.5*cos(2.*a);
    return (1./d) * vec2(sin(a)*cosh(b), -cos(a)*sinh(b));
}
vec2 SNH(vec2 e) { return vec2(sinh(e.x)*cos(e.y), cosh(e.x)*sin(e.y)); }
vec2 CSH(vec2 e) { return vec2(cosh(e.x)*cos(e.y), sinh(e.x)*sin(e.y)); }
vec2 TNH(vec2 e) {
    float a = 2.*e.x, b = 2.*e.y, d = cosh(a)+cos(b);
    return (1./d) * vec2(sinh(a), sin(b));
}
vec2 CTH(vec2 e) {
    float a = 2.*e.x, b = 2.*e.y, d = cosh(a)-cos(b);
    return (1./d) * vec2(sinh(a), -sin(b));
}
vec2 CCH(vec2 e) {
    float d = cos(2.*e.y) - cosh(2.*e.x);
    return (2./d) * vec2(-sinh(e.x)*cos(e.y), cosh(e.x)*sin(e.y));
}
vec2 SCH(vec2 e) {
    float d = cos(2.*e.y) + cosh(2.*e.x);
    return (2./d) * vec2(cosh(e.x)*cos(e.y), -sinh(e.x)*sin(e.y));
}

vec2 ASN(vec2 e) {
    float a = e.x, b = e.y;
    vec2 t1 = SQR(vec2(b*b-a*a+1., -2.*a*b));
    vec2 t2 = LOG(vec2(t1.x-b, t1.y+a));
    return vec2(t2.y, -t2.x);
}
vec2 ACS(vec2 e) {
    float a = e.x, b = e.y;
    vec2 t1 = SQR(vec2(b*b-a*a+1., -2.*a*b));
    vec2 t2 = LOG(vec2(t1.x-b, t1.y+a));
    return vec2(1.570796327-t2.y, t2.x);
}
vec2 ATN(vec2 e) {
    float a = e.x, b = e.y, d = a*a + (1.-b)*(1.-b);
    vec2 t1 = LOG(vec2((1.-b*b-a*a)/d, -2.*a/d));
    return vec2(-0.5*t1.y, 0.5*t1.x);
}
vec2 ACT(vec2 e) { return ATN(INV(e)); }
vec2 ASC(vec2 e) { return ACS(INV(e)); }
vec2 ACC(vec2 e) { return ASN(INV(e)); }
vec2 ASH(vec2 e) { vec2 r = ASN(vec2(e.y,-e.x)); return vec2(-r.y,r.x); }
vec2 ACH(vec2 e) { vec2 r = ACS(e); return r.y<=0.?vec2(-r.y,r.x):vec2(r.y,-r.x); }
vec2 ATH(vec2 e) {
    float a = e.x, b = e.y;
    float oneMinus = 1.-a, onePlus = 1.+a, d = oneMinus*oneMinus + b*b;
    vec2 x = (1./d) * vec2(onePlus*oneMinus-b*b, b*oneMinus+b*onePlus);
    return vec2(0.5*logMag(x), 0.5*Arg(x));
}
vec2 AKH(vec2 e) { return ATH(INV(e)); }
vec2 AXH(vec2 e) { return ASH(INV(e)); }
vec2 AGH(vec2 e) { return ACH(INV(e)); }



// HSL to RGB conversion
float hue2rgb(float p, float q, float t) {
    if (t < 0.) t += 1.;
    if (t > 1.) t -= 1.;
    if (t < 1./6.) return p + (q - p) * 6. * t;
    if (t < 1./2.) return q;
    if (t < 2./3.) return p + (q - p) * (2./3. - t) * 6.;
    return p;
}
vec3 hslToRgb(float h, float s, float l) {
    if (s == 0.) return vec3(l);
    float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
    float p = 2. * l - q;
    return vec3(
        hue2rgb(p, q, h + 1./3.),
        hue2rgb(p, q, h),
        hue2rgb(p, q, h - 1./3.)
    );
}


// main function
void main() {
    vec2 z = vPos.xy;
    vec2 fz = z;
    float h = Arg(fz) * 0.15915494309189535;
    float s = 1.0;
    float l = 1.0 - pow(1.0 - brightness, log(log(Mag(fz) + 1.0) + 1.05));
    gl_FragColor = vec4(hslToRgb(h, s, l), 1);
}
