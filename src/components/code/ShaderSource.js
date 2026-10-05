// Source: https://framerusercontent.com/modules/6tj2OZAcXlPErCTcSCDY/RekhsBiS0iszyZdEW86t/ShaderSource.js
export const shaderInputs = `
uniform float iTime;
uniform vec3 iResolution;
varying vec2 vUv;
uniform float iTimeDelta;
uniform vec4 iMouse;
uniform sampler2D iChannel0;
`
export const mainFunction = `
void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
}
`
export const vertexShaderSource = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`
export const fragmentShaderSource = [
  {
    title: "Warped Mandelbrot Set",
    author: "Stephane Cuillerdier - Aiekick/2024 (twitter:@aiekick)",
    originalURL: "https://www.shadertoy.com/view/MflBzj",
    value: `

#define AA 2
#define PETALS_COUNT 4.0
#define WARP_FACTOR 5.0
#define BUMP_FACTOR 0.03
#define FRACTAL_POWER 2

vec2 zmul(vec2 a, vec2 b){return mat2(a,-a.y,a.x)*b;} // z * z 
vec2 zinv(vec2 a){return vec2(a.x, -a.y) / dot(a,a);} // 1 / z
vec2 zpow(vec2 a, int p) {vec2 r=a;for(int i=1;i<p;++i) r=zmul(r, r);return r;} // z ^ p

vec3 sdf(vec2 p, float t) {
    // position
    if (FRACTAL_POWER < 3) p.y += 0.15; 
    else if (FRACTAL_POWER < 4) p.y -= 0.35;  
    else p.y -= 0.5;  
    
     // 90\xb0 rotation
    const float a = 1.57;
    p *= mat2(cos(a),-sin(a),sin(a),cos(a));
    
    // mandelbrot
    vec2 z = vec2(0);
    for (float i=0.;i<15.0;i++){
        z = zpow(z,FRACTAL_POWER) + p - vec2(0.5,0.);
        if (dot(z,z) > 4.0) {
            break;
        }
    }
    
    // sdf
    float d = dot(z,z);
    float sdf = 1.0 - sqrt(d) * log(d);
    
    // warped flower
    z = vec2(atan(z.x,z.y), length(z * 5.0));
    float warpFactor = 5.0;
    for (int i=0; i<3; i++) {
        z.y += cos(z.x * PETALS_COUNT - t) / 3.0;
        z.x += sin(z.y * WARP_FACTOR - t * 2.0) / 3.0;
    }
    z = vec2(cos(z.x), sin(z.x)) * z.y;
    z = abs(fract(z) - 0.5);
    return smoothstep(0.0, 1.0, sdf + 1.0) * vec3(length(z), z);
}

vec4 render(in vec2 v, in vec2 o) {
    // time
    float t = iTime * 0.5;
    
    // point
    vec2 uv = (v+v+o - iResolution.xy)/min(iResolution.x, iResolution.y) * 1.2;
    
    // ray dir
    vec3 rd = normalize(vec3(uv, 1.0));
    
    // light point
    vec3 lp = vec3(0.0, 0.0, -2.);
    
    // normal
    vec2 eps = vec2(7.5/iResolution.y, 0.0);
    vec3 f = sdf(uv, t);
    float fx = (sdf(uv-eps.xy, t).x-f.x)/eps.x;
    float fy = (sdf(uv-eps.yx, t).x-f.x)/eps.x;
    vec3 n = normalize(vec3(vec2(fx, fy) * BUMP_FACTOR, -1.0));
    
    // light attenuation
    vec3 ld = lp - vec3(uv, 0.0);
    float lDist = max(length(ld), 0.001);
    ld /= lDist;
    float atten = (f.x * 0.9 + 0.1)/(1.0 + lDist * lDist * 0.15);
    
    // diffuse
    float diff = max(dot(n, ld), 0.0);
    diff = pow(diff, 4.0) * 0.7 + pow(diff, 8.0) * 0.3;
    
    // specular
    float spec = pow(max(dot( reflect(-ld, n), -rd), 0.0), 32.0);
    
    // final color
    vec3 col = clamp(sin(vec3(8,12,10) + iTime) * 0.5 + 1.0, 0.0, 1.0);
    col = (col * (diff * pow(col, vec3(4.0)) * 2.0 + 0.5) + vec3(1.0) * spec * 2.0)*atten;
    
    // gamma corection
    col = clamp(sqrt(col), 0.0, 1.0);
    return vec4(col, 1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    fragColor = vec4(0);
    
    // anti aliasing
    const float AAf = float(AA);
    for(int i=0;i<AA;i++) {
        for(int j=0;j<AA;j++) {
            fragColor += render(gl_FragCoord.xy, vec2(i,j) / AAf);
        }
    }
    fragColor /= AAf * AAf;
     fragColor.a = 1.0;
}
`,
  },
  {
    title: "UI noise halo",
    author: "magician0809",
    originalURL: "https://www.shadertoy.com/view/3tBGRm",
    value: `
  
vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * vec3(.1031,.11369,.13787));
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3(p3.x+p3.y, p3.x+p3.z, p3.y+p3.z)*p3.zyx);
}

float snoise3(vec3 p)
{
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K1);
    vec3 d3 = d0 - 0.5;
    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
    return dot(vec4(31.316), n);
}

vec4 extractAlpha(vec3 colorIn)
{
    vec4 colorOut;
    float maxValue = min(max(max(colorIn.r, colorIn.g), colorIn.b), 1.0);
    if (maxValue > 1e-5)
    {
        colorOut.rgb = colorIn.rgb * (1.0 / maxValue);
        colorOut.a = maxValue;
    }
    else
    {
        colorOut = vec4(0.0);
    }
    return colorOut;
}

  #define BG_COLOR (vec3(sin(iTime)*0.5+0.5) * 0.0 + vec3(0.0))
  #define time iTime
  const vec3 color1 = vec3(0.611765, 0.262745, 0.996078);
  const vec3 color2 = vec3(0.298039, 0.760784, 0.913725);
  const vec3 color3 = vec3(0.062745, 0.078431, 0.600000);
  const float innerRadius = 0.6;
  const float noiseScale = 0.65;
  float light1(float intensity, float attenuation, float dist)
  {
      return intensity / (1.0 + dist * attenuation);
  }
  float light2(float intensity, float attenuation, float dist)
  {
      return intensity / (1.0 + dist * dist * attenuation);
  }

  void draw( out vec4 _FragColor, in vec2 vUv )
  {
      vec2 uv = vUv;
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float v0, v1, v2, v3, cl;
      float r0, d0, n0;
      float r, d;
      
      // ring
      n0 = snoise3( vec3(uv * noiseScale, time * 0.5) ) * 0.5 + 0.5;
      r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      d0 = distance(uv, r0 / len * uv);
      v0 = light1(1.0, 10.0, d0);
      v0 *= smoothstep(r0 * 1.05, r0, len);
      cl = cos(ang + time * 2.0) * 0.5 + 0.5;
      
      // high light
      float a = time * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      d = distance(uv, pos);
      v1 = light2(1.5, 5.0, d);
      v1 *= light1(1.0, 50.0 , d0);
      
      // back decay
      v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      
      // hole
      v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
      
      // color
      vec3 c = mix(color1, color2, cl);
      vec3 col = mix(color1, color2, cl);
      col = mix(color3, col, v0);
      col = (col + v1) * v2 * v3;
      col.rgb = clamp(col.rgb, 0.0, 1.0);
      
      //gl_FragColor = extractAlpha(col);
      _FragColor = extractAlpha(col);
  }

  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
      vec2 uv = (fragCoord*2.-iResolution.xy)/iResolution.y;
      vec4 col;
      draw(col, uv);
      vec3 bg = BG_COLOR;
      fragColor.rgb = mix(bg, col.rgb, col.a); //normal blend
          fragColor.a = 1.0;
  }

`,
  },
  {
    title: "Realm",
    author: "kishimisu",
    originalURL: "https://www.shadertoy.com/view/mtyGWy",
    value: `
  
vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);
    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;
        float d = length(uv) * exp(-length(uv0));
        vec3 col = palette(length(uv0) + i*.4 + iTime*.4);
        d = sin(d*8. + iTime)/8.;
        d = abs(d);
        d = pow(0.01 / d, 1.2);
        finalColor += col * d;
    }
    fragColor = vec4(finalColor, 1.0);
}
`,
  },
  {
    title: "Fractal Pyramid",
    author: "bradjamesgrant",
    originalURL: "https://www.shadertoy.com/view/tsXBzS",
    value: `

vec3 palette(float d){
	return mix(vec3(0.2,0.7,0.9),vec3(1.,0.,1.),d);
}

vec2 rotate(vec2 p,float a){
	float c = cos(a);
    float s = sin(a);
    return p*mat2(c,s,-s,c);
}

float map(vec3 p){
    for( int i = 0; i<8; ++i){
        float t = iTime*0.2;
        p.xz =rotate(p.xz,t);
        p.xy =rotate(p.xy,t*1.89);
        p.xz = abs(p.xz);
        p.xz-=.5;
	}
	return dot(sign(p),p)/5.;
}

vec4 rm (vec3 ro, vec3 rd){
    float t = 0.;
    vec3 col = vec3(0.);
    float d;
    for(float i =0.; i<64.; i++){
		vec3 p = ro + rd*t;
        d = map(p)*.5;
        if(d<0.02){
            break;
        }
        if(d>100.){
        	break;
        }
        //col+=vec3(0.6,0.8,0.8)/(400.*(d));
        col+=palette(length(p)*.1)/(400.*(d));
        t+=d;
    }
    return vec4(col,1./(d*100.));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-(iResolution.xy/2.))/iResolution.x;
	  vec3 ro = vec3(0.,0.,-50.);
    ro.xz = rotate(ro.xz,iTime);
    vec3 cf = normalize(-ro);
    vec3 cs = normalize(cross(cf,vec3(0.,1.,0.)));
    vec3 cu = normalize(cross(cf,cs));
    vec3 uuv = ro+cf*3. + uv.x*cs + uv.y*cu;
    vec3 rd = normalize(uuv-ro);
    vec4 col = rm(ro,rd);
    fragColor = col;
    fragColor.a = 1.0;
}

`,
  },
  {
    title: "Octagrams",
    author: "whisky_shusuky",
    originalURL: "https://www.shadertoy.com/view/tlVGDt",
    value: `

precision highp float;

float gTime = 0.;
const float REPEAT = 5.0;

mat2 rot(float a) {
	float c = cos(a), s = sin(a);
	return mat2(c,s,-s,c);
}

float sdBox( vec3 p, vec3 b )
{
	vec3 q = abs(p) - b;
	return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float box(vec3 pos, float scale) {
	pos *= scale;
	float base = sdBox(pos, vec3(.4,.4,.1)) /1.5;
	pos.xy *= 5.;
	pos.y -= 3.5;
	pos.xy *= rot(.75);
	float result = -base;
	return result;
}

float box_set(vec3 pos, float iTime) {
	vec3 pos_origin = pos;
	pos = pos_origin;
	pos .y += sin(gTime * 0.4) * 2.5;
	pos.xy *=   rot(.8);
	float box1 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
	pos = pos_origin;
	pos .y -=sin(gTime * 0.4) * 2.5;
	pos.xy *=   rot(.8);
	float box2 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
	pos = pos_origin;
	pos .x +=sin(gTime * 0.4) * 2.5;
	pos.xy *=   rot(.8);
	float box3 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);	
	pos = pos_origin;
	pos .x -=sin(gTime * 0.4) * 2.5;
	pos.xy *=   rot(.8);
	float box4 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);	
	pos = pos_origin;
	pos.xy *=   rot(.8);
	float box5 = box(pos,.5) * 6.;	
	pos = pos_origin;
	float box6 = box(pos,.5) * 6.;	
	float result = max(max(max(max(max(box1,box2),box3),box4),box5),box6);
	return result;
}

float map(vec3 pos, float iTime) {
	vec3 pos_origin = pos;
	float box_set1 = box_set(pos, iTime);
	return box_set1;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 p = (fragCoord.xy * 2. - iResolution.xy) / min(iResolution.x, iResolution.y);
	vec3 ro = vec3(0., -0.2 ,iTime * 4.);
	vec3 ray = normalize(vec3(p, 1.5));
	ray.xy = ray.xy * rot(sin(iTime * .03) * 5.);
	ray.yz = ray.yz * rot(sin(iTime * .05) * .2);
	float t = 0.1;
	vec3 col = vec3(0.);
	float ac = 0.0;
	for (int i = 0; i < 99; i++){
		vec3 pos = ro + ray * t;
		pos = mod(pos-2., 4.) -2.;
		gTime = iTime -float(i) * 0.01;
		float d = map(pos, iTime);
		d = max(abs(d), 0.01);
		ac += exp(-d*23.);
		t += d* 0.55;
	}
	col = vec3(ac * 0.02);
	col +=vec3(0.,0.2 * abs(sin(iTime)),0.5 + sin(iTime) * 0.2);
	fragColor = vec4(col ,1.0 - t * (0.02 + 0.02 * sin (iTime)));
}

`,
  },
  {
    title: "Let's self reflect",
    author: "mrange",
    originalURL: "https://www.shadertoy.com/view/XfyXRV",
    value: `

// Tinker with these parameters to create different solids
// -------------------------------------------------------
const float rotation_speed= 0.25;
const float poly_U        = 1.;   // [0, inf]
const float poly_V        = 0.5;  // [0, inf]
const float poly_W        = 1.0;  // [0, inf]
const int   poly_type     = 3;    // [2, 5]
const float poly_zoom     = 2.0;
const float inner_sphere  = 1.;
const float refr_index    = 0.9;
#define MAX_BOUNCES2        6
// -------------------------------------------------------
#define TIME        iTime
#define RESOLUTION  iResolution
#define PI          3.141592654
#define TAU         (2.0*PI)

// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
  return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
}

// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
//  Macro version of above to enable compile-time constants
#define HSV2RGB(c)  (c.z * mix(hsv2rgb_K.xxx, clamp(abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www) - hsv2rgb_K.xxx, 0.0, 1.0), c.y))

#define TOLERANCE2          0.0005
//#define MAX_RAY_LENGTH2   10.0
#define MAX_RAY_MARCHES2    50
#define NORM_OFF2           0.005
#define BACKSTEP2
#define TOLERANCE3          0.0005
#define MAX_RAY_LENGTH3     10.0
#define MAX_RAY_MARCHES3    90
#define NORM_OFF3           0.005
const vec3 rayOrigin    = vec3(0.0, 1., -5.);
const vec3 sunDir       = normalize(-rayOrigin);
const vec3 sunCol       = HSV2RGB(vec3(0.06 , 0.90, 1E-2))*1.;
const vec3 bottomBoxCol = HSV2RGB(vec3(0.66, 0.80, 0.5))*1.;
const vec3 topBoxCol    = HSV2RGB(vec3(0.60, 0.90, 1.))*1.;
const vec3 glowCol0     = HSV2RGB(vec3(0.05 , 0.7, 1E-3))*1.;
const vec3 glowCol1     = HSV2RGB(vec3(0.95, 0.7, 1E-3))*1.;
const vec3 beerCol      = -HSV2RGB(vec3(0.15+0.5, 0.7, 2.)); 
const float rrefr_index = 1./refr_index;

// License: Unknown, author: knighty, found: https://www.shadertoy.com/view/MsKGzw
const float poly_cospin   = cos(PI/float(poly_type));
const float poly_scospin  = sqrt(0.75-poly_cospin*poly_cospin);
const vec3  poly_nc       = vec3(-0.5, -poly_cospin, poly_scospin);
const vec3  poly_pab      = vec3(0., 0., 1.);
const vec3  poly_pbc_     = vec3(poly_scospin, 0., 0.5);
const vec3  poly_pca_     = vec3(0., poly_scospin, poly_cospin);
const vec3  poly_p        = normalize((poly_U*poly_pab+poly_V*poly_pbc_+poly_W*poly_pca_));
const vec3  poly_pbc      = normalize(poly_pbc_);
const vec3  poly_pca      = normalize(poly_pca_);
mat3 g_rot;
vec2 g_gd;

// License: MIT, author: Inigo Quilez, found: https://iquilezles.org/articles/noacos/
mat3 rot(vec3 d, vec3 z) {
  vec3  v = cross( z, d );
  float c = dot( z, d );
  float k = 1.0/(1.0+c);
  return mat3( v.x*v.x*k + c,     v.y*v.x*k - v.z,    v.z*v.x*k + v.y,
               v.x*v.y*k + v.z,   v.y*v.y*k + c,      v.z*v.y*k - v.x,
               v.x*v.z*k - v.y,   v.y*v.z*k + v.x,    v.z*v.z*k + c    );
}

// License: Unknown, author: Matt Taylor (https://github.com/64), found: https://64.github.io/tonemapping/
vec3 aces_approx(vec3 v) {
  v = max(v, 0.0);
  v *= 0.6;
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  return clamp((v*(a*v+b))/(v*(c*v+d)+e), 0.0, 1.0);
}

float sphere(vec3 p, float r) {
  return length(p) - r;
}

