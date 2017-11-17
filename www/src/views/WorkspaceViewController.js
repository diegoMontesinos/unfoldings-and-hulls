/**
 * Controlador del canvas (espacio de trabajo) 3D.
 *
 * Sostiene todo lo necesario para el motor de render de ThreeJS: camara, escena
 * y renderer.
 * También administra los objetos que se están dibujando en el grafo de escena.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Debug ID
  var debug = require('debug')('app:views:workspace');

  // Dependencias
  var $      = require('jquery');
  var THREE  = require('three');
  var TWEEN  = require('tween');
  require('OrthoTBControls');

  // Constantes
  const SIZE_HELPERS = 5000;
  const GRID_SEPARATION = 10;

  // Definicion del modulo
  var WorkspaceViewController = function (container) {
    debug('Setup workspace (3D) view');

    this.container = container;
    this.refreshContainerSize();

    this.setupThreeObjects();
    this.rendering = false;

    this.setupHelpers();
    this.setupControls();

    this.setupEventListeners();
  };

  // Funciones del modulo
  WorkspaceViewController.prototype = {
    refreshContainerSize: function () {
      if (!this.containerSize) {
        this.containerSize = {};
      }

      this.containerSize.width  = $(this.container).width();
      this.containerSize.height = $(this.container).height();
      this.containerRatio = this.containerSize.width / this.containerSize.height;
    },

    setupThreeObjects: function () {
      this.scene = new THREE.Scene();

      this.mainCamera = new THREE.OrthographicCamera(
        this.containerSize.width  / - 2,
        this.containerSize.width  / 2,
        this.containerSize.height / 2,
        this.containerSize.height / - 2,
        0.1,
        100
      );
      this.mainCamera.position.set(0, 0, 1);
      this.mainCamera.lookAt(new THREE.Vector3(0, 0, 0));
      this.mainCamera.zoom = 4.0;
      this.mainCamera.updateProjectionMatrix();

      this.renderer = new THREE.WebGLRenderer({
        antialias : true,
        alpha     : true
      });
      this.renderer.setClearColor(0xefefef, 1);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.containerSize.width, this.containerSize.height);

      this.container.appendChild(this.renderer.domElement);
    },

    setupHelpers: function () {

      this.gridHelper = new THREE.GridHelper(
        SIZE_HELPERS,
        SIZE_HELPERS / GRID_SEPARATION,
        0x000,
        0xaaaaaa
      );
      this.gridHelper.rotation.x = Math.PI * 0.5;
      this.scene.add(this.gridHelper);

      this.axisHelper = new THREE.AxisHelper(SIZE_HELPERS * 0.5);
      this.scene.add(this.axisHelper);
    },

    setupControls: function () {
      this.controls = new THREE.OrthographicTrackballControls(this.mainCamera);

      this.controls.noRotate  = true;
      this.controls.noRoll    = true;
      this.controls.zoomSpeed = 0.1;

      this.controls.staticMoving = true;
      this.controls.dynamicDampingFactor = 0.3;

      this.controls.maxZoom = 0.4;
      this.controls.minZoom = 10.0;

      this.controls.target = new THREE.Vector3(0, 0, 0);
    },

    start: function () {
      debug('Start rendering workspace');

      if (this.rendering) {
        return;
      }

      this.rendering = true;
      requestAnimationFrame(this.animate.bind(this));
    },

    pause: function () {
      this.rendering = false;
    },

    animate: function (time) {
      if (!this.rendering) {
        return;
      }

      TWEEN.update(time);
      this.updateTHREE(time);

      requestAnimationFrame(this.animate.bind(this));
    },

    updateTHREE: function () {
      if (this.controls) {
        this.controls.update();
      }
      
      this.renderer.render(this.scene, this.mainCamera);
    },

    setupEventListeners: function () {
      window.addEventListener('resize', this.onWindowResize.bind(this), false);
    },

    onWindowResize: function () {
      this.refreshContainerSize();

      this.mainCamera.left   = this.containerSize.width  / - 2;
      this.mainCamera.right  = this.containerSize.width  / 2;
      this.mainCamera.top    = this.containerSize.height / 2;
      this.mainCamera.bottom = this.containerSize.height / - 2;
      this.mainCamera.updateProjectionMatrix();

      this.renderer.setSize(this.containerSize.width, this.containerSize.height);
    }
  };

  if (!exports) {
    exports = {};
  }

  // Return the module definition as module export
  module.exports = WorkspaceViewController;
});
