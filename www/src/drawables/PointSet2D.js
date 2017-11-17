/**
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Dependencias
  const THREE = require('three');

  const Fonts      = require('drawables/Fonts');
  const Geometries = require('drawables/Geometries');

  function PointSet2D (points, color) {
    THREE.Object3D.call(this);
    
    this.objects = [];
    this.color   = color || 0x000;

    for (var i = 0; i < points.length; i++) {
      this.addPoint(points[i]);
    }
  }

  PointSet2D.prototype = Object.create(THREE.Object3D.prototype);
  PointSet2D.prototype.constructor = PointSet2D;

  PointSet2D.prototype.addPoint = function (vector) {
    var labelText = 'p' + this.objects.length;
    var pointObject = createPointObject(vector, labelText, this.color);

    this.objects.push(pointObject);
    this.add(pointObject);
  };

  PointSet2D.prototype.objectAtIndex = function (index) {
    return this.objects[index];
  };

  PointSet2D.prototype.hideLabels = function () {
    for (var i = 0; i < this.objects.length; i++) {
      var objectPoint = this.objects[i];
      objectPoint.label.visible = false;
    }
  };

  function createPointObject (vector, labelText, color) {
    var pointObject = new THREE.Object3D();

    // Circle
    var circleMaterial = new THREE.PointsMaterial({
      color : color,
      size  : 1.0
    });

    pointObject.circle = new THREE.Mesh(Geometries.POINT_GEOMETRY, circleMaterial);
    pointObject.circle.position.set(vector.x, vector.y, 0);
    pointObject.add(pointObject.circle);

    // Label
    var labelMaterial = new THREE.MeshBasicMaterial({
      color : color
    });

    pointObject.label = createLabelMesh(labelText, labelMaterial);
    pointObject.label.position.set(vector.x + 2.0, vector.y, 0.0);
    pointObject.add(pointObject.label);

    // Data
    pointObject.data = vector;

    pointObject.setOpacity = function (opacity) {
      pointObject.circle.material.opacity = opacity;
      pointObject.label.material.opacity  = opacity;
    };

    pointObject.setColor = function (color) {
      pointObject.circle.material.color = color;
      pointObject.label.material.color = color;
    };

    return pointObject;
  }

  function createLabelMesh (labelText, material) {
    var geometry = new THREE.TextBufferGeometry(labelText, {
      font   : Fonts.DEFAULT_FONT,
      size   : 2.75,
      height : 0.5
    });

    return new THREE.Mesh(geometry, material);
  }

  if (!exports) {
    exports = {};
  }

  module.exports = PointSet2D;
});
