/**
 * Axis-Aligned Bounding Box.
 *
 * Diego Montesinos @ Hotpixel 2016
 * email to: diegoa.montesinos@gmail.com
 * ---
 * When I wrote this, only God and I understood what I was doing.
 * Now, God only knows.
 */
define(function (require, exports, module) {
  'use strict';

  // Set debug ID
  var debug = require('debug')('app:scene');

  // Module dependencies
  var $     = require('jquery');
  var THREE = require('three');
  require('tbControls');

  // Module definition
  var Scene = function ( app ) {
    debug('Setup 3D scene');

    this.app = app;

    // Viewport and canvas
    this.viewport       = $('#viewport-3d')[0];
    this.viewportWidth  = $(this.viewport).width();
    this.viewportHeight = $(this.viewport).height();
    this.viewportRatio  = this.viewportWidth / this.viewportHeight;

    this.mainCanvas     = $('#main-3d')[0];

    // ThreeJS elements: scene, main camera and the renderer
    this.scene      = new THREE.Scene();

    this.mainCamera = new THREE.PerspectiveCamera(75, this.viewportRatio, 1, 10000);
    this.mainCamera.position.set(0, 100, 350);
    this.mainCamera.lookAt(new THREE.Vector3(0, 100, 0));

    this.renderer   = new THREE.WebGLRenderer({
      canvas    : this.mainCanvas,
      antialias : true,
      alpha     : true
    });
    this.renderer.setClearColor(0xefefef, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewportWidth, this.viewportHeight);

    // Axis and grid helpers
    this.axisHelper = new THREE.AxisHelper(350);
    this.scene.add(this.axisHelper);

    this.gridHelper = new THREE.GridHelper(200, 50, 0x000, 0xaaaaaa);
    this.scene.add(this.gridHelper);

    this.controls = new THREE.TrackballControls(this.mainCamera);
    this.controls.rotateSpeed          = 1.0;
    this.controls.zoomSpeed            = 1.2;
    this.controls.panSpeed             = 0.8;
    this.controls.noZoom               = false;
    this.controls.noPan                = false;
    this.controls.staticMoving         = true;
    this.controls.dynamicDampingFactor = 0.3;
    this.controls.target = new THREE.Vector3(0, 0, 0);

    this.setupEvents();
  };

  Scene.prototype = {

    /*****************
     * Scene Methods *
     *****************/

    start: function () {
      debug('Starting 3D scene');

      this.animate();
    },

    animate: function () {
      requestAnimationFrame(this.animate.bind(this));

      this.controls.update();

      this.renderer.render(this.scene, this.mainCamera);
    },

    /******************
     * Event Handlers *
     ******************/

    setupEvents: function () {
      window.addEventListener('resize', this.onWindowResize.bind(this), false);
    },

    onWindowResize: function () {
      this.viewportWidth  = $(this.viewport).width();
      this.viewportHeight = $(this.viewport).height();
      this.viewportRatio  = this.viewportWidth / this.viewportHeight;

      this.mainCamera.aspect = this.viewportRatio;
      this.mainCamera.updateProjectionMatrix();
      this.renderer.setSize(this.viewportWidth, this.viewportHeight);
    }
  };

  // Simple exports check
  if (!exports) {
    exports = {};
  }

  // Return module definition as the export
  module.exports = Scene;
});
