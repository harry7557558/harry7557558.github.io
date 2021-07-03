// this shader seems to be useless because everything is re-done in fragment shader

precision highp float;

attribute vec4 aVertexPosition;

uniform vec2 uRotate;
uniform float uDist;
uniform vec2 uResolution;

uniform vec3 uEggTranslation;

varying vec3 vRo;  // ray origin
varying vec3 vRd;  // ray direction

void main(void) {

    float rx = uRotate.x, rz = uRotate.y;
    vec3 w = vec3(cos(rx)*vec2(cos(rz),sin(rz)), sin(rx));
    vec3 u = vec3(-sin(rz),cos(rz),0);
    vec3 v = cross(w,u);

    vec3 cam = uDist*w;
    //cam += vec3(1, 1, 0.8)*uEggTranslation;
    cam += vec3(0, 0, 0.6);

    if (cam.z < 0.0) {
        cam -= w * (cam.z/w.z+1e-3);  // prevent below horizon
    }

    vec3 rd = normalize(mat3(u,v,-w)*vec3(aVertexPosition.xy*uResolution.xy, 2.0*length(uResolution)));

    vRo = cam, vRd = rd;

    gl_Position = aVertexPosition;
}