// License: MIT, author: Inigo Quilez, found: https://iquilezles.org/articles/distfunctions/
float box(vec2 p, vec2 b) {
  vec2 d = abs(p)-b;
  return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

// License: Unknown, author: knighty, found: https://www.shadertoy.com/view/MsKGzw
void poly_fold(inout vec3 pos) {
  vec3 p = pos;
  for(int i = 0; i < poly_type; ++i){
    p.xy  = abs(p.xy);
    p    -= 2.*min(0., dot(p,poly_nc)) * poly_nc;
  }
  pos = p;
}

float poly_plane(vec3 pos) {
  float d0 = dot(pos, poly_pab);
  float d1 = dot(pos, poly_pbc);
  float d2 = dot(pos, poly_pca);
  float d = d0;
  d = max(d, d1);
  d = max(d, d2);
  return d;
}

float poly_corner(vec3 pos) {
  float d = length(pos) - .0125;
  return d;
}

float dot2(vec3 p) {
  return dot(p, p);
}

float poly_edge(vec3 pos) {
  float dla = dot2(pos-min(0., pos.x)*vec3(1., 0., 0.));
  float dlb = dot2(pos-min(0., pos.y)*vec3(0., 1., 0.));
  float dlc = dot2(pos-min(0., dot(pos, poly_nc))*poly_nc);
  return sqrt(min(min(dla, dlb), dlc))-2E-3;
}

vec3 shape(vec3 pos) {
  pos *= g_rot;
  pos /= poly_zoom;
  poly_fold(pos);
  pos -= poly_p;
  return vec3(poly_plane(pos), poly_edge(pos), poly_corner(pos))*poly_zoom;
}

vec3 render0(vec3 ro, vec3 rd) {
  vec3 col = vec3(0.0);
  float srd  = sign(rd.y);
  float tp   = -(ro.y-6.)/abs(rd.y);
  if (srd < 0.) {
    col += bottomBoxCol*exp(-0.5*(length((ro + tp*rd).xz)));
  }
  if (srd > 0.0) {
    vec3 pos  = ro + tp*rd;
    vec2 pp = pos.xz;
    float db = box(pp, vec2(5.0, 9.0))-3.0;
    col += topBoxCol*rd.y*rd.y*smoothstep(0.25, 0.0, db);
    col += 0.2*topBoxCol*exp(-0.5*max(db, 0.0));
    col += 0.05*sqrt(topBoxCol)*max(-db, 0.0);
  }
  col += sunCol/(1.001-dot(sunDir, rd));
  return col; 
}

float df2(vec3 p) {
  vec3 ds = shape(p);
  float d2 = ds.y-5E-3;
  float d0 = min(-ds.x, d2);
  float d1 = sphere(p, inner_sphere);
  g_gd = min(g_gd, vec2(d2, d1));
  float d = (min(d0, d1));
  return d;
}

float rayMarch2(vec3 ro, vec3 rd, float tinit) {
  float t = tinit;
#if defined(BACKSTEP2)
  vec2 dti = vec2(1e10,0.0);
#endif
  int i;
  for (i = 0; i < MAX_RAY_MARCHES2; ++i) {
    float d = df2(ro + rd*t);
#if defined(BACKSTEP2)
    if (d<dti.x) { dti=vec2(d,t); }
#endif  
    // Bouncing in a closed shell, will never miss
    if (d < TOLERANCE2/* || t > MAX_RAY_LENGTH3 */) {
      break;
    }
    t += d;
  }
#if defined(BACKSTEP2)
  if(i==MAX_RAY_MARCHES2) { t=dti.y; };
#endif  
  return t;
}

vec3 normal2(vec3 pos) {
  vec2  eps = vec2(NORM_OFF2,0.0);
  vec3 nor;
  nor.x = df2(pos+eps.xyy) - df2(pos-eps.xyy);
  nor.y = df2(pos+eps.yxy) - df2(pos-eps.yxy);
  nor.z = df2(pos+eps.yyx) - df2(pos-eps.yyx);
  return normalize(nor);
}

vec3 render2(vec3 ro, vec3 rd, float db) {
  vec3 agg = vec3(0.0);
  float ragg = 1.;
  float tagg = 0.;
  for (int bounce = 0; bounce < MAX_BOUNCES2; ++bounce) {
    if (ragg < 0.1) break;
    g_gd      = vec2(1E3);
    float t2  = rayMarch2(ro, rd, min(db+0.05, 0.3));
    vec2 gd2  = g_gd;
    tagg      += t2;
    vec3 p2   = ro+rd*t2;
    vec3 n2   = normal2(p2);
    vec3 r2   = reflect(rd, n2);
    vec3 rr2  = refract(rd, n2, rrefr_index);
    float fre2= 1.+dot(n2,rd);
    vec3 beer = ragg*exp(0.2*beerCol*tagg);
    agg += glowCol1*beer*((1.+tagg*tagg*4E-2)*6./max(gd2.x, 5E-4+tagg*tagg*2E-4/ragg));
    vec3 ocol = 0.2*beer*render0(p2, rr2);
    if (gd2.y <= TOLERANCE2) {
      ragg *= 1.-0.9*fre2;
    } else {
      agg     += ocol;
      ragg    *= 0.8;
    }
    ro        = p2;
    rd        = r2;
    db        = gd2.x; 
  }
  return agg;
}

float df3(vec3 p) {
  vec3 ds = shape(p);
  g_gd = min(g_gd, ds.yz);
  const float sw = 0.02;
  float d1 = min(ds.y, ds.z)-sw;
  float d0 = ds.x;
  d0 = min(d0, ds.y);
  d0 = min(d0, ds.z);
  return d0;
}

float rayMarch3(vec3 ro, vec3 rd, float tinit, out int iter) {
  float t = tinit;
  int i;
  for (i = 0; i < MAX_RAY_MARCHES3; ++i) {
    float d = df3(ro + rd*t);
    if (d < TOLERANCE3 || t > MAX_RAY_LENGTH3) {
      break;
    }
    t += d;
  }
  iter = i;
  return t;
}

vec3 normal3(vec3 pos) {
  vec2  eps = vec2(NORM_OFF3,0.0);
  vec3 nor;
  nor.x = df3(pos+eps.xyy) - df3(pos-eps.xyy);
  nor.y = df3(pos+eps.yxy) - df3(pos-eps.yxy);
  nor.z = df3(pos+eps.yyx) - df3(pos-eps.yyx);
  return normalize(nor);
}

vec3 render3(vec3 ro, vec3 rd) {
  int iter;
  vec3 skyCol = render0(ro, rd);
  vec3 col  = skyCol;
  g_gd      = vec2(1E3);
  float t1  = rayMarch3(ro, rd, 0.1, iter);
  vec2 gd1  = g_gd;
  vec3 p1   = ro+t1*rd;
  vec3 n1   = normal3(p1);
  vec3 r1   = reflect(rd, n1);
  vec3 rr1  = refract(rd, n1, refr_index);
  float fre1= 1.+dot(rd, n1);
  fre1 *= fre1;
  float ifo = mix(0.5, 1., smoothstep(1.0, 0.9, float(iter)/float(MAX_RAY_MARCHES3)));
  if (t1 < MAX_RAY_LENGTH3) {
    col = render0(p1, r1)*(0.5+0.5*fre1)*ifo;
    vec3 icol = render2(p1, rr1, gd1.x); 
    if (gd1.x > TOLERANCE3 && gd1.y > TOLERANCE3 && rr1 != vec3(0.)) {
      col += icol*(1.-0.75*fre1)*ifo;
    }
  }
  col += (glowCol0+1.*fre1*(glowCol0))/max(gd1.x, 3E-4);
  return col;
}

vec3 effect(vec2 p, vec2 pp) {
  const float fov = 2.0;
  const vec3 up = vec3(0., 1., 0.);
  const vec3 la   = vec3(0.0);
  const vec3 ww = normalize(normalize(la-rayOrigin));
  const vec3 uu = normalize(cross(up, ww));
  const vec3 vv = cross(ww, uu);
  vec3 rd = normalize(-p.x*uu + p.y*vv + fov*ww);
  vec3 col = vec3(0.0);
  col = render3(rayOrigin, rd);
  col -= 2E-2*vec3(2.,3.,1.)*(length(p)+0.25);
  col = aces_approx(col);
  col = sqrt(col);
  return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 q = fragCoord/RESOLUTION.xy;
  vec2 p = -1. + 2. * q;
  vec2 pp = p;
  p.x *= RESOLUTION.x/RESOLUTION.y;
  float a = TIME*rotation_speed;
  vec3 r0 = vec3(1.0, sin(vec2(sqrt(0.5), 1.0)*a));
  vec3 r1 = vec3(cos(vec2(sqrt(0.5), 1.0)*0.913*a), 1.0);
  mat3 rot = rot(normalize(r0), normalize(r1));
  g_rot = rot;
  vec3 col = effect(p, pp);
  fragColor = vec4(col, 1.0);
}

`,
  },
  {
    title: "Seascape",
    author: "Alexander Alekseev aka TDM - 2014",
    originalURL: "https://www.shadertoy.com/view/Ms2SD1",
    value: `

const int NUM_STEPS = 8;
const float PI	 	= 3.141592;
const float EPSILON	= 1e-3;
#define EPSILON_NRM (0.1 / iResolution.x)

// sea
const int ITER_GEOMETRY = 3;
const int ITER_FRAGMENT = 5;
const float SEA_HEIGHT = 0.6;
const float SEA_CHOPPY = 4.0;
const float SEA_SPEED = 0.8;
const float SEA_FREQ = 0.16;
const vec3 SEA_BASE = vec3(0.0,0.09,0.18);
const vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6)*0.6;
#define SEA_TIME (1.0 + iTime * SEA_SPEED)
const mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);

// math
mat3 fromEuler(vec3 ang) {
	vec2 a1 = vec2(sin(ang.x),cos(ang.x));
    vec2 a2 = vec2(sin(ang.y),cos(ang.y));
    vec2 a3 = vec2(sin(ang.z),cos(ang.z));
    mat3 m;
    m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
	m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
	m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
	return m;
}
float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}
float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

// lighting
float diffuse(vec3 n,vec3 l,float p) {
    return pow(dot(n,l) * 0.4 + 0.6,p);
}
float specular(vec3 n,vec3 l,vec3 e,float s) {    
    float nrm = (s + 8.0) / (PI * 8.0);
    return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
}

// sky
vec3 getSkyColor(vec3 e) {
    e.y = (max(e.y,0.0)*0.8+0.2)*0.8;
    return vec3(pow(1.0-e.y,2.0), 1.0-e.y, 0.6+(1.0-e.y)*0.4) * 1.1;
}

// sea
float sea_octave(vec2 uv, float choppy) {
    uv += noise(uv);        
    vec2 wv = 1.0-abs(sin(uv));
    vec2 swv = abs(cos(uv));    
    wv = mix(wv,swv,wv);
    return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
}

float map(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    
    float d, h = 0.0;    
    for(int i = 0; i < ITER_GEOMETRY; i++) {        
    	d = sea_octave((uv+SEA_TIME)*freq,choppy);
    	d += sea_octave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= octave_m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}

float map_detailed(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    float d, h = 0.0;    
    for(int i = 0; i < ITER_FRAGMENT; i++) {        
    	d = sea_octave((uv+SEA_TIME)*freq,choppy);
    	d += sea_octave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= octave_m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}

vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {  
    float fresnel = clamp(1.0 - dot(n,-eye), 0.0, 1.0);
    fresnel = min(pow(fresnel,3.0), 0.5);
    vec3 reflected = getSkyColor(reflect(eye,n));    
    vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.12; 
    vec3 color = mix(refracted,reflected,fresnel);
    float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
    color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
    color += vec3(specular(n,l,eye,60.0));
    return color;
}

// tracing
vec3 getNormal(vec3 p, float eps) {
    vec3 n;
    n.y = map_detailed(p);    
    n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
    n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
    n.y = eps;
    return normalize(n);
}

float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {  
    float tm = 0.0;
    float tx = 1000.0;    
    float hx = map(ori + dir * tx);
    if(hx > 0.0) {
        p = ori + dir * tx;
        return tx;   
    }
    float hm = map(ori + dir * tm);    
    float tmid = 0.0;
    for(int i = 0; i < NUM_STEPS; i++) {
        tmid = mix(tm,tx, hm/(hm-hx));                   
        p = ori + dir * tmid;                   
    	float hmid = map(p);
		if(hmid < 0.0) {
        	tx = tmid;
            hx = hmid;
        } else {
            tm = tmid;
            hm = hmid;
        }
    }
    return tmid;
}

vec3 getPixel(in vec2 coord, float time) {    
    vec2 uv = coord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;    
        
    // ray
    vec3 ang = vec3(sin(time*3.0)*0.1,sin(time)*0.2+0.3,time);    
    vec3 ori = vec3(0.0,3.5,time*5.0);
    vec3 dir = normalize(vec3(uv.xy,-2.0)); dir.z += length(uv) * 0.14;
    dir = normalize(dir) * fromEuler(ang);
    
    // tracing
    vec3 p;
    heightMapTracing(ori,dir,p);
    vec3 dist = p - ori;
    vec3 n = getNormal(p, dot(dist,dist) * EPSILON_NRM);
    vec3 light = normalize(vec3(0.0,1.0,0.8)); 
             
    // color
    return mix(
        getSkyColor(dir),
        getSeaColor(p,n,light,dir,dist),
    	pow(smoothstep(0.0,-0.02,dir.y),0.2));
}

// main
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float time = iTime * 0.3 + iMouse.x*0.01;
	
#ifdef AA
    vec3 color = vec3(0.0);
    for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
        	vec2 uv = fragCoord+vec2(i,j)/3.0;
    		color += getPixel(uv, time);
        }
    }
    color /= 9.0;
#else
    vec3 color = getPixel(fragCoord, time);
#endif
    
    // post
	fragColor = vec4(pow(color,vec3(0.65)), 1.0);
}
`,
  },
  {
    title: "Protean clouds",
    author: "nimitz (twitter: @stormoid)",
    originalURL: "https://www.shadertoy.com/view/3l23Rh",
    value: `
 

