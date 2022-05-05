#version 300 es
precision highp float;

uniform sampler2D sImage;
uniform int iFrame;

out vec4 fragColor;

void main() {

    float nsample = 250.0 / pow(float(iFrame + 1),0.67);
    float grids = sqrt(nsample);
    int gr = clamp(int(grids), 1, 16);

    vec3 col = vec3(0.0);
    ivec2 p0 = gr*(ivec2(gl_FragCoord.xy+0.5*vec2(gr))/gr);
    for (int dx=0; dx<gr; dx++) {
        for (int dy=0; dy<gr; dy++) {
            ivec2 p = p0+ivec2(dx,dy);
            col += texelFetch(sImage, p, 0).xyz;
        }
    }
    col /= float(gr*gr);

    fragColor=vec4(col,1.0);
}
