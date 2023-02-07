// 光暈的故事
/**
 * tip
 * 1.varying: 
 *  vertex shader可以將錨點資料（例如位置、UV、法線）傳送給fragment shader
 *  如果fragment shader要「接住」來自vertex shader的變數，
 *  仍需要在fragment shader宣告同樣名字的變數
 * 2.vertexNormal的數值來自normal，而normal則不知道來自何方
 *  當shader在編譯時，早就被偷偷宣告變數了
 *  https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
 *  vertexNormal最源頭，是從three.js中的SphereGeometry 來的。
 * 3.helper
 * 4.dot() 
 *  是計算兩個向量有多相近。兩向量越是相近，越是趨近於1。最終如果是同方向，那就是1。
 *  相反的，如果兩個向量越是相反，則越趨近-1，如果完全相反，那就是-1
 *  內積
 *  俯視球，拆分法向量，看Z座標，加上1.05，形成光暈
 * 5.顏色的來源
 *  atmosphere 就是藍色（vec3(.3, .6, 1.) ）乘上像素的亮度，
 *  使得藍色在球體最靠近鏡頭的地方黯淡，而在球體靠近邊界的地方明亮
 *  再加上球體本身的顏色
 *  就可以計算出每顆像素最終的顏色。所以最後一行正是在疊加顏色。
 */

/**
 * todo
 *  1. mod() 做出階梯感
 *       vec3 atmosphere = vec3(.6, .4, 0.) * mod(intensity, 0.1) * 5.; 
 *                                                          // <= 使用mod限制範圍
 *      + vec4(0.,0.,0.2,1.); -> + vec4(0.8,0.6,0.1,1.);
 * 
 *  2.pow() 產生指數變化
 *      vec3 atmosphere = vec3(.3, .6, 1.) * pow(intensity,2.);
 *  3.sin() 前後對稱 限制數值由-1到1
 *      vec3 atmosphere = vec3(.3, .6, 1.) * sin(intensity);
 * 
 *      1.05 -> 1.5
 *      + vec4(0.,0.,0.2,1.); -> + vec4(0.2,0.2,0.4,1.);
 *  3-1.放大sin()的變化 
 *      * sin(intensity*20.);
 *  4.ceil() 柔和漸層感
 *      1.05 -> 1.45
 *      * ceil(intensity*10.)/10.;
 *      + vec4(0.,0.,0.2,1.); -> + vec4(0.2,0.2,0.4,1.);
 */

const shader4_1 = {
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

export { shader4_1 };