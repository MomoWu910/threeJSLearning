import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import * as THREE from 'three';


export default class ViewLession2_OrthographicCamera {
	//#region 宣告變數
	private scene: any;
	private camera: any;
	private camera2: any;
    private cameraHelper: any;
	private renderer: any;
	private controls: any;
	private gridHelper: any;
	private stats: any;
	private gui: any;

	private plane: any;
	private cube: any;
	private directLight: any;

	private rotateAngle: number = 0.01;

	private left: number = -500;
	private right: number = 500;
	private top: number = 500;
	private bottom: number = -500;
	private near: number = 1.0;
	private far: number = 2000;
    private isCamera2: boolean = false;

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
		this.camera = new THREE.OrthographicCamera(this.left, this.right, this.top, this.bottom, this.near, this.far); // 正交
        this.cameraHelper = new THREE.CameraHelper( this.camera );
        this.scene.add( this.cameraHelper );
		this.camera.position.set(0, 500, 1000);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.scene.add(this.camera);

        this.camera2 = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, 0.1, 10000); // 正交
        this.camera2.position.set(1000, 500, 0);
		this.camera2.lookAt(new THREE.Vector3(0, 0, 0));
		this.scene.add(this.camera2);

		this.renderer = new THREE.WebGL1Renderer({
			antialias: true,
			canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(new THREE.Color(0x888888));

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
		const light = new THREE.AmbientLight(0x404040);
		this.scene.add(light);

		this.directLight = new THREE.DirectionalLight(0xffffff, 1.5);
		this.scene.add(this.directLight.target);
		this.directLight.position.set(0, 1.75, 0);
		this.directLight.position.multiplyScalar(100);
		this.scene.add(this.directLight);
	}

	private initMesh() {
		// 材質
		const materialPhong = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });

		// 地板
		const planeG = new THREE.PlaneGeometry(1500, 1500);
		this.plane = new THREE.Mesh(planeG, materialPhong);
		this.plane.rotation.x = -Math.PI / 2;
		this.scene.add(this.plane);

		// 方塊
		const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
		this.cube = new THREE.Mesh(boxGeometry, materialPhong);
		this.cube.position.set(100, 100, 100);
		this.scene.add(this.cube);

	}

	private initGui() {
		this.gui = new GUI();
		this.gui.add(this, 'left',-2000.0, 100.0);
		this.gui.add(this, 'right', 100.0, 2000.0);
		this.gui.add(this, 'top', 100.0, 2000.0);
		this.gui.add(this, 'bottom', -2000.0, 100.0);
		this.gui.add(this, 'near', 0.0, 500.0);
		this.gui.add(this, 'far', 501.0, 10000.0);
		this.gui.add(this, 'isCamera2');
		this.gui.add(this, 'rotateAngle', 0.01, 0.5);
		console.log(this.gui.domElement);
	}

	private adjustCanvasSize() {
		this.renderer.setSize(innerWidth, innerHeight);
		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();
	}

	private render() {
		this.renderer.render(this.scene, this.isCamera2 ? this.camera2 : this.camera);
		requestAnimationFrame(() => this.render());
        
        this.cube.rotation.y += this.rotateAngle;

        this.camera.left = this.left;
        this.camera.right = this.right;
        this.camera.top = this.top;
        this.camera.bottom = this.bottom;
        this.camera.near = this.near;
        this.camera.far = this.far;
        this.camera.updateProjectionMatrix();
        this.cameraHelper.update();

        this.controls.object = this.isCamera2 ? this.camera2 : this.camera;
		this.controls.update();
		this.stats.update();

	}

	private onWindowResize( ) {
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
}