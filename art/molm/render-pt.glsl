#version 300 es
precision highp float;

in vec2 fragUv;
out vec4 fragColor;

uniform vec2 uRotate;
uniform float uDist;
uniform vec2 uResolution;

uniform int ZERO;  // reduce compile time
uniform int iFrame;
uniform sampler2D sSelf;

#define PI 3.1415926

// external texture(s)
uniform sampler2D texPortrait;


// Modeling primitives

mat2 rot2(float a) { return mat2(cos(a), sin(a), -sin(a), cos(a)); }
mat3 rotx(float a) { return mat3(1, 0, 0, 0, cos(a), sin(a), 0, -sin(a), cos(a)); }
mat3 rotz(float a) { return mat3(cos(a), sin(a), 0, -sin(a), cos(a), 0, 0, 0, 1); }
mat3 roty(float a) { return mat3(cos(a), 0, -sin(a), 0, 1, 0, sin(a), 0, cos(a)); }

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
float sdLnNormEllipsoid(vec3 p, vec3 r, vec3 n) {
    float d = pow(dot(pow(abs(p)/r,n),vec3(1)),1.0/max(max(n.x,n.y),n.z))-1.0;
    float m = min(min(r.x,r.y),r.z);
    return d * m;
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


// Modeling

const vec3 boxRadiusHelmet = vec3(1.4,1.4,0.5);
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
vec3 gradHelmet(in vec3 p) {
    const float h = 0.01;
	float a = mapHelmet(p+vec3( h, h, h), false).w;
	float b = mapHelmet(p+vec3( h,-h,-h), false).w;
	float c = mapHelmet(p+vec3(-h, h,-h), false).w;
	float d = mapHelmet(p+vec3(-h,-h, h), false).w;
	return (.25/h)*vec3(a+b-c-d,a-b+c-d,a-b-c+d);
}

const vec3 boxRadiusToken = vec3(1.8,1.0,0.4);
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
    float noi = 0.08*exp(0.5*(sin(9.0*p.y-2.0*sin(2.0*p.x))-1.0))*SimplexNoise3D(10.0*p);
    float str = 0.01*sin(40.0*(p.x+1.5*p.y+1.0*sin(2.0*p.x)*sin(2.0*p.y)))*exp(0.5*(cos(1.2*p.x)*cos(3.0*p.y)-1.))*(0.5+0.5*tanh(10.0*p.z))*dot(p.xy,p.xy);
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
vec3 gradToken(in vec3 p) {
    const float h = 0.01;
	float a = mapToken(p+vec3( h, h, h), false).w;
	float b = mapToken(p+vec3( h,-h,-h), false).w;
	float c = mapToken(p+vec3(-h, h,-h), false).w;
	float d = mapToken(p+vec3(-h,-h, h), false).w;
	return (.25/h)*vec3(a+b-c-d,a-b+c-d,a-b-c+d);
}

const vec3 boxRadiusCrystal = 0.75*vec3(0.2,0.8,1.0)+0.005;
float mapCrystal(vec3 p) {
    return sdLnNormEllipsoid(p, (boxRadiusCrystal-0.005)*vec3(vec2(0.9-0.1*sin(p.z)),1), vec3(4.0));
}
vec3 gradCrystal(in vec3 p) {
    const float h = 0.01;
	float a = mapCrystal(p+vec3( h, h, h));
	float b = mapCrystal(p+vec3( h,-h,-h));
	float c = mapCrystal(p+vec3(-h, h,-h));
	float d = mapCrystal(p+vec3(-h,-h, h));
	return (.25/h)*vec3(a+b-c-d,a-b+c-d,a-b-c+d);
}



// Primitive intersection functions

bool intersectSphere(float r, vec3 ro, vec3 rd,
        inout float t, inout vec3 n) {
    float b = -dot(ro, rd), c = dot(ro, ro) - r * r;
    float delta = b * b - c;
    if (delta < 0.0) return false;
    delta = sqrt(delta);
    float t1 = b - delta, t2 = b + delta;
    if (t1 > t2) t = t1, t1 = t2, t2 = t;
    if (t1 > t || t2 <= 0.) return false;
    t = t1 > 0. ? t1 : t2;
    n = normalize(ro + rd * t);
    return true;
}
bool intersectBox(vec3 boxRadius, vec3 ro, vec3 rd, out float tn, out float tf) {
    vec3 inv_rd = 1.0 / rd;
    vec3 n = inv_rd*(ro);
    vec3 k = abs(inv_rd)*boxRadius;
    vec3 t1 = -n - k, t2 = -n + k;
    tn = max(max(t1.x, t1.y), t1.z);
    tf = min(min(t2.x, t2.y), t2.z);
    if (tn > tf) return false;
    return true;
}


// Raymarching intersection functions

bool intersectHelmet(vec3 ro, vec3 rd, inout float t) {
    const float MIN_STEP = 0.005, MAX_STEP = 0.1;
    // intersect bounding box
    float t0, t1;
    if (!intersectBox(boxRadiusHelmet, ro, rd, t0, t1)) return false;
    if (t1 < 0. || t0 > t) return false;
    t0 = max(t0, 0.0), t1 = min(t1, t);
    // raymarching
    t = t0;
    float v_old = mapHelmet(ro+rd*t, false).w, v;
    float dt = clamp(abs(v_old), MIN_STEP, MAX_STEP);
    for (int i=ZERO; i<128; i++) {
        t += dt;
        v = mapHelmet(ro+rd*t, false).w;
        if (v*v_old<0.) break;
        if (t > t1) return false;
        dt = clamp(abs(v), MIN_STEP, MAX_STEP);
        v_old = v;
    }
    if (v*v_old<0.) {
        float t0 = t-dt, v0 = v_old;
        float t1 = t, v1 = v;
        for (int s = ZERO; s < 6; s += 1) {
            t = 0.5*(t0+t1);
            v = mapHelmet(ro+rd*t, false).w;
            if (v*v0<0.) t1=t, v1=v;
            else t0=t, v0=v;
        }
        t = t0 + (t1-t0) * clamp(v0/(v0-v1), 0., 1.);
        return true;
    }
    return false;
}

bool intersectToken(vec3 ro, vec3 rd, inout float t) {
    const float MIN_STEP = 0.005, MAX_STEP = 0.1;
    // intersect bounding box
    float t0, t1;
    if (!intersectBox(boxRadiusToken, ro, rd, t0, t1)) return false;
    if (t1 < 0. || t0 > t) return false;
    t0 = max(t0, 0.0), t1 = min(t1, t);
    // raymarching
    t = t0;
    float v_old = mapToken(ro+rd*t, false).w, v;
    float dt = clamp(abs(v_old), MIN_STEP, MAX_STEP);
    for (int i=ZERO; i<128; i++) {
        t += dt;
        v = mapToken(ro+rd*t, false).w;
        if (v*v_old<0.) break;
        if (t > t1) return false;
        dt = clamp(abs(v), MIN_STEP, MAX_STEP);
        v_old = v;
    }
    if (v*v_old<0.) {
        float t0 = t-dt, v0 = v_old;
        float t1 = t, v1 = v;
        for (int s = ZERO; s < 6; s += 1) {
            t = 0.5*(t0+t1);
            v = mapToken(ro+rd*t, false).w;
            if (v*v0<0.) t1=t, v1=v;
            else t0=t, v0=v;
        }
        t = t0 + (t1-t0) * clamp(v0/(v0-v1), 0., 1.);
        return true;
    }
    return false;
}

bool intersectCrystal(vec3 ro, vec3 rd, inout float t) {
    const float MIN_STEP = 0.01, MAX_STEP = 0.2;
    // intersect bounding box
    float t0, t1;
    if (!intersectBox(boxRadiusCrystal, ro, rd, t0, t1)) return false;
    if (t1 < 0. || t0 > t) return false;
    t0 = max(t0, 0.0), t1 = min(t1, t);
    // raymarching
    t = t0;
    float v_old = mapCrystal(ro+rd*t), v;
    float dt = clamp(abs(v_old), MIN_STEP, MAX_STEP);
    for (int i=ZERO; i<128; i++) {
        t += dt;
        v = mapCrystal(ro+rd*t);
        if (v*v_old<0.) break;
        if (t > t1) return false;
        dt = clamp(dt*abs(v/(v-v_old)), MIN_STEP, MAX_STEP);
        v_old = v;
    }
    if (v*v_old<0.) {
        float t0 = t-dt, v0 = v_old;
        float t1 = t, v1 = v;
        for (int s = ZERO; s < 6; s += 1) {
            t = 0.5*(t0+t1);
            v = mapCrystal(ro+rd*t);
            if (v*v0<0.) t1=t, v1=v;
            else t0=t, v0=v;
        }
        t = t0 + (t1-t0) * clamp(v0/(v0-v1), 0., 1.);
        return true;
    }
    return false;
}

// Random number generator
uint rand_seed = 0u, rand_base = 0u;
#if 1  /* low-discrepency */
const int primes[32] = int[32](2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131);
float vanDerCorput(int n, int b) {
    float x = 0.0;
    float e = 1.0 / float(b);
    for (int i = 0; i < 8; i++) {
        int d = n % b;
        x += float(d) * e;
        e /= float(b);
        n /= b;
    }
    return x;
}
float randf() {
    return vanDerCorput(int(rand_seed), primes[(rand_base++)%32u]);
}
#else  /* LCG */
uint randu() { return rand_seed = rand_seed * 1664525u + 1013904223u; }
float randf() { return float(randu()) * (1./4294967296.); }
#endif



// Sample BRDF
#define ImportanceSampling true

vec3 sampleCosWeightedHemisphere(vec3 n) {
    vec3 u = normalize(cross(n, vec3(1.2345, 2.3456, -3.4561)));
    vec3 v = cross(u, n);
    float rn = randf();
    float an = 2.0*PI*randf();
    vec2 rh = sqrt(rn) * vec2(cos(an), sin(an));
    float rz = sqrt(1. - rn);
    return rh.x * u + rh.y * v + rz * n;
}
vec3 sampleUniformHemisphere(vec3 n) {
    vec3 u = normalize(cross(n, vec3(1.2345, 2.3456, -3.4561)));
    vec3 v = cross(u, n);
    float rz = randf();
    float an = 2.0*PI*randf();
    vec2 rh = sqrt(1.0-rz*rz) * vec2(cos(an), sin(an));
    return rh.x * u + rh.y * v + rz * n;
}

// return weight (Fr divided by PDF)
float sampleGgxSimple(in vec3 wi, in float alpha, out vec3 wo) {
    wo = sampleUniformHemisphere(vec3(0, 0, 1));
    vec3 m = normalize(wi+wo);
    float denom = (alpha*alpha-1.)*m.z*m.z+1.;
    float Fr = alpha*alpha / (PI * denom*denom);
    return Fr / (1.0/(2.0*PI));
}
float sampleGgxImportance(in vec3 wi, in float alpha, out vec3 wo) {
    float su = 2.0*PI*randf();
    float sv = randf();
    //sv = acos(sqrt((1.0-sv)/((alpha*alpha-1.)*sv+1.)));
    sv = atan(alpha*sqrt(sv/(1.0-sv)));
    vec3 h = vec3(sin(sv)*vec2(cos(su),sin(su)), cos(sv));
    wo = -(wi-2.0*dot(wi,h)*h);
    return wo.z<0. ? 0. : 4.0*dot(wi, h);
}

// Torrance-Sparrow BRDF
vec3 sampleBrdf(
    vec3 wi, vec3 n,
    float alpha,  // roughness
    float f0,  // ratio of reflection along the normal
    vec3 albedo,  // microfacet color
    inout vec3 m_col
    )
{

    vec3 u = normalize(cross(n, vec3(1.2345, 2.3456, -3.4561)));
    vec3 v = cross(u, n);
    wi = vec3(dot(wi, u), dot(wi, v), dot(wi, n));
    vec3 wo, m;  // out and half vector

    // GGX divided by PDF
    float D;
    if (ImportanceSampling) D = sampleGgxImportance(wi, alpha, wo);
    else D = sampleGgxSimple(wi, alpha, wo);

    m = normalize(wi+wo);

    // Geometry
    float tan2_theta_i = (1.0-wi.z*wi.z)/(wi.z*wi.z);
    float tan2_theta_o = (1.0-wo.z*wo.z)/(wo.z*wo.z);
    float lambda_i = 0.5*(sqrt(1.0+alpha*alpha*tan2_theta_i)-1.0);
    float lambda_o = 0.5*(sqrt(1.0+alpha*alpha*tan2_theta_o)-1.0);
    float G = 1.0/(1.0+lambda_i+lambda_o);

    // Fresnel
    float F = f0 + (1.0-f0)*pow(1.0-dot(wi, m), 5.0);

    // Put all together
    float Fr = D*G*F / (4.0*wi.z*wo.z+1e-4);
    float Fr_cos = Fr * wo.z;  // wo is the direction of light in path tracing
    if (ImportanceSampling) {
        m_col *= Fr_cos * albedo;
    }
    else {
        vec3 col = albedo * Fr;
        m_col *= col * wo.z;
    }
    return wo.x * u + wo.y * v + wo.z * n;
}

// refraction
vec3 sampleFresnelRefraction(vec3 rd, vec3 n, float n1, float n2) {
    float eta = n1 / n2;
    float ci = -dot(n, rd);
    if (ci < 0.0) ci = -ci, n = -n;
    float ct = 1.0 - eta * eta * (1.0 - ci * ci);
    if (ct < 0.0) return rd + 2.0*ci*n;
    ct = sqrt(ct);
    float Rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct);
    float Rp = (n1 * ct - n2 * ci) / (n1 * ct + n2 * ci);
    float R = 0.5 * (Rs * Rs + Rp * Rp);
    return randf() > R ?
        rd * eta + n * (eta * ci - ct)  // refraction
        : rd + 2.0*ci*n;  // reflection
}


