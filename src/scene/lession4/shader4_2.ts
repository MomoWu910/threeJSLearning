const shader4_2 = {
    vertexShader: `
        varying vec3 vertexNormal;
        void main()	{
            vertexNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec3 vertexNormal;
        void main()	{
            float intensity = 1.05 - dot(vertexNormal, vec3(0.,0.,1.));
    		vec3 atmosphere = vec3(.3, .6, 1.) * intensity;
    		gl_FragColor=vec4(atmosphere,0.) + vec4(0.,0.,0.2,1.);
        }
    `
};

export { shader4_2 };