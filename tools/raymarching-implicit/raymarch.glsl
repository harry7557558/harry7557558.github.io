#version 300 es
precision highp float;

out vec4 fragColor;

uniform sampler2D iChannel0;
uniform mat4 transformMatrix;
in vec2 vXy;

#define ZERO min(uIso, 0.)
#define PI 3.1415926

vec3 screenToWorld(vec3 p) {
    vec4 q = transformMatrix * vec4(p, 1);
    return q.xyz / q.w;
}


// function and its gradient in world space
int callCount = 0;
float fun(vec3 p) {  // function
    callCount += 1;
#if {%Y_UP%}
    float x=p.x, y=p.z, z=-p.y;
#else
    float x=p.x, y=p.y, z=p.z;
#endif
    return {%FUN%};
}
vec3 funGrad(vec3 p) {  // analytical gradient
    callCount += 1;
#if {%Y_UP%}
    float x=p.x, y=p.z, z=-p.y;
    vec3 n = {%FUNGRAD%};
    return vec3(n.x, -n.z, n.y);
#else
    float x=p.x, y=p.y, z=p.z;
    return {%FUNGRAD%};
#endif
}
vec3 funGradN(vec3 p) {  // numerical gradient
    float h = 0.002*max(pow(length(p),1./3.),1.);  // error term O(h²)
    return vec3(
        fun(p+vec3(h,0,0)) - fun(p-vec3(h,0,0)),
        fun(p+vec3(0,h,0)) - fun(p-vec3(0,h,0)),
        fun(p+vec3(0,0,h)) - fun(p-vec3(0,0,h))
    ) / (2.0*h);
}

// function and its gradient in screen space
float funS(vec3 p) {
    return fun(screenToWorld(p));
}
vec3 funGradS(vec3 x) {
    mat3 R = mat3(transformMatrix);
    vec3 T = transformMatrix[3].xyz;
    vec3 P = vec3(transformMatrix[0][3], transformMatrix[1][3], transformMatrix[2][3]);
    float S = transformMatrix[3][3];
    float pers = dot(P, x) + S;
    mat3 M = (R * pers - outerProduct(R*x+T, P)) / (pers*pers);
    return funGrad(screenToWorld(x)) * M;
    // return funGradN(screenToWorld(x)) * M;
}
float sdfS(vec3 p, vec3 rd) {
    return funS(p) / abs(dot(funGradS(p), rd));  // usually but not always faster
    //return funS(p) / abs((funS(p+0.001*rd)-funS(p-0.001*rd))/0.002);
}


#define LDIR normalize(vec3(0.5,0.5,1.0))

// calculate the color at one point, parameters are in screen space
vec3 calcColor(vec3 ro, vec3 rd, float t) {
    vec3 n0 = normalize(funGrad(screenToWorld(ro+rd*t)));
    rd = normalize(screenToWorld(ro+rd)-screenToWorld(ro));
    vec3 n = dot(n0,rd)>0. ? -n0 : n0;
    n0 = n;  // why?
#if {%Y_UP%}
    n0 = vec3(n0.x, n0.z, -n0.y);
#endif
    vec3 basecol = mix(vec3(1.0), n0, {%NORMAL_COLOR_BLEND%});
    vec3 amb = vec3(0.2+0.1*n.y) * basecol;
    vec3 dif = 0.6*max(dot(n,LDIR),0.0) * basecol;
    vec3 spc = 0.1*pow(max(dot(reflect(rd,n),LDIR),0.0),40.0) * vec3(1.0);
    vec3 col = amb + dif + spc;
    col *= smoothstep(0., 1., 5.0*(clamp(1.0-t, 0., 1.)));
    return col;
}


#define STEP_SIZE 0.01
#define MAX_STEP 400
#define OPACITY 0.75


// Without opacity, finds the zero using bisection search
vec3 vSolid(in vec3 ro, in vec3 rd, float t0, float t1) {
    // raymarching
    float t = 0.0, dt = STEP_SIZE;
    float v_old = sdfS(ro+rd*t0, rd), v;
    int i = 0;
    for (t = t0 + dt; i < MAX_STEP && t < t1; t += dt, i++) {
        vec3 p = ro + rd * t;
        v = sdfS(p, rd);
        if (v*v_old < 0.0) break;
        v_old = v;
        dt = isnan(v) ? STEP_SIZE : clamp(abs(v)-STEP_SIZE, 0.1*STEP_SIZE, STEP_SIZE);
    }
    if (v*v_old >= 0.0) return vec3(0);
    // finding root
    t0 = t-dt, t1 = t;
    float v0 = v_old, v1 = v;
    for (int s = 0; s < 8; s += 1) {
        t = 0.5 * (t0 + t1);
        vec3 p = ro + rd * t;
        v = funS(p);
        if (v*v0 < 0.0) t1 = t, v1 = v;
        else t0 = t, v0 = v;
        if (abs(t1-t0) < 0.001*STEP_SIZE) break;
    }
#if 0
    {  // debug analytical gradient
        vec3 p = screenToWorld(ro+rd*t);
        vec3 nn = funGradN(p);
        vec3 na = funGrad(p);
        return vec3(tanh(100.*length(nn-na)));
    }
#endif
    return calcColor(ro, rd, t);
}

// With opacity, approximates zeros using linear interpolation
vec3 vAlpha(in vec3 ro, in vec3 rd, float t0, float t1) {
    float t = 0.0, dt = STEP_SIZE;
    float v_old = sdfS(ro+rd*t0, rd), v;
    int i = 0;
    vec3 tcol = vec3(0.0), mcol = vec3(1.0);
    for (t = t0 + dt; i < MAX_STEP && t < t1; t += dt, i++) {
        vec3 p = ro + rd * t;
        v = sdfS(p, rd);
        if (v*v_old < 0.0) {
            float tm = t - dt * v / (v - v_old);
            vec3 col = calcColor(ro, rd, tm);
            tcol += mcol * col * OPACITY;
            mcol *= 1.0 - OPACITY;
        }
        v_old = v;
        dt = isnan(v) ? STEP_SIZE : clamp(abs(v)-STEP_SIZE, 0.1*STEP_SIZE, STEP_SIZE);
    }
    return tcol;
}


void main(void) {
    vec3 ro = vec3(vXy, 0);
    vec3 rd = vec3(0, 0, 1);
    vec2 t01 = texture(iChannel0, 0.5+0.5*vXy).xy;
    float pad = max(STEP_SIZE, 1./255.);
    vec3 col = {%V_RENDER%}(ro, rd, max(t01.x-pad, 0.0), min(t01.y+pad, 1.0));
    col -= vec3(1.5/255.)*fract(0.13*gl_FragCoord.x*gl_FragCoord.y);  // reduce "stripes"
    //col = vec3(callCount) / 255.0;
    fragColor = vec4(clamp(col,0.,1.), 1.0);
}
