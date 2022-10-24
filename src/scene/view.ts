import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import * as THREE from 'three';

const grassTexture = '../../res/texture/grass.png';
const grassBlackMapTexture = '../../res/texture/grassBlack.png';
const grassWhiteMapTexture = '../../res/texture/grassWhite.png';
const grassNormalMapTexture = '../../res/texture/grassNormal.png';
const stoneTexture = '../../res/texture/stone.png';
const stoneNTexture = '../../res/texture/stoneN.png';

const porscheGLTF = '../../res/model/porsche/porsche.gltf';
const shibaGLTF = '../../res/model/shiba/shiba.gltf';
const godzillaGLTF = '../../res/model/godzilla/godzilla.gltf';
const bananaGLTF = '../../res/model/banana/banana.glb';
const rathalosGLTF = '../../res/model/rathalos/rathalos.gltf';
const bitcoinGLTF = '../../res/model/bitcoin2/bitcoin2.gltf';

export default class View {
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

	private loaderGLTF = new GLTFLoader();
	private porsche: any;
	private shiba: any;
	private godzilla: any;
	private banana: any;
	private rathalos: any;
	private bitcoin: any;

	private t_uniforms: any = {};
	//#endregion

	constructor() {
		this.initScene();
		this.initShader();
		this.initLight();
		this.initMesh();
		this.initShaderMesh();
		this.initModel();
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
		// this.scene.add(this.spotLight, this.spotLightHelper);

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
		const grass = new THREE.TextureLoader().load(grassTexture);
		const grassNormal = new THREE.TextureLoader().load(grassNormalMapTexture);
		const stone = new THREE.TextureLoader().load(stoneTexture);
		stone.wrapS = THREE.RepeatWrapping;
		stone.wrapT = THREE.RepeatWrapping;
		stone.repeat.set(4, 4);
		const stoneN = new THREE.TextureLoader().load(stoneNTexture);
		stoneN.wrapS = THREE.RepeatWrapping;
		stoneN.wrapT = THREE.RepeatWrapping;
		stoneN.repeat.set(4, 4);

		// 材質
		const materialBasic = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
		const materialNormal = new THREE.MeshNormalMaterial();
		const materialPhongGrass = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: grass, normalMap: grassNormal });
		const materialPhongStone = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: stone, normalMap: stoneN });
		const materialPhong = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
		const materialLambert = new THREE.MeshLambertMaterial({ color: 0x555555, side: THREE.DoubleSide });

		// 地板
		const planeG = new THREE.PlaneGeometry(1500, 1500);
		this.plane = new THREE.Mesh(planeG, materialPhongStone);
		this.plane.rotation.x = -Math.PI / 2;
		// this.plane.castShadow = true;
		this.plane.receiveShadow = true;
		this.scene.add(this.plane);

		// // 方塊
		const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
		const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
		this.cube = new THREE.Mesh(boxGeometry, materialPhong);
		this.cube.position.set(100, 100, 100);
		this.cube.castShadow = true;
		// this.cube.receiveShadow = true;
		this.scene.add(this.cube);

	}

	private initShader() {
		this.t_uniforms = {
			time: { value: 1.0 }
			// u_resolution: { type: "v2", value: new THREE.Vector2() }
		};
	}

	private initShaderMesh() {
		// shader mesh
		let t_vertexShader =  document.getElementById('vertexShader') as HTMLCanvasElement;
		let t_fragmentShader = document.getElementById('fragmentShader') as HTMLCanvasElement;
		const geometry = new THREE.PlaneBufferGeometry( 2, 2 );
		let material = new THREE.ShaderMaterial({
			uniforms: this.t_uniforms,
			vertexShader: t_vertexShader && t_vertexShader.textContent ? t_vertexShader.textContent.toString() : undefined,
			fragmentShader: t_fragmentShader && t_fragmentShader.textContent ? t_fragmentShader.textContent.toString() : undefined
		});
		material.transparent = true;
		material.opacity = 0.5;

		let mesh = new THREE.Mesh( geometry, material );
		this.scene.add( mesh );

	}

	private initModel() {
		this.shiba = this.loadGLTFModel(shibaGLTF, (shiba: any) => {
			shiba.position.set(0, 100, 0);
			shiba.scale.set(100, 100, 100);
		});

		// this.porsche = this.loadGLTFModel(porscheGLTF, (porsche: any) => {
		// 	porsche.position.set(200, 0, -200);
		// 	porsche.scale.set(100, 100, 100);
		// 	porsche.rotation.set(0, Math.PI / 2, 0);
		// });

		// this.godzilla = this.loadGLTFModel(godzillaGLTF, (godzilla: any) => {
		// 	godzilla.position.set(-200, 0, -200);
		// 	godzilla.scale.set(0.4, 0.4, 0.4);
		// });

		// this.banana = this.loadGLTFModel(bananaGLTF, (banana: any) => {
		// 	banana.position.set(0, 127, 0);
		// 	banana.scale.set(3, 3, 3);
		// });

		// this.rathalos = this.loadGLTFModel(rathalosGLTF, (rathalos: any) => {
		// 	this.setObjColor(rathalos, 0xFF6B56);
		// 	rathalos.position.set(-500, 0, 400);
		// 	rathalos.scale.set(3, 3, 3);
		// });

		// this.bitcoin = this.loadGLTFModel(bitcoinGLTF, (bitcoin: any) => {
		// 	bitcoin.scale.set(20, 20, 20);
		// 	bitcoin.position.set(-200, 10, 0);
		// });
	}

	private initGui() {
		this.gui = new GUI();
		this.gui.add(this, 'lightSpeed', 0.1, 5.0);
		this.gui.add(this, 'rotateAngle', -1.0, 1.0);
		this.gui.add(this, 'normalScale', 0, 1.0);
		console.log(this.gui.domElement);
	}

	private loadGLTFModel(path: string, callback: any) {
		this.loaderGLTF.load(path, (gltf) => {
			// onload
			this.scene.add(gltf.scene);
			gltf.scene.castShadow = true;
			gltf.scene.receiveShadow = true;
			this.setObjCastShow(gltf.scene);
			this.setObjReceiveShow(gltf.scene);

			if (callback) callback(gltf.scene);

			console.log(gltf.scene, gltf.scene.name);

			return gltf.scene;
		}, (xhr) => {
			// onprogress 沒甚麼用
			// console.log((xhr.loaded / xhr.timeStamp * 100) + '% loaded');
		}, (err) => {
			// onerror
			console.error(err);
		}
		);
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

	private adjustCanvasSize() {
		this.renderer.setSize(innerWidth, innerHeight);
		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();
	}

	private render() {
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(() => this.render());

		this.t_uniforms[ 'time' ].value = performance.now() / 1000;

		this.cube.rotation.y += this.rotateAngle;
		this.plane.material.normalScale.set(this.normalScale, this.normalScale);

		let dt = this.clock.getDelta();
		this.angle += dt / this.lightSpeed;
		this.spotLight.position.set(500 * Math.cos(this.angle), 300, 500 * Math.sin(this.angle));
		this.spotLightHelper.update();
		this.directLight.position.set(500 * Math.cos(this.angle), 300, 500 * Math.sin(this.angle));

		this.adjustCanvasSize();
		this.controls.update();
		this.stats.update();
	}

	private onWindowResize( event? ) {
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		// this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
		// this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
	}
}