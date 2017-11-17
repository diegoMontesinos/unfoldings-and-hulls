define(function (require, exports, module) {
  'use strict';

  // Dependencias
  const THREE = require('three');

  function Polygon2D (polygon, color) {
    THREE.Object3D.call(this);

    this.color = color || 0x000;

    var shape = createShape(polygon.vertices);

    this.inner = createInnerMesh(shape, this.color);
    this.add(this.inner);

    this.outline = createOutlineMesh(shape, this.color);
    this.add(this.outline);
  }

  Polygon2D.prototype = Object.create(THREE.Object3D.prototype);
  Polygon2D.prototype.constructor = Polygon2D;

  Polygon2D.prototype.setOutlineOpacity = function (opacity) {
    this.outline.material.opacity = opacity;
  };

  Polygon2D.prototype.setInnerOpacity = function (opacity) {
    this.inner.material.opacity = opacity;
  };

  function createShape (vertices) {
    var shape = new THREE.Shape();
    
    var vertex = vertices[0];
    shape.moveTo(vertex.x, vertex.y);

    for (var i = 1; i < vertices.length; i++) {
      vertex = vertices[i];
      shape.lineTo(vertex.x, vertex.y);
    }

    return shape;
  }

  function createInnerMesh (shape, color) {
    var geometry = new THREE.ShapeBufferGeometry(shape);
    var material = new THREE.MeshBasicMaterial({
      color       : color,
      transparent : true
    });

    return new THREE.Mesh(geometry, material);
  }

  function createOutlineMesh (shape, color) {
    shape.autoClose = true;

    var pointsGeometry  = shape.createPointsGeometry();
    var outlineMaterial = new THREE.LineBasicMaterial({
      color       : color,
      transparent : true,
      linewidth   : 1.5
    });

    return new THREE.Line(pointsGeometry, outlineMaterial);
  }

  if (!exports) {
    exports = {};
  }

  module.exports = Polygon2D;
});