// Scene

#define ID_BACKGROUND 0
#define ID_LIGHT 1
#define ID_PLANE 2
#define ID_SPHERE 3  /*for testing materials*/
#define ID_HELMET 4
#define ID_TOKEN 5
#define ID_CRYSTAL 6

#define EPSILON 1e-3
#define UPSILON 1e3

#define LIGHT_POS vec3(1,0,12)
#define LIGHT_COL vec3(20.0)
#define LIGHT_RAD 5.0

#define posHelmet vec3(0,0,0.54)
#define rotHelmet rotx(0.04*PI)
#define posToken vec3(0.5,1.0,0.05)
#define rotToken rotz(0.4*PI)
#define posCrystal vec3(1.0,-1.5,boxRadiusCrystal.z)
#define rotCrystal rotz(0.15*PI)

void intersectScene(vec3 ro, vec3 rd, bool inside_crystal,
    inout int intersect_id, inout float min_t, inout vec3 min_n) {
    ro += (min_n==vec3(0) ? 1.0 : sign(dot(min_n, rd))) * EPSILON * rd;
    float t;
    vec3 n;
    // intersect crystal
    if (!false) {
        t = min_t;
        vec3 p = inverse(rotCrystal)*(ro-posCrystal);
        if (intersectCrystal(p, inverse(rotCrystal)*rd, t) && t < min_t) {
            intersect_id = ID_CRYSTAL;
            min_t = t;
            // if (inside_crystal) return;
        }
    }
    // intersect sphere
    if (false) {
        t = min_t;
        if (intersectSphere(1.0, ro-vec3(0,0,1.01), rd, t, n) && t < min_t) {
            intersect_id = ID_SPHERE;
            min_t = t, min_n = n;
        }
    }
#if 1
    // intersect helmet
    if (!false) {
        t = min_t;
        vec3 p = inverse(rotHelmet)*(ro-posHelmet);
        if (intersectHelmet(p, inverse(rotHelmet)*rd, t) && t < min_t) {
            intersect_id = ID_HELMET;
            min_t = t;
        }
    }
    // intersect token
    if (!false) {
        t = min_t;
        vec3 p = inverse(rotToken)*(ro-posToken);
        if (intersectToken(p, inverse(rotToken)*rd, t) && t < min_t) {
            intersect_id = ID_TOKEN;
            min_t = t;
        }
    }
#endif
    // intersect plane
    {
        t = -ro.z/rd.z;
        if (t > 0.0 && t < min_t) {
            intersect_id = ID_PLANE;
            min_t = t, min_n = vec3(0,0,1);
        }
    }
    // intersect light
    {
        t = min_t;
        if (intersectSphere(LIGHT_RAD, ro-LIGHT_POS, rd, t, n) && t < min_t) {
            intersect_id = ID_LIGHT;
            min_t = t, min_n = n;
        }
    }
    if (intersect_id != ID_BACKGROUND) min_t += EPSILON;
}

