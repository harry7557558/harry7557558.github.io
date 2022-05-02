#version 300 es
precision highp float;

uniform vec2 uRotate;
uniform float uDist;
uniform vec2 uResolution;

in vec2 fragUv;
out vec4 fragColor;

#define PI 3.1415926

uniform sampler2D texFloor;


vec3 traceRay(vec3 ro, vec3 rd) {
    float t = -ro.z/rd.z;
    if (t < 0.0) return vec3(0.0);
    vec3 p = ro + rd * t;
    vec3 albedo = (0.5+0.1*sin(10.*p.x)*sin(10.*p.y))*vec3(0.8,0.6,0.4);
    albedo = 0.8*texture(texFloor, 0.15*p.xy).xyz + 0.4*texture(texFloor, 0.4*p.yx).xyz;
    return albedo / (0.2*dot(p.xy,p.xy)+1.);
}


void main(void) {
    vec2 uv = fragUv;
    uv *= uResolution/min(uResolution.x,uResolution.y);
    uv *= 1. + .01*dot(uv,uv)*(dot(uv,uv)+1.);

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
    vec3 rd = normalize(mat3(u,v,-w)*vec3(uv, 2.0));
    vec3 col = traceRay(cam, rd);

    // output
    fragColor = vec4(col, 1.0);
}
