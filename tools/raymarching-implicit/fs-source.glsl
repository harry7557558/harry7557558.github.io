#version 300 es
precision highp float;

out vec4 fragColor;

uniform mat4 transformMatrix;
in vec2 vXy;

#define ZERO min(uIso, 0.)
#define PI 3.1415926

vec3 screenToWorld(vec3 p) {
    vec4 q = transformMatrix * vec4(p, 1);
    return q.xyz / q.w;
}


float fun0(vec3 p) {
    float x=p.x, y=p.y, z=p.z;
    return {%FUN%};
}

int callCount = 0;
vec3 funNGradT(vec3 p, float e) {
    p = screenToWorld(p);
    return vec3(
        fun0(p+vec3(e,0,0)) - fun0(p-vec3(e,0,0)),
        fun0(p+vec3(0,e,0)) - fun0(p-vec3(0,e,0)),
        fun0(p+vec3(0,0,e)) - fun0(p-vec3(0,0,e))
    ) / (2.0*e);
}
float funT(vec3 p) {
    callCount += 1;
    return fun0(screenToWorld(p));
}
vec3 funTNGrad(vec3 p, float e) {
    return vec3(
        funT(p+vec3(e,0,0)) - funT(p-vec3(e,0,0)),
        funT(p+vec3(0,e,0)) - funT(p-vec3(0,e,0)),
        funT(p+vec3(0,0,e)) - funT(p-vec3(0,0,e))
    ) / (2.0*e);
}
float fun(vec3 p, vec3 rd) {
    // return funT(p);
    // return funT(p) / length(funNGradT(p, 0.001));
    // return funT(p) / length(funTNGrad(p, 0.001));
    return funT(p) / (abs(funT(p+0.001*rd)-funT(p-0.001*rd))/0.002);
}



vec3 vIsosurf(in vec3 ro, in vec3 rd) {
    const float step_size = 0.01;
    // raymarching
    float t = 0.0, dt = step_size;
    float v_old = fun(ro, rd), v;
    int i = 0;
    for (t = dt; i < 240 && t < 1.0; t += dt, i++) {
        v = fun(ro+rd*t, rd);
        if (v*v_old < 0.0) break;
        v_old = v;
        dt = isnan(v) ? step_size : clamp(abs(v)-step_size, 0.1*step_size, step_size);
    }
    if (v*v_old >= 0.0) return vec3(0);
    // finding root
    float t0 = t-dt, t1 = t;
    float v0 = v_old, v1 = v;
    for (int s = 0; s < 8; s += 1) {
        // t = t1 - (t1-t0) * v1/(v1-v0);
        t = 0.5 * (t0 + t1);
        // v = fun(ro+rd*t, rd);
        v = funT(ro+rd*t);
        if (v*v0 < 0.0) t1 = t, v1 = v;
        else t0 = t, v0 = v;
        if (abs(t1-t0) < 0.001*step_size) break;
    }
    vec3 n = normalize(funNGradT(ro+rd*t, 0.001));  // normal
    rd = normalize(screenToWorld(ro+rd)-screenToWorld(ro));
    if (dot(n,rd)>0.) n=-n;
    vec3 ldir = normalize(vec3(0.5,0.5,1.0));  // light
    float col = 0.2+0.1*n.y+0.6*max(dot(n,ldir),0.0)+0.1*pow(max(dot(reflect(rd,n),ldir),0.0),40.0);
    col *= smoothstep(0., 1., 5.0*(clamp(1.0-t, 0., 1.)));
    return vec3(0.95+0.05*n)*col;
}


void main(void) {
    mat4 mat = transformMatrix;
    mat = mat4(1.0);
    vec4 p0 = mat * vec4(vXy, 0.0, 1.0);
    vec4 p1 = mat * vec4(vXy, 1.0, 1.0);
    vec3 ro = p0.xyz / p0.w;
    vec3 rd = p1.xyz/p1.w - ro;  // don't normalize
    vec3 col = vIsosurf(ro, rd);
    col -= vec3(1.5/255.)*fract(0.13*gl_FragCoord.x*gl_FragCoord.y);  // reduce "stripes"
    //col = vec3(callCount) / 255.0;
    fragColor = vec4(clamp(col,0.,1.), 1.0);
}
