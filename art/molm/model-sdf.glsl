#version 300 es
precision highp float;

in vec2 fragUv;
out vec4 fragColor;

uniform vec2 uRotate;
uniform float uDist;
uniform vec2 uResolution;

uniform int ZERO;
uniform int iFrame;

#define PI 3.1415926


// primitives

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0., 1.);
    return mix(b, a, h) - k * h * (1.0 - h);
}
float smax(float a, float b, float k) {
    return -smin(-a, -b, k);
}
vec4 cmin(vec4 c1, vec4 c2) {
    return c1.w<c2.w ? c1 : c2;
}
vec4 smin(vec4 a, vec4 b, float k) {
    float h = clamp(0.5 + 0.5 * (b.w - a.w) / k, 0., 1.);
    float d = mix(b.w, a.w, h) - k * h * (1.0 - h);
    return vec4(mix(b.xyz, a.xyz, h), d);
}
vec4 smax(vec4 a, vec4 b, float k) {
    return smin(a*vec4(1,1,1,-1), b*vec4(1,1,1,-1), k) * vec4(1,1,1,-1);
}

float sdEllipsoid(vec3 p, vec3 r) {
    float k1 = length(p/r);
    float k2 = length(p/(r*r));
    return k1*(k1-1.0)/k2;
}
float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q,vec3(0))) + min(max(q.x,max(q.y,q.z)),0.0);
}

vec3 hash33(vec3 p3) {
    // https://www.shadertoy.com/view/4djSRW
    p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((vec3(p3.x, p3.x, p3.y) + vec3(p3.y, p3.z, p3.z))*p3.zyx);
}
float SimplexNoise3D(vec3 xyz) {
    const float K1 = 0.3333333333;
    const float K2 = 0.1666666667;
    vec3 p = xyz + (xyz.x + xyz.y + xyz.z)*K1;
    vec3 i = floor(p);
    vec3 f0 = xyz - (i - (i.x + i.y + i.z)*K2);
    //vec3f e = step(f0.yzx(), f0);  // possibly result in degenerated simplex
    vec3 e = vec3(f0.y > f0.x ? 0.0 : 1.0, f0.z >= f0.y ? 0.0 : 1.0, f0.x > f0.z ? 0.0 : 1.0);
    vec3 i1 = e * (vec3(1.0) - e.zxy);
    vec3 i2 = vec3(1.0) - e.zxy * (vec3(1.0) - e);
    vec3 f1 = f0 - i1 + K2;
    vec3 f2 = f0 - i2 + 2.0*K2;
    vec3 f3 = f0 - 1.0 + 3.0*K2;
    vec3 n0 = 2.0 * hash33(i) - 1.0;
    vec3 n1 = 2.0 * hash33(i + i1) - 1.0;
    vec3 n2 = 2.0 * hash33(i + i2) - 1.0;
    vec3 n3 = 2.0 * hash33(i + 1.0) - 1.0;
    vec4 v = vec4(dot(f0, n0), dot(f1, n1), dot(f2, n2), dot(f3, n3));
    vec4 w = max(-vec4(dot(f0, f0), dot(f1, f1), dot(f2, f2), dot(f3, f3)) + 0.5, vec4(0.0));
    return dot((w*w*w*w) * v, vec4(32.0));
}




// model

// #define BOX_RADIUS vec3(1.4,1.4,0.5)
vec4 mapHelmet(vec3 p, bool col_required) {
    p.z += 0.4;
    p += 0.01*sin(2.0*p.x)*sin(2.0*p.y);
    float d = sdEllipsoid(p-vec3(0.05,0,-0.1), vec3(1.35,1.3,0.5));
    float slt = sdEllipsoid(p-vec3(0,0,-2.5), vec3(1.0,1.0,4.0));
    slt = smax(slt, -sdEllipsoid(p-vec3(0.7,0.1,0.45), vec3(0.1,0.3,0.15)), 0.1);
    slt = smax(abs(slt)-0.02, p.z-0.8, 0.05);
    slt = smin(slt, sdEllipsoid(p-vec3(0,0,0.75), vec3(0.55,0.55,0.1)), 0.05);
    d = smin(d, slt, 0.1);
    d = smax(abs(d)-0.02, -p.z, 0.05);
    d = smax(d, -(length(p.xy-vec2(1.5,0))-0.5), 0.05);
    vec4 helmet = vec4(vec3(0.75,0.45,0.2), d);
    vec4 ears = vec4(0.25,0.15,0.1,
        length(vec3(p.x,abs(p.y),p.z)-vec3(0.0,0.95,0.3))-0.05+0.02*cos(40.0*p.y)*sin(40.0*p.z));
    helmet = smin(helmet, ears, 0.05);
    if (col_required) {
        helmet.xyz *= mix(vec3(0.6,0.6,0.7), vec3(1.0), smoothstep(-0.2,0.2,SimplexNoise3D(p)));
        helmet.xyz *= 1.0-exp(4.0*(SimplexNoise3D(10.0*p)-0.9));
    }
    return helmet;
}

