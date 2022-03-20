#version 300 es
precision highp float;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
out vec4 fragColor;

// get image
#define sv(p) texelFetch(iChannel0, p, 0).xyz
// get magnitude of gradient
#define sg(p) texelFetch(iChannel1, p, 0)

vec3 antialias(ivec2 p0, int r) {
    if (sg(p0).x < 0.01) {
        vec3 c0 = sv(p0);
        vec3 c1 = sg(p0).yzw;
        //return c0;
        return length(c1-c0)>0.3 ? c1 : c0;  // remove black pixels
    }

    // find the line of best fit to the gradient
    // https://www.desmos.com/calculator/cs4faizltl
    float n = float((2*r+1)*(2*r+1));
    float sx=0., sy=0., sx2=0., sxy=0., sy2=0.;
    for (int dx=-r; dx<=r; dx++) {
    for (int dy=-r; dy<=r; dy++) {
        float w = sg(p0+ivec2(dx,dy)).x;
        sx += w*float(dx);
        sy += w*float(dy);
        sx2 += w*float(dx*dx);
        sy2 += w*float(dy*dy);
        sxy += w*float(dx*dy);
    }}
    float ml = n*sxy-sx*sy;
    if (ml==0.) return sv(p0); // no variance
    float kl = (n*sx2-n*sy2+sy*sy-sx*sx)/ml;
    vec2 ab = vec2(kl-sign(ml)*sqrt(kl*kl+4.), 2.);
    float c = (ab.x*sx+ab.y*sy)/n;
    float abl = length(ab);
    c /= abl, ab /= abl;
    //return vec3(0,1,0);  // debug

    // rasterize the line with AA
    float ck = 0.5-12.*c;
    if (ck<0. || ck>1.) return sv(p0);
    vec3 c0=vec3(0.), c1=vec3(0.); // color of two sides
    float w0=0., w1=0.;
    for (int dx=1-r; dx<r; dx++) {
    for (int dy=1-r; dy<r; dy++) if (dx*dx+dy*dy<r*r) {
        float d = dot(ab,vec2(dx,dy));
        if (abs(d)>1.) continue; // prevent blurring
        vec3 col = sv(p0+ivec2(dx,dy));
        if (d<c) c0+=col, w0+=1.;
        else c1+=col, w1+=1.;
    }}
    if (w0==0. || w1==0.) return sv(p0);
    //return vec3(0,1,0);  // debug
    return mix(c0/w0, c1/w1, clamp(ck,0.,1.)); // AA
}

void main(void) {
    ivec2 p = ivec2(gl_FragCoord.xy);
    vec3 col = antialias(p, 3);
    //col = sv(p).xyz;
    //col = vec3(sg(p).x);
    fragColor = vec4(col,1.0);
}
