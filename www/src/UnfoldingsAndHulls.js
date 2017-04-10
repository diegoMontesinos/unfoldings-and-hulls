/**
 * Este modulo exporta un objeto singleton de la aplicacion.
 * Es el punto de entrada para toda la logica.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  var debug = require('debug')('app');

  var View2D = require('views/View2D');

  var $ = require('jquery');
  var interact = require('interact');
  var Vector = require('math/Vector');
  var Utils  = require('misc/Utils');
  var IncrementalCH2D = require('algorithms/ch2D/IncrementalCH2D');

  ///////////////////////////
  var runningAlgorithm;
  var input, inputElems;
  var hull, hullElem;
  var currentIndex, currentPoint, currentPointElem;
  var tangentRight, tangentLeft;

  var UnfoldingsAndHulls = function () {
    debug('Setup app');

    this.debugMode = true;

    this.view2D = new View2D();
  };

  UnfoldingsAndHulls.prototype = {
    start : function () {
      debug('Starting app');

      input = Utils.randomPointsInCircle({
        num          : 75,
        center       : new Vector(300, 300),
        radius       : 250,
        gralPosition : true
      });

      this.addInput();
      this.startAlgorithm();
    },

    addInput: function () {
      debug('Add input');

      inputElems = [];

      var point, pointElem;
      for (var i = 0; i < input.length; i++) {
        point = input[i];
        pointElem = this.addInputPoint(point, i);

        inputElems.push(pointElem);
      }
    },

    addInputPoint: function (point, index) {
      var pointElem = this.view2D.drawPoint(point, 3);

      pointElem.setAttribute('index-input', index);

      pointElem.addEventListener('mouseenter', function () {
        pointElem.setAttributeNS(null, 'r',  7);
      });

      pointElem.addEventListener('mouseleave', function () {
        pointElem.setAttributeNS(null, 'r',  3);
      });

      interact(pointElem).draggable({
        autoScroll: true,
        restrict: {
          restriction: 'parent',
          endOnly: false,
        },
        onmove: this.onDragPoint.bind(this),
        onend: this.onEndDragPoint.bind(this)
      });

      return pointElem;
    },

    onDragPoint: function (event) {
      if (runningAlgorithm) {
        return;
      }

      var target = event.target;
      var x = (parseFloat(target.getAttribute('cx')) || 0) + event.dx;
      var y = (parseFloat(target.getAttribute('cy')) || 0) + event.dy;

      target.setAttributeNS(null, 'cx', x);
      target.setAttributeNS(null, 'cy', y);
    },

    onEndDragPoint: function (event) {
      if (runningAlgorithm) {
        return;
      }

      var target = event.target;

      var index = (parseInt(target.getAttribute('index-input')) || 0)
      var x = (parseFloat(target.getAttribute('cx')) || 0);
      var y = (parseFloat(target.getAttribute('cy')) || 0);

      var point = input[index];
      point.x = x;
      point.y = y;

      var checked = $('input[name="show-steps"]')[0].checked;
      if (!checked) {
        this.view2D.removePolygon(hullElem);

        hull = IncrementalCH2D.run(input);
        hullElem = this.view2D.drawPolygon(hull, false);
        return;
      }

      if (hull && (!hull.contains(point) || (hull.vertices.indexOf(point) != -1))) {
        this.view2D.removePolygon(hullElem);
        this.startAlgorithm();
      }
    },

    startAlgorithm: function () {
      debug('Starting algorithm');

      runningAlgorithm = true;
      $('span.status').html(' Corriendo algoritmo (no se pueden draggear los puntos)');

      hull = IncrementalCH2D.makeFirstHull(input);
      hullElem = this.view2D.drawPolygon(hull, false);

      currentIndex = 3;

      this.stepAlgorithm();
      this.animateInterval = setInterval(this.stepAlgorithm.bind(this), 100);
    },

    stepAlgorithm: function () {
      $('span.index').html(' ' + currentIndex);

      if (currentIndex >= input.length) {
        debug('Stop algorithm');

        clearInterval(this.animateInterval);
        this.onStopAlgorithm();
        return;
      }

      // No hay punto elegido
      if (!currentPoint) {
        currentPoint = input[currentIndex];

        currentPointElem = inputElems[currentIndex];
        currentPointElem.setAttributeNS(null, 'r',  4);
        currentPointElem.setAttributeNS(null, 'fill',  'red');
        return;
      }

      // No hay tangentes y esta dentro
      if (!tangentLeft && hull.contains(currentPoint)) {
        currentPointElem.setAttributeNS(null, 'r',  3);
        currentPointElem.setAttributeNS(null, 'fill',  'black');

        currentPointElem = undefined;
        currentPoint = undefined;
        currentIndex++;

        return;
      }

      // No hay tangentes y no esta dentro
      if (!tangentLeft && !hull.contains(currentPoint)) {
        var indexLeft  = IncrementalCH2D.indexOfSupportVertex(hull, currentPoint, true);
        var indexRight = IncrementalCH2D.indexOfSupportVertex(hull, currentPoint, false);

        tangentLeft = this.view2D.drawLine(currentPoint, hull.vertices[indexLeft]);
        tangentRight = this.view2D.drawLine(currentPoint, hull.vertices[indexRight]);

        tangentLeft.setAttributeNS(null, 'stroke', 'blue');
        tangentRight.setAttributeNS(null, 'stroke', 'red');
        return;
      }

      // Ya hay tangentes
      if (tangentLeft) {
        this.view2D.removePolygon(hullElem);
        IncrementalCH2D.appendPoint(hull, currentPoint);

        hullElem = this.view2D.drawPolygon(hull, false);

        this.view2D.removeLine(tangentLeft);
        this.view2D.removeLine(tangentRight);
        tangentLeft  = undefined;
        tangentRight = undefined;

        currentPointElem.setAttributeNS(null, 'r',  3);
        currentPointElem.setAttributeNS(null, 'fill',  'black');
        currentPointElem = undefined;
        currentPoint = undefined;
        currentIndex++;
      }
    },

    onStopAlgorithm: function () {
      runningAlgorithm = false;
      $('span.status').html(' En espera (se pueden draggear los puntos)');
      $('span.index').html(' ');
    }
  };

  if (!exports) {
    exports = {};
  }

  module.exports = new UnfoldingsAndHulls();
});
