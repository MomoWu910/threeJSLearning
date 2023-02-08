/**
 * 不動的光暈
 * 太陽球
 * 傳貼圖到shader
 * 波浪 兩種
 */

const shader4_2 = {
    vertexShader: `
        varying vec3 vertexNormal;
        varying vec2 vUv;
        void main()	{
            vUv = uv;
            vertexNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec3 vertexNormal;
        uniform sampler2D textureSun;
        varying vec2 vUv;
        void main()	{
            float intensity = 1.05 - dot(vertexNormal, vec3(0.,0.,1.));
    		vec3 atmosphere = vec3(.8, .5, .2) * intensity;
            gl_FragColor = vec4(atmosphere,0.) + texture2D(textureSun, vUv);
        }
    `
};

const shader4_2_2 = {
    vertexShader: `
        uniform float time;
        varying vec2 vUv;
        void main(){
            vUv = uv;
            float x = position.x;
            float y = position.y;
            float PI = 3.141592653589;

            float sz = 0.0;
            float ti = 0.06;
            float index = 1.0;
            vec2 dir;//波的方向
            //四条正弦波相加
            for(int i = 0;i<4;i++){
                ti = ti + 0.0005;
                index = index + 0.1;
                if(mod(index,2.0)==0.0){
                    dir = vec2(1.0,ti);
                }else{
                    dir = vec2(-1.0,ti);
                }
                float l1 = 50.0 * PI / (0.5);//波长
                float s1 = 50.0 * 2.0 / l1;//速度
                float z1 = 10.0 * sin(dot(normalize(dir),vec2(x,y)) * l1 + time * s1);//正弦波方程式
                sz +=z1;
            }
            gl_Position = projectionMatrix * modelViewMatrix * vec4(x,y,sin(sz) * 5.0,1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D textureSun;
        varying vec2 vUv;
        void main(){
            gl_FragColor = vec4(90./255.,160./255.,248./255.,1.0)*0.5 + texture2D(textureSun, vUv);      
        }
    `
};

export { shader4_2, shader4_2_2 };
// gl_FragColor=vec4(atmosphere,0.) + vec4(0.5, 0.2, 0., 1.);