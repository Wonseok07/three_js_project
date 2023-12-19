import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { World,Vec3, Body, Plane,Box } from "cannon-es";

const clock = new THREE.Clock();
const world = new World({
	allowSleep: true,
	gravity: new Vec3(0, -9.8, 0)
});
let diceBody:Body;
let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
let physicsWorld:World;
let controls: OrbitControls;
let mesh: THREE.Object3D;

function initPhysics() {
	physicsWorld = new World({
		gravity: new Vec3(0, -90, 0),
	})
}
function init() {
	initPhysics()
	const container = document.getElementById("container");

	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
	camera.position.set(0, 100, 250);

	scene = new THREE.Scene();
	scene.background = new THREE.Color().setHSL(0.6, 0, 1);
	scene.fog = new THREE.Fog(scene.background, 1, 5000);

	// LIGHTS

	const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
	hemiLight.color.setHSL(0.6, 1, 0.6);
	hemiLight.groundColor.setHSL(0.095, 1, 0.75);
	hemiLight.position.set(0, 50, 0);
	scene.add(hemiLight);

	const dirLight = new THREE.DirectionalLight(0xffffff, 3);
	dirLight.color.setHSL(0.1, 1, 0.95);
	dirLight.position.set(-1, 1.75, 1);
	dirLight.position.multiplyScalar(30);
	scene.add(dirLight);

	dirLight.castShadow = true;
	dirLight.shadow.mapSize.width = 2048;
	dirLight.shadow.mapSize.height = 2048;

	const d = 50;

	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;

	dirLight.shadow.camera.far = 3500;
	dirLight.shadow.bias = -0.0001;

	// GROUND

	createFloor();
	// SKYDOME

	// const vertexShader = document.getElementById('vertexShader')!.textContent;
	// const fragmentShader = document.getElementById('fragmentShader')!.textContent;
	// const uniforms = {
	// 	topColor: { value: new THREE.Color(0x0077ff) },
	// 	bottomColor: { value: new THREE.Color(0xffffff) },
	// 	offset: { value: 33 },
	// 	exponent: { value: 0.6 }
	// };
	// uniforms['topColor'].value.copy(hemiLight.color);

	// scene.fog.color.copy(uniforms['bottomColor'].value);

	// const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
	// const skyMat = new THREE.ShaderMaterial({
	// 	uniforms: uniforms,
	// 	vertexShader: vertexShader!,
	// 	fragmentShader: fragmentShader!,
	// 	side: THREE.BackSide
	// });

	// const sky = new THREE.Mesh(skyGeo, skyMat);
	// scene.add(sky);

	// MODEL

	const loader = new GLTFLoader();
	const s = 5;
	loader.load("/randomdice.glb", function (gltf) {
		mesh = gltf.scene.children[0];

		
		mesh.scale.set(s, s, s);
		mesh.rotation.z = 5;
		mesh.position.y = -10;
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		scene.add(mesh);
	});
	diceBody = new Body({
		mass: 0.3,
		shape: new Box(new Vec3(s, s, s)),
 		position: new Vec3(0, -15, 0),
		sleepTimeLimit: .02
	})
	physicsWorld.addBody(diceBody);
	

	// RENDERER

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	container?.appendChild(renderer.domElement);

	// STATS

	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableZoom = false;
	controls.enablePan = false;
	controls.rotateSpeed = 0.5;
	controls.enableDamping = true;
	
	window.addEventListener("resize", onWindowResize);
	addDiceEvents();
}
function createFloor() {
	const groundGeo = new THREE.PlaneGeometry(10000, 10000);
	const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
	groundMat.color.setHSL(0.095, 1, 0.75);

	const floor = new THREE.Mesh(groundGeo, groundMat);
	floor.receiveShadow = true;
	floor.position.y = -22;
	floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * 0.5);
  
	scene.add(floor);
  
	const floorBody = new Body({
	  type: Body.STATIC,
	  shape: new Plane(),
	});

	floorBody.position.copy(floor.position as any);
	floorBody.quaternion.copy(floor.quaternion as any);
	physicsWorld.addBody(floorBody);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function addDiceEvents() {
	console.log('asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfsadfasdfasdfasdfasdfasdfasdfasdf')
	diceBody.addEventListener('sleep', (e:any) => {
		console.log('event')
		diceBody.allowSleep = false;
		const euler = new Vec3();
		e.target.quaternion.toEuler(euler);

		const eps = 0.1;
		let isZero = (angle:any) => Math.abs(angle) < eps;
		let isHalfPi = (angle:any) => Math.abs(angle - 0.5 * Math.PI) < eps;
		let isMinusHalfPi = (angle:any) => Math.abs(0.5 * Math.PI + angle) < eps;
		let isPiOrMinusPi = (angle:any) => Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;
		
		if (isZero(euler.x)) {
			if (isZero(euler.x)) {
				console.log(1);
			} else if (isHalfPi(euler.x)) {
				console.log(4);
			} else if (isMinusHalfPi(euler.x)) {
				console.log(3)
			} else if (isPiOrMinusPi(euler.x)) {
				console.log(6);
			} else {
				console.log("else")
				diceBody.allowSleep = true;
			}
		} else if (isHalfPi(euler.z)) {
			console.log(2);
		} else {
			console.log("else")
			diceBody.allowSleep = true;
		}
	})
}

//

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	render();
	world.fixedStep();
}

function render() {
	physicsWorld.fixedStep();

	mesh.position.copy(diceBody.position as any);
  	mesh.quaternion.copy(diceBody.quaternion as any);

	renderer.render(scene, camera);
}

const dice = () => {
	init();
	animate();
};

const roll = () => {
	diceBody.velocity.setZero();
	diceBody.angularVelocity.setZero();
	mesh.position.copy(diceBody.position as any)
	mesh.rotation.set(
		10 * Math.PI * Math.random() - 100 * Math.PI * Math.random(),
		100 * Math.PI * Math.random() - 10 * Math.PI * Math.random(),
		10 * Math.PI * Math.random() - 100 * Math.PI * Math.random()
	);
	diceBody.quaternion.copy(mesh.quaternion as any)
	diceBody.position = new Vec3(0, -15, 0)
	diceBody.applyImpulse(new Vec3(3 * Math.PI * Math.random()-3 * Math.PI * Math.random(),30,3 * Math.PI * Math.random()-3 * Math.PI * Math.random()))
	diceBody.applyForce(new Vec3(0,20,0))
	
	diceBody.allowSleep = true;
};
export { dice, roll };