mat2 rot(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
const mat3 m3 = mat3(0.33338, 0.56034, -0.71817, -0.87887, 0.32651, -0.15323, 0.15162, 0.69596, 0.61339)*1.93;
float mag2(vec2 p){return dot(p,p);}
float linstep(in float mn, in float mx, in float x){ return clamp((x - mn)/(mx - mn), 0., 1.); }
float prm1 = 0.;
vec2 bsMo = vec2(0);
vec2 disp(float t){ return vec2(sin(t*0.22)*1., cos(t*0.175)*1.)*2.; }
vec2 map(vec3 p)
{
    vec3 p2 = p;
    p2.xy -= disp(p.z).xy;
    p.xy *= rot(sin(p.z+iTime)*(0.1 + prm1*0.05) + iTime*0.09);
    float cl = mag2(p2.xy);
    float d = 0.;
    p *= .61;
    float z = 1.;
    float trk = 1.;
    float dspAmp = 0.1 + prm1*0.2;
    for(int i = 0; i < 5; i++)
    {
		p += sin(p.zxy*0.75*trk + iTime*trk*.8)*dspAmp;
        d -= abs(dot(cos(p), sin(p.yzx))*z);
        z *= 0.57;
        trk *= 1.4;
        p = p*m3;
    }
    d = abs(d + prm1*3.)+ prm1*.3 - 2.5 + bsMo.y;
    return vec2(d + cl*.2 + 0.25, cl);
}

vec4 render( in vec3 ro, in vec3 rd, float time )
{
	vec4 rez = vec4(0);
  const float ldst = 8.;
	vec3 lpos = vec3(disp(time + ldst)*0.5, time + ldst);
	float t = 1.5;
	float fogT = 0.;
	for(int i=0; i<130; i++)
	{
		if(rez.a > 0.99)break;
		vec3 pos = ro + t*rd;
    vec2 mpv = map(pos);
		float den = clamp(mpv.x-0.3,0.,1.)*1.12;
		float dn = clamp((mpv.x + 2.),0.,3.);
		vec4 col = vec4(0);
    if (mpv.x > 0.6)
    {
    
        col = vec4(sin(vec3(5.,0.4,0.2) + mpv.y*0.1 +sin(pos.z*0.4)*0.5 + 1.8)*0.5 + 0.5,0.08);
        col *= den*den*den;
        col.rgb *= linstep(4.,-2.5, mpv.x)*2.3;
        float dif =  clamp((den - map(pos+.8).x)/9., 0.001, 1. );
        dif += clamp((den - map(pos+.35).x)/2.5, 0.001, 1. );
        col.xyz *= den*(vec3(0.005,.045,.075) + 1.5*vec3(0.033,0.07,0.03)*dif);
    }
		
		float fogC = exp(t*0.2 - 2.2);
		col.rgba += vec4(0.06,0.11,0.11, 0.1)*clamp(fogC-fogT, 0., 1.);
		fogT = fogC;
		rez = rez + col*(1. - rez.a);
		t += clamp(0.5 - dn*dn*.05, 0.09, 0.3);
	}
	return clamp(rez, 0.0, 1.0);
}

float getsat(vec3 c)
{
    float mi = min(min(c.x, c.y), c.z);
    float ma = max(max(c.x, c.y), c.z);
    return (ma - mi)/(ma+ 1e-7);
}

//from my "Will it blend" shader (https://www.shadertoy.com/view/lsdGzN)
vec3 iLerp(in vec3 a, in vec3 b, in float x)
{
    vec3 ic = mix(a, b, x) + vec3(1e-6,0.,0.);
    float sd = abs(getsat(ic) - mix(getsat(a), getsat(b), x));
    vec3 dir = normalize(vec3(2.*ic.x - ic.y - ic.z, 2.*ic.y - ic.x - ic.z, 2.*ic.z - ic.y - ic.x));
    float lgt = dot(vec3(1.0), ic);
    float ff = dot(dir, normalize(ic));
    ic += 1.5*dir*sd*ff*lgt;
    return clamp(ic,0.,1.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{	
	vec2 q = fragCoord.xy/iResolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
    bsMo = (iMouse.xy - 0.5*iResolution.xy)/iResolution.y;
    float time = iTime*3.;
    vec3 ro = vec3(0,0,time);
    ro += vec3(sin(iTime)*0.5,sin(iTime*1.)*0.,0);
    float dspAmp = .85;
    ro.xy += disp(ro.z)*dspAmp;
    float tgtDst = 3.5;
    vec3 target = normalize(ro - vec3(disp(time + tgtDst)*dspAmp, time + tgtDst));
    ro.x -= bsMo.x*2.;
    vec3 rightdir = normalize(cross(target, vec3(0,1,0)));
    vec3 updir = normalize(cross(rightdir, target));
    rightdir = normalize(cross(updir, target));
	  vec3 rd=normalize((p.x*rightdir + p.y*updir)*1. - target);
    rd.xy *= rot(-disp(time + 3.5).x*0.2 + bsMo.x);
    prm1 = smoothstep(-0.4, 0.4,sin(iTime*0.3));
	  vec4 scn = render(ro, rd, time);
    vec3 col = scn.rgb;
    col = iLerp(col.bgr, col.rgb, clamp(1.-prm1,0.05,1.));
    col = pow(col, vec3(.55,0.65,0.6))*vec3(1.,.97,.9);
    col *= pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.12)*0.7+0.3; //Vign
	  fragColor = vec4( col, 1.0 );
}

`,
  },
  {
    title: "Silk Fabric",
    author: "Giorgi Azmaipharashvili",
    originalURL: "https://www.shadertoy.com/view/X3yXRd",
    value: `
 
  #define INVERT 1

  float noise(vec2 p) {
      return smoothstep(-0.5, 0.9, sin((p.x - p.y) * 555.0) * sin(p.y * 1444.0)) - 0.4;
  }

  float fabric(vec2 p) {
      const mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
      float f = 0.4 * noise(p);
      f += 0.3 * noise(p = m * p);
      f += 0.2 * noise(p = m * p);
      return f + 0.1 * noise(m * p);
  }

  float silk(vec2 uv, float t) {
      float s = sin(5.0 * (uv.x + uv.y + cos(2.0 * uv.x + 5.0 * uv.y)) + sin(12.0 * (uv.x + uv.y)) - t);
      s = 0.7 + 0.3 * (s * s * 0.5 + s);
      s *= 0.9 + 0.6 * fabric(uv * min(iResolution.x, iResolution.y) * 0.0006);
      return s * 0.9 + 0.1;
  }

  float silkd(vec2 uv, float t) {
      float xy = uv.x + uv.y;
      float d = (5.0 * (1.0 - 2.0 * sin(2.0 * uv.x + 5.0 * uv.y)) + 12.0 * cos(12.0 * xy)) * cos(5.0 * (cos(2.0 * uv.x + 5.0 * uv.y) + xy) + sin(12.0 * xy) - t);
      return 0.005 * d * (sign(d) + 3.0);
  }

  void mainImage(out vec4 fragColor, vec2 fragCoord) {
      float mr = min(iResolution.x, iResolution.y);
      vec2 uv = fragCoord / mr;
      
      float t = iTime;
      uv.y += 0.03 * sin(8.0 * uv.x - t);
      
      if (iMouse.z > 1.0)
          uv += smoothstep(0.5, 0.0, distance(iMouse.xy / mr, uv)) * 0.08;
      // uv -= normalize(iMouse.xy / iResolution.xy * 2.0 - 1.0) * t * 0.05; // Wind, requires state
      
      float s = sqrt(silk(uv, t));
      float d = silkd(uv, t);
      vec3 c = vec3(s);
      c += 0.7 * vec3(1, 0.83, 0.6) * d;
      c *= 1.0 - max(0.0, 0.8 * d);
  #if INVERT
      c = pow(c, 0.3 / vec3(0.52, 0.5, 0.4));
      c = 1.0 - c;
  #else
      c = pow(c, vec3(0.52, 0.5, 0.4));
  #endif
      fragColor = vec4(c, 1);
  }

`,
  },
  {
    title: "CineShader Lava",
    author: "edankwan",
    originalURL: "https://www.shadertoy.com/view/3sySRK",
    value: `

float opSmoothUnion( float d1, float d2, float k )
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
} 

float map(vec3 p)
{
	float d = 2.0;
	for (int i = 0; i < 16; i++) {
		float fi = float(i);
		float time = iTime * (fract(fi * 412.531 + 0.513) - 0.5) * 2.0;
		d = opSmoothUnion(
            sdSphere(p + sin(time + fi * vec3(52.5126, 64.62744, 632.25)) * vec3(2.0, 2.0, 0.8), mix(0.5, 1.0, fract(fi * 412.531 + 0.5124))),
			d,
			0.4
		);
	}
	return d;
}

vec3 calcNormal( in vec3 p )
{
    const float h = 1e-5; // or some other value
    const vec2 k = vec2(1,-1);
    return normalize( k.xyy*map( p + k.xyy*h ) + 
                      k.yyx*map( p + k.yyx*h ) + 
                      k.yxy*map( p + k.yxy*h ) + 
                      k.xxx*map( p + k.xxx*h ) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv = fragCoord/iResolution.xy;
    
  // screen size is 6m x 6m
	vec3 rayOri = vec3((uv - 0.5) * vec2(iResolution.x/iResolution.y, 1.0) * 6.0, 3.0);
	vec3 rayDir = vec3(0.0, 0.0, -1.0);
	float depth = 0.0;
	vec3 p;
	for(int i = 0; i < 64; i++) {
		p = rayOri + rayDir * depth;
		float dist = map(p);
        depth += dist;
		if (dist < 1e-6) {
			break;
		}
	}
  depth = min(6.0, depth);
	vec3 n = calcNormal(p);
  float b = max(0.0, dot(n, vec3(0.577)));
  vec3 col = (0.5 + 0.5 * cos((b + iTime * 3.0) + uv.xyx * 2.0 + vec3(0,2,4))) * (0.85 + b * 0.35);
  col *= exp( -depth * 0.15 );
	
  // maximum thickness is 2m in alpha channel
  fragColor = vec4(col, 1.0 - (depth - 0.5) / 2.0);
  fragColor.a = 1.0;
}

`,
  },
  {
    title: "TV Noise",
    author: "arthurstammet",
    originalURL: "https://www.shadertoy.com/view/tdXXRM",
    value: `

float Noise21 (vec2 p, float ta, float tb) {
    return fract(sin(p.x*ta+p.y*tb)*5678.);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord/iResolution.xy;
    float t = iTime+123.; // tweak the start moment
    float ta = t*.654321;
    float tb = t*(ta*.123456);
    float c = Noise21(uv, ta, tb);
    vec3 col = vec3(c);
    fragColor = vec4(col,1.);
}

`,
  },
  {
    title: "MONSTER",
    author: "butadiene",
    originalURL: "https://www.shadertoy.com/view/WtKSzt",
    value: `
  float TK = 1.;
  float PI = 3.1415926535;

vec2 rot(vec2 p,float r){
	mat2 m = mat2(cos(r),sin(r),-sin(r),cos(r));
	return m*p;
}

vec2 pmod(vec2 p,float n){
	float np = 2.0*PI/n;
	float r = atan(p.x,p.y)-0.5*np;
	r = mod(r,np)-0.5*np;
	return length(p)*vec2(cos(r),sin(r));
}

float cube(vec3 p,vec3 s){
	vec3 q = abs(p);
	vec3 m = max(s-q,0.0);
	return length(max(q-s,0.0))-min(min(m.x,m.y),m.z);
}

float dist(vec3 p){
	p.z -= 1.*TK*iTime;
	p.xy = rot(p.xy,1.0*p.z);
	p.xy = pmod(p.xy,6.0);
	float k = 0.7;
	float zid = floor(p.z*k);
	p = mod(p,k)-0.5*k;
	for(int i = 0;i<4;i++){
		p = abs(p)-0.3;
		p.xy = rot(p.xy,1.0+zid+0.1*TK*iTime);
		p.xz = rot(p.xz,1.0+4.7*zid+0.3*TK*iTime);
	}
	return min(cube(p,vec3(0.3)),length(p)-0.4);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv = fragCoord/iResolution.xy;
	uv = 2.0*(uv-0.5);
	uv.y *= iResolution.y/iResolution.x;
	uv = rot(uv,TK*iTime);
	vec3 ro = vec3(0.0,0.0,0.1);
	vec3 rd = normalize(vec3(uv,0.0)-ro);
	float t  =2.0;
	float d = 0.0;
	float ac = 0.0;
	for(int i = 0;i<66;i++){
  d = dist(ro+rd*t)*0.2;
  d = max(0.0000,abs(d));
  t += d;
  if(d<0.001)ac += 0.1;//exp(-15.0*d);
	}
	vec3 col = vec3(0.0);
	col = vec3(0.1,0.7,0.7)*0.2*vec3(ac);//vec3(exp(-1.0*t));
	vec3 pn = ro+rd*t;
	float kn = 0.5;
	pn.z += -1.5*iTime*TK;
	pn.z = mod(pn.z,kn)-0.5*kn;
	float em = clamp(0.01/pn.z,0.0,100.0);
	col += 3.0*em*vec3(0.1,1.0,0.1);
	col = clamp(col,0.0,1.0);

  // Output to screen
  fragColor = vec4(col,0.1);
  fragColor.a = 1.0;
}

`,
  },
  {
    title: "2D Clouds",
    author: "drift",
    originalURL: "https://www.shadertoy.com/view/4tdSWr",
    value: `
const float cloudscale = 1.1;
const float speed = 0.03;
const float clouddark = 0.5;
const float cloudlight = 0.3;
const float cloudcover = 0.2;
const float cloudalpha = 8.0;
const float skytint = 0.5;
const vec3 skycolour1 = vec3(0.2, 0.4, 0.6);
const vec3 skycolour2 = vec3(0.4, 0.7, 1.0);

const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );

vec2 hash( vec2 p ) {
	p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p ) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
	vec2 i = floor(p + (p.x+p.y)*K1);	
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
    vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot(n, vec3(70.0));	
}

float fbm(vec2 n) {
	float total = 0.0, amplitude = 0.1;
	for (int i = 0; i < 7; i++) {
		total += noise(n) * amplitude;
		n = m * n;
		amplitude *= 0.4;
	}
	return total;
}

// -----------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 p = fragCoord.xy / iResolution.xy;
	  vec2 uv = p*vec2(iResolution.x/iResolution.y,1.0);    
    float time = iTime * speed;
    float q = fbm(uv * cloudscale * 0.5);
    
    //ridged noise shape
	  float r = 0.0;
	  uv *= cloudscale;
    uv -= q - time;
    float weight = 0.8;
    for (int i=0; i<8; i++){
		r += abs(weight*noise( uv ));
    uv = m*uv + time;
		weight *= 0.7;
    }
    
    //noise shape
	  float f = 0.0;
    uv = p*vec2(iResolution.x/iResolution.y,1.0);
	  uv *= cloudscale;
    uv -= q - time;
    weight = 0.7;
    for (int i=0; i<8; i++){
		f += weight*noise( uv );
        uv = m*uv + time;
		weight *= 0.6;
    }
    
    f *= r + f;
    
    //noise colour
    float c = 0.0;
    time = iTime * speed * 2.0;
    uv = p*vec2(iResolution.x/iResolution.y,1.0);
	  uv *= cloudscale*2.0;
    uv -= q - time;
    weight = 0.4;
    for (int i=0; i<7; i++){
		c += weight*noise( uv );
    uv = m*uv + time;
		weight *= 0.6;
    }
    
    //noise ridge colour
    float c1 = 0.0;
    time = iTime * speed * 3.0;
    uv = p*vec2(iResolution.x/iResolution.y,1.0);
	  uv *= cloudscale*3.0;
    uv -= q - time;
    weight = 0.4;
    for (int i=0; i<7; i++){
		c1 += abs(weight*noise( uv ));
    uv = m*uv + time;
		weight *= 0.6;
    }
    c += c1;
    vec3 skycolour = mix(skycolour2, skycolour1, p.y);
    vec3 cloudcolour = vec3(1.1, 1.1, 0.9) * clamp((clouddark + cloudlight*c), 0.0, 1.0);
    f = cloudcover + cloudalpha*f*r;
    vec3 result = mix(skycolour, clamp(skytint * skycolour + cloudcolour, 0.0, 1.0), clamp(f + c, 0.0, 1.0));
	  fragColor = vec4( result, 1.0 );
}

`,
  },
  {
    title: "Tileable Water Caustic",
    author: "Dave_Hoskins",
    originalURL: "https://www.shadertoy.com/view/MdlXz8",
    value: `

#define TAU 6.28318530718
#define MAX_ITER 5

void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
	float time = iTime * .5+23.0;
  // uv should be the 0-1 uv of texture...
	vec2 uv = fragCoord.xy / iResolution.xy;

#ifdef SHOW_TILING
	vec2 p = mod(uv*TAU*2.0, TAU)-250.0;
#else
    vec2 p = mod(uv*TAU, TAU)-250.0;
#endif
	vec2 i = vec2(p);
	float c = 1.0;
	float inten = .005;
	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = time * (1.0 - (3.5 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.17-pow(c, 1.4);
	vec3 colour = vec3(pow(abs(c), 8.0));
  colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);

	#ifdef SHOW_TILING
	// Flash tile borders...
	vec2 pixel = 2.0 / iResolution.xy;
	uv *= 2.0;
	float f = floor(mod(iTime*.5, 2.0)); 	// Flash value.
	vec2 first = step(pixel, uv) * f;		   	// Rule out first screen pixels and flash.
	uv  = step(fract(uv), pixel);				// Add one line of pixels per tile.
	colour = mix(colour, vec3(1.0, 1.0, 0.0), (uv.x + uv.y) * first.x * first.y); // Yellow line
	#endif

	fragColor = vec4(colour, 1.0);
}

`,
  },
  {
    title: "Auroras",
    author: "nimitz",
    originalURL: "https://www.shadertoy.com/view/XtGGRt",
    value: ` 

#define time iTime
mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);
float tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);}
vec2 tri2(in vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));}
float triNoise2d(in vec2 p, float spd)
{
    float z=1.8;
    float z2=2.5;
	  float rz = 0.;
    p *= mm2(p.x*0.06);
    vec2 bp = p;
    for (float i=0.; i<5.; i++ )
    {
          vec2 dg = tri2(bp*1.85)*.75;
          dg *= mm2(time*spd);
          p -= dg/z2;
          bp *= 1.3;
          z2 *= .45;
          z *= .42;
          p *= 1.21 + (rz-1.0)*.02;
          rz += tri(p.x+tri(p.y))*z;
          p*= -m2;
    }
    return clamp(1./pow(rz*29., 1.3),0.,.55);
}