vec3 getPortraitGlow(vec3 ro, vec3 rd, float t1) {
    ro = inverse(rotCrystal)*(ro-posCrystal);
    rd = inverse(rotCrystal)*rd;
    float t = -ro.x/rd.x;
    if (t < 0. || t > t1) return vec3(0);
    vec3 p = ro + rd * t;
    vec2 uv = 2.0*(p.yz-vec2(0,0.05))*vec2(1,-0.7)/0.75;
    if (max(abs(uv.x),abs(uv.y))>=1.) return vec3(0);
    vec3 col = 1.0-texture(texPortrait, 0.5+0.5*uv).xyz;
    col = mix(col, vec3(1.0)*col.y, 1.0);
    return col;
}

vec3 traceRay(vec3 ro, vec3 rd) {
    vec3 tcol = vec3(0.0), fcol = vec3(1.0);
    bool is_inside = false;
    for (int i = ZERO; i < 20; i++) {
        int intersect_id = ID_BACKGROUND;
        float t = UPSILON;
        vec3 n = vec3(0.0);
        intersectScene(ro, rd=normalize(rd), is_inside, intersect_id, t, n);
        n = normalize(n);
        if (dot(rd, n) > 0.) n = -n;

        if (is_inside) tcol += getPortraitGlow(ro, rd, t);

        if (intersect_id == ID_BACKGROUND) {
            // tcol += fcol * vec3(1.0) * max(rd.z,0.0);
            return tcol;
        }

        vec3 p = ro+rd*t;
        // fcol *= pow(vec3(0.99,0.5,0.1), 0.01*vec3(t));

        // light
        if (intersect_id == ID_LIGHT) {
            tcol += fcol * LIGHT_COL;
            return tcol;
        }
        // plane
        if (intersect_id == ID_PLANE) {
            float tex = 0.0;
            for (float k=0.; k<4.; k++) {
                vec2 q = 0.3*(mat2(4.,-exp(k),exp(k),4.)*p.xy-vec2(exp2(k)));
                tex += 0.5 * pow(1.5,-k) * cos(q.x)*cos(q.y);
            }
            vec3 albedo = mix(vec3(0.6,0.6,0.7), vec3(0.7,0.55,0.45), clamp(0.3+0.3*tex,0.,1.));
            float mc = SimplexNoise3D(vec3(3.0*p.xy,0.0)) + 2.8/(1.0+0.1*dot(p.xy,p.xy)) - 1.0;
            albedo *= tanh(max(mc, 0.25));
            rd = sampleBrdf(-rd, n, 0.5, 0.4, albedo, fcol);
        }
        // sphere
        else if (intersect_id == ID_SPHERE) {
            vec2 eta = is_inside ? vec2(1.8, 1.0) : vec2(1.0, 1.8);
            rd = sampleFresnelRefraction(rd, n, eta.x, eta.y);
            // if (is_inside) tcol += fcol * t * vec3(1.0,0.5,0.0);
            // if (is_inside) fcol *= pow(vec3(0.99,0.5,0.1), vec3(t));
        }
#if 1
        // helmet
        else if (intersect_id == ID_HELMET) {
            vec3 q = inverse(rotHelmet)*(p-posHelmet);
            vec3 albedo = mapHelmet(q, true).xyz;
            n = normalize(rotHelmet*gradHelmet(q));
            rd = sampleBrdf(-rd, n, 0.2, 0.5, albedo, fcol);
        }
        // token
        else if (intersect_id == ID_TOKEN) {
            vec3 q = inverse(rotToken)*(p-posToken);
            vec3 albedo = mapToken(q, true).xyz;
            // albedo = pow(albedo+vec3(0.05,0.0,0.1), vec3(0.8));
            n = normalize(rotToken*gradToken(q));
            rd = sampleBrdf(-rd, n, 0.8, 0.3, albedo, fcol);
        }
#endif
        // token
        else if (intersect_id == ID_CRYSTAL) {
            vec3 q = inverse(rotCrystal)*(p-posCrystal);
            n = (is_inside?-1.0:1.0)*normalize(rotCrystal*gradCrystal(q));
            vec2 eta = is_inside ? vec2(1.8, 1.0) : vec2(1.0, 1.8);
            rd = sampleFresnelRefraction(rd, n, eta.x, eta.y);
            // rd = sampleBrdf(-rd, n, 0.2, 0.3, vec3(1,0.5,0.5), fcol);
        }

        ro = p;
        if (dot(rd, n) < 0.0) is_inside = !is_inside;
    }
    return tcol;
}


