#version 300 es
precision highp float;

in vec2 vXy;
out vec4 fragColor;

uniform sampler2D iChannel0;
uniform mat4 transformMatrix;
uniform vec2 screenCom;

uniform float ZERO;  // used in loops to reduce compilation time
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
    {%FUN%}
}
vec3 funGradA(vec3 p) {  // analytical gradient
    callCount += 1;
#if {%Y_UP%}
    float x=p.x, y=p.z, z=-p.y;
#else
    float x=p.x, y=p.y, z=p.z;
#endif
    {%FUNGRAD%}
}
vec3 funGradN(vec3 p) {  // numerical gradient
    float h = 0.002*max(pow(length(p),1./3.),1.);  // error term O(h²)
    return vec3(
        fun(p+vec3(h,0,0)) - fun(p-vec3(h,0,0)),
        fun(p+vec3(0,h,0)) - fun(p-vec3(0,h,0)),
        fun(p+vec3(0,0,h)) - fun(p-vec3(0,0,h))
    ) / (2.0*h);
}
#if {%ANALYTICAL_GRADIENT%}
#if {%Y_UP%}
vec3 funGrad(vec3 p) {
    vec3 n = funGradA(p);
    return vec3(n.x, -n.z, n.y);
}
#else
#define funGrad funGradA
#endif  // {%Y_UP%}
#else
#define funGrad funGradN
#endif

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
}
float sdfS(vec3 p, vec3 rd) {
#if {%ANALYTICAL_GRADIENT%}
    // usually but not always faster
    return funS(p) / abs(dot(funGradS(p), rd));
#else
    return funS(p) / abs((funS(p+0.001*rd)-funS(p-0.001*rd))/0.002);
#endif
}


#define STEP_SIZE {%STEP_SIZE%}
#define MAX_STEP int(10.0/(STEP_SIZE))

uniform vec3 LDIR;
#define OPACITY 0.6

// calculate the color at one point, parameters are in screen space
float fade(float t) {
    return smoothstep(0., 1., 5.0*(clamp(1.0-t, 0., 1.)));
}
vec4 calcColor(vec3 ro, vec3 rd, float t) {
    vec3 n0 = funGrad(screenToWorld(ro+rd*t));
    rd = normalize(screenToWorld(ro+rd)-screenToWorld(ro));
    vec3 n = normalize(dot(n0,rd)>0. ? -n0 : n0);
#if {%Y_UP%}
    n0 = vec3(n0.x, n0.z, -n0.y);
#endif
#if {%COLOR%} == 0
    // porcelain-like shading
    vec3 albedo = mix(vec3(1.0), normalize(n0), 0.05);
    vec3 amb = vec3(0.2+0.1*n.y) * albedo;
    vec3 dif = 0.6*max(dot(n,LDIR),0.0) * albedo;
    vec3 spc = min(1.2*pow(max(dot(reflect(rd,n),LDIR),0.0),100.0),1.) * vec3(10.);
    vec3 rfl = mix(vec3(1.), vec3(4.), clamp(5.*dot(reflect(rd,n),LDIR),0.,1.));
    vec3 col = mix(amb+dif, rfl+spc, mix(.01,.2,pow(clamp(1.+dot(rd,n),.0,.8),5.)));
#else
#if {%COLOR%} == 1
    // color based on normal
    vec3 albedo = mix(vec3(1.0), normalize(n0), 0.45);
#elif {%COLOR%} == 2
    // heatmap color based on gradient magnitude
    float grad = 0.5-0.5*cos(PI*log(length(n0))/log(10.));
    vec3 albedo = vec3(.372,.888,1.182) + vec3(.707,-2.123,-.943)*grad
        + vec3(.265,1.556,.195)*cos(vec3(5.2,2.48,8.03)*grad-vec3(2.52,1.96,-2.88));
#endif
    // phong shading
    vec3 amb = vec3(0.2+0.1*n.y) * albedo;
    vec3 dif = 0.6*max(dot(n,LDIR),0.0) * albedo;
    vec3 spc = pow(max(dot(reflect(rd,n),LDIR),0.0),40.0) * vec3(0.1);
    vec3 col = amb + dif + spc;
#endif
    return vec4(col*fade(t), 1.0-pow(1.0-OPACITY,abs(1.0/dot(rd,n))));
}

