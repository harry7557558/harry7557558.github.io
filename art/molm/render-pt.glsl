#version 300 es
precision highp float;

in vec2 fragUv;
out vec4 fragColor;

uniform vec2 uRotate;
uniform float uDist;
uniform vec2 uResolution;

uniform int ZERO;
uniform int iFrame;
uniform sampler2D sSelf;

#define PI 3.1415926

uniform sampler2D texFloor;

// random number generator
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



// sample hemisphere distributions
vec3 sampleCosWeighted(vec3 n) {
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


// sample GGX, return weight (Fr divided by PDF)
// At least one of the two functions have a bug
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

#define ImportanceSampling true
vec3 sampleCookTorrance(
    vec3 wi, vec3 n,
    float alpha,  // roughness
    float f0,  // ratio of reflection along the normal
    vec3 microfacet_col,  // microfacet color
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
        m_col *= Fr_cos * microfacet_col;
    }
    else {
        vec3 col = microfacet_col * Fr;
        m_col *= col * wo.z;
    }
    return wo.x * u + wo.y * v + wo.z * n;
}



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


#define ID_BACKGROUND 0
#define ID_LIGHT -1
#define ID_PLANE 1
#define ID_SPHERE 2
#define EPSILON 1e-3
#define UPSILON 1e3

#define LIGHT_POS vec3(1,0,12)
#define LIGHT_COL vec3(20.0)
#define LIGHT_RAD 5.0


void intersectScene(vec3 ro, vec3 rd,
    inout int intersect_id, inout float min_t, inout vec3 min_n) {
    ro += (min_n==vec3(0) ? 1.0 : sign(dot(min_n, rd))) * EPSILON * rd;
    float t;
    vec3 n;
    // intersect light
    {
        t = min_t;
        if (intersectSphere(LIGHT_RAD, ro-LIGHT_POS, rd, t, n) && t < min_t) {
            intersect_id = ID_LIGHT;
            min_t = t, min_n = n;
        }
    }
    // intersect plane
    {
        t = -ro.z/rd.z;
        if (t > 0.0 && t < min_t) {
            intersect_id = ID_PLANE;
            min_t = t, min_n = vec3(0,0,1);
        }
    }
    // intersect sphere
    {
        t = min_t;
        if (intersectSphere(1.0, ro-vec3(0,0,1), rd, t, n) && t < min_t) {
            intersect_id = ID_SPHERE;
            min_t = t, min_n = n;
        }
    }
    if (intersect_id != ID_BACKGROUND) min_t += EPSILON;
}

vec3 traceRay(vec3 ro, vec3 rd) {
    vec3 tcol = vec3(0.0), fcol = vec3(1.0);
    for (int i = ZERO; i < 20; i++) {
        int intersect_id = ID_BACKGROUND;
        float t = UPSILON;
        vec3 n = vec3(0.0);
        intersectScene(ro, rd=normalize(rd), intersect_id, t, n);
        n = normalize(n);
        if (dot(rd, n) > 0.) n = -n;

        if (intersect_id == ID_BACKGROUND) {
            return tcol;
        }

        vec3 p = ro+rd*t;
        vec3 dls_rd = LIGHT_POS-p;
        // int occl_id = ID_BACKGROUND; float occl_t=UPSILON; vec3 occl_n=n;
        // intersectScene(p, normalize(dls_rd), occl_id, occl_t, occl_n);
        // bool is_occl = occl_id != ID_BACKGROUND;
        // if (is_occl && i==1) return 0.5+0.5*normalize(dls_rd);
        bool is_occl = true;

        // light
        if (intersect_id == ID_LIGHT) {
            vec3 col = LIGHT_COL;
            tcol += fcol * col;
            return tcol;
        }

        // plane
        if (intersect_id == ID_PLANE) {
            vec3 albedo = 0.4*texture(texFloor, 0.04*mat2(1,-1,1,1)*p.xy).xyz
                        + 0.4*texture(texFloor, 0.15*p.xy).xyz
                        + 0.3*texture(texFloor, 0.4*p.yx).xyz;
            if (!is_occl) tcol += fcol * albedo * LIGHT_COL / dot(dls_rd,dls_rd);
            rd = sampleCookTorrance(-rd, n, 0.5, 0.4, albedo, fcol);
        }

        // sphere
        else if (intersect_id == ID_SPHERE) {
            vec3 albedo = vec3(0.9,0.5,0.0);
            if (!is_occl) tcol += fcol * albedo * LIGHT_COL / dot(dls_rd,dls_rd);
            fcol *= albedo;
            rd = sampleCookTorrance(-rd, n, 0.2, 0.9, albedo, fcol);
        }

        ro = p;
    }
    return tcol;
}


void main(void) {
    // random seed
    vec3 p3 = fract(vec3(fragUv.xy, sin(float(iFrame))) * .1031);
    p3 += dot(p3, p3.zyx + 31.32);
    float h = fract((p3.x + p3.y) * p3.z);
    uint seed0 = uint(16777216.*h);

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
    int nsample = 4;
    for (int i=ZERO; i<nsample; i++) {
        rand_seed = seed0 + uint(iFrame*nsample + i), rand_base = 0u;
        vec2 duv = (-1.0+2.0*vec2(randf(),randf()))/uResolution;
        vec3 rd = normalize(mat3(u,v,-w)*vec3(uv+duv, 2.0));
        col += traceRay(cam, rd)/float(nsample);
    }

    // output
    vec4 rgbn = texelFetch(sSelf, ivec2(gl_FragCoord.xy), 0);
    if (iFrame == 0) rgbn.w = 0.0;
    fragColor = vec4((rgbn.xyz*rgbn.w + col)/(rgbn.w+1.0), rgbn.w+1.0);
}
