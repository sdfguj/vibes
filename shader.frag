#version 300 es

precision mediump float;
uniform float u_time;
void main() {
float red = 0.5 + 0.5 * sin(u_time * 2.0);
float green = 0.5 + 0.5 * sin(u_time * 3.0);
float blue = 0.5 + 0.5 * cos(u_time * 1.5);
gl_FragColor = vec4(red, green, blue, 1.0);
}