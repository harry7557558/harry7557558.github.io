precision highp float;

varying vec3 vRo;  // ray origin
varying vec3 vRd;  // ray direction

uniform vec3 uEggParameters;
uniform mat3 uEggOrientation;  // transposed
uniform vec3 uEggTranslation;


// MODELING

#define ID_PLANE 0
#define ID_EGG 1

float eggEquationPolar(float t) {
    float s = sin(t);
    vec3 r = (s*s) * vec3(1.0, exp(-t), cos(t));
    return 1.0 - dot(r, uEggParameters);
}

float eggSDF(vec3 p) {
    p = uEggOrientation * (p - uEggTranslation);
    float d = length(p.xy), z = p.z;
    float a = atan(abs(d), z);
    float r = length(vec2(d, z));
    return r - eggEquationPolar(a);
}

vec3 getEggNormal(vec3 p) {
    const float eps = 0.01;
    return normalize(vec3(
        eggSDF(p+vec3(eps,0,0))-eggSDF(p-vec3(eps,0,0)),
        eggSDF(p+vec3(0,eps,0))-eggSDF(p-vec3(0,eps,0)),
        eggSDF(p+vec3(0,0,eps))-eggSDF(p-vec3(0,0,eps))));
}


bool intersectSphere(vec3 ce, float r, in vec3 ro, in vec3 rd, out float t) {
    vec3 p = ro-ce;
    float b = dot(p,rd), c = dot(p,p)-r*r;
    float delta = b*b-c; if (delta<=0.0) return false;
    delta = sqrt(delta);
    t = -b-delta;
    return true;
}

bool raymarch(in vec3 ro, in vec3 rd, out float t) {
    const float eps = 0.001;
    if (!intersectSphere(uEggTranslation, 1.0+eps, ro, rd, t)) return false;
    t = max(t, 0.0);
    ro = ro + rd*t;
    float t0 = t;
    t = eps;
    for (int i=0; i<64; i++) {
        float dt = 0.9*eggSDF(ro+rd*t);
        t += dt;
        if (dt < eps) {
            vec3 p = ro+rd*t;
            t += t0;
            return true;
        }
        if (dt>2.0) break;
    }
    return false;
}


bool intersectScene(in vec3 ro, in vec3 rd, out float min_t, out vec3 min_n, out vec3 fcol, out int intersect_id) {
    float t;
    vec3 n;
    min_t = 1e+6;
    intersect_id = -1;

    // intersect with the egg
    if (raymarch(ro, rd, t)) {
        min_t = t, min_n = getEggNormal(ro+rd*t);
        vec3 p = uEggOrientation*(ro+rd*t-uEggTranslation);
        fcol = eggTexture(p);
        fcol *= vec3(0.99, 0.95, 0.81);
        intersect_id = ID_EGG;
    }

    // intersect with the plane
    t = -(ro.z+0.0)/rd.z;
    if (t > 0.0 && t < min_t) {
        min_t = t, min_n = vec3(0, 0, 1);
        //fcol = vec3(0.5, 0.8, 1.0);
        fcol = vec3(1.0, 1.0, 0.9);
        vec2 p = ro.xy+rd.xy*t;
        if (mod(floor(p.x)+floor(p.y),2.0)==0.0) fcol*=0.9;
      #if 0
        if (length(p-vec2(0,0))<0.1) fcol = vec3(0.5,0.5,1.0);
        if (length(p-vec2(1,0))<0.1) fcol = vec3(1.0,0.5,0.5);
        if (length(p-vec2(0,1))<0.1) fcol = vec3(0.4,0.8,0.4);
      #endif
        intersect_id = ID_PLANE;
    }

    if (dot(rd, min_n) > 0.0) min_n = -min_n;

    return intersect_id != -1;
}


// RENDERING

const vec3 light = vec3(3, 3, 10);


float calcSoftShadow(vec3 ro, float k) {
    vec3 rd = light - ro;
    float col = 1.0;
    float t = 0.1;
    float maxt = length(rd);
    for (int i=0; i<8; i++){
        float h = eggSDF(ro + rd*t);
        col = min(col, smoothstep(0.0, 1.0, k*h/t));
        t += clamp(h, 0.01, 0.2);
        if (h<0. || t>maxt) break;
    }
    return max(col, 0.);
}

float calcAO(vec3 p, vec3 n) {
    float t = 0.12;
    vec3 q = p+n*t;
    float sd = min(eggSDF(q), q.z);
    float occ = (t - sd)*2.0;
    return smoothstep(0.0, 1.0, 1.0-occ);
}


vec3 getShade(vec3 ro, vec3 rd, vec3 n, vec3 fcol, int intersect_id) {
    vec3 lightdir = light - ro;
    vec3 ambient = (0.5+0.2*dot(n,vec3(0.5,0.5,0.5)))*vec3(1.0,1.0,1.0)*fcol / (0.01*dot(ro,ro)+1.0);
    vec3 direct = 3.0*max(dot(n,lightdir)/dot(lightdir,lightdir), 0.0) * fcol;
    vec3 specular = (intersect_id==ID_EGG?0.05:0.1) * vec3(1.0,0.95,0.9)*pow(max(dot(rd, normalize(lightdir)), 0.0), (intersect_id==ID_EGG?5.0:40.0));
    float shadow = calcSoftShadow(ro, 0.2);
    float ao = calcAO(ro, n);
    return ao*(ambient+shadow*(direct+specular));
}

vec3 traceRay(vec3 ro, vec3 rd) {

    float t;
    vec3 n;
    vec3 fcol;
    int intersect_id;
    if (!intersectScene(ro, rd, t, n, fcol, intersect_id)) {
        return vec3(0.0);
    }

    ro = ro + rd*t;
    vec3 refl = rd - 2.0*dot(rd, n)*n;
    vec3 col_direct = getShade(ro, refl, n, fcol, intersect_id);
    vec3 n0 = n;

    if (intersect_id==ID_EGG) return col_direct;

    vec3 col_refl = vec3(0.0);
    if (intersectScene(ro+0.01*refl, refl, t, n, fcol, intersect_id)) {
        col_refl = getShade(ro+refl*t, refl-2.0*dot(refl,n)*n, n, fcol, intersect_id);
    }
    else col_refl = vec3(max(dot(refl, normalize(light-ro)), 0.0));

    return mix(col_direct, col_refl, 0.2+0.3*pow(1.0-abs(dot(refl,n0)),5.0));
}


void main() {
    vec3 col = traceRay(vRo, normalize(vRd));
    float gamma = 1.2;
    col = vec3(pow(col.x,gamma), pow(col.y,gamma), pow(col.z,gamma));
    col = 1.1*col;
    gl_FragColor = vec4(col, 1.0);
}