#define BOX_RADIUS vec3(1.8,1.0,0.4)
vec4 mapToken(vec3 p, bool col_required) {
    vec3 q = vec3(p.x,p.y-0.1*cos(2.0*p.x),p.z+0.05+0.05*cos(4.0*p.x)*cos(4.0*p.y));
    float clo1 = sdBox(q, vec3(
        1.6+0.2*cos(8.0*q.y),
        0.8-0.1*q.x*q.x+0.1*sin(4.0*q.x),
        0.2*(1.0+0.3*sin(8.0*q.y)+0.05*sin(40.0*q.y)+0.02*sin(20.0*q.x))/(0.5*q.x*q.x+q.y*q.y+1.5)
    )-0.2)-0.2;
    q = vec3(p.x,p.y+0.1,p.z+0.05-0.2*cos(1.2*p.x)*cos(p.y));
    float clo2 = sdBox(q, vec3(
        1.4-0.4*tanh(q.y)*cos(7.0*q.y),
        0.8+0.1*tanh(p.y)*sin(6.0*p.x),
        0.1*(1.0+0.3*sin(12.0*q.y)+0.08*sin(40.0*q.y+10.0*sin(q.x)))/(q.x*q.x+1.5*q.y*q.y+1.0)
    )-0.2)-0.2;
    float noi = 0.04*exp(0.5*(sin(9.0*p.y-2.0*sin(2.0*p.x))-1.0))*SimplexNoise3D(10.0*p);
    float str = 0.005*sin(40.0*(p.x+1.5*p.y+1.0*sin(2.0*p.x)*sin(2.0*p.y)))*exp(0.5*(cos(1.2*p.x)*cos(3.0*p.y)-1.))*(0.5+0.5*tanh(10.0*p.z))*dot(p.xy,p.xy);
    float lyr = 0.006*sin(100.0*p.z+20.0*sin(p.x)*sin(2.0*p.y));
    float disp = noi + str + lyr;
    vec4 clo = smin(
        vec4(0.2,0.15,0.15,clo1),
        vec4(0.35,0.3,0.25,clo2),
        0.05);
    clo.w += disp;
    clo.xyz *= vec3(0.8,0.9,0.9)*exp(-40.0*disp);
    return clo;
}

vec4 map(vec3 p, bool col_required) {
    // return mapHelmet(p, col_required);
    return mapToken(p, col_required);
}

int sdfEvalCount = 0;
float sdf(vec3 p) {
    sdfEvalCount += 1;
    const float sc = 1.0;
    return map(p/sc, false).w*sc;
}
vec3 sdfGrad(in vec3 p, in float e) {
	float a = sdf(p+vec3(e,e,e));
	float b = sdf(p+vec3(e,-e,-e));
	float c = sdf(p+vec3(-e,e,-e));
	float d = sdf(p+vec3(-e,-e,e));
	return (.25/e)*vec3(a+b-c-d,a-b+c-d,a-b-c+d);
}


// SDF visualizer

// orange-blue: SDF isosurfaces
// red-black: discontinuity (high numerical gradient)
// green-pink: surface gradient lower/higher than 1

// color surface or not
#define COLOR 1

// raymarching parameters
#define MIN_STEP 0.005
#define MAX_STEP 0.1

// rendering parameters
#define FIELD_EMISSION 0.1
#define ISOSURFACE_FREQUENCY 8.0
#define DISCONTINUITY_OPACITY 0.01
#define SURFACE_GRADIENT 10.0

// projection parameters
#define PERSPECTIVE 10.0  /* larger: less perspective effect */
#define SCALE 5.0  /* image appears smaller when this is set larger */


// light direction as global variable
vec3 light = normalize(vec3(0.5,0.5,1.0));