// Without opacity, finds the zero using bisection search
vec3 vSolid(in vec3 ro, in vec3 rd, float t0, float t1) {
    // raymarching
    float t = ZERO, dt = STEP_SIZE;
    float v_old = sdfS(ro+rd*t0, rd), v;
    int i = int(ZERO);
    for (t += t0 + dt; i < MAX_STEP && t < t1; t += dt, i++) {
        vec3 p = ro + rd * t;
        v = sdfS(p, rd);
        if (v*v_old < 0.0) {
            break;
        }
        v_old = v;
        dt = isnan(v) ? STEP_SIZE : clamp(abs(v)-STEP_SIZE, 0.05*STEP_SIZE, STEP_SIZE);
    }
    if (v*v_old >= 0.0) return vec3(0);
    // finding root
    t0 = t-dt, t1 = t;
    float v0 = funS(ro+rd*t0), v1 = funS(ro+rd*t1);
    float old_dvdt = abs((v1-v0)/(t1-t0)), dvdt;
    for (int s = int(ZERO); s < 8; s += 1) {
        // bisect
        t = 0.5 * (t0 + t1);
        vec3 p = ro + rd * t;
        v = funS(p);
        if (v*v0 < 0.0) t1 = t, v1 = v;
        else t0 = t, v0 = v;
        // check discontinuity
        dvdt = abs((v1-v0)/(t1-t0));
#if {%DISCONTINUITY%}
        if (abs(t1-t0) < 1e-4 && dvdt > 1.8*old_dvdt) {
            return vec3(1,0,0) * fade(0.5*(t0+t1));
        }
#endif
        if (abs(t1-t0) < 0.001*STEP_SIZE) break;
        old_dvdt = dvdt;
    }
#if 0
    {  // debug analytical gradient
        vec3 p = screenToWorld(ro+rd*t);
        vec3 nn = funGradN(p);
        vec3 na = funGradA(p);
        return vec3(tanh(100.*length(nn-na)));
    }
#endif
    return calcColor(ro, rd, t).xyz;
}

// With opacity, approximates zeros using linear interpolation
vec3 vAlpha(in vec3 ro, in vec3 rd, float t0, float t1) {
    float t = ZERO, dt = STEP_SIZE;
    float v_old = sdfS(ro+rd*t0, rd), v;
    int i = int(ZERO);
    vec3 tcol = vec3(0.0);
    float mcol = 1.0;
    for (t += t0 + dt; i < MAX_STEP && t < t1; t += dt, i++) {
        vec3 p = ro + rd * t;
        v = sdfS(p, rd);
        if (v*v_old < 0.0 && mcol > 0.01) {
            float tm = t - dt * v / (v - v_old);
            vec4 rgba = calcColor(ro, rd, tm);
            tcol += mcol * rgba.xyz * rgba.w;
            mcol *= 1.0 - rgba.w;
        }
        v_old = v;
        dt = isnan(v) ? STEP_SIZE : clamp(abs(v)-STEP_SIZE, 0.05*STEP_SIZE, STEP_SIZE);
    }
    return tcol;
}


void main(void) {
    vec3 ro = vec3(vXy-screenCom, 0);
    vec3 rd = vec3(0, 0, 1);
    vec2 t01 = texture(iChannel0, 0.5+0.5*vXy).xy;
    float pad = max(STEP_SIZE, 1./255.);
    vec3 col = {%V_RENDER%}(ro, rd, max(t01.x-pad, 0.0), min(t01.y+pad, 1.0));
    col -= vec3(1.5/255.)*fract(0.13*gl_FragCoord.x*gl_FragCoord.y);  // reduce "stripes"
    //col = vec3(callCount) / 255.0;
    fragColor = vec4(clamp(col,0.,1.), 1.0);
}
