precision highp float;

#define PI 3.1415926

vec3 textureBackground(float u, float v) {
    return vec3(1.0);
    return vec3(0.2, 0.1, 0.1);
}

// u: left to right, -1 to 1
// v: bottom to top, 0 to 1
vec3 eggTexture(float u, float v) {
    vec3 col = vec3(1.0);
    //col = sin(10.*PI*v)>0.0 ? vec3(1.0, 0.5, 0.5) : vec3(0.5, 0.5, 1.0);
    col = textureBackground(u, v);
    return col;
}
