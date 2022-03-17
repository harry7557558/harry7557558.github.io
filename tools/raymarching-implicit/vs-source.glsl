#version 300 es
precision highp float;

in vec4 vertexPosition;
out vec2 vXy;


void main(void) {
    vXy = vertexPosition.xy;
    gl_Position = vertexPosition;
}
