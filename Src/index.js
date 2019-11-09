import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {
    EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
    ColladaLoader
} from 'three/examples/jsm/loaders/ColladaLoader.js';
import {
    WEBGL
} from 'three/examples/jsm/WebGL.js';

import {
    RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
    ShaderPass
} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {
    CopyShader
} from 'three/examples/jsm/shaders/CopyShader.js';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    Loader
} from './Loader';

if (WEBGL.isWebGL2Available() === false) {
    document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
}
var camera, scene, renderer, stats, controls, container, clock;
var composer, model;

init();

function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 2000);
    camera.position.z = 50;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xcccccc, 100, 1500);
    clock = new THREE.Clock();

    //
    ///Lights
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 0).normalize();
    scene.add(directionalLight);
    //

    //
    var canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated'; // disable browser interpolation
    var context = canvas.getContext('webgl2', {
        alpha: true,
        antialias: false
    });
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        context: context
    });
    renderer.alpha = true;
    renderer.autoClear = false;
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    //
    var parameters = {
        format: THREE.RGBFormat,
        stencilBuffer: false
    };
    var size = renderer.getDrawingBufferSize(new THREE.Vector2());
    var renderTarget = new THREE.WebGLMultisampleRenderTarget(size.width, size.height, parameters);
    var renderPass = new RenderPass(scene, camera);
    var copyPass = new ShaderPass(CopyShader);
    //
    composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(renderPass);
    composer.addPass(copyPass);


    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    stats = new Stats();
    container.appendChild(stats.dom);
    window.addEventListener('resize', onWindowResize, false);

    document.addEventListener('dragover', function (event) {

        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';

    }, false);

    document.addEventListener('drop', function (event) {

        event.preventDefault();
        var objLoader = new Loader();
        objLoader.loadFiles(event.dataTransfer.files, onLoad);

    }, false);

    animate();
}

function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    composer.setSize(container.offsetWidth, container.offsetHeight);

}

function animate() {
    requestAnimationFrame(animate);
    controls.update()
    stats.update();
    renderer.setViewport(0, 0, container.offsetWidth, container.offsetHeight);
    composer.render();
}



function onLoad(object) {
    if (model) {
        scene.remove(model);
    }
    model = object;
    scene.add(model);
}