void main(void) {
    // more frames, higher fps
    const int discard_size = 4;
    int pid = iFrame % (discard_size*discard_size);
    ivec2 cid = ivec2(pid/discard_size, pid%discard_size);
    ivec2 cact = ivec2(gl_FragCoord.xy) % discard_size;
    if (cid != cact) {
        if (iFrame == 0) {
            fragColor = vec4(0.0);
            return;
        }
        discard;
    }

    // random seed
    vec3 p3 = fract(fragUv.xyx*1.1031);
    // if (fragUv.x<0.) p3 = fract(vec3(fragUv.xy, sin(float(iFrame)))*.1031);
    p3 += dot(p3, p3.zxy + 31.32);
    float h = fract((p3.x + p3.y) * p3.z);
    uint seed0 = uint(1048576.*h);

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
    vec3 cam = uDist*w + vec3(0, 0, 0.6);
    if (cam.z < 0.0) {
        cam -= w * (cam.z/w.z+1e-3);  // prevent below horizon
    }

    // generate ray
    vec3 col = vec3(0.0);
    int nsample = 1;
    for (int i=ZERO; i<nsample; i++) {
        rand_seed = seed0 + uint(iFrame*nsample/(discard_size*discard_size) + i);
        rand_base = 0u;
        vec2 duv = (-1.0+2.0*vec2(randf(),randf()))/uResolution;
        vec3 rd = normalize(mat3(u,v,-w)*vec3(uv+duv, 2.0));
        col += traceRay(cam, rd);
    }

    // output
    vec4 rgbn = texelFetch(sSelf, ivec2(gl_FragCoord.xy), 0);
    if (iFrame == 0) rgbn.w = 0.0;
    fragColor = vec4((rgbn.xyz*rgbn.w + col)/(rgbn.w+float(nsample)), rgbn.w+float(nsample));
}
