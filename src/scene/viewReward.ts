import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import * as THREE from 'three';
import { gsap } from "gsap";

const woodTexture = '../../res/texture/wood.png';
const woodNormalMapTexture = '../../res/texture/woodNormal.png';

const porscheGLTF = '../../res/model/porsche/porsche.gltf';
const shibaGLTF = '../../res/model/shiba/shiba.gltf';
const godzillaGLTF = '../../res/model/godzilla/godzilla.gltf';
const bananaGLTF = '../../res/model/banana/banana.glb';
const rathalosGLTF = '../../res/model/rathalos/rathalos.gltf';
const bitcoinGLTF = '../../res/model/bitcoin2/bitcoin2.gltf';

const radius = 250;
const modelRadius = radius - 80;
const cylinderHeight = 15;
const eachReward = Math.PI / 3;

export default class ViewReward {
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
	private spotLight: any;
	private spotLightHelper: any;
	private pointLight: any;
	private pointLightHelper: any;
	private directLight: any;

	private cylinder: any;
	private btn: any;
	private lightSpeed: number = 5;
	private rotateAngle: number = 0.01;
	private normalScale: number = 1;
	private angle: number = 0;
	private clock = new THREE.Clock();

	private rewards: any;
	private loaderGLTF = new GLTFLoader();
	private porsche: any;
	private shiba: any;
	private godzilla: any;
	private banana: any;
	private rathalos: any;
	private bitcoin: any;

	private raycaster: any;
	private mouse: any = new THREE.Vector2(0, 0);
	private isClick: boolean = false;
	//#endregion

	constructor() {

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);

		this.initScene();
		this.initLight();
		this.initFloor();
		this.initCylinder();
		this.initBtn();
		this.initModel();
		this.initRaycaster();

