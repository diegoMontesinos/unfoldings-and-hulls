/**
 * Algoritmo "envoltura de regalo" (gift wrapping) para calcular el
 * cierre convexo (convex hull) de una coleccion de puntos.
 *
 * El cierre convexo es el minimo poliedro convexo que contiene
 * al conjunto de puntos.
 *
 * Este codigo esta basado en la descripcion del algoritmo del libro
 * Computational Geometry in C, Joseph O'Rourke.
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  // Dependencias
  var DCEL         = require('geom/dcel/DCEL');
  var DCELVertex   = require('geom/dcel/DCELVertex');
  var DCELHalfEdge = require('geom/dcel/DCELHalfEdge');
  var DCELUtils    = require('misc/DCELUtils');
  var Vector3      = require('math/Vector3');

  // Definicion del modulo
  var GiftWrapping3d = {
    run: function ( points ) {
      if (points.length < 4) {
        return;
      }

      var dcel = new DCEL();

      // Obtenemos la primera cara y encolamos sus medias aristas
      var firstFace = this.firstFace(points, dcel);
      var queue = [
        firstFace.heA,
        firstFace.heB,
        firstFace.heC
      ];

      this.processWrappingQueue(queue, points, dcel);

      return dcel;
    },

    firstFace: function ( points, dcel ) {

      var minZ = points[this.getIndexMinZ(points)];

      var vA = new DCELVertex(minZ.x, minZ.y, minZ.z);
      dcel.addVertex(vA);

      var vC = this.addNextVertex(vA, null, points, dcel);
      var vB = this.addNextVertex(vA, vC, points, dcel);

      return this.addWrappingFace(vA, vB, vC, dcel);
    },

    getIndexMinZ: function ( points ) {
      var indexMin = -1;
      var zMin = 0.0;
      for (var i = 0, len = points.length; i < len; i++) {
        if (indexMin === -1 || points[i].z < zMin) {
          indexMin = i;
          zMin     = points[i].z;
        }
      }

      return indexMin;
    },

    addNextVertex: function ( vA, vB, points, dcel ) {

      var nextPoint = this.findNextPoint(vA, vB, points);

      var nextVertex = dcel.getVertexByCoords(nextPoint);
      if (!nextVertex) {
        nextVertex = new DCELVertex(nextPoint.x, nextPoint.y, nextPoint.z);
        dcel.addVertex(nextVertex);
      }

      return nextVertex;
    },

    findNextPoint: function ( vA, vB, points ) {
      vB = !vB ? new Vector3(vA.x + 1, vA.y, vA.z) : vB;

      // Obtenemos el vector edge
      var edge = new Vector3();
      edge.subVectors(vB, vA);
      edge.normalize();

      // Iteramos obteniendo siempre el indice del punto con menor angulo
      var nextPointIndex = -1;
      for (var i = 0, len = points.length; i < len; i++) {
        var point = points[i];

        if (point.equals(vA) || point.equals(vB)) {
          continue;
        }

        if (nextPointIndex === -1) {
          nextPointIndex = i;
          continue;
        }

        // Obtenemos las proyeccion del punto y del candidato actual sobre el plano
        // tangente al vector edge
        var projNextPoint = this.projectOnTangentPlane(points[nextPointIndex], vA, edge);
        var projPoint     = this.projectOnTangentPlane(point, vA, edge);

        // Nos quedamos con el que este a la izquierda (menor angulo)
        var compare = this.compareTurn(projNextPoint, projPoint, edge);
        if (compare < 0.0 || (compare === 0.0 && projPoint.z < projNextPoint.z)) {
          nextPointIndex = i;
        }
      }

      var nextPoint = points[nextPointIndex];
      return nextPoint;
    },

    addWrappingFace: function ( vA, vB, vC, dcel ) {
      var iVA = dcel.getVertexIndexByCoords(vA);
      var iVB = dcel.getVertexIndexByCoords(vB);
      var iVC = dcel.getVertexIndexByCoords(vC);

      var heA = new DCELHalfEdge(vA, vB, iVA, iVB);
      var heB = new DCELHalfEdge(vB, vC);
      var heC = new DCELHalfEdge(vC, vA);
      dcel.addHalfEdge(heA);
      dcel.addHalfEdge(heB);
      dcel.addHalfEdge(heC);

      vA.incidentEdge = heA;
      vB.incidentEdge = heB;
      vC.incidentEdge = heC;

      var face = DCELUtils.createFace(heA, heB, heC);
      dcel.addFace(face);

      return face;
    },

    projectOnTangentPlane: function ( point, initV, normal ) {
      var projection = new Vector3();
      projection.subVectors(point, initV);
      projection.subVectors(projection, projection.projectOn(normal));

      return projection;
    },

    compareTurn: function ( vA, vB, vNormal ) {
      var cross = new Vector3();
      cross.crossVectors(vA, vB);

      return cross.dot(vNormal);
    },

    processWrappingQueue: function ( queue, points, dcel ) {

      // Punto de encuentro para unir medias aristas con sus gemelas
      var meetPoint = {};
      queue.forEach(function ( he ) {
        var id = he.origin.index + '-' + he.end.index;
        meetPoint[id] = he;
      });

      // Iteramos hasta que no haya aristas pendientes en la cola
      var currHE, origin, end;
      var nextVertex, face;
      while (queue.length !== 0) {

        // Desencolamos una media arista
        currHE = queue.shift();

        var notProcessed = !currHE.twin;
        if (notProcessed) {
          origin = currHE.origin;
          end    = currHE.end;

          // Encontramos el siguiente vertice y creamos la siguiente cara nueva
          nextVertex = this.addNextVertex(origin, end, points, dcel);
          face = this.addWrappingFace(nextVertex, end, origin, dcel);

          // Por cada media arista de la nueva cara
          face.getComponent().forEach(function ( he ) {

            // Si no existe su gemela, la encolamos para que sea procesada
            var twin = DCELUtils.matchTwinHalfEdge(he, meetPoint);
            if (!twin) {
              queue.push(he);
            }
          });
        }
      }
    }
  };

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = GiftWrapping3d;
});
