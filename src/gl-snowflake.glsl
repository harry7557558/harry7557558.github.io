precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec3 iMouse;

#define PI 3.14159265368979

float sqr(vec2 x) {return dot(x,x);}
float det(vec2 a, vec2 b) {return a.x*b.y-a.y*b.x;}

float sd_wedge(vec2 p, vec2 a, vec2 c, vec2 b) {
	p -= c, a -= c, b -= c;
	float da = sqr(p - a * max(dot(p, a) / dot(a, a), 0.0));
	float db = sqr(p - b * max(dot(p, b) / dot(b, b), 0.0));
	float sign = det(a, b) > 0.0 ? max(det(b, p), det(p, a)) : max(det(a, p), det(p, b));
	return sqrt(min(da, db)) * (sign > 0.0 ? 1.0 : -1.0);
}

float hexagon(vec2 p, float r) {
	return dot(vec2(0.866025404, 0.5), p) - 0.866025404*r;
}

float map(vec2 p0) {
	float a = abs(mod(3.0*atan(p0.y, p0.x) + 0.5*PI, PI) - 0.5*PI) / 3.0;
	vec2 p = length(p0.xy)*vec2(cos(a), sin(a));
	a = abs(mod(3.0*atan(p0.x, p0.y) + 0.5*PI, PI) - 0.5*PI) / 3.0;;
	vec2 q = length(p0.xy)*vec2(sin(a), cos(a));

	float d = 1e+12;
	d = min(d, 0.1*hexagon(p, 0.15));
	d = min(d, 0.5*hexagon(p, 0.1));
	d = min(d, 1.0*max(sd_wedge(p, vec2(0.0, 0.0), vec2(0.0, 0.01), vec2(2.0, 0.0)), p.x - 1.25));
	d = min(d, 0.3*sd_wedge(p, vec2(0.2, 0.0), vec2(0.3, 0.1), vec2(0.25, 0.0)));
	d = min(d, 0.3*sd_wedge(p, vec2(0.3, 0.0), vec2(0.4, 0.1), vec2(0.35, 0.0)));
	d = min(d, 0.5*(length(p - vec2(0.45, 0.0)) - 0.04));
	d = min(d, 0.3*sd_wedge(p, vec2(0.48, 0.0), vec2(0.56, 0.13), vec2(0.55, 0.0)));
	d = min(d, 0.2*sd_wedge(p, vec2(0.5, 0.0), vec2(0.8, 0.12), vec2(1.0, 0.0)));
	d = min(d, 0.3*sd_wedge(p, vec2(0.9, 0.0), vec2(1.1, 0.1), vec2(1.0, 0.0)));
	d = min(d, 0.3*sd_wedge(p, vec2(1.1, 0.0), vec2(1.2, 0.05), vec2(1.15, 0.0)));
	d = min(d, 1.0*sd_wedge(q, vec2(0.0, 0.0), vec2(0.01, 0.0), vec2(0.0, 0.5)));
	d = min(d, length(q - vec2(0.0, 0.18)) - 0.02);
	d = min(d, length(q - vec2(0.0, 0.24)) - 0.02);
	d = min(d, 0.3*sd_wedge(q, vec2(0.0, 0.2), vec2(0.05, 0.7), vec2(0.0, 0.65)));
	d = min(d, 0.3*sd_wedge(q, vec2(0.0, 0.65), vec2(0.03, 0.65), vec2(0.0, 0.75)));
	return d - 0.001;
}

vec3 get_background(vec3 rd) {
    vec3 col = (0.4+0.1*sin(iTime)+0.1*sin(0.5*iTime))
        * vec3(0.5 + 1.0*dot(rd,vec3(0.5,0.5,-0.5))
        + 0.6*sin(5.*rd.x)*sin(5.*rd.y)*sin(5.*rd.z)
        + 0.3*cos(10.*rd.x)*cos(10.*rd.y)*cos(10.*rd.z)
        + 0.2*cos(20.*rd.x)*cos(20.*rd.y)*cos(20.*rd.z)
        + 0.05*sin(45.*rd.x)*cos(44.*rd.y)*sin(46.*rd.z));
    col = vec3(1.0)-exp(-col);
    return clamp(col * 0.8*vec3(0.2,0.2,1.0), 0.0, 1.0);
}

void main() {
    float iDist = 6.0;

    float rx = iMouse.z>0.?1.57+1.0*(2.0*iMouse.y/iResolution.y-1.0):1.4+0.5*sin(0.1*iTime);
    float rz = iMouse.z>0.?-iMouse.x/iResolution.x*4.0*3.14:0.2*iTime-2.0;

    vec3 w = vec3(cos(rx)*vec2(cos(rz),sin(rz)), sin(rx));
    vec3 u = vec3(-sin(rz),cos(rz),0);
    vec3 v = cross(w,u);

    vec2 uv = 2.0 * gl_FragCoord.xy / iResolution.xy - vec2(1.0) - vec2(0.0, 0.05);
    vec3 rd = normalize(mat3(u,v,-w)*vec3(uv*iResolution.xy,4.0*min(iResolution.x,iResolution.y)));
    vec3 ro = iDist*w + (iDist-2.0)*rd;

    float t = -ro.z / rd.z;
    ro += rd*t;
    float sd = map(ro.xy);
    vec3 col = get_background(rd);

    if (sd < 0.0) {
        vec3 col1 = vec3(0.0);
        vec3 n = vec3(0, 0, 1);
        col1 += 0.6 * get_background(rd);
        col1 += 0.15 * get_background(reflect(rd, n));

        float y = pow(0.3656*abs(sin(0.5*iTime)+2.0*sin(iTime)),20.0);
        vec3 c = 0.8*vec3(0.8,0.4,0.6) + y * 0.2*vec3(0.8,0.6,0.2);
        col1 += c * exp(30.0 * sd / dot(rd, n));

        float t = clamp(-1.4*min(iResolution.x,iResolution.y)*sd, 0.0, 1.0);
        col = mix(col, col1, t);
    }

    gl_FragColor = vec4(col,1.0);
}
