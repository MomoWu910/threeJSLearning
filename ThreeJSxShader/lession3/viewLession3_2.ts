import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

export default class ViewLession3_2 {

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGL1Renderer;
    private controls: OrbitControls;
    private t_uniforms: any = {};
    private directLight: THREE.DirectionalLight;
	private angle: number = 0;
	private lightSpeed: number = 5;
	private clock = new THREE.Clock();

    constructor() {
        this.initScene();
        this.initMesh();
        this.render();
    }

    public initScene() {
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

		const light = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(light);

		this.directLight = new THREE.DirectionalLight(0xffffff, 1.5);
		this.directLight.shadow.bias = -0.0005; // 消除影子線條
		this.scene.add(this.directLight.target);
		this.setShadowSize(this.directLight, 1000, 2048);// 目前版本directLight 需要設定光照範圍以及座標才能正確照到
		this.directLight.position.set(0, 1.75, 0);
		this.directLight.position.multiplyScalar(100);
        this.directLight.shadow.camera.far = 10000;
        this.directLight.castShadow = true;
		this.scene.add(this.directLight);
        
        this.onWindowResize = this.onWindowResize.bind(this);
		this.onWindowResize();
		window.addEventListener( 'resize', this.onWindowResize, false );
    }

    private initMesh() {
        let t_vertexShader =  document.getElementById('vertexShader2') as HTMLCanvasElement;
        let t_fragmentShader = document.getElementById('fragmentShader3') as HTMLCanvasElement;
        this.t_uniforms = {
			time: { value: 1.0 },
		};
		let material = new THREE.ShaderMaterial({
			uniforms: this.t_uniforms,
			vertexShader: t_vertexShader && t_vertexShader.textContent ? t_vertexShader.textContent.toString() : undefined,
			fragmentShader: t_fragmentShader && t_fragmentShader.textContent ? t_fragmentShader.textContent.toString() : undefined
		});
        material.transparent = true;
        
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(1500, 1500), material);
        // plane.rotation.x = -Math.PI/2;
        plane.receiveShadow = true;
        plane.castShadow = true;
        this.scene.add(plane);
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

		this.t_uniforms[ 'time' ].value += dt/10 * 5;
		// this.t_uniforms2[ 'time' ].value += dt * 2;

        this.directLight.position.set(500 * Math.cos(this.angle), 300, 500 * Math.sin(this.angle));
        
		this.adjustCanvasSize();
		this.controls.update();
	}

	private onWindowResize( ) {
		this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}