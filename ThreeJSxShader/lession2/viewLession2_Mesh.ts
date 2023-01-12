import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import * as THREE from 'three';

const grassTexture = '../../res/texture/grass.png';
const stoneTexture = '../../res/texture/stone.png';

export default class ViewLession2_Mesh {
	//#region 宣告變數
	private scene: any;
	private camera: any;
	private renderer: any;
	private controls: any;
	private stats: any;
	private gui: any;

	private plane: any;
	private cube: any;
	private directLight: any;

	private rotateAngle: number = 0.01;

    private grass: any;
    private refraction: boolean = false;

	//#endregion

	constructor() {
		this.initScene();
		this.initLight();
		this.initMesh();
		this.initGui();
		this.render();
	}

	private initScene() {
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000); // 透視
		this.camera.position.set(0, 500, 1000);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.scene.add(this.camera);

		this.renderer = new THREE.WebGL1Renderer({
			antialias: true,
			canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
        
        this.renderer.outputEncoding = THREE.sRGBEncoding;

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(new THREE.Color(0x888888));

		this.stats = Stats();
		document.body.appendChild(this.stats.dom);

		this.onWindowResize = this.onWindowResize.bind(this);
		this.onWindowResize();
		window.addEventListener( 'resize', this.onWindowResize, false );
	}

	private initLight() {
		const light = new THREE.AmbientLight(0x404040);
		this.scene.add(light);

		this.directLight = new THREE.DirectionalLight(0xffffff, 1.5);
		this.scene.add(this.directLight.target);
		this.directLight.position.set(0, 1.75, 1);
		this.directLight.position.multiplyScalar(100);
		this.scene.add(this.directLight);
	}

	private initMesh() {
		// 材質
		const stone = new THREE.TextureLoader().load(stoneTexture);
        
        // 關鍵行 /////////////////////////////////////////////////////////////
		const materialPhong = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
        materialPhong.needsUpdate = true;

		// 地板
		const planeG = new THREE.PlaneGeometry(1500, 1500);
		this.plane = new THREE.Mesh(planeG, new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: stone}));
		this.plane.rotation.x = -Math.PI / 2;
		this.scene.add(this.plane);

		// 方塊
		const boxGeometry = new THREE.TorusKnotGeometry( 150, 80, 150, 20);
		this.cube = new THREE.Mesh(boxGeometry, materialPhong);
		this.cube.position.set(100, 300, 100);
		this.scene.add(this.cube);

	}

	private initGui() {
		this.gui = new GUI();
		// this.gui.add(this, 'refraction');
		console.log(this.gui.domElement);
	}

	private render() {
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(() => this.render());
        
        this.cube.rotation.y += this.rotateAngle;


		this.controls.update();
		this.stats.update();

	}

	private onWindowResize( ) {
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();
	}
}