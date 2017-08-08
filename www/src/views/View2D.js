/**
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  var debug = require('debug')('app:view-2D');

  var SVGNS = 'http://www.w3.org/2000/svg';

  var View2D = function () {
    debug('Setup view 2D');

    this.svg = document.getElementById('viewport-2D');
  };

  View2D.prototype.drawPoint = function (vector, radius) {
    var point = document.createElementNS(SVGNS, 'circle');
    point.setAttributeNS(null, 'cx', vector.x);
    point.setAttributeNS(null, 'cy', vector.y);
    point.setAttributeNS(null, 'r',  radius);
    point.setAttributeNS(null, 'fill', 'black');

    this.svg.appendChild(point);

    return point;
  };

  View2D.prototype.drawText = function (str, x, y) {
    var text = document.createElementNS(SVGNS, 'text');
    text.setAttributeNS(null, 'x', x);
    text.setAttributeNS(null, 'y', y);
    text.setAttributeNS(null, 'fill', 'black');
    text.innerHTML = str;

    this.svg.appendChild(text);

    return text;
  };

  View2D.prototype.drawPolygon = function (polygon, drawIndexes) {
    var pointsStr = '';
    for (var i = 0; i < polygon.vertices.length; i++) {
      var vertex = polygon.vertices[i];
      pointsStr += (vertex.x + ',' + vertex.y + ' ');

      if (drawIndexes) {
        this.drawText('' + i, vertex.x, vertex.y);
      }
    }

    var polygonSVG = document.createElementNS(SVGNS, 'polygon');
    polygonSVG.setAttributeNS(null, 'points', pointsStr);
    polygonSVG.setAttributeNS(null, 'fill', 'none');
    polygonSVG.setAttributeNS(null, 'stroke', 'black');

    this.svg.appendChild(polygonSVG);

    return polygonSVG;
  };

  View2D.prototype.drawLine = function (start, end) {

    var line = document.createElementNS(SVGNS, 'line');
    line.setAttributeNS(null, 'x1', start.x);
    line.setAttributeNS(null, 'y1', start.y);
    line.setAttributeNS(null, 'x2', end.x);
    line.setAttributeNS(null, 'y2', end.y);
    line.setAttributeNS(null, 'stroke', 'black');

    this.svg.appendChild(line);

    return line;
  };

  View2D.prototype.removeLine = function (line) {
    this.svg.removeChild(line);
  };

  View2D.prototype.removePolygon = function (polygon) {
    this.svg.removeChild(polygon);
  };

  if (!exports) {
    exports = {};
  }

  module.exports = View2D;
});
