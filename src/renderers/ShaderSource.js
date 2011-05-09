// File generated with src/shaders/buildShaders.py. Do not edit //

J3D.ShaderSource = {};

J3D.ShaderSource.CommonInclude = [
	"#ifdef GL_ES",
	"precision highp float;",
	"#endif",

	"struct lightSource {",
	"int type;",
	"vec3 direction;",
	"vec3 color;",
	"vec3 position;",
	"};",

	"uniform lightSource uLight[4];",

	"float luminance(vec3 c) {",
	"return c.r * 0.299 + c.g * 0.587 + c.b * 0.114;",
	"}",

	"float brightness(vec3 c) {",
	"return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;",
	"}",

	"vec3 computeLight(vec4 p, vec3 n, float si, float sh, lightSource light){",
	"vec3 ld;",

	"if(light.type == 0) return vec3(0);",
	"else if(light.type == 1) ld = light.direction;",
	"else if(light.type == 2) ld = normalize(light.position - p.xyz);",
	"float dif = max(dot(n, ld), 0.0);",

	"float spec = 0.0;",

	"if(si > 0.0) {",
	"vec3 eyed = normalize(-p.xyz);",
	"vec3 refd = reflect(-ld, n);",
	"spec = pow(max(dot(refd, eyed), 0.0), sh) * si;",
	"};",

	"return light.color * dif + light.color * spec;",
	"}",

	"vec3 computeLights(vec4 p, vec3 n, float si, float sh) {",
	"vec3 s = computeLight(p, n, si, sh, uLight[0]);",
	"s += computeLight(p, n, si, sh, uLight[1]);",
	"s += computeLight(p, n, si, sh, uLight[2]);",
	"s += computeLight(p, n, si, sh, uLight[3]);",
	"return s;",
	"}",

""].join("\n");

J3D.ShaderSource.GouraudVertex = [
	"uniform vec3 uAmbientColor;",

	"uniform float uSpecularIntensity;",
	"uniform float uShininess;",

	"varying vec3 vLight;",
	"varying vec2 vTextureCoord;",

	"void main(void) {",
	"vec4 p = uMVMatrix * vec4(aVertexPosition, 1.0);",
	"gl_Position = projMat * p;",

	"vTextureCoord = aTextureCoord;",

	"vec3 n = normalize( uNMatrix * aVertexNormal );",
	"vLight = uAmbientColor + computeLights(p, n, uSpecularIntensity, uShininess);",
	"}",

""].join("\n");

J3D.ShaderSource.GouraudFragment = [
	"uniform vec4 uColor;",
	"uniform sampler2D uColorSampler;",
	"uniform bool uHasColorSampler;",

	"varying vec3 vLight;",
	"varying vec2 vTextureCoord;",

	"void main(void) {",
	"vec4 tc = uColor.rgba;",
	"if(uHasColorSampler) tc *= texture2D(uColorSampler, vTextureCoord);",
	"gl_FragColor = vec4(tc.rgb * vLight, uColor.a);",
	"}",
""].join("\n");

J3D.ShaderSource.Normal2ColorVertex = [
	"varying vec3 vColor;",

	"void main(void) {",
	"gl_Position = projMat *  uMVMatrix * vec4(aVertexPosition, 1.0);",
	"vColor = normalize( uNMatrix * aVertexNormal );",
	"}",

""].join("\n");

J3D.ShaderSource.Normal2ColorFragment = [
	"varying vec3 vColor;",

	"void main(void) {",
	"gl_FragColor = vec4(vColor, 1.0);",
	"}",
""].join("\n");

J3D.ShaderSource.PhongVertex = [
	"varying vec4 vPosition;",
	"varying vec3 vLight;",
	"varying vec2 vTextureCoord;",
	"varying vec3 vNormal;",

	"void main(void) {",
	"vTextureCoord = aTextureCoord;",
	"vNormal = uNMatrix * aVertexNormal;",
	"vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);",
	"gl_Position = projMat * vPosition;",
	"}",

""].join("\n");

J3D.ShaderSource.PhongFragment = [
	"uniform vec4 uColor;",
	"uniform sampler2D uColorSampler;",
	"uniform bool uHasColorSampler;",

	"uniform vec3 uAmbientColor;",
	"uniform float uSpecularIntensity;",
	"uniform float uShininess;",

	"varying vec4 vPosition;",
	"varying vec3 vLight;",
	"varying vec2 vTextureCoord;",
	"varying vec3 vNormal;",

	"void main(void) {",
	"vec4 tc = uColor.rgba;",
	"if(uHasColorSampler) tc *= texture2D(uColorSampler, vTextureCoord);",

	"float lum = brightness(tc.rgb);",
	"vec3 l = uAmbientColor + computeLights(vPosition, vNormal, uSpecularIntensity, uShininess) * lum;",

	"gl_FragColor = vec4(tc.rgb * l, uColor.a);",
	"}",
""].join("\n");

J3D.ShaderSource.VertexInclude = [
	"attribute vec3 aVertexPosition;",
	"attribute vec3 aVertexNormal;",
	"attribute vec2 aTextureCoord;",

	"uniform mat4 uMVMatrix;",
	"uniform mat4 projMat;",
	"uniform mat3 uNMatrix;",
""].join("\n");
