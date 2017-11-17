define(function (require, exports, module) {
  'use strict';

  // Dependencias
  const TWEEN = require('tween');

  const Polygon2D = require('drawables/Polygon2D');
  const IncrementalCH2D = require('algorithms/ch2D/IncrementalCH2D');

  const AppendStep = require('runner/ch2D/IncrementalCH2D/AppendStep');

  // Definición del módulo
  function InitialStep () {}

  InitialStep.prototype.forward = function (inData, done) {
    this.pointSet = inData.pointSet;

    this.hull = IncrementalCH2D.makeTriangle(inData.points);

    this.polygon = new Polygon2D(this.hull, 0x00FF00);
    this.polygon.visible = false;
    inData.scene.add(this.polygon);

    this.animateForward(function () {
      var outData = {
        index    : 3,
        scene    : inData.scene,
        points   : inData.points,
        pointSet : inData.pointSet,
        hull     : this.hull,
        polygon  : this.polygon
      };

      var nextStep = new AppendStep();
      done(outData, nextStep);
    }.bind(this));
  };

  InitialStep.prototype.animateForward = function (doneAnimation) {
    
    // 1. Fade-out all points
    var fadeOutPoints = new TWEEN.Tween({ opacity : 1.0 })
    .to({ opacity: 0.3 }, 300)
    .onUpdate(function (params) {
      setOpacityToObjectPoints(params.opacity, this.pointSet.objects);
    }.bind(this));

    // 2. Fade-in first points
    var firstPoints = [
      this.pointSet.objectAtIndex(0),
      this.pointSet.objectAtIndex(1),
      this.pointSet.objectAtIndex(2)
    ];

    var fadeInPoints = new TWEEN.Tween({ opacity : 0.5 })
    .delay(200)
    .to({ opacity : 1.0 }, 300)
    .onUpdate(function (params) {
      setOpacityToObjectPoints(params.opacity, firstPoints);
    })
    .onComplete(function () {
      this.polygon.setOutlineOpacity(0.0);
      this.polygon.setInnerOpacity(0.0);
      this.polygon.visible = true;
    }.bind(this));

    // 3. Fade-in polygon
    var fadeInPolygon = new TWEEN.Tween({ opacity : 0.0 })
    .delay(200)
    .to({ opacity : 1.0 }, 300)
    .onUpdate(function (params) {
      this.polygon.setOutlineOpacity(params.opacity);
      this.polygon.setInnerOpacity(params.opacity * 0.1);
    }.bind(this))
    .onComplete(doneAnimation);

    fadeOutPoints.chain(fadeInPoints);
    fadeInPoints.chain(fadeInPolygon);
    fadeOutPoints.start();
  };

  function setOpacityToObjectPoints(opacity, pointObjects) {
    for (var i = 0; i < pointObjects.length; i++) {
      var objectPoint = pointObjects[i];
      objectPoint.setOpacity(opacity);
    }
  }

  if (!exports) {
    exports = {};
  }

  // Export all steps
  module.exports = InitialStep;
});
