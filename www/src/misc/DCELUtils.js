/**
 * Funciones de utileria especificas para la construccion y manejo de DCEL.
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
  var DCELFace     = require('geom/dcel/DCELFace');

  // Definicion del modulo
  var DCELUtils = {

    /**
     * Crea una DCEL a partir de una instancia de THREE.Geometry.
     *
     * @param  { Object } geometry La geometria
     * @return { Object }          La DCEL construida
     */
    createDCELFromGeometry: function ( geometry ) {
      var dcel = new DCEL();

      geometry.vertices.forEach(function ( v ) {
        if (!dcel.getVertexByCoords(v)) {
          var vertex = new DCELVertex(v.x, v.y, v.z);
          dcel.addVertex(vertex);
        }
      });

      // "Punto de encuentro" para unir medias aristas con sus gemelas
      var meetPoint = {};
      geometry.faces.forEach(function ( f ) {

        // Vertices de la geometria
        var vAGeom = geometry.vertices[f.a];
        var vBGeom = geometry.vertices[f.b];
        var vCGeom = geometry.vertices[f.c];

        // Indices y vertices en la DCEL
        var vA = dcel.getVertexByCoords(vAGeom);
        var vB = dcel.getVertexByCoords(vBGeom);
        var vC = dcel.getVertexByCoords(vCGeom);

        // Creamos medias aristas
        var heA = new DCELHalfEdge(vA, vB);
        var heB = new DCELHalfEdge(vB, vC);
        var heC = new DCELHalfEdge(vC, vA);

        vA.incidentEdge = heA;
        vB.incidentEdge = heB;
        vC.incidentEdge = heC;

        this.matchTwinHalfEdge(heA, meetPoint);
        this.matchTwinHalfEdge(heB, meetPoint);
        this.matchTwinHalfEdge(heC, meetPoint);

        dcel.addHalfEdge(heA);
        dcel.addHalfEdge(heB);
        dcel.addHalfEdge(heC);

        var face = this.createFace(heA, heB, heC);
        dcel.addFace(face);
      }, this);

      return dcel;
    },

    /**
     * Encuentra el gemelo de una media arista usando que
     * el origen y final de su gemelo estan invertidos, asi
     * se crea un id auxiliar para ambos.
     *
     * Con estos ids se ocupa un objeto como punto de encuentro.
     *
     * @param  { Object } he        La media arista
     * @param  { Object } meetPoint Objeto auxiliar para punto de encuentro
     * @return { Object }           La arista gemela si la encontro
     */
    matchTwinHalfEdge: function ( he, meetPoint ) {
      var idAux  = he.origin.index + '-' + he.end.index;
      var twinId = he.end.index + '-' + he.origin.index;

      var twin = meetPoint[twinId];
      if (twin) {
        he.twin   = twin;
        twin.twin = he;

        delete meetPoint[twinId];
      } else {
        meetPoint[idAux] = he;
      }

      return twin;
    },

    /**
     * Construye una arista completa, es decir, sus dos medias aristas.
     * Se devuelve un arreglo, con las dos medias aristas:
     * [0] : DCELHalfEdge (arista del origen al final)
     * [1] : DCELHalfEdge (arista del final al origien)
     *
     * @param  { Object } origin El vertice origen de la arista
     * @param  { Object } end    El vertice final de la arista
     * @return { Object }        Las medias aristas gemelas entre si
     */
    createEdge: function ( origin, end ) {

      var originEnd = new DCELHalfEdge(origin, end);
      var endOrigin = new DCELHalfEdge(end, origin);

      originEnd.twin = endOrigin;
      endOrigin.twin = originEnd;

      origin.incidentEdge = originEnd;
      end.incidentEdge = endOrigin;

      return [ originEnd, endOrigin ];
    },

    /**
     * Construye una cara dadas sus tres aristas, sirve también para linkear
     * las medias aristas, i.e. establecer sus apuntadores correspondientes.
     *
     * El sentido de estas caras debe seguir la regla de la mano derecha.
     *
     * @param  { Object } heA La primera arista
     * @param  { Object } heB La segunda arista
     * @param  { Object } heC La tercera arista
     * @return { Object }     La cara construida
     */
    createFace: function ( heA, heB, heC ) {
      var component = [ heA, heB, heC ];

      // TODO: Fix component
      this.linkComponent(component);

      var face = new DCELFace(component[0], component[1], component[2]);

      component[0].incidentFace = face;
      component[1].incidentFace = face;
      component[2].incidentFace = face;

      return face;
    },

    /**
     * Enlaza un componente, es decir, asigna el previo y el siguiente de un
     * conjunto de aristas dadas en un arreglo con respecto al orden dado.
     *
     * @param { Array } component Un arreglo de medias aristas a enlazar
     */
    linkComponent: function ( component ) {
      for (var i = 0, len = component.length; i < len; i++) {
        var he     = component[i];
        var nextHe = component[(i + 1) % len];

        he.next     = nextHe;
        nextHe.prev = he;
      }
    }
  };

  if (!exports) {
    exports = {};
  }

  // Regresa la definicion del modulo como resultado
  module.exports = DCELUtils;
});
