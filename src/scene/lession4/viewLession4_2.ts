import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js'
import Stats from 'three/examples/jsm/libs/stats.module';
import * as THREE from 'three';

const stoneTexture = '../../res/texture/stone.png';
const stoneNTexture = '../../res/texture/stoneN.png';
const sunTexture = '../../res/texture/sunMap.jpeg';
const cloudTexture = '../../res/texture/cloud.png';
const lavaTexture = '../../res/texture/lavatile.jpg';

import { shader4_2_1, shader4_2_2, shader4_2_3 } from './shader4_2';

export default class ViewLession4_2 {
	//#region 宣告變數
	private scene: any;
	private camera: any;
	private renderer: any;
	private controls: any;
	private axeHelper: any;
	private gridHelper: any;
	private stats: any;

	private sphere: any;
	private spotLight: any;
	private spotLightHelper: any;
	private directLight: any;

	private lightSpeed: number = 5;
	private rotateAngle: number = 0.01;
	private normalScale: number = 1;
	private angle: number = 0;
	private clock = new THREE.Clock();

	private t_uniforms: any = {};
	private shaderMesh: any;
	//#endregion

	constructor() {
		this.initScene();
		this.initShader();
		this.initLight();
		this.initMesh();
		this.initShaderMesh();
		this.render();
	}

	private initScene() {
		this.scene = new THREE.Scene();
		// this.camera = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, 0.1, 10000); // 正交
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000); // 透視
		this.renderer = new THREE.WebGL1Renderer({
			antialias: true,
			canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
		});

		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.camera.position.set(0, 0, 1000);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.scene.add(this.camera);

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(new THREE.Color(0x888888));

		this.axeHelper = new THREE.AxesHelper(2000);
		this.axeHelper.position.set(0, 2, 0);
		// this.scene.add(this.axeHelper);

		// (多大, 分幾格)
		this.gridHelper = new THREE.GridHelper(1500, 15);
		this.gridHelper.position.set(0, 1, 0);
		// this.scene.add(this.gridHelper);

		this.stats = Stats();
		document.body.appendChild(this.stats.dom);

		this.onWindowResize = this.onWindowResize.bind(this);
		this.onWindowResize();
		window.addEventListener( 'resize', this.onWindowResize, false );
	}

	private initLight() {
		const light = new THREE.AmbientLight(0x404040); // soft white light
		this.scene.add(light);

		this.spotLight = new THREE.SpotLight(0xFFFFFF, 3, 2000, Math.PI / 4, 0.5);
		this.spotLight.castShadow = true;
		this.spotLight.position.set(0, 300, 500);
		this.spotLight.shadow.bias = -0.0005; // 消除影子線條
		this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
		// this.scene.add(this.spotLightHelper);

		this.directLight = new THREE.DirectionalLight(0xffffff, 1.5);
		this.directLight.castShadow = true;
		this.directLight.shadow.bias = -0.0005; // 消除影子線條
		this.scene.add(this.directLight.target);
		this.setShadowSize(this.directLight, 1000, 2048);// 目前版本directLight 需要設定光照範圍以及座標才能正確照到
		this.directLight.position.set(0, 1.75, 0);
		this.directLight.position.multiplyScalar(100);
		this.directLight.shadow.camera.far = 10000;
		// this.scene.add(this.directLight);
	}

	private initMesh() {
		// 花色
		const stone = new THREE.TextureLoader().load(stoneTexture);
		stone.wrapS = THREE.RepeatWrapping;
		stone.wrapT = THREE.RepeatWrapping;
		stone.repeat.set(4, 4);
		const stoneN = new THREE.TextureLoader().load(stoneNTexture);
		stoneN.wrapS = THREE.RepeatWrapping;
		stoneN.wrapT = THREE.RepeatWrapping;
		stoneN.repeat.set(4, 4);

		const sun = new THREE.TextureLoader().load(sunTexture);

		// 材質
		const materialPhongStone = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: stone, normalMap: stoneN });
		const materialPhong = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
		const materialPhongSun = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: sun});

		// // 方塊
		const sphereGeometry = new THREE.SphereGeometry(100, 32, 32);
		this.sphere = new THREE.Mesh(sphereGeometry, materialPhongSun);
		// this.sphere.position.set(100, 100, 100);
		this.sphere.castShadow = true;
		// this.scene.add(this.sphere);

	}

	private initShader() {
		const textureLoader = new THREE.TextureLoader();
		this.t_uniforms = {
			uTime: { value: 1.0 },
			// textureSun: { value: textureLoader.load(lavaTexture) },
            fogDensity: { value: 0 },
			fogColor: { value: new THREE.Vector3( 0, 0, 0 ) },
            texture1: { value: textureLoader.load(cloudTexture) },
			texture2: { value: textureLoader.load(lavaTexture) },
            uResolution: {
                value: [window.innerHeight,window.innerWidth]
            }
		};
		this.t_uniforms[ 'texture1' ].value.wrapS = this.t_uniforms[ 'texture1' ].value.wrapT = THREE.RepeatWrapping;
		this.t_uniforms[ 'texture2' ].value.wrapS = this.t_uniforms[ 'texture2' ].value.wrapT = THREE.RepeatWrapping;
	}

	private initShaderMesh() {
		// shader mesh
		let t_vertexShader = shader4_2_3.vertexShader;
		let t_fragmentShader = shader4_2_3.fragmentShader;
		// console.warn(t_vertexShader);
		let material = new THREE.ShaderMaterial({
			uniforms: this.t_uniforms,
			vertexShader: t_vertexShader,
			fragmentShader: t_fragmentShader,
			side: THREE.DoubleSide,
			transparent: true,
			// blending: THREE.AdditiveBlending,
		});

		// this.shaderMesh = new THREE.Mesh( new THREE.SphereGeometry(500,10,10), material );
		// this.shaderMesh = new THREE.Mesh( new THREE.CircleGeometry(500,100,100), material );  // 波浪
		this.shaderMesh = new THREE.Mesh( new THREE.PlaneGeometry(500,500,10,10), material ); // 波浪
        this.shaderMesh.receiveShadow = true;
        this.scene.add( this.shaderMesh );

		const helper = new VertexNormalsHelper( this.shaderMesh, 5, 0xff0000 );
		// this.scene.add( helper );

	}

	private setShadowSize(light1: any, sz: number = 0, mapSz: number = 0) {
		light1.shadow.camera.left = -sz;
		light1.shadow.camera.bottom = sz;
		light1.shadow.camera.right = sz;
		light1.shadow.camera.top = -sz;
		if (mapSz) {
			light1.shadow.mapSize.set(mapSz, mapSz)
		}
	}

	private adjustCanvasSize() {
		this.renderer.setSize(innerWidth, innerHeight);
		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();
	}

	private render() {
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(() => this.render());
		

		let dt = this.clock.getDelta();
		this.angle += dt / this.lightSpeed;
		this.spotLight.position.set(500 * Math.cos(this.angle), 300, 500 * Math.sin(this.angle));
		this.spotLightHelper.update();
		this.directLight.position.set(500 * Math.cos(this.angle), 300, 500 * Math.sin(this.angle));

		this.t_uniforms[ 'uTime' ].value += dt * 0.5;

		this.adjustCanvasSize();
		this.controls.update();
		this.stats.update();

	}

	private onWindowResize( ) {
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
}