float hash21(in vec2 n){ return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
vec4 aurora(vec3 ro, vec3 rd)
{
    vec4 col = vec4(0);
    vec4 avgCol = vec4(0);
    for(float i=0.;i<50.;i++)
    {
        float of = 0.006*hash21(gl_FragCoord.xy)*smoothstep(0.,15., i);
        float pt = ((.8+pow(i,1.4)*.002)-ro.y)/(rd.y*2.+0.4);
        pt -= of;
    	  vec3 bpos = ro + pt*rd;
        vec2 p = bpos.zx;
        float rzt = triNoise2d(p, 0.06);
        vec4 col2 = vec4(0,0,0, rzt);
        col2.rgb = (sin(1.-vec3(2.15,-.5, 1.2)+i*0.043)*0.5+0.5)*rzt;
        avgCol =  mix(avgCol, col2, .5);
        col += avgCol*exp2(-i*0.065 - 2.5)*smoothstep(0.,5., i);
        
    }
    
    col *= (clamp(rd.y*15.+.4,0.,1.));
    
    //return clamp(pow(col,vec4(1.3))*1.5,0.,1.);
    //return clamp(pow(col,vec4(1.7))*2.,0.,1.);
    //return clamp(pow(col,vec4(1.5))*2.5,0.,1.);
    //return clamp(pow(col,vec4(1.8))*1.5,0.,1.);
    //return smoothstep(0.,1.1,pow(col,vec4(1.))*1.5);
    return col*1.8;
    //return pow(col,vec4(1.))*2.
}

//-------------------Background and Stars--------------------
vec3 nmzHash33(vec3 q)
{
    uvec3 p = uvec3(ivec3(q));
    p = p*uvec3(374761393U, 1103515245U, 668265263U) + p.zxy + p.yzx;
    p = p.yzx*(p.zxy^(p >> 3U));
    return vec3(p^(p >> 16U))*(1.0/vec3(0xffffffffU));
}

vec3 stars(in vec3 p)
{
    vec3 c = vec3(0.);
    float res = iResolution.x*1.;
    
	for (float i=0.;i<4.;i++)
    {
        vec3 q = fract(p*(.15*res))-0.5;
        vec3 id = floor(p*(.15*res));
        vec2 rn = nmzHash33(id).xy;
        float c2 = 1.-smoothstep(0.,.6,length(q));
        c2 *= step(rn.x,.0005+i*i*0.001);
        c += c2*(mix(vec3(1.0,0.49,0.1),vec3(0.75,0.9,1.),rn.y)*0.1+0.9);
        p *= 1.3;
    }
    return c*c*.8;
}

vec3 bg(in vec3 rd)
{
    float sd = dot(normalize(vec3(-0.5, -0.6, 0.9)), rd)*0.5+0.5;
    sd = pow(sd, 5.);
    vec3 col = mix(vec3(0.05,0.1,0.2), vec3(0.1,0.05,0.2), sd);
    return col*.63;
}

//-----------------------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	  vec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = q - 0.5;
	  p.x*=iResolution.x/iResolution.y;
    vec3 ro = vec3(0,0,-6.7);
    vec3 rd = normalize(vec3(p,1.3));
    vec2 mo = iMouse.xy / iResolution.xy-.5;
    mo = (mo==vec2(-.5))?mo=vec2(-0.1,0.1):mo;
	  mo.x *= iResolution.x/iResolution.y;
    rd.yz *= mm2(mo.y);
    rd.xz *= mm2(mo.x + sin(time*0.05)*0.2);
    vec3 col = vec3(0.);
    vec3 brd = rd;
    float fade = smoothstep(0.,0.01,abs(brd.y))*0.1+0.9;
    col = bg(rd)*fade;
    if (rd.y > 0.){
        vec4 aur = smoothstep(0.,1.5,aurora(ro,rd))*fade;
        col += stars(rd);
        col = col*(1.-aur.a) + aur.rgb;
    }
    else //Reflections
    {
        rd.y = abs(rd.y);
        col = bg(rd)*fade*0.6;
        vec4 aur = smoothstep(0.0,2.5,aurora(ro,rd));
        col += stars(rd)*0.1;
        col = col*(1.-aur.a) + aur.rgb;
        vec3 pos = ro + ((0.5-ro.y)/rd.y)*rd;
        float nz2 = triNoise2d(pos.xz*vec2(.5,.7), 0.);
        col += mix(vec3(0.2,0.25,0.5)*0.08,vec3(0.3,0.3,0.5)*0.7, nz2*0.4);
    }
	fragColor = vec4(col, 1.);
}

`,
  },
  {
    title: "Cellular",
    author: "vug",
    originalURL: "https://www.shadertoy.com/view/Xs2GDd",
    value: `

#define PI 3.14159265359
vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
vec3 col3 = vec3(0.867, 0.910, 0.247); // red

float disk(vec2 r, vec2 center, float radius) {
	return 1.0 - smoothstep( radius-0.008, radius+0.008, length(r-center));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float t = iTime*2.;
	vec2 r = (2.0*fragCoord.xy - iResolution.xy) / iResolution.y;
	r *= 1.0 + 0.05*sin(r.x*5.+iTime) + 0.05*sin(r.y*3.+iTime);
	r *= 1.0 + 0.2*length(r);
	float side = 0.5;
	vec2 r2 = mod(r, side);
	vec2 r3 = r2-side/2.;
	float i = floor(r.x/side)+2.;
	float j = floor(r.y/side)+4.;
	float ii = r.x/side+2.;
	float jj = r.y/side+4.;	
	vec3 pix = vec3(1.0);
	float rad, disks;
	rad = 0.15 + 0.05*sin(t+ii*jj);
	disks = disk(r3, vec2(0.,0.), rad);
	pix = mix(pix, col2, disks);
	float speed = 2.0;
	float tt = iTime*speed+0.1*i+0.08*j;
	float stopEveryAngle = PI/2.0;
	float stopRatio = 0.7;
	float t1 = (floor(tt) + smoothstep(0.0, 1.0-stopRatio, fract(tt)) )*stopEveryAngle;
	float x = -0.07*cos(t1+i);
	float y = 0.055*(sin(t1+j)+cos(t1+i));
	rad = 0.1 + 0.05*sin(t+i+j);
	disks = disk(r3, vec2(x,y), rad);
	pix = mix(pix, col1, disks);
	rad = 0.2 + 0.05*sin(t*(1.0+0.01*i));
	disks = disk(r3, vec2(0.,0.), rad);
	pix += 0.2*col3*disks * sin(t+i*j+i);
	pix -= smoothstep(0.3, 5.5, length(r));	
	fragColor = vec4(pix,1.0);
}

`,
  },
  {
    title: "DrawCircle",
    author: "haquxx",
    originalURL: "https://www.shadertoy.com/view/3tdSRn",
    value: `

vec3 drawCircle(vec2 pos, float radius, float width, float power, vec4 color)
{
    vec2 mousePos = iMouse.xy - vec2(0.5);
    float dist1 = length(pos);
    dist1 = fract((dist1 * 5.0) - fract(iTime));
    float dist2 = dist1 - radius;
    float intensity = pow(radius / abs(dist2), width); 
    vec3 col = color.rgb * intensity * power * max((0.8- abs(dist2)), 0.0);
    return col;
}

vec3 hsv2rgb(float h, float s, float v)
{
    vec4 t = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // // -1.0 ~ 1.0
    vec2 pos = (fragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
    float h = mix(0.5, 0.65, length(pos));
    vec4 color = vec4(hsv2rgb(h, 1.0, 1.0), 1.0);
    float radius = 0.5;
    float width = 0.8;
    float power = 0.1;
    vec3 finalColor = drawCircle(pos, radius, width, power, color);
    pos = abs(pos);
    // vec3 finalColor = vec3(pos.x, 0.0, pos.y);
    fragColor = vec4(finalColor, 1.0);
}

`,
  },
  {
    title: "PsychedelicSakura",
    author: "Author Reva - 2020-02-21",
    originalURL: "https://www.shadertoy.com/view/wlGXRD",
    value: `

float plot(float r, float pct){
	return  smoothstep( pct-0.2, pct, r) -smoothstep( pct, pct+0.2, r);
}

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
        return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    vec3 col = vec3(1.0);
    vec2 pos = vec2(0.5) - uv;
    pos.x *= iResolution.x/iResolution.y;
    pos *= cos(iTime)*1.0+1.5;
    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);
    float f = abs(cos(a*2.5+iTime*0.5))*sin(iTime*2.0)*0.698+cos(iTime)-4.0;
    float d = f-r;
    col = (vec3(smoothstep(fract(d),fract(d)+-0.200,0.160))-vec3(smoothstep(fract(d),fract(d)+-1.184,0.160)) ) 
	* pal( f, vec3(0.725,0.475,0.440),vec3(0.605,0.587,0.007),vec3(1.0,1.0,1.0),vec3(0.310,0.410,0.154) );
    float pct = plot(r*0.272,fract(d*(sin(iTime)*0.45+0.5)));
    col += pct*pal( r, vec3(0.750,0.360,0.352),vec3(0.450,0.372,0.271),vec3(0.540,0.442,0.264),vec3(0.038,0.350,0.107) );

    // Output to screen
    fragColor = vec4(col,pct*0.3);
    fragColor.a = 1.0;
}

`,
  },
  {
    title: "Fractal",
    author: "gaetanThiesson",
    originalURL: "https://www.shadertoy.com/view/WlcXR4",
    value: `

vec2 f(vec2 x, vec2 c) {
    return mat2(x,-x.y,x.x)*x + c;
}

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    uv -= 0.5;uv *= 1.3;uv += 0.5;
    vec4 col = vec4(1.0);
    float time = iTime;
    int u_maxIterations = 75;
    float r = 0.7885*(sin((time/3.) - 1.57)*0.2+0.85);
	  vec2 c = vec2(r*cos((time/3.)), r*sin((time/3.)));
    vec2 z = vec2(0.);
    z.x = 3.0 * (uv.x - 0.5);
    z.y = 2.0 * (uv.y - 0.5);
    bool escaped = false;
    int iterations;
    for (int i = 0; i < 10000; i++) {
        if (i > u_maxIterations) break;
        iterations = i;
        z = f(z, c);
        if (dot(z,z) > 4.0) {
            escaped = true;
            break;
        }
    }
			
    vec3 iterationCol = vec3(palette(float(iterations)/ float(u_maxIterations),
                                     vec3(0.5),
                                     vec3(0.5),
                                     vec3(1.0, 1.0, 0.0),
                                     vec3(0.3 + 0.3 * sin(time),
                                          0.2 + 0.2 * sin(1. + time),
                                          0.2  + 0.2 * sin(1.5 + time))));
		
	  vec3 coreCol = vec3(0.);
    float f_ite = float(iterations);
    float f_maxIte = float(u_maxIterations);
    fragColor = vec4(escaped ? iterationCol : coreCol, f_ite/f_maxIte );
    fragColor.a = 1.0;
}

`,
  },
  {
    title: "CoordSys - intersection",
    author: "Inigo Quilez",
    originalURL: "https://www.shadertoy.com/view/lsfGDB",
    value: `

#if 1

//Elegant way to intersect a planar coordinate system (3x3 linear system)
vec3 intersectCoordSys( in vec3 ro, in vec3 rd, vec3 dc, vec3 du, vec3 dv )
{
	vec3 oc = ro - dc;
	return vec3(
        dot( cross(du,dv), oc ),
		dot( cross(oc,du), rd ),
		dot( cross(dv,oc), rd ) ) / 
        dot( cross(dv,du), rd );
}

#else

// Ugly (but faster) way to intersect a planar coordinate system: plane + projection
vec3 intersectCoordSys( in vec3 ro, in vec3 rd, vec3 dc, vec3 du, vec3 dv )
{
	vec3  oc = ro - dc;
	vec3  no = cross(du,dv);
    float t  = -dot(no,oc)/dot(rd,no);
    float r  =  dot(du,oc + rd*t);
    float s  =  dot(dv,oc + rd*t);
    return vec3(t,s,r);
}

#endif	

vec3 hash3( float n )
{
    return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(43758.5453123,12578.1459123,19642.3490423));
}

vec3 shade( in vec4 res )
{
    float ra = length(res.yz);
    float an = atan(res.y,res.z) + 2.0*iTime;
    float pa = sin(3.0*an);

    vec3 cola = 0.5 + 0.5*sin( (res.w/32.0)*3.5 + vec3(0.0,1.0,2.0) );
	
	vec3 col = vec3(0.0);
	col += cola*0.4*(1.0-smoothstep( 0.90, 1.00, ra) );
  col += cola*1.0*(1.0-smoothstep( 0.00, 0.03, abs(ra-0.8)))*(0.5+0.5*pa);
  col += cola*1.0*(1.0-smoothstep( 0.00, 0.20, abs(ra-0.8)))*(0.5+0.5*pa);
  col += cola*0.5*(1.0-smoothstep( 0.05, 0.10, abs(ra-0.5)))*(0.5+0.5*pa);
  col += cola*0.7*(1.0-smoothstep( 0.00, 0.30, abs(ra-0.5)))*(0.5+0.5*pa);
	return col*0.3;
}

vec3 render( in vec3 ro, in vec3 rd )
{
  // raytrace
  vec3 col = vec3( 0.0 );
	for( int i=0; i<32; i++ )
	{
		  // position disk
	    vec3 r = 1.5*(-1.0 + 2.0*hash3( float(i) ));
		
      // orientate disk
      vec3 u = normalize( r.zxy );
      vec3 v = normalize( cross( u, vec3(0.0,1.0,0.0 ) ) );						   
  
      // intersect coord sys
      vec3 tmp = intersectCoordSys( ro, rd, r, u, v );
	
	    if( dot(tmp.yz,tmp.yz)<1.0 && tmp.x>0.0 ) 
	    {
        // shade			
		    col += shade( vec4(tmp,float(i)) );
	    }
	}

    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    // camera
	  vec3 ro = 1.5*vec3(cos(0.05*iTime),0.0,sin(0.05*iTime));
    vec3 ta = vec3(0.0,0.0,0.0);
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
	  // create view ray
	  vec3 rd = normalize( p.x*uu + p.y*vv + 1.0*ww );
    vec3 col = render( ro, rd );
    fragColor = vec4( col, 1.0 );
}

`,
  },
  {
    title: "Waves Remix",
    author: "ADOB",
    originalURL: "https://www.shadertoy.com/view/4ljGD1",
    value: `

  float squared(float value) { return value * value; }
  float getAmp(float frequency) { return texture(iChannel0, vec2(frequency / 512.0, 0)).x; }
  float getWeight(float f) {
  return (+ getAmp(f-2.0) + getAmp(f-1.0) + getAmp(f+2.0) + getAmp(f+1.0) + getAmp(f)) / 5.0; }

  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {    
    vec2 uvTrue = fragCoord.xy / iResolution.xy;
    vec2 uv = -1.0 + 2.0 * uvTrue;
    float lineIntensity;
    float glowWidth;
    vec3 color = vec3(0.0);
    for(float i = 0.0; i < 5.0; i++) {     
    uv.y += (0.2 * sin(uv.x + i/7.0 - iTime * 0.6));
    float Y = uv.y + getWeight(squared(i) * 20.0) *
    (texture(iChannel0, vec2(uvTrue.x, 1)).x - 0.5);
    lineIntensity = 0.4 + squared(1.6 * abs(mod(uvTrue.x + i / 1.3 + iTime,2.0) - 1.0));
    glowWidth = abs(lineIntensity / (150.0 * Y));
    color += vec3(glowWidth * (2.0 + sin(iTime * 0.13)),
                      glowWidth * (2.0 - sin(iTime * 0.23)),
                      glowWidth * (2.0 - cos(iTime * 0.19)));
  }	
	
	fragColor = vec4(color, 1.0);
}

`,
  },
  {
    title: "Kaleidoscope Tunnel",
    author: "kaneta",
    originalURL: "https://www.shadertoy.com/view/WsSGWG",
    value: `

#define PI 3.141592654

mat2 rot(float x)
{
    return mat2(cos(x), sin(x), -sin(x), cos(x));
}

vec2 foldRotate(in vec2 p, in float s) {
    float a = PI / s - atan(p.x, p.y);
    float n = PI * 2. / s;
    a = floor(a / n) * n;
    p *= rot(a);
    return p;
}

float sdRect( vec2 p, vec2 b )
{
  vec2 d = abs(p) - b;
  return min(max(d.x, d.y),0.0) + length(max(d,0.0));
}

// TheGrid by dila
// https://www.shadertoy.com/view/llcXWr
float tex(vec2 p, float z)
{
    p = foldRotate(p, 8.0);
    vec2 q = (fract(p / 10.0) - 0.5) * 10.0;
    for (int i = 0; i < 3; ++i) {
        for(int j = 0; j < 2; j++) {
        	q = abs(q) - .25;
        	q *= rot(PI * .25);
        }
        q = abs(q) - vec2(1.0, 1.5);
        q *= rot(PI * .25 * z);
		q = foldRotate(q, 3.0);  
    }
	float d = sdRect(q, vec2(1., 1.));
  float f = 1.0 / (1.0 + abs(d));
  return smoothstep(.9, 1., f);
}

// The Drive Home by BigWings
// https://www.shadertoy.com/view/MdfBRX
float Bokeh(vec2 p, vec2 sp, float size, float mi, float blur)
{
    float d = length(p - sp);
    float c = smoothstep(size, size*(1.-blur), d);
    c *= mix(mi, 1., smoothstep(size*.8, size, d));
    return c;
}

vec2 hash( vec2 p ){
	p = vec2( dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));
	return fract(sin(p)*43758.5453) * 2.0 - 1.0;
}

float dirt(vec2 uv, float n)
{
    vec2 p = fract(uv * n);
    vec2 st = (floor(uv * n) + 0.5) / n;
    vec2 rnd = hash(st);
    return Bokeh(p, vec2(0.5, 0.5) + vec2(0.2) * rnd, 0.05, abs(rnd.y * 0.4) + 0.3, 0.25 + rnd.x * rnd.y * 0.2);
}

float sm(float start, float end, float t, float smo)
{
    return smoothstep(start, start + smo, t) - smoothstep(end - smo, end, t);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    uv *= 2.0;
    vec3 col = vec3(0.0);
    #define N 6
    #define NN float(N)
    #define INTERVAL 3.0
    #define INTENSITY vec3((NN * INTERVAL - t) / (NN * INTERVAL))
    float time = iTime;
    for(int i = 0; i < N; i++) {
        float t;
        float ii = float(N - i);
        t = ii * INTERVAL - mod(time - INTERVAL * 0.75, INTERVAL);
        col = mix(col, INTENSITY, dirt(mod(uv * max(0.0, t) * 0.1 + vec2(.2, -.2) * time, 1.2), 3.5));
        t = ii * INTERVAL - mod(time + INTERVAL * 0.5, INTERVAL);
        col = mix(col, INTENSITY * vec3(0.7, 0.8, 1.0) * 1.3,tex(uv * max(0.0, t), 4.45));
        t = ii * INTERVAL - mod(time - INTERVAL * 0.25, INTERVAL);
        col = mix(col, INTENSITY * vec3(1.), dirt(mod(uv * max(0.0, t) * 0.1 + vec2(-.2, -.2) *  time, 1.2), 3.5));    
        t = ii * INTERVAL - mod(time, INTERVAL);
        float r = length(uv * 2.0 * max(0.0, t));
        float rr = sm(-24.0, -0.0, (r - mod(time * 30.0, 90.0)), 10.0);
        col = mix(col, mix(INTENSITY * vec3(1.), INTENSITY * vec3(0.7, 0.5, 1.0) * 3.0, rr),tex(uv * 2.0 * max(0.0, t), 0.27 + (2.0 * rr)));
    }

	fragColor = vec4(col, 0.0);
  fragColor.a = 1.0;
}