		window.addEventListener('mousemove', this.onMouseMove, false);
		window.addEventListener('mousedown', this.onMouseDown, false);
		this.render();
	}

	private initScene() {
		this.scene = new THREE.Scene();
		// this.camera = new THREE.OrthographicCamera(-innerWidth/2, innerWidth/2, innerHeight/2, -innerHeight/2, 0.1, 10000); // 正交
		this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 10000); // 透視
		this.renderer = new THREE.WebGL1Renderer({
			antialias: true,
			canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
		});

		this.renderer.setPixelRatio(window.devicePixelRatio);
		// this.renderer.shadowMap.enabled = true;
		// this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		// this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.camera.position.set(0, 50, 650);
		this.camera.lookAt(new THREE.Vector3(0, 300, 0));
		this.scene.add(this.camera);

		this.renderer.setSize(innerWidth, innerHeight);
		this.renderer.setClearColor(new THREE.Color(0x000000));

		this.axeHelper = new THREE.AxesHelper(2000);
		this.axeHelper.position.set(0, 2, 0);
		// this.scene.add(this.axeHelper);

		// (多大, 分幾格)
		this.gridHelper = new THREE.GridHelper(1500, 15);
		this.gridHelper.position.set(0, 1, 0);
		// this.scene.add(this.gridHelper);

		this.stats = Stats();
		document.body.appendChild(this.stats.dom);
	}

	private initLight() {
		const light = new THREE.AmbientLight(0x404040); // soft white light
		this.scene.add(light);

		this.spotLight = new THREE.SpotLight(0xffffff, 3, 2000, Math.PI / 3.5, 0.5);
		// this.spotLight.castShadow = true;
		this.spotLight.position.set(0, 700, 300);
		// this.spotLight.shadow.bias = -0.0005; // 消除影子線條
		// this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
		this.scene.add(this.spotLight);

		// this.directLight = new THREE.DirectionalLight(0xffffff, 1.5);
		// this.directLight.castShadow = true;
		// this.directLight.shadow.bias = -0.0005; // 消除影子線條
		// this.scene.add(this.directLight.target);
		// this.setShadowSize(this.directLight, 1000, 2048);// 目前版本directLight 需要設定光照範圍以及座標才能正確照到
		// this.directLight.position.set(0, 1.75, 0);
		// this.directLight.position.multiplyScalar(100);
		// this.directLight.shadow.camera.far = 10000;
		// this.scene.add(this.directLight);
	}

	private initFloor() {
		// 花色
		const wood = new THREE.TextureLoader().load(woodTexture);
		wood.wrapS = THREE.RepeatWrapping;
		wood.wrapT = THREE.RepeatWrapping;
		wood.repeat.set(4, 4);
		const woodNormal = new THREE.TextureLoader().load(woodNormalMapTexture);
		woodNormal.wrapS = THREE.RepeatWrapping;
		woodNormal.wrapT = THREE.RepeatWrapping;
		woodNormal.repeat.set(4, 4);

		// 材質
		const materialPhongWood = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: wood });
		const materialPhongWoodN = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, map: wood, normalMap: woodNormal });

		// 地板
		const planeG = new THREE.PlaneGeometry(2000, 2000);
		this.plane = new THREE.Mesh(planeG, materialPhongWood);
		this.plane.rotation.x = -Math.PI / 2;
		// this.plane.castShadow = true;
		// this.plane.receiveShadow = true;
		this.scene.add(this.plane);

		const boxHeight = 250;
		const materialPhong = new THREE.MeshPhongMaterial({ color: 0x000000, side: THREE.DoubleSide });
		const boxGeometry = new THREE.CylinderGeometry(5, 5, boxHeight, 32);
		const box = new THREE.Mesh(boxGeometry, materialPhong);
		// box.rotation.x = -Math.PI / 2;
		box.position.set(0, 0, 30);
		this.scene.add(box);

	}

	private initCylinder() {
		const materialPhong = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
		const geometry = new THREE.CylinderGeometry(radius, radius, cylinderHeight, 6);
		this.cylinder = new THREE.Mesh(geometry, materialPhong);
		this.cylinder.position.set(0, radius + 50, 0);
		this.cylinder.rotation.set(Math.PI / 2, 0, 0);
		this.scene.add(this.cylinder);
	}

	private initBtn() {
		this.btn = new THREE.Group();
		const boxHeight = 50;
		const materialPhong = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
		const boxGeometry = new THREE.BoxGeometry(30, 30, boxHeight);
		const box = new THREE.Mesh(boxGeometry, materialPhong);

		const btnHeight = 5;
		const materialbtn = new THREE.MeshPhongMaterial({ color: 0xaa0000, side: THREE.DoubleSide });
		const cylinder = new THREE.CylinderGeometry(10, 10, btnHeight, 32);
		const btn = new THREE.Mesh(cylinder, materialbtn);
		btn.name = 'btn';
		this.isClick = false;
		btn.rotation.set(Math.PI / 2, 0, 0);
		btn.position.set(0, 0, (boxHeight + btnHeight - 2) / 2);
		// box.castShadow = true;

		this.btn.rotation.set(-Math.PI / 2, 0, 0);
		this.btn.position.set(100, boxHeight / 2, 300);
		this.btn.add(box, btn)
		this.scene.add(this.btn);

	}

	//modelRadius * Math.cos(Math.PI/6), radius, modelRadius * Math.sin(Math.PI/6)
	private initModel() {
		this.shiba = this.loadGLTFModel(shibaGLTF, (shiba: any) => {
			shiba.position.set(modelRadius * Math.cos(eachReward), cylinderHeight + 27, modelRadius * Math.sin(eachReward));
			shiba.rotation.set(-Math.PI / 2, 0, 0);
			shiba.scale.set(30, 30, 30);
			this.cylinder.add(shiba);
		});

		this.porsche = this.loadGLTFModel(porscheGLTF, (porsche: any) => {
			porsche.position.set(modelRadius * Math.cos(2 * eachReward), cylinderHeight - 5, modelRadius * Math.sin(2 * eachReward));
			porsche.scale.set(20, 20, 20);
			porsche.rotation.set(0, Math.PI / 4, 0);
			this.cylinder.add(porsche);
		});

		this.rathalos = this.loadGLTFModel(rathalosGLTF, (rathalos: any) => {
			this.setObjColor(rathalos, 0xFF6B56);
			rathalos.position.set(modelRadius * Math.cos(3 * eachReward) + 20, 250, modelRadius * Math.sin(3 * eachReward) + 50);
			rathalos.rotation.set(-Math.PI / 2, 0, Math.PI / 5);
			rathalos.scale.set(1, 1, 1);
			this.cylinder.add(rathalos);
		});

		this.banana = this.loadGLTFModel(bananaGLTF, (banana: any) => {
			banana.position.set(modelRadius * Math.cos(-eachReward), 10, modelRadius * Math.sin(-eachReward));
			banana.rotation.set(-Math.PI / 2, 0, 0);
			banana.scale.set(3, 3, 3);
			this.cylinder.add(banana);
		});

		this.bitcoin = this.loadGLTFModel(bitcoinGLTF, (bitcoin: any) => {
			bitcoin.scale.set(10, 10, 10);
			bitcoin.rotation.set(-Math.PI / 2, 0, 0);
			bitcoin.position.set(modelRadius * Math.cos(-2 * eachReward) - 130, 10, modelRadius * Math.sin(-2 * eachReward) + 180);
			this.cylinder.add(bitcoin);
		});

		this.godzilla = this.loadGLTFModel(godzillaGLTF, (godzilla: any) => {
			godzilla.position.set(-modelRadius * Math.cos(3 * eachReward), cylinderHeight - 5, modelRadius * Math.sin(-3 * eachReward) + 50);
			godzilla.rotation.set(-Math.PI / 2, 0, 0);
			godzilla.scale.set(0.2, 0.2, 0.2);
			this.cylinder.add(godzilla);
		});

	}

	private loadGLTFModel(path: string, callback: any) {
		this.loaderGLTF.load(path, (gltf) => {
			// onload
			this.scene.add(gltf.scene);
			// gltf.scene.castShadow = true;
			// gltf.scene.receiveShadow = true;
			// this.setObjCastShow(gltf.scene);
			// this.setObjReceiveShow(gltf.scene);

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

	private initRaycaster() {
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2(0, 0);
	}

	private onMouseMove(event) {
		// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

		// 通过摄像机和鼠标位置更新射线
		this.raycaster.setFromCamera(this.mouse, this.camera);
		// 计算物体和射线的焦点
		const intersects = this.raycaster.intersectObjects(this.scene.children, true);
		if (intersects.length > 0) {
			if (intersects[0].object.name === "btn") {

			}
		}
	}

	private onMouseDown(event) {

		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

		// 通过摄像机和鼠标位置更新射线
		this.raycaster.setFromCamera(this.mouse, this.camera);
		// 计算物体和射线的焦点
		const intersects = this.raycaster.intersectObjects(this.scene.children, true);
		if (intersects.length > 0) {
			if (intersects[0].object.name === "btn" && !this.isClick) {
				this.isClick = true;
				const random = Math.floor(Math.random() * 360) + 100;
				console.log(random);
				gsap.to(this.cylinder.rotation, {
					y: random, duration: 5, ease: "power3.out",
					onComplete: () => {
						this.isClick = false;
					}
				});

			}
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

		this.adjustCanvasSize();
		// this.controls.update();
		this.stats.update();
	}

}