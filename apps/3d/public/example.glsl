#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec2 mt = u_mouse/u_resolution;
	gl_FragColor = vec4(tan((sin(u_time))*st.x/mt.y/mt.x),(st.y/mt.y*mt.x),(sin(u_time*st.y/mt.x*mt.y)),1.0);
}