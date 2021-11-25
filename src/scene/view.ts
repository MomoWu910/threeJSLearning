import { Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { SpotLight, PointLight, PointLightHelper, DirectionalLight, AmbientLight } from 'three';
import { BoxGeometry, PlaneGeometry, Mesh } from 'three';
import { MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial } from 'three';
import { DoubleSide, PCFSoftShadowMap } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

export default class View {
	private scene: any;
	private camera: any;
	private renderer: any;
	private controls: any;
	private stats: any;
	private gui: any;

	private plane: any;
	private cube: any;
	private pointLight: any;
	private pointLightHelper: any;
	private directLight: any;

	private rotateAngle: number = 0.01;

	constructor() {

		this.scene = new Scene();
		this.camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);
		this.renderer = new WebGLRenderer({
			antialias: true,
			canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
		});

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.camera.position.set(300, 300, 300);
		this.camera.lookAt(new Vector3(0, 0, 0));
		this.scene.add(this.camera);

		this.renderer.setSize(innerWidth, innerHeight);
		this.renderer.setClearColor(new Color(0x888888));

		this.stats = Stats();
		document.body.appendChild(this.stats.dom);

		////
		const materialBasic = new MeshBasicMaterial({ color: 0x222222, side: DoubleSide });
		const materialNormal = new MeshNormalMaterial();
		const materialPhong = new MeshPhongMaterial({ color: 0xaaaaaa, side: DoubleSide });

		const planeG = new PlaneGeometry(200, 200);
		this.plane = new Mesh(planeG, materialPhong);
		this.plane.rotation.x = -Math.PI / 2;
		this.plane.receiveShadow = true;
		this.scene.add(this.plane);

		const geometry = new BoxGeometry(50, 50, 50);
		this.cube = new Mesh(geometry, materialPhong);
		this.cube.position.set(0, 50, 0);
		this.cube.castShadow = true;
		// this.cube.receiveShadow = true;
		this.scene.add(this.cube);

		const light = new AmbientLight(0x404040); // soft white light
		this.scene.add(light);

		this.pointLight = new PointLight(0xffffff, 1, 500);
		this.pointLightHelper = new PointLightHelper(this.pointLight, 10);
		this.pointLight.castShadow = true;
		this.pointLight.position.set(0, 150, 0);
		this.pointLight.shadow.mapSize.width = 512; // default
		this.pointLight.shadow.mapSize.height = 512; // default
		this.pointLight.shadow.camera.near = 0.5; // default
		this.pointLight.shadow.camera.far = 500; // default
		this.scene.add(this.pointLight, this.pointLightHelper);

		// this.directLight = new DirectionalLight(0xffffff, 1);
		// this.directLight.position.set(0, 200, 0);
		// this.directLight.castShadow = true;
		// this.directLight.shadow.mapSize.width = 512; // default
		// this.directLight.shadow.mapSize.height = 512; // default
		// this.directLight.shadow.camera.near = 0.5; // default
		// this.directLight.shadow.camera.far = 500; // default
		// this.scene.add(this.directLight);

		this.gui = new GUI();
		this.gui.add(this, 'rotateAngle', -1.0, 1.0);

		this.render();
	}

	private adjustCanvasSize() {
		this.renderer.setSize(innerWidth, innerHeight);
		this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();
	}

	private render() {
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(() => this.render());

		this.cube.rotation.y += this.rotateAngle;

		this.adjustCanvasSize();
		this.controls.update();
		this.stats.update();
	}
}