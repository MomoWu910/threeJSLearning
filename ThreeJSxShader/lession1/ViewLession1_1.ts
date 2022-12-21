import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import * as THREE from 'three';

// 材質、法向量材質圖檔、模型檔
const grassTexture = '../../res/texture/grass.png';
const grassNormalMapTexture = '../../res/texture/grassNormal.png';
const stoneTexture = '../../res/texture/stone.png';
const stoneNTexture = '../../res/texture/stoneN.png';
const shibaGLTF = '../../res/model/shiba/shiba.gltf';

export default class ViewLession1_1 {
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
	private directLight: any;

	private lightSpeed: number = 5;
	private rotateAngle: number = 0.01;
	private normalScale: number = 1;
	private angle: number = 0;
	private clock = new THREE.Clock();

	private loaderGLTF = new GLTFLoader();
	private shiba: any;
	//#endregion

	constructor() {
		this.initScene();
		this.initLight();
		this.initMesh();
		this.initModel();
		// this.initGui();
		this.render();
	}

	private initScene() {
		// 場景、相機、渲染器...
		this.scene = new THREE.Scene();
		// this.camera = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, 0.1, 10000); // 正交
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000); // 透視
		this.renderer = new THREE.WebGL1Renderer({
			antialias: true,
			canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
		});

		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
		window.addEventListener( 'resize', this.onWindowResize );
	}

	private initLight() {
        // 光線
		
	}

	private initMesh() {
        //// 地板
		// 花色

		// 材質
		
		// 形狀

		//// 方塊

	}

	private initModel() {
        /**
         *  this.myModel = this.loadGLTFModel(myModelGLTFPath, (model: any) => {
         *     model.position.set(0, 0, 0);
         *     model.scale.set(100, 100, 100);
         *  });
         */
		
	}

    // gui套件，需要的話可以加上，用法參考: https://sbcode.net/threejs/dat-gui/
	private initGui() {
		// this.gui = new GUI();
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

    // 目前版本directLight 需要設定光照範圍以及座標才能正確照到
	private setShadowSize(light: any, sz: number = 0, mapSz: number = 0) {
		light.shadow.camera.left = -sz;
		light.shadow.camera.bottom = sz;
		light.shadow.camera.right = sz;
		light.shadow.camera.top = -sz;
		if (mapSz) {
			light.shadow.mapSize.set(mapSz, mapSz)
		}
	}

    // 因為模型不一定是一個整體，而可能是好幾個物件拼湊成的，所以這邊用traverse對子物件們調整receiveShadow
	private setObjReceiveShow(obj: any) {
		obj.traverse((child: any) => {
			if (child.isMesh) {
                child.receiveShadow = true;
                
                // 計算一次法線向量，避免產生錯誤陰影
				child.geometry.computeVertexNormals();

				// 這一段是防止model的材質沒有使用可以receive shadow的材質
				if (child.material.type === 'MeshBasicMaterial') {
					let map = child.material.map;
					child.material = new THREE.MeshStandardMaterial({ map: map });
				}
			}
		});
    }
    
    // 因為模型不一定是一個整體，而可能是好幾個物件拼湊成的，所以這邊用traverse對子物件們調整receiveShadow
	private setObjCastShow(obj: any) {
		obj.traverse((child: any) => {
			if (child.isMesh) child.castShadow = true;
		});
	}

    // 調整畫面大小
	private adjustCanvasSize() {
		this.renderer.setSize(innerWidth, innerHeight);
		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();
	}

	private render() {
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(() => this.render());

		// 利用三角函數與這個angle就能做到公轉
		let dt = this.clock.getDelta();
		this.angle += dt / this.lightSpeed;

		this.adjustCanvasSize();
		this.controls.update();
		this.stats.update();
	}

	private onWindowResize( event? ) {
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
}