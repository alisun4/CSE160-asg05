import * as THREE from '../lib/three.module.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import { OBJLoader } from '../lib/OBJLoader.js';
import { MTLLoader } from '../lib/MTLLoader.js';

function main() {

    // SETUP
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { canvas, antialias: true } );
	
	// Source for next two lines: ChatGPT
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;

	// CAMERA
	// Source: Kitty Playground by Yukti Malhan https://people.ucsc.edu/~ymalhan/asg5/asg5.html
    let camera;
	initCamera();
	let controls = new OrbitControls(camera, canvas); 

	const scene = new THREE.Scene();
	function initCamera() {
		const fov = 10;
		const aspect = window.innerWidth / window.innerHeight;; 
		const near = 0.1;
		const far = 100;

		camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 12, 30);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(0, 12, 0);
        controls.update();
	}

	// LIGHTS: Ambient, Directional, Hemisphere

	{

		const color = 0xFFFFFF;
		const intensity = 0.3;
		const light = new THREE.AmbientLight(color, intensity);
		scene.add(light);

	}

	{

		const color = 0xFFFFFF;
		const intensity = 1;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set(- 1, 2, 4);
		scene.add(light);

	}

	{

		const skyColor = 0xB1E1FF;
        const groundColor = 0xB97A20;
        const intensity = 0.4;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
		
	}

	// SKYBOX
	// Source: https://threejs.org/manual/?q=sky#en/backgrounds,
	//			https://jaxry.github.io/panorama-to-cubemap/
	{
		const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
			'./background/px.jpg',
			'./background/nx.jpg',
			'./background/py.jpg',
			'./background/ny.jpg',
			'./background/pz.jpg',
			'./background/nz.jpg',
        ]);
        scene.background = texture;
	}

	function makeCone( color, x, y, height, radius ) {

        // Source: ChatGPT, https://threejs.org/manual/#en/primitives

		const material = new THREE.MeshPhongMaterial( { color } );
        const coneGeometry = new THREE.ConeGeometry(radius, height, 32);
		const cone = new THREE.Mesh( coneGeometry, material );
		cone.position.x = x;
		cone.position.y = y;
        scene.add( cone );

		return cone;
        
	}

	function makeCube( color, x, y, width, height, depth ) {

		// Source: https://threejs.org/manual/#en/primitives

		const material = new THREE.MeshPhongMaterial( { color } );
		const boxGeometry = new THREE.BoxGeometry(width, height, depth);
		const cube = new THREE.Mesh( boxGeometry, material );
		cube.position.x = x;
		cube.position.y = y;
		scene.add( cube );

		return cube;

	}

	function makeSphere( color, x, y, radius, width, height ) {

		// Source: ChatGPT, https://threejs.org/manual/#en/primitives

		const material = new THREE.MeshPhongMaterial( { color } );
		const sphereGeometry = new THREE.SphereGeometry(radius, width, height);
		const sphere = new THREE.Mesh( sphereGeometry, material );
		sphere.position.x = x;
		sphere.position.y = y;
		scene.add(sphere);

		return sphere;
	}

    function makeTorus( color, x, y, radius, tubeRadius ) {

        // Source: ChatGPT, https://threejs.org/manual/#en/primitives

		const material = new THREE.MeshPhongMaterial( { color } );
        const torusGeometry = new THREE.TorusGeometry(radius, tubeRadius, 32, 32);
		const torus = new THREE.Mesh( torusGeometry, material );
		torus.position.x = x;
		torus.position.y = y;
        scene.add( torus );

		return torus;

	}
    
	const shapes = [

		// Top row
		makeCone( 0x8844aa, -4, 2, 1, 1 ),
		makeSphere ( 0x96ab35, -2, 2, 0.75, 22, 22 ),
		makeCube ( 0xaa8849, 0, 2, 1, 1, 1),
		makeSphere ( 0x96ab35, 2, 2, 0.75, 22, 22 ),
		makeCone( 0x8844aa, 4, 2, 1, 1 ),

		// Middle row 1
		makeCube( 0xaa8849, -4, 0, 1, 1, 1 ), 
		makeCone( 0x8844aa, -2, 0, 1, 1 ),
		makeTorus( 0xaa8844, 2, 0, 0.5, 0.25 ),
		makeCube ( 0xab7644, 4, 0, 1, 1, 1 ),

		// Middle row 2
		makeTorus( 0xac94503, -4, -2, 0.5, 0.25 ),
		makeCube ( 0xaa8849, -2, -2, 1, 1, 1 ),
		makeSphere ( 0x96ab35, 0, -2, 0.75, 22, 22 ),
		makeCone( 0x8844aa, 2, -2, 1, 1 ),
		makeTorus( 0xac94503, 4, -2, 0.5, 0.25 ),

		// Bottom row
		makeCube ( 0xaa8849, -4, -4, 1, 1, 1 ),
		makeTorus( 0xac9900, -2, -4, 0.5, 0.25 ),
		makeTorus( 0xac9900, 0, -4, 0.5, 0.25 ),
		makeCube ( 0xab7644, 2, -4, 1, 1, 1 ),
		makeSphere( 0xab7644, 4, -4, 0.75, 22, 22 )
	];

    const loader = new THREE.TextureLoader();

	const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/wall.jpg' );
	texture.colorSpace = THREE.SRGBColorSpace;

    const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	const material = new THREE.MeshBasicMaterial( {
		map: texture
	} );
	const cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	shapes.push( cube );

    // Model

    {
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();

        mtlLoader.load('./garfield.mtl', (mtl) => {
            mtl.preload();
            objLoader.setMaterials(mtl);
            objLoader.load('./garfield.obj', (root) => {
            scene.add(root);
            });
        });
    }

	function render( time ) {

		time *= 0.001; // convert time to seconds

		shapes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
