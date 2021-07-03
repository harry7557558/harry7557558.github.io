precision highp float;

#define PI 3.1415926

// Gravatar identicon components
// https://barro.github.io/2018/02/avatars-identicons-and-hash-visualization/

#define N_COMPONENT 44

// return a signed number, -1 < u,v < 1
float identiconComponent_raw(int id, float u, float v) {
    if (id==0) return v;
    if (id==1) return u-v-2.0;
    if (id==2) return u+v;
    if (id==3) return abs(v)-0.5*(u+1.0);
    if (id==4) return abs(u)+abs(v)-1.0;
    if (id==5) return abs(u+v)-(u-v+2.0)/3.0;
    if (id==6) return max(abs(v)-0.5*(u+1.0),-max(abs(v)-0.5*(-u+1.0),-u));
    if (id==7) return max(abs(u+v)-(u-v+2.0)/3.0,u-v-1.0);
    if (id==8) return max(abs(u),abs(v))-0.5;
    if (id==9) return max(min(-u,v),u-v);
    if (id==10) return max(u,-v);
    if (id==11) return max(u+abs(v)-1.0,-u);
    if (id==12) return max(v-u,-v-u);
    if (id==13) return max(v-u-1.0,max(u,-v));
    if (id==14) return u-v+1.0;
    if (id==15) return u*v;
    if (id==16) return (v+u)*(v-u);
    if (id==17) return u-2.0*v+1.0;
    if (id==18) return min(u-2.0*v+1.0,max(u-2.0*v-1.0,v));
    if (id==19) return min(u-2.0*v+1.0,max(u-v,v));
    if (id==20) return max(-u-v,u+2.0*v-1.0);
    if (id==21) return min(max(min(-u,v),u-v),max(max(-u,v),u-v-1.0));
    if (id==22) return max(1.0-2.0*abs(v)-u,-1.0+2.0*abs(v)-u);
    if (id==23) return abs(u)-2.0*abs(v)+1.0;
    if (id==24) return min(abs(u)-2.0*abs(v)+1.0,abs(u)+2.0*abs(v)-1.0);
    if (id==25) return abs(u)+abs(v)-0.5;
    if (id==26) return min(1.0+abs(u)-2.0*abs(v),abs(v)-2.0*abs(u)+1.0);
    if (id==27) return min(max(abs(v)-u-1.0,u),abs(v)-u);
    if (id==28) return min(max(2.0*v-u-1.0,u-v),max(2.0*v+u-1.0,-u-v));
    if (id==29) return min(u-2.0*v+1.0,-u+2.0*v+1.0);
    if (id==30) return min(min(1.0+abs(u)-2.0*abs(v),abs(v)-2.0*abs(u)+1.0),abs(u)+abs(v)-0.5);
    if (id==31) return max(abs(abs(u)+abs(v)-0.75)-0.25,min(u,-v));
    if (id==32) return abs(u)+2.0*abs(v)-1.0;
    if (id==33) return min(u-v+1.0,min(max(u-v-1.0,max(-u,v)),max(min(-u,v),u-v)));
    if (id==34) return abs(abs(u)+abs(v)-0.75)-0.25;
    if (id==35) return min(max(u+2.0*v+1.0,u-2.0*v-1.0),min(max(v-2.0*u+1.0,v+2.0*u-1.0),max(-u-2.0*v+1.0,-u+2.0*v-1.0)));
    if (id==36) return min(max(u+2.0*v+1.0,u-2.0*v-1.0),max(v-2.0*u+1.0,v+2.0*u-1.0));
    if (id==37) return min(max(u+2.0*v+1.0,u-2.0*v-1.0),max(-u-2.0*v+1.0,-u+2.0*v-1.0));
    if (id==38) return max(-u+2.0*abs(v)-1.0,u-abs(v));
    if (id==39) return max(2.0*abs(v)-u-1.0,min(0.5-u,u-abs(v)));
    if (id==40) return min(u-v+1.0,v-u+1.0);
    if (id==41) return min(max(u-2.0*v+1.0,u),max(2.0*v-u+1.0,-u));
    if (id==42) return max(abs(u)+abs(v)-1.0,abs(u)-abs(v));
    if (id==43) return min(max(max(u-v,-u-v),v-u-1.0),max(max(v-u,u+v),u-v-1.0));
    return 0.0;
}

float identiconComponent(vec2 uv, int id, bool trspose, bool flip_h, bool flip_v, bool sgn) {
    float u = uv.x, v = uv.y;
    if (trspose) u = uv.y, v = uv.x;
    if (flip_h) u = -u;
    if (flip_v) v = -v;
    return (sgn?-1.0:1.0) * identiconComponent_raw(id, u, v);
}

vec3 textureTop(float u, float v) {
    float x = v*cos(4.0*u), y = v*sin(4.0*u);
    float sd = identiconComponent(vec2(x,y), 11, false, true, true, false);
    return sd<0.0 ? vec3(0.9, 0.5, 0.5) : vec3(0.5, 0.9, 0.9);
}

vec3 textureRing(float u, float v) {
    u = 2.0*u-1.0, v=2.0*v-1.0;
    float sd = identiconComponent(vec2(u,v), 21, true, true, false, true);
    return sd<0.0 ? vec3(0.5, 0.5, 0.9) : vec3(0.5, 0.9, 0.5);
}

vec3 textureBody(float u, float v) {
    u = 2.0*u-1.0, v=2.0*v-1.0;
    float sd = identiconComponent(vec2(u,v), 43, true, true, true, false);
    return sd<0.0 ? vec3(0.9, 0.9, 0.5) :  vec3(0.5, 0.9, 0.9);
}

vec3 textureMiddle(float u, float v) {
    u = 2.0*u-1.0, v=2.0*v-1.0;
    vec3 k = abs(v)<0.4 ? vec3(1.0) : vec3(0.9);
    float sd = identiconComponent(vec2(u,v), 28, false, false, false, true);
    vec3 col = sd<0.0 ? vec3(0.9,0.8,0.7) : vec3(0.7,0.5,1.0);
    return k * col;
}

vec3 eggTexture(vec3 p) {
    float u = atan(p.x, -p.y), v = (PI-atan(length(p.xy), p.z))/PI;
    float vn = min(v, 1.0-v);

    vec3 col = vec3(1.0);

    if (vn<0.1) {
        col = textureTop(v<0.5?u:1.0-u, vn/0.1);
    }
    else if (vn<0.2) {
        float un8r = acos(cos(4.0*u))/PI;
        col = textureRing(v<0.5?un8r:1.0-un8r, (vn-0.1)/(0.2-0.1));
    }
    else if (vn<0.38) {
        float un8 = fract(u * 4.0 / PI);
        col = textureBody(v<0.5?un8:1.0-un8, (vn-0.2)/(0.38-0.2));
    }
    else {
        float un8 = u * 4.0 + 0.5*PI;
        float vn = sin(un8)<0.0 ? v : 1.0-v;
        col = textureMiddle(fract(un8/PI), (vn-0.38)/(1.0-2.0*0.38));
    }

    return col;
}
