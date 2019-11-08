import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {
    ColladaLoader
} from 'three/examples/jsm/loaders/ColladaLoader.js';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

import {
    EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';

import {
    WEBGL
} from 'three/examples/jsm/WebGL.js';
var stats, clock;
var camera, scene, elf, controls;
var canvas ;
var context;
var renderer;
let composer;

initRenderer();
init();
animate();

function initRenderer(){
   // Create renderer
    canvas = document.createElement( 'canvas' );
    context = canvas.getContext( 'webgl2', { alpha: false, antialias: false } );
   renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
   renderer.setPixelRatio( window.devicePixelRatio );
   renderer.setSize( window.innerWidth, window.innerHeight );
   document.body.appendChild( renderer.domElement );
    
}

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(8, 10, 8);

    scene = new THREE.Scene();
    clock = new THREE.Clock();
    // loading manager
    var loadingManager = new THREE.LoadingManager(function () {
        scene.add(elf);
    });

    // collada
    var loader = new ColladaLoader(loadingManager);
    loader.load('./models/test.dae', function (collada) {
        elf = collada.scene;
    });

    ///Lights
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 0).normalize();
    scene.add(directionalLight);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    stats = new Stats();
    canvas.appendChild(stats.dom);

   
    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
   // renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update()
    render();

    stats.update();
}

function render() {
    var delta = clock.getDelta();
    if (elf !== undefined) {
        // elf.rotation.z += delta * 0.5;
    }
    renderer.render( scene, camera );
}