#version 300 es
            precision highp float;
            uniform float u_time;
            in vec2 vUv;
            out vec4 fragColor;
            void main() {
                fragColor = vec4(vUv.x, vUv.y, 0.5*sin(u_time*0.002), 1.0);
            }
