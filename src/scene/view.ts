import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import * as THREE from 'three';

const grassTexture = '../../res/texture/grass.png';
const grassBlackMapTexture = '../../res/texture/grassBlack.png';
const grassWhiteMapTexture = '../../res/texture/grassWhite.png';
const grassNormalMapTexture = '../../res/texture/grassNormal.png';


export default class View {
	private scene: any;
	private camera: any;
	private renderer: any;
	private controls: any;
	private stats: any;
	private gui: any;

	private plane: any;
	private cube: any;
	private spotLight: any;
	private spotLightHelper: any;
	private pointLight: any;
	private pointLightHelper: any;
	private directLight: any;

	private rotateAngle: number = 0.01;
	private angle: number = 0;
	private clock = new THREE.Clock();

	constructor() {

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
		});

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.camera.position.set(300, 300, 300);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.scene.add(this.camera);

		this.renderer.setSize(innerWidth, innerHeight);
		this.renderer.setClearColor(new THREE.Color(0x888888));

		this.stats = Stats();
		document.body.appendChild(this.stats.dom);

		//
		const light = new THREE.AmbientLight(0x404040); // soft white light
		this.scene.add(light);

		this.spotLight = new THREE.SpotLight(0xFFFFFF, 2, 1000, Math.PI/9);
		this.spotLight.castShadow = true;
		this.spotLight.position.set(0, 300, 300);
		this.spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
		this.scene.add(this.spotLight, this.spotLightHelper);

		// this.pointLight = new THREE.PointLight(0xffffff, 1.2, 500);
		// this.pointLightHelper = new THREE.PointLightHelper(this.pointLight, 10);
		// this.pointLight.castShadow = true;
		// this.pointLight.position.set(0, 150, 0);
		// this.pointLight.shadow.mapSize.width = 512; // default
		// this.pointLight.shadow.mapSize.height = 512; // default
		// this.pointLight.shadow.camera.near = 0.5; // default
		// this.pointLight.shadow.camera.far = 5000; // default
		// this.scene.add(this.pointLight, this.pointLightHelper);

		// this.directLight = new THREE.DirectionalLight(0xffffff, 1.2);
		// this.directLight.castShadow = true;
		// this.setShadowSize(this.directLight, 100, 1024);
		// this.directLight.shadow.camera.near = 1200; // default
		// this.directLight.shadow.camera.far = 2500; // default
		// const helper = new THREE.DirectionalLightHelper( this.directLight, 500 );
		// this.scene.add(this.directLight, helper);

		////
		const grass = new THREE.TextureLoader().load(grassTexture);
		const grassBlack = new THREE.TextureLoader().load(grassBlackMapTexture);
		const grassWhite = new THREE.TextureLoader().load(grassWhiteMapTexture);
		const grassNormal = new THREE.TextureLoader().load(grassNormalMapTexture);
		const materialBasic = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
		const materialNormal = new THREE.MeshNormalMaterial();
		const materialPhongGrass = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: grass });
		const materialPhong = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
		const materialLambert = new THREE.MeshLambertMaterial({ color: 0x555555, side: THREE.DoubleSide });

		const planeG = new THREE.PlaneGeometry(500, 500);
		this.plane = new THREE.Mesh(planeG, materialPhongGrass);
		this.plane.rotation.x = Math.PI / 2;
		this.plane.position.y = -10;
		// this.plane.castShadow = true;
		this.plane.receiveShadow = true;
		this.scene.add(this.plane);

		const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
		const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
		this.cube = new THREE.Mesh(boxGeometry, materialPhong);
		this.cube.position.set(0, 100, 0);
		this.cube.castShadow = true;
		// this.cube.receiveShadow = true;
		this.scene.add(this.cube);

		//
		this.gui = new GUI();
		this.gui.add(this, 'rotateAngle', -1.0, 1.0);

		this.render();
	}

	private setShadowSize(light1: any, sz: number = 0, mapSz: number = 0) {
        light1.shadow.camera.left = sz;
        light1.shadow.camera.bottom = sz;
        light1.shadow.camera.right = -sz;
        light1.shadow.camera.top = -sz;
        if(mapSz){
            light1.shadow.mapSize.set(mapSz,mapSz)
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

		this.cube.rotation.y += this.rotateAngle;
		// this.cube.position.x += 0.5;

		let dt = this.clock.getDelta();
		this.angle += dt/5;
		this.spotLight.position.set (300*Math.cos(-this.angle), 300, 300*Math.sin(-this.angle));
		this.spotLightHelper.update();
	

		this.adjustCanvasSize();
		this.controls.update();
		this.stats.update();
	}
}