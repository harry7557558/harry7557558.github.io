#version 300 es
precision highp float;

in vec2 vXy;
out vec4 fragColor;

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
    return {%FUN%};
}
vec3 funGradA(vec3 p) {  // analytical gradient
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
#if {%ANALYTICAL_GRADIENT%}
#define funGrad funGradA
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

// returns the inverval to check for intersections
vec2 premarch(in vec3 ro, in vec3 rd) {
    float t = ZERO, dt = STEP_SIZE;
    float v_old = funS(ro), v;
    float t0 = -1.0, t1 = -1.0;
    float min_t = 0.0, min_v = 1e12;
    int i = int(ZERO);
    for (t += dt; i < MAX_STEP && t < 1.0; t += dt, i++) {
        vec3 p = ro + rd * t;
        v = sdfS(p, rd);
        if (abs(v) < min_v) min_t = t, min_v = abs(v);
        float dt1 = isnan(v) ? STEP_SIZE : clamp(abs(v)-STEP_SIZE, 0.1*STEP_SIZE, STEP_SIZE);
        if (v*v_old < 0.0) {
            if (t0 < 0.) t0 = t - dt, t1 = t + dt1;
            else t1 = t;
        }
        v_old = v;
        dt = dt1;
    }
    if (t0 < 0.) t0 = t1 = min_t;
    return vec2(t0, t1);
}


void main(void) {
    vec2 t = premarch(vec3(vXy-screenCom,0), vec3(0,0,1));
    fragColor = vec4(t, 0.0, 1.0);
}