import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import * as THREE from 'three';

const grassTexture = '../../res/texture/grass.png';
const grassBlackMapTexture = '../../res/texture/grassBlack.png';
const grassWhiteMapTexture = '../../res/texture/grassWhite.png';
const grassNormalMapTexture = '../../res/texture/grassNormal.png';
const stoneTexture = '../../res/texture/stone.png';
const stoneNTexture = '../../res/texture/stoneN.png';

const cloudTexture = '../../res/texture/cloud.png';
const lavaTexture = '../../res/texture/lavatile.jpg';

const vertexShader = require('./shader1.vert');
const fragmentShader = require('./shader1.frag');
import { shader1 } from './shader1.js';

export default class ViewLession4_1 {
	//#region 宣告變數
	private scene: any;
	private camera: any;
	private renderer: any;
	private controls: any;
	private axeHelper: any;
	private gridHelper: any;
	private stats: any;
	private gui: any;

	private plane: any;
	private cube: any;
	private spotLight: any;
	private spotLightHelper: any;
	private pointLight: any;
	private pointLightHelper: any;
	private directLight: any;

	private lightSpeed: number = 5;
	private rotateAngle: number = 0.01;
	private normalScale: number = 1;
	private angle: number = 0;
	private clock = new THREE.Clock();

	private t_uniforms: any = {};
	private t_uniforms2: any = {};
	private shaderCube: any;
	private shaderPlane: any;
	//#endregion

	constructor() {
		this.initScene();
		this.initShader();
		this.initLight();
		this.initMesh();
		this.initShaderMesh();
		this.initGui();
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

		this.camera.position.set(0, 500, 1000);
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

		this.directLight = new THREE.DirectionalLight(0xffffff, 1.5);
		this.directLight.castShadow = true;
		this.directLight.shadow.bias = -0.0005; // 消除影子線條
		this.scene.add(this.directLight.target);
		this.setShadowSize(this.directLight, 1000, 2048);// 目前版本directLight 需要設定光照範圍以及座標才能正確照到
		this.directLight.position.set(0, 1.75, 0);
		this.directLight.position.multiplyScalar(100);
		this.directLight.shadow.camera.far = 10000;
		this.scene.add(this.directLight);
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

		// 材質
		const materialPhongStone = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: stone, normalMap: stoneN });
		const materialPhong = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });

		// 地板
		const planeG = new THREE.PlaneGeometry(1500, 1500);
		this.plane = new THREE.Mesh(planeG, materialPhongStone);
		this.plane.rotation.x = -Math.PI / 2;
		// this.plane.castShadow = true;
		this.plane.receiveShadow = true;
		this.scene.add(this.plane);

		// // 方塊
		const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
		this.cube = new THREE.Mesh(boxGeometry, materialPhong);
		this.cube.position.set(100, 100, 100);
		this.cube.castShadow = true;
		this.scene.add(this.cube);

	}

	private initShader() {
		this.t_uniforms = {
			time: { value: 1.0 },
		};
	}

	private initShaderMesh() {
		// shader mesh
		let t_vertexShader = shader1.vertexShader;
		let t_fragmentShader = shader1.fragmentShader;
		console.warn(t_vertexShader);
		let material = new THREE.ShaderMaterial({
			uniforms: this.t_uniforms,
			vertexShader: t_vertexShader,
			fragmentShader: t_fragmentShader
		});
		material.transparent = true;

		this.shaderCube = new THREE.Mesh( new THREE.BoxGeometry(30, 30, 30), material );
		this.shaderCube.position.set(-100, 100, 100);
		this.shaderCube.castShadow = true;
		this.scene.add( this.shaderCube );

	}

	private initGui() {
		this.gui = new GUI();
		// console.warn(this.gui.domElement);
		this.gui.add(this, 'lightSpeed', 0.1, 5.0);
		this.gui.add(this, 'rotateAngle', -1.0, 1.0);
		this.gui.add(this, 'normalScale', 0, 1.0);
		// console.warn(this.gui.domElement);
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

	private setObjReceiveShow(obj: any) {
		obj.traverse((child: any) => {
			if (child.isMesh) {
				child.receiveShadow = true;
				child.geometry.computeVertexNormals();

				// 這一段是防止model的材質沒有使用可以receive shadow的材質
				if (child.material.type === 'MeshBasicMaterial') {
					let map = child.material.map;
					child.material = new THREE.MeshStandardMaterial({ map: map });
				}
			}
		});
	}

	private setObjCastShow(obj: any) {
		obj.traverse((child: any) => {
			if (child.isMesh) child.castShadow = true;
		});
	}

	private setObjColor(obj: any, color: any) {
		obj.traverse((child: any) => {
			if (child.isMesh) {
				child.material.color.set(color);
			}
		});
	}

	private setObjTexture(obj: any, texturePath: string) {
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load(texturePath);
		obj.traverse((child: any) => {
			if (child.isMesh) {
				child.material.map = texture;
			}
		});
	}

	private adjustCanvasSize() {
		this.renderer.setSize(innerWidth, innerHeight);
		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();
	}

	private render() {
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(() => this.render());
		
		this.plane.material.normalScale.set(this.normalScale, this.normalScale);

		let dt = this.clock.getDelta();
		this.angle += dt / this.lightSpeed;
		this.spotLight.position.set(500 * Math.cos(this.angle), 300, 500 * Math.sin(this.angle));
		this.spotLightHelper.update();
		this.directLight.position.set(500 * Math.cos(this.angle), 300, 500 * Math.sin(this.angle));

		this.t_uniforms[ 'time' ].value += dt * 5;

		this.adjustCanvasSize();
		this.controls.update();
		this.stats.update();

	}

	private onWindowResize( ) {
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
}