`,
  },
  {
    title: "Topologica",
    author: "Otavio Good",
    originalURL: "https://www.shadertoy.com/view/4djXzz",
    value: `
        
uniform int iFrame;

// various noise functions
float Hash3d(vec3 uv)
{
    float f = uv.x + uv.y * 37.0 + uv.z * 521.0;
    return fract(cos(f*3.333)*100003.9);
}
float mixP(float f0, float f1, float a)
{
    return mix(f0, f1, a*a*(3.0-2.0*a));
}
const vec2 zeroOne = vec2(0.0, 1.0);
float noise(vec3 uv)
{
    vec3 fr = fract(uv.xyz);
    vec3 fl = floor(uv.xyz);
    float h000 = Hash3d(fl);
    float h100 = Hash3d(fl + zeroOne.yxx);
    float h010 = Hash3d(fl + zeroOne.xyx);
    float h110 = Hash3d(fl + zeroOne.yyx);
    float h001 = Hash3d(fl + zeroOne.xxy);
    float h101 = Hash3d(fl + zeroOne.yxy);
    float h011 = Hash3d(fl + zeroOne.xyy);
    float h111 = Hash3d(fl + zeroOne.yyy);
    return mixP(
        mixP(mixP(h000, h100, fr.x), mixP(h010, h110, fr.x), fr.y),
        mixP(mixP(h001, h101, fr.x), mixP(h011, h111, fr.x), fr.y)
        , fr.z);
}

float PI=3.14159265;
#define saturate(a) clamp(a, 0.0, 1.0)
// Weird for loop trick so compiler doesn't unroll loop
// By making the zero a variable instead of a constant, the compiler can't unroll the loop and
// that speeds up compile times by a lot.
#define ZERO_TRICK max(0, -iFrame)

float Density(vec3 p)
{
    float final = noise(p*0.06125);
    float other = noise(p*0.06125 + 1234.567);
    other -= 0.5;
    final -= 0.5;
    final = 0.1/(abs(final*final*other));
    final += 0.5;
    return final*0.0001;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	// ---------------- First, set up the camera rays for ray marching ----------------
	vec2 uv = fragCoord.xy/iResolution.xy * 2.0 - 1.0;

	// Camera up vector.
	vec3 camUp=vec3(0,1,0); // vuv

	// Camera lookat.
	vec3 camLookat=vec3(0,0.0,0);	// vrp

	float mx=iMouse.x/iResolution.x*PI*2.0 + iTime * 0.01;
	float my=-iMouse.y/iResolution.y*10.0 + sin(iTime * 0.03)*0.2+0.2;//*PI/2.01;
	vec3 camPos=vec3(cos(my)*cos(mx),sin(my),cos(my)*sin(mx))*(200.2); 	// prp

	// Camera setup.
	vec3 camVec=normalize(camLookat - camPos);//vpn
	vec3 sideNorm=normalize(cross(camUp, camVec));	// u
	vec3 upNorm=cross(camVec, sideNorm);//v
	vec3 worldFacing=(camPos + camVec);//vcv
	vec3 worldPix = worldFacing + uv.x * sideNorm * (iResolution.x/iResolution.y) + uv.y * upNorm;//scrCoord
	vec3 relVec = normalize(worldPix - camPos);//scp

	// --------------------------------------------------------------------------------
	float t = 0.0;
	float inc = 0.02;
	float maxDepth = 70.0;
	vec3 pos = vec3(0,0,0);
  float density = 0.0;
	// ray marching time
    for (int i = ZERO_TRICK; i < 37; i++)	// This is the count of how many times the ray actually marches.
    {
        if ((t > maxDepth)) break;
        pos = camPos + relVec * t;
        float temp = Density(pos);
        inc = 1.9 + temp*0.05;	// add temp because this makes it look extra crazy!
        density += temp * inc;
        t += inc;
    }

	// --------------------------------------------------------------------------------
	// Now that we have done our ray marching, let's put some color on this.
	vec3 finalColor = vec3(0.01,0.1,1.0)* density*0.2;

	// output the final color with sqrt for "gamma correction"
	fragColor = vec4(sqrt(clamp(finalColor, 0.0, 1.0)),1.0); fragColor.a = 1.0;
}

`,
  },
  {
    title: "Rainbow Showoff",
    author: "akufishi",
    originalURL: "https://www.shadertoy.com/view/lscBRf",
    value: `

#define FALLING_SPEED  0.25
#define STRIPES_FACTOR 5.0

//get sphere
float sphere(vec2 coord, vec2 pos, float r) {
    vec2 d = pos - coord; 
    return smoothstep(60.0, 0.0, dot(d, d) - r * r);
}

//main
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //normalize pixel coordinates
    vec2 uv         = fragCoord / iResolution.xy;
    //pixellize uv
    vec2 clamped_uv = (round(fragCoord / STRIPES_FACTOR) * STRIPES_FACTOR) / iResolution.xy;
    //get pseudo-random value for stripe height
    float value		= fract(sin(clamped_uv.x) * 43758.5453123);
    //create stripes
    vec3 col        = vec3(1.0 - mod(uv.y * 0.5 + (iTime * (FALLING_SPEED + value / 5.0)) + value, 0.5));
    //add color
         col       *= clamp(cos(iTime * 2.0 + uv.xyx + vec3(0, 2, 4)), 0.0, 1.0);
    //add glowing ends
    	 col 	   += vec3(sphere(fragCoord, 
                                  vec2(clamped_uv.x, (1.0 - 2.0 * mod((iTime * (FALLING_SPEED + value / 5.0)) + value, 0.5))) * iResolution.xy, 
                                  0.9)) / 2.0; 
    //add screen fade
         col       *= vec3(exp(-pow(abs(uv.y - 0.5), 6.0) / pow(2.0 * 0.05, 2.0)));
    // Output to screen
    fragColor       = vec4(col,1.0);
}

`,
  },
  {
    title: "Creation by Silexars",
    author: "Danguafer",
    originalURL: "https://www.shadertoy.com/view/XsXXDn",
    value: `
        // If you intend to reuse this shader, please add credits to 'Danilo Guanabara'
  #define t iTime
  #define r iResolution.xy

  void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    vec3 c;
    float l,z=t;
    for(int i=0;i<3;i++) {
      vec2 uv,p=fragCoord.xy/r;
      uv=p;
      p-=.5;
      p.x*=r.x/r.y;
      z+=.07;
      l=length(p);
      uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
      c[i]=.01/length(mod(uv,1.)-.5);
    }
    fragColor=vec4(c/l,t);
  }
`,
  },
  {
    title: "Cyber Fuji 2020",
    author: "kaiware007",
    originalURL: "https://www.shadertoy.com/view/Wt33Wf",
    value: `
float sun(vec2 uv, float battery)
{
 	float val = smoothstep(0.3, 0.29, length(uv));
 	float bloom = smoothstep(0.7, 0.0, length(uv));
  float cut = 3.0 * sin((uv.y + iTime * 0.2 * (battery + 0.02)) * 100.0) 
				+ clamp(uv.y * 14.0 + 1.0, -6.0, 6.0);
  cut = clamp(cut, 0.0, 1.0);
  return clamp(val * cut, 0.0, 1.0) + bloom * 0.6;
}

float grid(vec2 uv, float battery)
{
    vec2 size = vec2(uv.y, uv.y * uv.y * 0.2) * 0.01;
    uv += vec2(0.0, iTime * 4.0 * (battery + 0.05));
    uv = abs(fract(uv) - 0.5);
    vec2 lines = smoothstep(size, vec2(0.0), uv);
    lines += smoothstep(size * 5.0, vec2(0.0), uv) * 0.4 * battery;
    return clamp(lines.x + lines.y, 0.0, 3.0);
}

float dot2(in vec2 v ) { return dot(v,v); }

float sdTrapezoid( in vec2 p, in float r1, float r2, float he )
{
    vec2 k1 = vec2(r2,he);
    vec2 k2 = vec2(r2-r1,2.0*he);
    p.x = abs(p.x);
    vec2 ca = vec2(p.x-min(p.x,(p.y<0.0)?r1:r2), abs(p.y)-he);
    vec2 cb = p - k1 + k2*clamp( dot(k1-p,k2)/dot2(k2), 0.0, 1.0 );
    float s = (cb.x<0.0 && ca.y<0.0) ? -1.0 : 1.0;
    return s*sqrt( min(dot2(ca),dot2(cb)) );
}

float sdLine( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

float opSmoothUnion(float d1, float d2, float k){
	float h = clamp(0.5 + 0.5 * (d2 - d1) /k,0.0,1.0);
    return mix(d2, d1 , h) - k * h * ( 1.0 - h);
}

float sdCloud(in vec2 p, in vec2 a1, in vec2 b1, in vec2 a2, in vec2 b2, float w)
{
	//float lineVal1 = smoothstep(w - 0.0001, w, sdLine(p, a1, b1));
    float lineVal1 = sdLine(p, a1, b1);
    float lineVal2 = sdLine(p, a2, b2);
    vec2 ww = vec2(w*1.5, 0.0);
    vec2 left = max(a1 + ww, a2 + ww);
    vec2 right = min(b1 - ww, b2 - ww);
    vec2 boxCenter = (left + right) * 0.5;
    //float boxW = right.x - left.x;
    float boxH = abs(a2.y - a1.y) * 0.5;
    //float boxVal = sdBox(p - boxCenter, vec2(boxW, boxH)) + w;
    float boxVal = sdBox(p - boxCenter, vec2(0.04, boxH)) + w;
    float uniVal1 = opSmoothUnion(lineVal1, boxVal, 0.05);
    float uniVal2 = opSmoothUnion(lineVal2, boxVal, 0.05);
    return min(uniVal1, uniVal2);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.0 * fragCoord.xy - iResolution.xy)/iResolution.y;
    float battery = 1.0;
    //if (iMouse.x > 1.0 && iMouse.y > 1.0) battery = iMouse.y / iResolution.y;
    //else battery = 0.8;
    //if (abs(uv.x) < (9.0 / 16.0))
    {
        // Grid
        float fog = smoothstep(0.1, -0.02, abs(uv.y + 0.2));
        vec3 col = vec3(0.0, 0.1, 0.2);
        if (uv.y < -0.2)
        {
            uv.y = 3.0 / (abs(uv.y + 0.2) + 0.05);
            uv.x *= uv.y * 1.0;
            float gridVal = grid(uv, battery);
            col = mix(col, vec3(1.0, 0.5, 1.0), gridVal);
        }
        else
        {
            float fujiD = min(uv.y * 4.5 - 0.5, 1.0);
            uv.y -= battery * 1.1 - 0.51;
            vec2 sunUV = uv;
            vec2 fujiUV = uv;
            
            // Sun
            sunUV += vec2(0.75, 0.2);
            //uv.y -= 1.1 - 0.51;
            col = vec3(1.0, 0.2, 1.0);
            float sunVal = sun(sunUV, battery);
            
            col = mix(col, vec3(1.0, 0.4, 0.1), sunUV.y * 2.0 + 0.2);
            col = mix(vec3(0.0, 0.0, 0.0), col, sunVal);
            
            // fuji
            float fujiVal = sdTrapezoid( uv  + vec2(-0.75+sunUV.y * 0.0, 0.5), 1.75 + pow(uv.y * uv.y, 2.1), 0.2, 0.5);
            float waveVal = uv.y + sin(uv.x * 20.0 + iTime * 2.0) * 0.05 + 0.2;
            float wave_width = smoothstep(0.0,0.01,(waveVal));
            
            // fuji color
            col = mix( col, mix(vec3(0.0, 0.0, 0.25), vec3(1.0, 0.0, 0.5), fujiD), step(fujiVal, 0.0));
            // fuji top snow
            col = mix( col, vec3(1.0, 0.5, 1.0), wave_width * step(fujiVal, 0.0));
            // fuji outline
            col = mix( col, vec3(1.0, 0.5, 1.0), 1.0-smoothstep(0.0,0.01,abs(fujiVal)) );
            //col = mix( col, vec3(1.0, 1.0, 1.0), 1.0-smoothstep(0.03,0.04,abs(fujiVal)) );
            //col = vec3(1.0, 1.0, 1.0) *(1.0-smoothstep(0.03,0.04,abs(fujiVal)));
            
            // horizon color
            col += mix( col, mix(vec3(1.0, 0.12, 0.8), vec3(0.0, 0.0, 0.2), clamp(uv.y * 3.5 + 3.0, 0.0, 1.0)), step(0.0, fujiVal) );
            
            // cloud
            vec2 cloudUV = uv;
            cloudUV.x = mod(cloudUV.x + iTime * 0.1, 4.0) - 2.0;
            float cloudTime = iTime * 0.5;
            float cloudY = -0.5;
            float cloudVal1 = sdCloud(cloudUV, 
                                     vec2(0.1 + sin(cloudTime + 140.5)*0.1,cloudY), 
                                     vec2(1.05 + cos(cloudTime * 0.9 - 36.56) * 0.1, cloudY), 
                                     vec2(0.2 + cos(cloudTime * 0.867 + 387.165) * 0.1,0.25+cloudY), 
                                     vec2(0.5 + cos(cloudTime * 0.9675 - 15.162) * 0.09, 0.25+cloudY), 0.075);
            cloudY = -0.6;
            float cloudVal2 = sdCloud(cloudUV, 
                                     vec2(-0.9 + cos(cloudTime * 1.02 + 541.75) * 0.1,cloudY), 
                                     vec2(-0.5 + sin(cloudTime * 0.9 - 316.56) * 0.1, cloudY), 
                                     vec2(-1.5 + cos(cloudTime * 0.867 + 37.165) * 0.1,0.25+cloudY), 
                                     vec2(-0.6 + sin(cloudTime * 0.9675 + 665.162) * 0.09, 0.25+cloudY), 0.075);
            
            float cloudVal = min(cloudVal1, cloudVal2);
            //col = mix(col, vec3(1.0,1.0,0.0), smoothstep(0.0751, 0.075, cloudVal));
            col = mix(col, vec3(0.0, 0.0, 0.2), 1.0 - smoothstep(0.075 - 0.0001, 0.075, cloudVal));
            col += vec3(1.0, 1.0, 1.0)*(1.0 - smoothstep(0.0,0.01,abs(cloudVal - 0.075)));
        }
        col += fog * fog * fog;
        col = mix(vec3(col.r, col.r, col.r) * 0.5, col, battery * 0.7);
        fragColor = vec4(col,1.0);
    }

}

        `,
  },
  {
    title: "Synthwave",
    author: "stduhpf",
    originalURL: "https://www.shadertoy.com/view/tsScRK",
    value: `

//#define AA 2
//#define VAPORWAVE
//#define stereo 1. // -1. for cross-eyed (defaults to parallel view)
#define speed 10. 
#define wave_thing
//#define city

//you can add any sound texture in iChannel0 to turn it into a cool audio visualizer 
// (it looks better with lower speeds though)
//you should commment out or remove the following line to enable it (it's disabled mainly for performance reasons):
#define disable_sound_texture_sampling

#ifndef disable_sound_texture_sampling
    #undef speed 
    // lower value of speed when using as audio visualizer
    #define speed 5.
#endif

//self-explainatory
#define audio_vibration_amplitude .125
float jTime;
#ifdef disable_sound_texture_sampling
#define textureMirror(a, b) vec4(0)
#else
vec4 textureMirror(sampler2D tex, vec2 c){
    vec2 cf = fract(c);
    return texture(tex,mix(cf,1.-cf,mod(floor(c),2.)));
}
#endif

float amp(vec2 p){
    return smoothstep(1.,8.,abs(p.x));   
}

float pow512(float a){
    a*=a;//^2
    a*=a;//^4
    a*=a;//^8
    a*=a;//^16
    a*=a;//^32
    a*=a;//^64
    a*=a;//^128
    a*=a;//^256
    return a*a;
}

float pow1d5(float a){
    return a*sqrt(a);
}

float hash21(vec2 co){
    return fract(sin(dot(co.xy,vec2(1.9898,7.233)))*45758.5433);
}

float hash(vec2 uv){
    float a = amp(uv);
    #ifdef wave_thing
    float w = a>0.?(1.-.4*pow512(.51+.49*sin((.02*(uv.y+.5*uv.x)-jTime)*2.))):0.;
    #else
    float w=1.;
    #endif
    return (a>0.?
        a*pow1d5(
        //texture(iChannel0,uv/iChannelResolution[0].xy).r
        hash21(uv)
        )*w
        :0.)-(textureMirror(iChannel0,vec2((uv.x*29.+uv.y)*.03125,1.)).x)*audio_vibration_amplitude;
}

