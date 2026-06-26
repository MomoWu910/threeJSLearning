/**
 * 不動的光暈
 * 太陽球
 * 傳貼圖到shader
 * 波浪 兩種
 */

// 光暈
const shader4_2_1 = {
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
        uniform float uTime;
        varying vec3 vertexNormal;
        uniform sampler2D texture2;
        varying vec2 vUv;
        void main()	{
            float intensity = 1.05 - dot(vertexNormal, vec3(0.,0.,1.));
    		vec3 atmosphere = vec3(.8, .5, .2) * intensity;
            gl_FragColor = vec4(atmosphere,0.) + texture2D(texture2, vUv);
            // gl_FragColor=vec4(atmosphere,0.) + vec4(0.5, 0.2, 0., 1.);
        }
    `
};


// 岩漿波浪
const shader4_2_2 = {
    vertexShader: `
        uniform float uTime;
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
                float z1 = 10.0 * sin(dot(normalize(dir),vec2(x,y)) * l1 + uTime * s1);//正弦波方程式
                sz +=z1;
            }
            gl_Position = projectionMatrix * modelViewMatrix * vec4(x,y,sin(sz) * 5.0,1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D texture2;
        varying vec2 vUv;
        void main(){
            gl_FragColor = vec4(190./255.,100./255.,100./255.,1.0)*0.5 + texture2D(texture2, vUv);      
        }
    `
};


// 岩漿波浪+Noise
const shader4_2_3 = {
    vertexShader: `
        uniform float uTime;
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
                float s1 = 10.0 * 2.0 / l1;//速度
                float z1 = 10.0 * sin(dot(normalize(dir),vec2(x,y)) * l1 + uTime * s1);//正弦波方程式
                sz +=z1;
            }
            gl_Position = projectionMatrix * modelViewMatrix * vec4(x,y,sin(sz) * 5.0,1.0);
            // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    fragmentShader: `
    
        uniform float uTime;
        uniform float fogDensity;
        uniform vec3 fogColor;
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform vec2 uResolution;
        varying vec2 vUv;

        void main() {
            vec2 position = - 1.0 + 2.0 * vUv;

            vec4 noise = texture2D( texture1, vUv );
            vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * uTime * 0.02;
            vec2 T2 = vUv + vec2( - 0.5, 2.0 ) * uTime * 0.01;
      
            T1.x += noise.x * 2.0;
            T1.y += noise.y * 2.0;
            T2.x -= noise.y * 0.2;
            T2.y += noise.z * 0.2;
      
            float p = texture2D( texture1, T1 * 2.0 ).a;
      
            vec4 color = texture2D( texture2, T2 * 2.0 );
            vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );
      
            if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
            if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
            if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }
      
            gl_FragColor = temp;
      
            float depth = gl_FragCoord.z / gl_FragCoord.w;
            const float LOG2 = 1.442695;
            float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
            fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );
      
            gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
        }
    `
};

export { shader4_2_1, shader4_2_2, shader4_2_3 };