// colormaps - https://www.shadertoy.com/view/NsSSRK
vec3 colorSdf(float t) {
    float r = .385+.619*t+.238*cos(4.903*t-2.61);
    float g = -5.491+.959*t+6.089*cos(.968*t-.329);
    float b = 1.107-.734*t+.172*cos(6.07*t-2.741);
    return clamp(vec3(r, g, b), 0.0, 1.0);
}
vec3 colorNormal(float t) {
    float r = .529-.054*t+.55*cos(5.498*t+2.779);
    float g = .21+.512*t+.622*cos(4.817*t-1.552);
    float b = .602-.212*t+.569*cos(5.266*t+2.861);
    return clamp(vec3(r, g, b), 0.0, 1.0);
}


// modified from a volume rendering demo
// https://github.com/harry7557558/Graphics/blob/master/raytracing/webgl_volume/fs-source.glsl
vec3 render(vec3 ro, vec3 rd, float t0, float t1) {
    float t = t0;
    vec3 totcol = vec3(0.0);
    float totabs = 1.0;
    float v_old = sdf(ro+rd*t), v;
    float dt = clamp(abs(v_old), MIN_STEP, MAX_STEP);
    for (int i=ZERO; i<128; i++) {
        t += dt;
        if (t > t1) return totcol;
        v = sdf(ro+rd*t);
        if (v*v_old<0.) break;
        vec3 col = colorSdf(0.5+0.5*sin(ISOSURFACE_FREQUENCY*PI*0.5*(v_old+v)));
        float grad = abs(v-v_old)/dt;
        float grad_abs = (1.0-grad)/dt;
        col = mix(vec3(1,0,0), col, clamp(exp(grad_abs),0.0,1.0));
        float absorb = FIELD_EMISSION+DISCONTINUITY_OPACITY*max(-grad_abs,0.0);
        totabs *= exp(-absorb*dt);
        totcol += col*absorb*totabs*dt;
        // dt = dt * abs(v/(v-v_old));
        dt = abs(v);
        dt = clamp(dt, MIN_STEP, MAX_STEP);
        v_old = v;
    }
    if (v*v_old<0.) {
        float t0 = t-dt, v0 = v_old;
        float t1 = t, v1 = v;
        for (int s = ZERO; s < 6; s += 1) {
            t = 0.5*(t0+t1);
            v = sdf(ro+rd*t);
            if (v*v0<0.) t1=t, v1=v;
            else t0=t, v0=v;
        }
        t = t0 + (t1-t0) * clamp(v0/(v0-v1), 0., 1.);
    }
    vec3 grad = sdfGrad(ro+rd*t, 1e-3);
    float grad_col = SURFACE_GRADIENT*(0.5*length(grad)-0.5);
    vec3 col = colorNormal(1.0-1.0/(1.0+exp(2.0*grad_col)));  // 0.5+0.5*tanh(grad_col)
#if COLOR
    col = map(ro+rd*t, true).xyz;
    col *= 0.2+0.05*normalize(grad).y+max(dot(normalize(grad), light),0.0);
#else
    col = 0.2+0.05*normalize(grad).y+col*max(dot(normalize(grad), light),0.0);
#endif
    // return vec3(sdfEvalCount)/255.;
    return totcol + col * totabs;
}


// ray intersection with a box
bool boxIntersection(vec3 ro, vec3 rd, out float tn, out float tf) {
    vec3 inv_rd = 1.0 / rd;
    vec3 n = inv_rd*(ro);
    vec3 k = abs(inv_rd)*BOX_RADIUS;
    vec3 t1 = -n - k, t2 = -n + k;
    tn = max(max(t1.x, t1.y), t1.z);
    tf = min(min(t2.x, t2.y), t2.z);
    if (tn > tf) return false;
    return true;
}

// main
void main() {

    // screen coordinates
    vec2 uv = fragUv;
    uv *= uResolution/min(uResolution.x,uResolution.y);
    uv *= 1. + .01*dot(uv,uv)*(dot(uv,uv)+1.);  // distorsion

    // calculate projection
    float rx = uRotate.x;
    float rz = -uRotate.y;
    vec3 w = vec3(cos(rx)*vec2(cos(rz),sin(rz)), sin(rx));
    vec3 u = vec3(-sin(rz),cos(rz),0);
    vec3 v = cross(w,u);

    // camera position
    vec3 ro = uDist*w;
    vec3 rd = normalize(mat3(u,v,-w)*vec3(uv, 2.0));

    // calculate pixel color
    light = normalize(w+0.5*u+0.1*v);

    float t0, t1;
    if (!boxIntersection(ro, rd, t0, t1)) {
        fragColor = vec4(vec3(0.0), 1.0);
        return;
    }
    vec3 col = render(ro, rd, t0, t1);;
    fragColor = vec4(col, 1.0);
}
