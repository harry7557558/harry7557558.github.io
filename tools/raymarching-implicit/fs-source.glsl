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


// function and its gradient in world space
int callCount = 0;
float fun(vec3 p) {  // function
    callCount += 1;
    float x=p.x, y=p.y, z=p.z;
    return {%FUN%};
}
vec3 funGrad(vec3 p) {  // analytical gradient
    callCount += 1;
    float x=p.x, y=p.y, z=p.z;
    return {%FUNGRAD%};
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



vec3 vIsosurf(in vec3 ro, in vec3 rd) {
    const float step_size = 0.01;
    // raymarching
    float t = 0.0, dt = step_size;
    float v_old = funS(ro), v;
    int i = 0;
    for (t = dt; i < 240 && t < 1.0; t += dt, i++) {
        vec3 p = ro + rd * t;
        v = funS(p) / abs(dot(funGradS(p), rd));  // usually but not always faster
        //v = funS(p) / abs((funS(p+0.001*dt)-funS(p-0.001*dt))/0.002);
        if (v*v_old < 0.0) break;
        v_old = v;
        dt = isnan(v) ? step_size : clamp(abs(v)-step_size, 0.1*step_size, step_size);
    }
    if (v*v_old >= 0.0) return vec3(0);
    // finding root
    float t0 = t-dt, t1 = t;
    float v0 = v_old, v1 = v;
    for (int s = 0; s < 8; s += 1) {
        t = 0.5 * (t0 + t1);
        vec3 p = ro + rd * t;
        v = funS(p);
        if (v*v0 < 0.0) t1 = t, v1 = v;
        else t0 = t, v0 = v;
        if (abs(t1-t0) < 0.001*step_size) break;
    }
#if 0
    {  // debug analytical gradient
        vec3 p = screenToWorld(ro+rd*t);
        vec3 nn = funGradN(p);
        vec3 na = funGrad(p);
        //return vec3(100.*length(normalize(nn)-normalize(na)));
        //return vec3(100.*abs(length(nn)-length(na)));
        return vec3(100.*length(nn-na));
    }
#endif
    vec3 n = normalize(funGrad(screenToWorld(ro+rd*t)));
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