float edgeMin(float dx,vec2 da, vec2 db,vec2 uv){
    uv.x+=5.;
    vec3 c = fract((round(vec3(uv,uv.x+uv.y)))*(vec3(0,1,2)+0.61803398875));
    float a1 = textureMirror(iChannel0,vec2(c.y,0.)).x>.6?.15:1.;
    float a2 = textureMirror(iChannel0,vec2(c.x,0.)).x>.6?.15:1.;
    float a3 = textureMirror(iChannel0,vec2(c.z,0.)).x>.6?.15:1.;
    return min(min((1.-dx)*db.y*a3,da.x*a2),da.y*a1);
}

vec2 trinoise(vec2 uv){
    const float sq = sqrt(3./2.);
    uv.x *= sq;
    uv.y -= .5*uv.x;
    vec2 d = fract(uv);
    uv -= d;
    bool c = dot(d,vec2(1))>1.;
    vec2 dd = 1.-d;
    vec2 da = c?dd:d,db = c?d:dd;
    float nn = hash(uv+float(c));
    float n2 = hash(uv+vec2(1,0));
    float n3 = hash(uv+vec2(0,1));
    float nmid = mix(n2,n3,d.y);
    float ns = mix(nn,c?n2:n3,da.y);
    float dx = da.x/db.y;
    return vec2(mix(ns,nmid,dx),edgeMin(dx,da, db,uv+d));
}

vec2 map(vec3 p){
    vec2 n = trinoise(p.xz);
    return vec2(p.y-2.*n.x,n.y);
}

vec3 grad(vec3 p){
    const vec2 e = vec2(.005,0);
    float a =map(p).x;
    return vec3(map(p+e.xyy).x-a
                ,map(p+e.yxy).x-a
                ,map(p+e.yyx).x-a)/e.x;
}

vec2 intersect(vec3 ro,vec3 rd){
    float d =0.,h=0.;
    for(int i = 0;i<500;i++){ //look nice with 50 iterations
        vec3 p = ro+d*rd;
        vec2 s = map(p);
        h = s.x;
        d+= h*.5;
        if(abs(h)<.003*d)
            return vec2(d,s.y);
        if(d>150.|| p.y>2.) break;
    }
    return vec2(-1);
}

void addsun(vec3 rd,vec3 ld,inout vec3 col){
	float sun = smoothstep(.21,.2,distance(rd,ld));
    if(sun>0.){
        float yd = (rd.y-ld.y);
        float a =sin(3.1*exp(-(yd)*14.)); 
        sun*=smoothstep(-.8,0.,a);
        col = mix(col,vec3(1.,.8,.4)*.75,sun);
    }
}


float starnoise(vec3 rd){
  float c = 0.;
  vec3 p = normalize(rd)*300.;
	for (float i=0.;i<4.;i++)
    {
        vec3 q = fract(p)-.5;
        vec3 id = floor(p);
        float c2 = smoothstep(.5,0.,length(q));
        c2 *= step(hash21(id.xz/id.y),.06-i*i*0.005);
        c += c2;
        p = p*.6+.5*p*mat3(3./5.,0,4./5.,0,1,0,-4./5.,0,3./5.);
    }
    c*=c;
    float g = dot(sin(rd*10.512),cos(rd.yzx*10.512));
    c*=smoothstep(-3.14,-.9,g)*.5+.5*smoothstep(-.3,1.,g);
    return c*c;
}

vec3 gsky(vec3 rd,vec3 ld,bool mask){
    float haze = exp2(-5.*(abs(rd.y)-.2*dot(rd,ld)));
    //float st = mask?pow512(texture(iChannel0,(rd.xy+vec2(300.1,100)*rd.z)*10.).r)*(1.-min(haze,1.)):0.;
    //float st = mask?pow512(hash21((rd.xy+vec2(300.1,100)*rd.z)*10.))*(1.-min(haze,1.)):0.;
    float st = mask?(starnoise(rd))*(1.-min(haze,1.)):0.;
    vec3 back = vec3(.4,.1,.7)*(1.-.5*textureMirror(iChannel0,vec2(.5+.05*rd.x/rd.y,0.)).x
    *exp2(-.1*abs(length(rd.xz)/rd.y))
    *max(sign(rd.y),0.));
    #ifdef city
    float x = round(rd.x*30.);
    float h = hash21(vec2(x-166.));
    bool building = (h*h*.125*exp2(-x*x*x*x*.0025)>rd.y);
    if(mask && building)
        back*=0.,haze=.8, mask=mask && !building;
    #endif
    vec3 col=clamp(mix(back,vec3(.7,.1,.4),haze)+st,0.,1.);
    if(mask)addsun(rd,ld,col);
    return col;  
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    fragColor=vec4(0);
    #ifdef AA
    for(float x = 0.;x<1.;x+=1./float(AA)){
    for(float y = 0.;y<1.;y+=1./float(AA)){
    #else
        const float AA=1.,x=0.,y=0.;
    #endif
    vec2 uv = (2.*(fragCoord+vec2(x,y))-iResolution.xy)/iResolution.y;
    
    const float shutter_speed = .25; // for motion blur
	//float dt = fract(texture(iChannel0,float(AA)*(fragCoord+vec2(x,y))/iChannelResolution[0].xy).r+iTime)*shutter_speed;
    float dt = fract(hash21(float(AA)*(fragCoord+vec2(x,y)))+iTime)*shutter_speed;
    jTime = mod(iTime-dt*iTimeDelta,4000.);
    vec3 ro = vec3(0.,1,(-20000.+jTime*speed));
    
        #ifdef stereo
            ro+=stereo*vec3(.2*(float(uv.x>0.)-.5),0.,0.); 
            const float de = .9;
            uv.x=uv.x+.5*(uv.x>0.?-de:de);
            uv*=2.;
		#endif
        
    vec3 rd = normalize(vec3(uv,4./3.));//vec3(uv,sqrt(1.-dot(uv,uv)));
    vec2 i = intersect(ro,rd);
    float d = i.x;
    vec3 ld = normalize(vec3(0,.125+.05*sin(.1*jTime),1));
    vec3 fog = d>0.?exp2(-d*vec3(.14,.1,.28)):vec3(0.);
    vec3 sky = gsky(rd,ld,d<0.);
    vec3 p = ro+d*rd;
    vec3 n = normalize(grad(p));
    float diff = dot(n,ld)+.1*n.y;
    vec3 col = vec3(.1,.11,.18)*diff;
    vec3 rfd = reflect(rd,n); 
    vec3 rfcol = gsky(rfd,ld,true);
    col = mix(col,rfcol,.05+.95*pow(max(1.+dot(rd,n),0.),5.));
    #ifdef VAPORWAVE
    col = mix(col,vec3(.4,.5,1.),smoothstep(.05,.0,i.y));
    col = mix(sky,col,fog);
    col = sqrt(col);
    #else
    col = mix(col,vec3(.8,.1,.92),smoothstep(.05,.0,i.y));
    col = mix(sky,col,fog);
    //no gamma for that old cg look
    #endif
    if(d<0.)
        d=1e6;
    d=min(d,10.);
    fragColor += vec4(clamp(col,0.,1.),d<0.?0.:.1+exp2(-d));
     #ifdef AA
    }
    }
    fragColor/=float(AA*AA);
    #endif
    fragColor = vec4(col,1.0);
}
`,
  },
  {
    title: "Disco tunnel",
    author: "WAHa_06x36",
    originalURL: "https://www.shadertoy.com/view/XstfzB",
    value: ` 

vec2 position(float z) {
	return vec2(
		0.0 + sin(z * 0.1) * 1.0 + sin(cos(z * 0.031) * 4.0) * 1.0 + sin(sin(z * 0.0091) * 3.0) * 3.0,
		0.0 + cos(z * 0.1) * 1.0 + cos(cos(z * 0.031) * 4.0) * 1.0 + cos(sin(z * 0.0091) * 3.0) * 3.0
	) * 1.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = (fragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
	float camZ = 25.0 * iTime;
	vec2 cam = position(camZ);
	float dt = 0.5;
	float camZ2 = 25.0 * (iTime + dt);
 	vec2 cam2 = position(camZ2);
	vec2 dcamdt = (cam2 - cam) / dt;
	vec3 f = vec3(0.0);
 	for(int j = 1; j < 300; j++) {
		float i = float(j);
		float realZ = floor(camZ) + i;
		float screenZ = realZ - camZ;
		float r = 1.0 / screenZ;
 		vec2 c = (position(realZ) - cam) * 10.0 / screenZ - dcamdt * 0.4;
	 	vec3 color = (vec3(sin(realZ * 0.07), sin(realZ * 0.1), sin(realZ * 0.08)) + vec3(1.0)) / 2.0;
 		f += color * 0.06 / screenZ / (abs(length(p - c) - r) + 0.01);
	}
	fragColor = vec4(f, 1.0);
}

  `,
  },
  {
    title: "Ball Of Fire",
    author: "Trisomie21",
    originalURL: "https://www.shadertoy.com/view/lsf3RH",
    value: ` 

float snoise(vec3 uv, float res)
{
	const vec3 s = vec3(1e0, 1e2, 1e3);
	uv *= res;
	vec3 uv0 = floor(mod(uv, res))*s;
	vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;
	vec3 f = fract(uv); f = f*f*(3.0-2.0*f);
	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
		      	  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);
	vec4 r = fract(sin(v*1e-1)*1e3);
	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);
	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	return mix(r0, r1, f.z)*2.-1.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
	vec2 p = -.5 + fragCoord.xy / iResolution.xy;
	p.x *= iResolution.x/iResolution.y;
	float color = 3.0 - (3.*length(2.*p));
	vec3 coord = vec3(atan(p.x,p.y)/6.2832+.5, length(p)*.4, .5);
	for(int i = 1; i <= 7; i++)
	{
		float power = pow(2.0, float(i));
		color += (1.5 / power) * snoise(coord + vec3(0.,-iTime*.05, iTime*.01), power*16.);
	}
	fragColor = vec4( color, pow(max(color,0.),2.)*0.4, pow(max(color,0.),3.)*0.15 , 1.0);
}

  `,
  },
  {
    title: "Star Nest",
    author: "Kali",
    originalURL: "https://www.shadertoy.com/view/XlfGRj",
    value: ` 
 
 // Star Nest by Pablo Roman Andrioli
// License: MIT

#define iterations 17
#define formuparam 0.53
#define volsteps 20
#define stepsize 0.1
#define zoom   0.800
#define tile   0.850
#define speed  0.010 
#define brightness 0.0015
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	//get coords and direction
	vec2 uv=fragCoord.xy/iResolution.xy-.5;
	uv.y*=iResolution.y/iResolution.x;
	vec3 dir=vec3(uv*zoom,1.);
	float time=iTime*speed+.25;

	//mouse rotation
	float a1=.5+iMouse.x/iResolution.x*2.;
	float a2=.8+iMouse.y/iResolution.y*2.;
	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	dir.xz*=rot1;
	dir.xy*=rot2;
	vec3 from=vec3(1.,.5,0.5);
	from+=vec3(time*2.,time,-2.);
	from.xz*=rot1;
	from.xy*=rot2;
	
	//volumetric rendering
	float s=0.1,fade=1.;
	vec3 v=vec3(0.);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a; // add contrast
		if (r>6) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v+=fade;
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	fragColor = vec4(v*.01,1.);	
}
  `,
  },
  {
    title: "Starleidoscope",
    author: "DanielXMoore",
    originalURL: "https://www.shadertoy.com/view/ftt3R7",
    value: ` 

#define NUM_LAYERS 10.

mat2 Rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

float Star(vec2 uv, float flare) {
    float col = 0.;
    float d = length(uv);
    float m = .02/d;
    float rays = max(0., 1. - abs(uv.x * uv.y * 1000.));
    m += rays * flare;
    uv *= Rot(3.1415/4.);
    rays = max(0., 1. - abs(uv.x * uv.y * 1000.));
    m += rays * .3 * flare;
    m *= smoothstep(1., .2, d);
    return m;
}

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p+45.32);
  return fract(p.x*p.y);
}

vec3 StarLayer(vec2 uv) {
    vec3 col = vec3(0.);
    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);
    for(int y = -1; y <= 1; y++ ) {
        for(int x = -1; x <= 1; x++) {
            vec2 offs = vec2(x, y);
            float n = Hash21(id + offs);
            float size = fract(n*345.32);            
            vec2 p = vec2(n, fract(n*34.));
            float star = Star(gv - offs - p + .5, smoothstep(.8, 1., size) * .6);
            vec3 hueShift = fract(n*2345.2 + dot(uv /420.,texture(iChannel0, vec2(0.25, 0.)).rg))*vec3(.2, .3, .9)*123.2;
            vec3 color = sin(hueShift) * .5 + .5;
            color = color * vec3(1., .25, 1.+size);
            star *= sin(iTime*3.+n*6.2831)*.4+1.;
            col += star * size * color;
        }
    }
    return col;
}

vec2 N(float angle) {
  return vec2(sin(angle), cos(angle));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5*iResolution.xy)/iResolution.y;
    vec2 M = (iMouse.xy - iResolution.xy*.5)/iResolution.y;
    float t = iTime * .01;
    uv.x = abs(uv.x);
    uv.y += tan((5./6.) * 3.1415) * .5;
    vec2 n = N((5./6.) * 3.1415);
    float d = dot(uv - vec2(.5, 0.), n);
    uv -= n * max(0., d) * 2.;
    // col += smoothstep(.01, .0, abs(d));
    n = N((2./3.) * 3.1415);
    float scale = 1.;
    uv.x += 1.5 / 1.25;
    for(int i=0; i<5; i++) {
        scale *= 1.25;
        uv *= 1.25;
        uv.x -= 1.5;
        uv.x = abs(uv.x);
        uv.x -= 0.5;
        uv -= n * min(0., dot(uv, n)) * 2.;
    }
 
    uv += M * 4.;
    uv *= Rot(t);
    vec3 col = vec3(0.);
    float layers = 10.;

    for(float i=0.; i < 1.; i+=1./NUM_LAYERS) {
        float depth = fract(i+t);
        float scale = mix(20., .5, depth);
        float fade = depth * smoothstep(1., .9, depth);
        col += StarLayer(uv * scale + i * 453.2) * fade;
    }

    fragColor = vec4(col,1.0);
}
  `,
  },
  {
    title: "Phantom Star",
    author: "kasari39",
    originalURL: "https://www.shadertoy.com/view/ttKGDt",
    value: ` 
precision highp float;

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}

const float pi = acos(-1.0);
const float pi2 = pi*2.0;
vec2 pmod(vec2 p, float r) {
    float a = atan(p.x, p.y) + pi/r;
    float n = pi2 / r;
    a = floor(a/n)*n;
    return p*rot(-a);
}

float box( vec3 p, vec3 b ) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float ifsBox(vec3 p) {
    for (int i=0; i<5; i++) {
        p = abs(p) - 1.0;
        p.xy *= rot(iTime*0.3);
        p.xz *= rot(iTime*0.1);
    }
    p.xz *= rot(iTime);
    return box(p, vec3(0.4,0.8,0.3));
}

float map(vec3 p, vec3 cPos) {
    vec3 p1 = p;
    p1.x = mod(p1.x-5., 10.) - 5.;
    p1.y = mod(p1.y-5., 10.) - 5.;
    p1.z = mod(p1.z, 16.)-8.;
    p1.xy = pmod(p1.xy, 5.0);
    return ifsBox(p1);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 p = (fragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec3 cPos = vec3(0.0,0.0, -3.0 * iTime);
    // vec3 cPos = vec3(0.3*sin(iTime*0.8), 0.4*cos(iTime*0.3), -6.0 * iTime);
    vec3 cDir = normalize(vec3(0.0, 0.0, -1.0));
    vec3 cUp  = vec3(sin(iTime), 1.0, 0.0);
    vec3 cSide = cross(cDir, cUp);
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir);

    // Phantom Mode https://www.shadertoy.com/view/MtScWW by aiekick
    float acc = 0.0;
    float acc2 = 0.0;
    float t = 0.0;
    for (int i = 0; i < 99; i++) {
        vec3 pos = cPos + ray * t;
        float dist = map(pos, cPos);
        dist = max(abs(dist), 0.02);
        float a = exp(-dist*3.0);
        if (mod(length(pos)+24.0*iTime, 30.0) < 3.0) {
            a *= 2.0;
            acc2 += a;
        }
        acc += a;
        t += dist * 0.5;
    }

    vec3 col = vec3(acc * 0.01, acc * 0.011 + acc2*0.002, acc * 0.012+ acc2*0.005);
    fragColor = vec4(col, 1.0 - t * 0.03);
    fragColor.a = 1.0;
}
  `,
  },
  {
    title: "Shooting Stars",
    author: "Xor",
    originalURL: "https://www.shadertoy.com/view/ctXGRn",
    value: ` 
