#version 300 es
precision highp float;

out vec4 fragColor;

uniform mat4 transformMatrix;
in vec2 vXy;

#define ZERO min(uIso, 0.)
#define PI 3.1415926


float fun_coords(vec3 p) {
    float v1 = length(p)-0.6;
    float v2 = max(max(abs(p.x),abs(p.y)),abs(p.z))-0.6;
    float o = mix(v1, v2, 1.2);
    float bx = length(p-vec3(1,0,0))-0.1;
    float by = length(p-vec3(0,1.2,0))-0.1;
    float bz = length(p-vec3(0,0,1.5))-0.1;
    return min(min(bx, by), min(bz, o));
}
float fun_heart(vec3 p) {
    float e = p.x*p.x + 2.25*p.y*p.y + p.z*p.z - 1.0;
	return e*e*e - (p.x*p.x + 0.1125*p.y*p.y)*p.z*p.z*p.z;
}
float fun_fox(vec3 p) {
    float e = p.x*p.x+2.*p.y*p.y+p.z*p.z;
	return e*e*e-(9.*p.x*p.x+p.y*p.y)*p.z*p.z*p.z-.5;
}
float fun_star(vec3 p) {
    vec3 u = p*p;
    float d = u.x+2.0*u.y+u.z-1.0;
    return 4.0*d*d-p.z*(5.*u.x*u.x-10.*u.x*u.z+u.z*u.z)-1.0;
}
float fun_genus2(vec3 p) {
    vec3 u = p*p;
    return 2.*p.y*(u.y-3.*u.x)*(1.-u.z)+(u.x+u.y)*(u.x+u.y)-(9.*u.z-1.)*(1.-u.z);
}
float fun_torus(vec3 p) {
    float k = dot(p,p)+3.;
    return k*k - 16.*dot(p.xy,p.xy);
}
float fun_wineglass(vec3 p) {
    return p.x*p.x+p.y*p.y-log(p.z+3.2)*log(p.z+3.2)-0.02;
}

float fun0(vec3 p) {
    return fun_coords(p);
}

float fun(vec3 p) {
    vec4 q = transformMatrix*vec4(p,1.0); p=q.xyz/q.w;
    return fun0(p);
}
vec3 funNGrad(in vec3 p, in float e) {
    vec4 q = transformMatrix*vec4(p,1.0); p=q.xyz/q.w;
    return vec3(
        fun0(p+vec3(e,0,0)) - fun0(p-vec3(e,0,0)),
        fun0(p+vec3(0,e,0)) - fun0(p-vec3(0,e,0)),
        fun0(p+vec3(0,0,e)) - fun0(p-vec3(0,0,e))
    ) / (2.0*e);
}



#define STEP 0.01
#define MAX_STEP 1000.

vec3 vIsosurf(in vec3 ro, in vec3 rd) {
    float step_count = min(ceil(1.0/STEP), MAX_STEP);
    float step_size = 1.0 / step_count;
    float t = 0.0;
    float v_old = fun(ro), v;
    for (t = step_size; t < 1.0; t += step_size) {
        v = fun(ro+rd*t);
        if (v*v_old < 0.0) break;
        v_old = v;
    }
    if (v*v_old >= 0.0) return vec3(0.0);
    // raymarching
    for (int s = 0; s < 8; s += 1) {
        v_old = v;
        step_size *= -0.5;
        for (int i = 0; i < 2; i++) {
            t += step_size;
            v = fun(ro+rd*t);
            if (v*v_old < 0.0) break;
        }
    }
    vec3 n = normalize(funNGrad(ro+rd*t, 0.01));
    float col = 0.2+0.1*n.y+0.6*max(dot(n, normalize(vec3(0.5,0.5,1.0))),0.0);
    return vec3(col);
}


void main(void) {
    mat4 mat = transformMatrix;
    mat = mat4(1.0);
    vec4 p0 = mat * vec4(vXy, 0.0, 1.0);
    vec4 p1 = mat * vec4(vXy, 1.0, 1.0);
    vec3 ro = p0.xyz / p0.w;
    vec3 rd = p1.xyz/p1.w - ro;  // don't normalize
    vec3 col = vIsosurf(ro, rd);
    col += vec3(1.5/255.)*fract(0.13*gl_FragCoord.x*gl_FragCoord.y);  // reduce "stripes"
    fragColor = vec4(col, 1.0);
}
