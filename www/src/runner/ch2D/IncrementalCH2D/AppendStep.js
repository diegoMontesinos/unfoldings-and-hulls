define(function (require, exports, module) {
  'use strict';

  // Dependencias
  const THREE = require('three');
  const TWEEN = require('tween');

  const Polygon2D       = require('drawables/Polygon2D');
  const IncrementalCH2D = require('algorithms/ch2D/IncrementalCH2D');

  // Definición del módulo
  function AppendStep() {}

  AppendStep.prototype.forward = function (inData, done) {
    this.index       = inData.index;
    this.pointSet    = inData.pointSet;
    this.prevHull    = inData.hull;
    this.prevPolygon = inData.polygon;

    this.scene  = inData.scene;
    this.points = inData.points; 
    this.point  = this.points[this.index];

    var contains = this.prevHull.contains(this.point);
    if (contains) {
      this.hull    = this.prevHull;
      this.polygon = this.prevPolygon;
    }
    else {
      this.indexLeft  = IncrementalCH2D.indexOfSupportVertex(this.prevHull, this.point, checkLeftTangent);
      this.indexRight = IncrementalCH2D.indexOfSupportVertex(this.prevHull, this.point, checkRightTangent);

      this.hull = this.prevHull.copy();
      IncrementalCH2D.appendPoint(this.hull, this.point);

      this.polygon = new Polygon2D(this.hull, 0x00FF00);
      this.polygon.visible = false;

      this.scene.add(this.polygon);
    }
    
    this.animateForward(function () {
      var output = {
        scene    : inData.scene,
        index    : this.index + 1,
        points   : inData.points,
        pointSet : inData.pointSet,
        hull     : this.hull,
        polygon  : this.polygon
      };

      if ((this.index + 1) < inData.points.length) {
        done(output, new AppendStep());
      }
      else {
        done(output);
      }
    }.bind(this));
  };

  AppendStep.prototype.animateForward = function(doneAnimation) {
    var pointObject = this.pointSet.objectAtIndex(this.index);
    var contains = this.prevHull.contains(this.point);

    // 1. Focus on point: fade in + red
    var putFocusOnPoint = this.putFocusOnPoint(pointObject);

    var loseFocusOnPoint;
    if (contains) {

      // 2. Lose focus: black
      loseFocusOnPoint = this.loseFocusPoint(pointObject);
      loseFocusOnPoint.onComplete(doneAnimation);

      putFocusOnPoint.chain(loseFocusOnPoint);
    }
    else {

      var hullVertices = this.prevHull.vertices;

      // 2. Walk to right and left
      var walkToRight = this.createWalkTween({
        color      : 0xff0000,
        steps      : this.indexRight,
        direction  : 1,
        onComplete : function (line) {
          this.rightLine = line;
        }.bind(this)
      });

      var walkToLeft = this.createWalkTween({
        color      : 0x0000ff,
        steps      : (hullVertices.length - this.indexLeft),
        direction  : -1,
        onComplete : function (line) {
          this.leftLine = line;

          this.polygon.setOutlineOpacity(0.0);
          this.polygon.setInnerOpacity(0.0);
          this.polygon.visible = true;
        }.bind(this)
      });

      // 3. Fade-in new hull
      var fadeInPolygon = this.fadeInPolygon();
      fadeInPolygon.onComplete(function () {
        this.scene.remove(this.prevPolygon);
        doneAnimation();
      }.bind(this));

      // 4. Lose focus: black
      loseFocusOnPoint = this.loseFocusPoint(pointObject);

      putFocusOnPoint.chain(walkToRight);
      walkToRight.chain(walkToLeft);
      walkToLeft.chain(fadeInPolygon);
      fadeInPolygon.chain(loseFocusOnPoint);
    }

    putFocusOnPoint.start();
  };

  AppendStep.prototype.putFocusOnPoint = function (pointObject) {
    var focusPoint = new TWEEN.Tween({ opacity : 0.3, colorAmt: 0.0 })
    .delay(100)
    .to({ opacity : 1.0, colorAmt : 1.0 }, 100)
    .onUpdate(function (params) {
      var color = new THREE.Color(params.colorAmt, 0, 0);
      pointObject.setColor(color);
      pointObject.setOpacity(params.opacity);
    });

    return focusPoint;
  };

  AppendStep.prototype.loseFocusPoint = function (pointObject) {
    var loseFocusPoint = new TWEEN.Tween({ colorAmt : 1.0 })
    .delay(100)
    .to({ colorAmt : 0.0 }, 100)
    .onUpdate(function (params) {
      var color = new THREE.Color(params.colorAmt, 0, 0);
      pointObject.setColor(color);
    });

    return loseFocusPoint;
  };

  AppendStep.prototype.fadeInPolygon = function () {
    var fadeInPolygon = new TWEEN.Tween({ opacityIn : 0.0, opacityOut : 1.0 })
    .delay(600)
    .to({ opacityIn : 1.0, opacityOut : 0.0 }, 200)

    .onStart(function () {
      this.scene.remove(this.leftLine);
      this.scene.remove(this.rightLine);
    }.bind(this))
    
    .onUpdate(function (params) {
      this.polygon.setOutlineOpacity(params.opacityIn);
      this.polygon.setInnerOpacity(params.opacityIn * 0.1);

      this.prevPolygon.setOutlineOpacity(params.opacityOut);
      this.prevPolygon.setInnerOpacity(params.opacityOut * 0.1);
    }.bind(this));

    return fadeInPolygon;
  };
 
  AppendStep.prototype.createWalkTween = function (options) {
    var material = new THREE.LineBasicMaterial({ color: options.color });

    var hullVertices = this.prevHull.vertices;
    var i = (options.direction > 0) ? 0 : hullVertices.length;
    
    var lastLine;
    var walkTween = createTickerTween({
      ticks    : options.steps,
      delay    : 100,
      interval : 125,
      onTick   : function () {
        var startPoint = this.point;
        var endPoint = hullVertices[i % hullVertices.length];

        var geometry = new THREE.Geometry();
        geometry.vertices.push(startPoint);
        geometry.vertices.push(endPoint);

        var line = new THREE.Line(geometry, material);
        if (lastLine) {
          this.scene.remove(lastLine);
        }
        this.scene.add(line);

        lastLine = line;
        i += options.direction;
      }.bind(this),
      onComplete: function () {
        options.onComplete(lastLine);
      }
    });

    return walkTween;
  };

  function checkLeftTangent (turnToLast, turnToNext) { return turnToNext > 0; }
  function checkRightTangent (turnToLast, turnToNext) { return turnToNext < 0; }

  function createTickerTween(options) {
    var easingFunction = createStepFunction(options.ticks);
    var duration = (options.ticks * options.interval);

    var onComplete = options.onComplete || function () {};

    var lastT = -1.0;
    var tickerTween = new TWEEN.Tween({ t : 0.0 })
    .delay(options.delay)
    .to({ t : 1.0 }, duration)
    .easing(easingFunction)
    .onUpdate(function(params) {
      var t = params.t;

      if (lastT === t) {
        return;
      }

      var tick = Math.floor(t * options.ticks);
      options.onTick(tick);

      lastT = t;
    })
    .onComplete(onComplete);

    return tickerTween;
  }

  function createStepFunction (numSteps) {
    return function (k) {
      return (Math.floor(k * numSteps) / numSteps);
    };
  }

  if (!exports) {
    exports = {};
  }

  // Export all steps
  module.exports = AppendStep;
});