void mainImage(out vec4 O, vec2 I)
{
    //Clear fragcolor
    O *= 0.;
    
    //Line dimensions (box) and position relative to line
    vec2 b = vec2(0,.2), p;
    //Rotation matrix
    mat2 R;
    //Iterate 20 times
    for(float i=.9; i++<20.;
        //Add attenuation
        O += 1e-3/length(clamp(p=R
        //Using rotated boxes
        *(fract((I/iResolution.y*i*.1+iTime*b)*R)-.5),-b,b)-p)
        //My favorite color palette
        *(cos(p.y/.1+vec4(0,1,2,3))+1.) )
        //Rotate for each iteration
        R=mat2(cos(i+vec4(0,33,11,0)));
          O.a = 1.0;
}
  `,
  },
  {
    title: "Zippy Zaps",
    author: "SnoopethDuckDuck",
    originalURL: "https://www.shadertoy.com/view/XXyGzh",
    value: ` 
  void mainImage( out vec4 o, vec2 u )
{
    vec2 v = iResolution.xy;
         u = .2*(u+u-v)/v.y;    
         
    vec4 z = o = vec4(1,2,3,0);
     
    for (float a = .5, t = iTime, i; 
         ++i < 19.; 
         o += (1. + cos(z+t)) 
            / length((1.+i*dot(v,v)) 
                   * sin(1.5*u/(.5-dot(u,u)) - 9.*u.yx + t))
         )  
        v = cos(++t - 7.*u*pow(a += .03, i)) - 5.*u,                 
        u += tanh(40. * dot(u *= mat2(cos(i + .02*t - vec4(0,11,33,0)))
                           ,u)
                      * cos(1e2*u.yx + t)) / 2e2
           + .2 * a * u
           + cos(4./exp(dot(o,o)/1e2) + t) / 3e2;
              
     o = 25.6 / (min(o, 13.) + 164. / o) 
       - dot(u, u) / 250.;
            o*=1.0;
}
  `,
  },
  {
    title: "Inside the Matrix",
    author: "And390",
    originalURL: "https://www.shadertoy.com/view/4t3BWl",
    value: ` 


const int ITERATIONS = 40;   //use less value if you need more performance
const float SPEED = 1.;
const float STRIP_CHARS_MIN =  7.;
const float STRIP_CHARS_MAX = 40.;
const float STRIP_CHAR_HEIGHT = 0.15;
const float STRIP_CHAR_WIDTH = 0.10;
const float ZCELL_SIZE = 1. * (STRIP_CHAR_HEIGHT * STRIP_CHARS_MAX);  //the multiplier can't be less than 1.
const float XYCELL_SIZE = 12. * STRIP_CHAR_WIDTH;  //the multiplier can't be less than 1.
const int BLOCK_SIZE = 10;  //in cells
const int BLOCK_GAP = 2;    //in cells
const float WALK_SPEED = 1. * XYCELL_SIZE;
const float BLOCKS_BEFORE_TURN = 3.;
const float PI = 3.14159265359;

//----  random  ----
float hash(float v) {
    return fract(sin(v)*43758.5453123);
}

float hash(vec2 v) {
    return hash(dot(v, vec2(5.3983, 5.4427)));
}

vec2 hash2(vec2 v)
{
    v = vec2(v * mat2(127.1, 311.7,  269.5, 183.3));
	return fract(sin(v)*43758.5453123);
}

vec4 hash4(vec2 v)
{
    vec4 p = vec4(v * mat4x2( 127.1, 311.7,
                              269.5, 183.3,
                              113.5, 271.9,
                              246.1, 124.6 ));
    return fract(sin(p)*43758.5453123);
}

vec4 hash4(vec3 v)
{
    vec4 p = vec4(v * mat4x3( 127.1, 311.7, 74.7,
                              269.5, 183.3, 246.1,
                              113.5, 271.9, 124.6,
                              271.9, 269.5, 311.7 ) );
    return fract(sin(p)*43758.5453123);
}


//  ----  symbols  ----
//  Slightly modified version of "runes" by FabriceNeyret2 -  https://www.shadertoy.com/view/4ltyDM
//  Which is based on "runes" by otaviogood -  https://shadertoy.com/view/MsXSRn

float rune_line(vec2 p, vec2 a, vec2 b) {   // from https://www.shadertoy.com/view/4dcfW8
    p -= a, b -= a;
	float h = clamp(dot(p, b) / dot(b, b), 0., 1.);   // proj coord on line
	return length(p - b * h);                         // dist to segment
}

float rune(vec2 U, vec2 seed, float highlight)
{
	float d = 1e5;
	for (int i = 0; i < 4; i++)	// number of strokes
	{
    vec4 pos = hash4(seed);
		seed += 1.;

		// each rune touches the edge of its box on all 4 sides
		if (i == 0) pos.y = .0;
		if (i == 1) pos.x = .999;
		if (i == 2) pos.x = .0;
		if (i == 3) pos.y = .999;
		// snap the random line endpoints to a grid 2x3
		vec4 snaps = vec4(2, 3, 2, 3);
		pos = ( floor(pos * snaps) + .5) / snaps;
		if (pos.xy != pos.zw)  //filter out single points (when start and end are the same)
		    d = min(d, rune_line(U, pos.xy, pos.zw + .001) ); // closest line
	}
	return smoothstep(0.1, 0., d) + highlight*smoothstep(0.4, 0., d);
}

float random_char(vec2 outer, vec2 inner, float highlight) {
    vec2 seed = vec2(dot(outer, vec2(269.5, 183.3)), dot(outer, vec2(113.5, 271.9)));
    return rune(inner, seed, highlight);
}

//----  digital rain  ----
// xy - horizontal, z - vertical
vec3 rain(vec3 ro3, vec3 rd3, float time) {
    vec4 result = vec4(0.);

    // normalized 2d projection
    vec2 ro2 = vec2(ro3);
    vec2 rd2 = normalize(vec2(rd3));

    // we use formulas "ro3 + rd3 * t3" and "ro2 + rd2 * t2", "t3_to_t2" is a multiplier to convert t3 to t2
    bool prefer_dx = abs(rd2.x) > abs(rd2.y);
    float t3_to_t2 = prefer_dx ? rd3.x / rd2.x : rd3.y / rd2.y;

    // at first, horizontal space (xy) is divided into cells (which are columns in 3D)
    // then each xy-cell is divided into vertical cells (along z) - each of these cells contains one raindrop

    ivec3 cell_side = ivec3(step(0., rd3));      //for positive rd.x use cell side with higher x (1) as the next side, for negative - with lower x (0), the same for y and z
    ivec3 cell_shift = ivec3(sign(rd3));         //shift to move to the next cell

    //  move through xy-cells in the ray direction
    float t2 = 0.;  // the ray formula is: ro2 + rd2 * t2, where t2 is positive as the ray has a direction.
    ivec2 next_cell = ivec2(floor(ro2/XYCELL_SIZE));  //first cell index where ray origin is located
    for (int i=0; i<ITERATIONS; i++) {
        ivec2 cell = next_cell;  //save cell value before changing
        float t2s = t2;          //and t

        //  find the intersection with the nearest side of the current xy-cell (since we know the direction, we only need to check one vertical side and one horizontal side)
        vec2 side = vec2(next_cell + cell_side.xy) * XYCELL_SIZE;  //side.x is x coord of the y-axis side, side.y - y of the x-axis side
        vec2 t2_side = (side - ro2) / rd2;  // t2_side.x and t2_side.y are two candidates for the next value of t2, we need the nearest
        if (t2_side.x < t2_side.y) {
            t2 = t2_side.x;
            next_cell.x += cell_shift.x;  //cross through the y-axis side
        } else {
            t2 = t2_side.y;
            next_cell.y += cell_shift.y;  //cross through the x-axis side
        }
        //now t2 is the value of the end point in the current cell (and the same point is the start value in the next cell)

        //  gap cells
        vec2 cell_in_block = fract(vec2(cell) / float(BLOCK_SIZE));
        float gap = float(BLOCK_GAP) / float(BLOCK_SIZE);
        if (cell_in_block.x < gap || cell_in_block.y < gap || (cell_in_block.x < (gap+0.1) && cell_in_block.y < (gap+0.1))) {
            continue;
        }

        //  return to 3d - we have start and end points of the ray segment inside the column (t3s and t3e)
        float t3s = t2s / t3_to_t2;

        //  move through z-cells of the current column in the ray direction (don't need much to check, two nearest cells are enough)
        float pos_z = ro3.z + rd3.z * t3s;
        float xycell_hash = hash(vec2(cell));
        float z_shift = xycell_hash*11. - time * (0.5 + xycell_hash * 1.0 + xycell_hash * xycell_hash * 1.0 + pow(xycell_hash, 16.) * 3.0);  //a different z shift for each xy column
        float char_z_shift = floor(z_shift / STRIP_CHAR_HEIGHT);
        z_shift = char_z_shift * STRIP_CHAR_HEIGHT;
        int zcell = int(floor((pos_z - z_shift)/ZCELL_SIZE));  //z-cell index
        for (int j=0; j<2; j++) {  //2 iterations is enough if camera doesn't look much up or down
            //  calcaulate coordinates of the target (raindrop)
            vec4 cell_hash = hash4(vec3(ivec3(cell, zcell)));
            vec4 cell_hash2 = fract(cell_hash * vec4(127.1, 311.7, 271.9, 124.6));

            float chars_count = cell_hash.w * (STRIP_CHARS_MAX - STRIP_CHARS_MIN) + STRIP_CHARS_MIN;
            float target_length = chars_count * STRIP_CHAR_HEIGHT;
            float target_rad = STRIP_CHAR_WIDTH / 2.;
            float target_z = (float(zcell)*ZCELL_SIZE + z_shift) + cell_hash.z * (ZCELL_SIZE - target_length);
            vec2 target = vec2(cell) * XYCELL_SIZE + target_rad + cell_hash.xy * (XYCELL_SIZE - target_rad*2.);

            //  We have a line segment (t0,t). Now calculate the distance between line segment and cell target (it's easier in 2d)
            vec2 s = target - ro2;
            float tmin = dot(s, rd2);  //tmin - point with minimal distance to target
            if (tmin >= t2s && tmin <= t2) {
                float u = s.x * rd2.y - s.y * rd2.x;  //horizontal coord in the matrix strip
                if (abs(u) < target_rad) {
                    u = (u/target_rad + 1.) / 2.;
                    float z = ro3.z + rd3.z * tmin/t3_to_t2;
                    float v = (z - target_z) / target_length;  //vertical coord in the matrix strip
                    if (v >= 0.0 && v < 1.0) {
                        float c = floor(v * chars_count);  //symbol index relative to the start of the strip, with addition of char_z_shift it becomes an index relative to the whole cell
                        float q = fract(v * chars_count);
                        vec2 char_hash = hash2(vec2(c+char_z_shift, cell_hash2.x));
                        if (char_hash.x >= 0.1 || c == 0.) {  //10% of missed symbols
                            float time_factor = floor(c == 0. ? time*5.0 :  //first symbol is changed fast
                                    time*(1.0*cell_hash2.z +   //strips are changed sometime with different speed
                                            cell_hash2.w*cell_hash2.w*4.*pow(char_hash.y, 4.)));  //some symbols in some strips are changed relatively often
                            float a = random_char(vec2(char_hash.x, time_factor), vec2(u,q), max(1., 3. - c/2.)*0.2);  //alpha
                            a *= clamp((chars_count - 0.5 - c) / 2., 0., 1.);  //tail fade
                            if (a > 0.) {
                                float attenuation = 1. + pow(0.06*tmin/t3_to_t2, 2.);
                                vec3 col = (c == 0. ? vec3(0.67, 1.0, 0.82) : vec3(0.25, 0.80, 0.40)) / attenuation;
                                float a1 = result.a;
                                result.a = a1 + (1. - a1) * a;
                                result.xyz = (result.xyz * a1 + col * (1. - a1) * a) / result.a;
                                if (result.a > 0.98)  return result.xyz;
                            }
                        }
                    }
                }
            }
            // not found in this cell - go to next vertical cell
            zcell += cell_shift.z;
        }
        // go to next horizontal cell
    }
    return result.xyz * result.a;
}

//  ----  main, camera  ----

vec2 rotate(vec2 v, float a) {
    float s = sin(a);
	float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

vec3 rotateX(vec3 v, float a) {
    float s = sin(a);
    float c = cos(a);
    return mat3(1.,0.,0.,0.,c,-s,0.,s,c) * v;
}

vec3 rotateY(vec3 v, float a) {
    float s = sin(a);
    float c = cos(a);
    return mat3(c,0.,-s,0.,1.,0.,s,0.,c) * v;
}

vec3 rotateZ(vec3 v, float a) {
    float s = sin(a);
    float c = cos(a);
    return mat3(c,-s,0.,s,c,0.,0.,0.,1.) * v;
}

float smoothstep1(float x) {
    return smoothstep(0., 1., x);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    if (STRIP_CHAR_WIDTH > XYCELL_SIZE || STRIP_CHAR_HEIGHT * STRIP_CHARS_MAX > ZCELL_SIZE) {
        // error
        fragColor = vec4(1., 0., 0., 1.);
        return;
    }

	  vec2 uv = (fragCoord.xy * 2. - iResolution.xy) / iResolution.y;
    float time = iTime * SPEED;
    const float turn_rad = 0.25 / BLOCKS_BEFORE_TURN;   //0 .. 0.5
    const float turn_abs_time = (PI/2.*turn_rad) * 1.5;  //multiplier different than 1 means a slow down on turns
    const float turn_time = turn_abs_time / (1. - 2.*turn_rad + turn_abs_time);  //0..1, but should be <= 0.5
    float level1_size = float(BLOCK_SIZE) * BLOCKS_BEFORE_TURN * XYCELL_SIZE;
    float level2_size = 4. * level1_size;
    float gap_size = float(BLOCK_GAP) * XYCELL_SIZE;
    vec3 ro = vec3(gap_size/2., gap_size/2., 0.);
    vec3 rd = vec3(uv.x, 2.0, uv.y);
    float tq = fract(time / (level2_size*4.) * WALK_SPEED);  //the whole cycle time counter
    float t8 = fract(tq*4.);  //time counter while walking on one of the four big sides
    float t1 = fract(t8*8.);  //time counter while walking on one of the eight sides of the big side
    vec2 prev;
    vec2 dir;
    if (tq < 0.25) {
        prev = vec2(0.,0.);
        dir = vec2(0.,1.);
    } else if (tq < 0.5) {
        prev = vec2(0.,1.);
        dir = vec2(1.,0.);
    } else if (tq < 0.75) {
        prev = vec2(1.,1.);
        dir = vec2(0.,-1.);
    } else {
        prev = vec2(1.,0.);
        dir = vec2(-1.,0.);
    }
    float angle = floor(tq * 4.);  //0..4 wich means 0..2*PI
    prev *= 4.;
    const float first_turn_look_angle = 0.4;
    const float second_turn_drift_angle = 0.5;
    const float fifth_turn_drift_angle = 0.25;
    vec2 turn;
    float turn_sign = 0.;
    vec2 dirL = rotate(dir, -PI/2.);
    vec2 dirR = -dirL;
    float up_down = 0.;
    float rotate_on_turns = 1.;
    float roll_on_turns = 1.;
    float add_angel = 0.;
    if (t8 < 0.125) {
        turn = dirL;
        //dir = dir;
        turn_sign = -1.;
        angle -= first_turn_look_angle * (max(0., t1 - (1. - turn_time*2.)) / turn_time - max(0., t1 - (1. - turn_time)) / turn_time * 2.5);
        roll_on_turns = 0.;
    } else if (t8 < 0.250) {
        prev += dir;
        turn = dir;
        dir = dirL;
        angle -= 1.;
        turn_sign = 1.;
        add_angel += first_turn_look_angle*0.5 + (-first_turn_look_angle*0.5+1.0+second_turn_drift_angle)*t1;
        rotate_on_turns = 0.;
        roll_on_turns = 0.;
    } else if (t8 < 0.375) {
        prev += dir + dirL;
        turn = dirR;
        //dir = dir;
        turn_sign = 1.;
        add_angel += second_turn_drift_angle*sqrt(1.-t1);
        //roll_on_turns = 0.;
    } else if (t8 < 0.5) {
        prev += dir + dir + dirL;
        turn = dirR;
        dir = dirR;
        angle += 1.;
        turn_sign = 0.;
        up_down = sin(t1*PI) * 0.37;
    } else if (t8 < 0.625) {
        prev += dir + dir;
        turn = dir;
        dir = dirR;
        angle += 1.;
        turn_sign = -1.;
        up_down = sin(-min(1., t1/(1.-turn_time))*PI) * 0.37;
    } else if (t8 < 0.750) {
        prev += dir + dir + dirR;
        turn = dirL;
        //dir = dir;
        turn_sign = -1.;
        add_angel -= (fifth_turn_drift_angle + 1.) * smoothstep1(t1);
        rotate_on_turns = 0.;
        roll_on_turns = 0.;
    } else if (t8 < 0.875) {
        prev += dir + dir + dir + dirR;
        turn = dir;
        dir = dirL;
        angle -= 1.;
        turn_sign = 1.;
        add_angel -= fifth_turn_drift_angle - smoothstep1(t1) * (fifth_turn_drift_angle * 2. + 1.);
        rotate_on_turns = 0.;
        roll_on_turns = 0.;
    } else {
        prev += dir + dir + dir;
        turn = dirR;
        //dir = dir;
        turn_sign = 1.;
        angle += fifth_turn_drift_angle * (1.5*min(1., (1.-t1)/turn_time) - 0.5*smoothstep1(1. - min(1.,t1/(1.-turn_time))));
    }

    if (iMouse.x > 10. || iMouse.y > 10.) {
        vec2 mouse = iMouse.xy / iResolution.xy * 2. - 1.;
        up_down = -0.7 * mouse.y;
        angle += mouse.x;
        rotate_on_turns = 1.;
        roll_on_turns = 0.;
    } else {
        angle += add_angel;
    }
    rd = rotateX(rd, up_down);
    vec2 p;
    if (turn_sign == 0.) {
        //  move forward
        p = prev + dir * (turn_rad + 1. * t1);
    }
    else if (t1 > (1. - turn_time)) {
        //  turn
        float tr = (t1 - (1. - turn_time)) / turn_time;
        vec2 c = prev + dir * (1. - turn_rad) + turn * turn_rad;
        p = c + turn_rad * rotate(dir, (tr - 1.) * turn_sign * PI/2.);
        angle += tr * turn_sign * rotate_on_turns;
        rd = rotateY(rd, sin(tr*turn_sign*PI) * 0.2 * roll_on_turns);  //roll
    }  else  {
        //  move forward
        t1 /= (1. - turn_time);
        p = prev + dir * (turn_rad + (1. - turn_rad*2.) * t1);
    }
    rd = rotateZ(rd, angle * PI/2.);
    ro.xy += level1_size * p;
    ro += rd * 0.2;
    rd = normalize(rd);
    vec3 col = rain(ro, rd, time);
    fragColor = vec4(col, 1.);
}
        `,
  },
  {
    title: "Tiles",
    author: "Johnrobmiller",
    originalURL: "https://www.shadertoy.com/view/mdBSRt",
    value: ` 

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float aspect_ratio = iResolution.y/iResolution.x;
	  vec2 uv = fragCoord.xy / iResolution.x;
    uv -= vec2(0.5, 0.5 * aspect_ratio);
    float rot = radians(-30. -iTime); // radians(45.0*sin(iTime));
    mat2 rotation_matrix = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
   	uv = rotation_matrix * uv;
    vec2 scaled_uv = 20.0 * uv; 
    vec2 tile = fract(scaled_uv);
    float tile_dist = min(min(tile.x, 1.0-tile.x), min(tile.y, 1.0-tile.y));
    float square_dist = length(floor(scaled_uv));
    float edge = sin(iTime-square_dist*20.);
    edge = mod(edge * edge, edge / edge);
    float value = mix(tile_dist, 1.0-tile_dist, step(1.0, edge));
    edge = pow(abs(1.0-edge), 2.2) * 0.5;
    value = smoothstep( edge-0.05, edge, 0.95*value);
    value += square_dist*.1;
    value *= 0.8 - 0.2;
    fragColor = vec4(pow(value, 2.), pow(value, 1.5), pow(value, 1.2), 1.);
}
  `,
  },
  {
    title: "Dance floor",
    author: "Nrx",
    originalURL: "https://www.shadertoy.com/view/lsBXDW",
    value: ` 
  
