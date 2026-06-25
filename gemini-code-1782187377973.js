async function loadShaderSource( url ) {
    const response = await fetch( url );
    if ( !response.ok ) {
        console.error( "Failed to download shader file from " + url );
    }
    return await response.text();
}

async function initializeSimulation() {
    const canvas = document.getElementById( "simulationCanvas" );
    const gl = canvas.getContext( "webgl2" );

    if ( !gl ) {
        console.error( "WebGL 2 not supported in this browser" );
        return;
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport( 0, 0, canvas.width, canvas.height );
    }

    window.addEventListener( "resize", resizeCanvas );
    resizeCanvas();

    const vertexShaderSource = await loadShaderSource( "shader.vert" );
    const fragmentShaderSource = await loadShaderSource( "shader.frag" );

    function createShader( gl, type, source ) {
        const shader = gl.createShader( type );
        gl.shaderSource( shader, source );
        gl.compileShader( shader );
        if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
            console.error( gl.getShaderInfoLog( shader ) );
            gl.deleteShader( shader );
            return null;
        }
        return shader;
    }

    const vertexShader = createShader( gl, gl.VERTEX_SHADER, vertexShaderSource );
    const fragmentShader = createShader( gl, gl.FRAGMENT_SHADER, fragmentShaderSource );

    const program = gl.createProgram();
    gl.attachShader( program, vertexShader );
    gl.attachShader( program, fragmentShader );
    gl.linkProgram( program );

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
        console.error( gl.getProgramInfoLog( program ) );
        return;
    }

    const vertices = new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    const positionAttributeLocation = gl.getAttribLocation( program, "position" );
    gl.enableVertexAttribArray( positionAttributeLocation );
    gl.vertexAttribPointer( positionAttributeLocation, 2, gl.FLOAT, false, 0, 0 );

    gl.useProgram( program );

    function renderLoop() {
        gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
        gl.clear( gl.COLOR_BUFFER_BIT );

        gl.drawArrays( gl.TRIANGLES, 0, 6 );

        requestAnimationFrame( renderLoop );
    }

    requestAnimationFrame( renderLoop );
}

initializeSimulation();