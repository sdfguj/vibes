const canvas = document.getElementById("simulationCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("WebGL not supported");
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

const fsSource = `
      precision mediump float;
      uniform float u_time;
      void main() {
        float red = 0.5 + 0.5 * sin(u_time * 2.0);
        float green = 0.5 + 0.5 * sin(u_time * 3.0);
        float blue = 0.5 + 0.5 * cos(u_time * 1.5);
        gl_FragColor = vec4(red, green, blue, 1.0);
      }
    `;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positions = new Float32Array([-1.0, -1.0,
    1.0, -1.0, -1.0, 1.0, -1.0, 1.0,
    1.0, -1.0,
    1.0, 1.0,
]);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const timeLocation = gl.getUniformLocation(program, "u_time");
const startTime = performance.now();

function render() {
    const currentTime = performance.now();
    const elapsedTimeInSeconds = (currentTime - startTime) / 1000.0;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(timeLocation, elapsedTimeInSeconds);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);