// #version 300 es
varying vec2 vUv;

uniform float aRandom2;

// vec2 uv;
// uniform vec3 position;
// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;

void main()
{
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += aRandom2 * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    
}