vec3 hsv2rgb (in vec3 hsv) {
	hsv.yz = clamp (hsv.yz, 0.0, 1.0);
	return hsv.z * (1.0 + 0.5 * hsv.y * (cos (2.0 * 3.14159 * (hsv.x + vec3 (0.0, 2.0 / 3.0, 1.0 / 3.0))) - 1.0));
}

float rand (in vec2 seed) {
	return fract (sin (dot (seed, vec2 (12.9898, 78.233))) * 137.5453);
}

void mainImage (out vec4 fragColor, in vec2 fragCoord) {
	vec2 frag = (2.0 * fragCoord.xy - iResolution.xy) / iResolution.y;
	frag *= 1.0 - 0.2 * cos (frag.yx) * sin (3.14159 * 0.5 * texture (iChannel0, vec2 (0.0)).x);
	frag *= 5.0;
	float random = rand (floor (frag));
	vec2 black = smoothstep (1.0, 0.8, cos (frag * 3.14159 * 2.0));
	vec3 color = hsv2rgb (vec3 (random, 1.0, 1.0));
	color *= black.x * black.y * smoothstep (1.0, 0.0, length (fract (frag) - 0.5));
	color *= 0.5 + 0.5 * cos (random + random * iTime + iTime + 3.14159 * 0.5 * texture (iChannel0, vec2 (0.7)).x);
	fragColor = vec4 (color, 1.0);
}
  `,
  },
  {
    title: "Sincos 3d",
    author: "ChunderFPV",
    originalURL: "https://www.shadertoy.com/view/XfXGz4",
    value: ` 


#define A(v) mat2(cos(m.v+radians(vec4(0, -90, 90, 0))))  // rotate
#define W(v) length(vec3(p.yz-v(p.x+vec2(0, pi_2)+t), 0))-lt  // wave
//#define W(v) length(p-vec3(round(p.x*pi)/pi, v(t+p.x), v(t+pi_2+p.x)))-lt  // alt wave
#define P(v) length(p-vec3(0, v(t), v(t+pi_2)))-pt  // point

void mainImage( out vec4 C, in vec2 U )
{
    float lt = .1, // line thickness
          pt = .3, // point thickness
          pi = 3.1416,
          pi2 = pi*2.,
          pi_2 = pi/2.,
          t = iTime*pi,
          s = 1., d = 0., i = d;
    
    vec2 R = iResolution.xy,
         m = (iMouse.xy-.5*R)/R.y*4.;
    
    vec3 o = vec3(0, 0, -7), // cam
         u = normalize(vec3((U-.5*R)/R.y, 1)),
         c = vec3(0), k = c, p;
    
    if (iMouse.z < 1.) m = -vec2(t/20.-pi_2, 0); // move when not clicking
    mat2 v = A(y), h = A(x); // pitch & yaw
    
    for (; i++<50.;) // raymarch
    {
        p = o+u*d;
        p.yz *= v;
        p.xz *= h;
        p.x -= 3.; // slide objects to the right a bit
        if (p.y < -1.5) p.y = 2./p.y; // reflect into neg y
        k.x = min( max(p.x+lt, W(sin)), P(sin) ); // sine wave
        k.y = min( max(p.x+lt, W(cos)), P(cos) ); // cosine wave
        s = min(s, min(k.x, k.y)); // blend
        if (s < .001 || d > 100.) break; // limits
        d += s*.5;
    }
    
    // add and color scene
    c = max(cos(d*pi2) - s*sqrt(d) - k, 0.);
    c.gb += .1;
    C = vec4(c*.4 + c.brg*.6 + c*c, 1);
}
  `,
  },
  {
    title: "Fireworks",
    author: "ilyaev",
    originalURL: "https://www.shadertoy.com/view/wslcWN",
    value: ` 

#define SPARKS 30
#define FIREWORKS 8.
#define BASE_PAUSE FIREWORKS / 30.
#define PI 3.14
#define PI2 6.28

float n21(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec2 randomSpark(float noise) {
    vec2 v0 = vec2((noise - .5) * 13., (fract(noise * 123.) - .5) * 15.);
    return v0;
}

vec2 circularSpark(float i, float noiseId, float noiseSpark) {
    noiseId = fract(noiseId * 7897654.45);
    float a = (PI2 / float(SPARKS)) * i;
    float speed = 10.*clamp(noiseId, .7, 1.);
    float x = sin(a + iTime*((noiseId-.5)*3.));
    float y = cos(a + iTime*(fract(noiseId*4567.332) - .5)*2.);
    vec2 v0 = vec2(x, y) * speed;
    return v0;
}

vec2 rocket(vec2 start, float t) {
    float y = t;
    float x = sin(y*10.+cos(t*3.))*.1;
    vec2 p = start + vec2(x, y * 8.);
    return p;
}
vec3 firework(vec2 uv, float index, float pauseTime) {
    vec3 col = vec3(0.);
    float timeScale = 1.;
    vec2 gravity = vec2(0., -9.8);
    float explodeTime = .9;
    float rocketTime = 1.1;
    float episodeTime = rocketTime + explodeTime + pauseTime;
    float ratio = iResolution.x / iResolution.y;
    float timeScaled = (iTime - pauseTime) / timeScale;
    float id = floor(timeScaled / episodeTime);
    float et = mod(timeScaled, episodeTime);
    float noiseId = n21(vec2(id+1., index+1.));
    float scale = clamp(fract(noiseId*567.53)*30., 10., 30.);
    uv *= scale;
    rocketTime -= (fract(noiseId*1234.543) * .5);
    vec2 pRocket = rocket(vec2(0. + ((noiseId - .5)*scale*ratio), 0. - scale/2.), clamp(et, 0., rocketTime));
    if (et < rocketTime) {
        float rd = length(uv - pRocket);
        col += pow(.05/rd , 1.9) * vec3(0.9, .3, .0);
    }

    if (et > rocketTime && et < (rocketTime + explodeTime)) {
        float burst = sign(fract(noiseId*44432.22) - .6);
        for(int i = 0 ; i < SPARKS ; i++) {
                vec2 center = pRocket;
                float fi = float(i);
                float noiseSpark = fract(n21(vec2(id*10.+index*20., float(i+1))) * 332.44);
                float t = et - rocketTime;
                vec2 v0;
                if (fract(noiseId*3532.33) > .5) {
                    v0 = randomSpark(noiseSpark);
                    t -= noiseSpark * (fract(noiseId*543.) * .2);
                } else {
                    v0 = circularSpark(fi, noiseId, noiseSpark);
                    if ( (fract(noiseId*973.22) - .5) > 0.) {
                        float re = mod(fi, 4. + 10. * noiseId);
                        t -= floor(re/2.) * burst * .1;
                    } else {
                        t -= mod(fi, 2.) == 0. ? 0. : burst * .5*clamp(noiseId, .3, 1.);
                    }
                }
                vec2 s = v0*t + (gravity * t * t) / 2.;
                vec2 p = center + s;
                float d = length(uv - p);
                if (t > 0.) {
                    float fade = clamp((1. - t/explodeTime), 0., 1.);
                    vec3 sparkColor = vec3(noiseId*.9, .5*fract(noiseId *456.33), .5*fract(noiseId *1456.33));
                    vec3 c = (.05 / d) * sparkColor;
                    col += c * fade;
                }
            }
    }
    return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoords) {
    vec2 uv = fragCoords.xy / iResolution.xy;
    uv -= .5;
    uv.x *= iResolution.x / iResolution.y;
    vec3 col = vec3(0.);
    for (float i = 0. ; i < FIREWORKS ; i += 1.) {
        col += firework(uv, i + 1., (i * BASE_PAUSE));
    }
    fragColor = vec4(col, 1.);
}
  `,
  },
  {
    title: "Party Concert Visuals",
    author: "Blackle Mori",
    originalURL: "https://www.shadertoy.com/view/WtscW4",
    value: ` 

float comp (vec3 p) {
    p = asin(sin(p)*.9);
    return length(p)-1.;
}

vec3 erot(vec3 p, vec3 ax, float ro) {
    return mix(dot(p,ax)*ax,p,cos(ro))+sin(ro)*cross(ax,p);
}

float smin(float a, float b, float k) {
    float h = max(0.,k-abs(b-a))/k;
    return min(a,b)-h*h*h*k/6.;
}

vec4 wrot(vec4 p) {
    return vec4(dot(p,vec4(1)), p.yzw + p.zwy - p.wyz - p.xxx)/2.;
}

float d1, d2, d3;
float t;
float lazors, doodad;
vec3 p2;
float bpm = 125.;
float scene(vec3 p) {
    p2 = erot(p, vec3(0,1,0), t);
    p2 = erot(p2, vec3(0,0,1), t/3.);
    p2 = erot(p2, vec3(1,0,0), t/5.);
    float bpt = iTime/60.*bpm;
        vec4 p4 = vec4(p2,0);
        p4=mix(p4,wrot(p4),smoothstep(-.5,.5,sin(bpt/4.)));
        p4 =abs(p4);
        p4=mix(p4,wrot(p4),smoothstep(-.5,.5,sin(bpt)));
    float fctr = smoothstep(-.5,.5,sin(bpt/2.));
    float fctr2 = smoothstep(.9,1.,sin(bpt/16.));
    doodad = length(max(abs(p4)-mix(0.05,0.07,fctr),0.)+mix(-0.1,.2,fctr))-mix(.15,.55,fctr*fctr)+fctr2;
    /*
        vec4 p4 = vec4(p2,0);
        p4=wrot(p4);
        p4 = abs(p4);
        p4=mix(p4,wrot(p4),smoothstep(-.5,.5,sin(t)));
        doodad = length(max(abs(p4)-0.07,0)+0.2)-.55;
    }*/
    p.x += asin(sin(t/80.)*.99)*80.;
    lazors = length(asin(sin(erot(p,vec3(1,0,0),t*.2).yz*.5+1.))/.5)-.1;
    d1 = comp(p);
    d2 = comp(erot(p+5., normalize(vec3(1,3,4)),0.4));
    d3 = comp(erot(p+10., normalize(vec3(3,2,1)),1.));
    return min(doodad,min(lazors,.3-smin(smin(d1,d2,0.05),d3,0.05)));
}

vec3 norm(vec3 p) {
    float precis = length(p) < 1. ? 0.005 : 0.01;
    mat3 k = mat3(p,p,p)-mat3(precis);
    return normalize(scene(p)-vec3(scene(k[0]),scene(k[1]),scene(k[2])));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    float bpt = iTime/60.*bpm;
    float bp = mix(pow(sin(fract(bpt)*3.14/2.),20.)+floor(bpt), bpt,0.4);
    t = bp;
	  vec3 cam = normalize(vec3(.8+sin(bp*3.14/4.)*.3,uv));
    vec3 init = vec3(-1.5+sin(bp*3.14)*.2,0,0)+cam*.2;
    init = erot(init,vec3(0,1,0),sin(bp*.2)*.4);
    init = erot(init,vec3(0,0,1),cos(bp*.2)*.4);
    cam = erot(cam,vec3(0,1,0),sin(bp*.2)*.4);
    cam = erot(cam,vec3(0,0,1),cos(bp*.2)*.4);
    vec3 p = init;
    bool hit = false;
    float atten = 1.;
    float tlen = 0.;
    float glo = 0.;
    float dist;
    float fog = 0.;
    float dlglo = 0.;
    bool trg = false;
    for (int i = 0; i <80 && !hit; i++) {
        dist = scene(p);
        hit = dist*dist < 1e-6;
        glo += .2/(1.+lazors*lazors*20.)*atten;
        dlglo += .2/(1.+doodad*doodad*20.)*atten;
        if (hit && ((sin(d3*45.)<-0.4 && (dist!=doodad )) || (dist==doodad && sin(pow(length(p2*p2*p2),.3)*120.)>.4 )) && dist != lazors) {
            trg = trg || dist==doodad;
            hit = false;
            vec3 n = norm(p);
            atten *= 1.-abs(dot(cam,n))*.98;
            cam = reflect(cam,n);
            dist = .1;
        }
        p += cam*dist;
        tlen += dist;
        fog += dist*atten/30.;
    }
    fog = smoothstep(0.,1.,fog);
    bool lz = lazors == dist;
    bool dl = doodad == dist;
    vec3 fogcol = mix(vec3(0.5,0.8,1.2), vec3(0.4,0.6,0.9), length(uv));
    vec3 n = norm(p);
    vec3 r = reflect(cam,n);
    float ss = smoothstep(-.3,0.3,scene(p+vec3(.3)))+.5;
    float fact = length(sin(r*(dl?4.:3.))*.5+.5)/sqrt(3.)*.7+.3;
    vec3 matcol = mix(vec3(0.9,0.4,0.3), vec3(0.3,0.4,0.8), smoothstep(-1.,1.,sin(d1*5.+iTime*2.)));
    matcol = mix(matcol, vec3(0.5,0.4,1.0), smoothstep(0.,1.,sin(d2*5.+iTime*2.)));
    if (dl) matcol = mix(vec3(1),matcol,0.1)*.2+0.1;
    vec3 col = matcol*fact*ss + pow(fact,10.);
    if (lz) col = vec3(4);
    fragColor.xyz = col*atten + glo*glo + fogcol*glo;
    fragColor.xyz = mix(fragColor.xyz, fogcol, fog);
    if(!dl)fragColor.xyz = abs(erot(fragColor.xyz, normalize(sin(p*2.)),0.2*(1.-fog)));
    if(!trg&&!dl)fragColor.xyz+=dlglo*dlglo*.1*vec3(0.4,0.6,0.9);
    fragColor.xyz = sqrt(fragColor.xyz);
    fragColor.xyz = smoothstep(vec3(0),vec3(1.2),fragColor.xyz);
    fragColor.a = 1.0;
}

  `,
  },
]
export const __FramerMetadata__ = {
  exports: {
    mainFunction: { type: "variable", annotations: { framerContractVersion: "1" } },
    vertexShaderSource: { type: "variable", annotations: { framerContractVersion: "1" } },
    shaderInputs: { type: "variable", annotations: { framerContractVersion: "1" } },
    fragmentShaderSource: { type: "variable", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
}
//# sourceMappingURL=./ShaderSource.map
