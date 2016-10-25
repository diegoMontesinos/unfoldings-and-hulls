/**
 * Representa toda la escena 3D.
 * Almacena y dibuja las entradas de los algoritmos asi como la geometria
 * resultante.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Debug ID
  var debug = require('debug')('app:scene');

  // Dependencias
  var $     = require('jquery');
  var THREE = require('three');
  require('tbControls');

  // Definicion del modulo
  var Scene = function ( app ) {
    debug('Setup 3D scene');

    this.app = app;

    // Viewport y canvas
    this.viewport       = $('#viewport-3d')[0];
    this.viewportWidth  = $(this.viewport).width();
    this.viewportHeight = $(this.viewport).height();
    this.viewportRatio  = this.viewportWidth / this.viewportHeight;

    this.mainCanvas     = $('#main-3d')[0];

    // Elementos ThreeJS: la escena, la camara principal y el renderer
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

    // Ejes y grid
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

    /***********
     * Metodos *
     ***********/

    start: function () {
      debug('Starting 3D scene');

      this.animate();
    },

    animate: function () {
      requestAnimationFrame(this.animate.bind(this));

      this.controls.update();

      this.renderer.render(this.scene, this.mainCamera);
    },

    add: function ( object ) {
      this.scene.add(object);
    },

    addPoints: function ( points, color ) {
      var geometry = new THREE.Geometry();
      for (var i = 0; i < points.length; i++) {
        geometry.vertices.push(points[i]);
      }

      var material = new THREE.PointsMaterial({
        color : color || 0x000,
        size  : 1.0
      });

      var pointsObj = new THREE.Points(geometry, material);

      this.scene.add(pointsObj);

      return pointsObj;
    },

    /*********************
     * Manejo de eventos *
     *********************/

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

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = Scene;
});
