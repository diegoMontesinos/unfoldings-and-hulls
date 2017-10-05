/**
 * Implementación del algoritmo "Divide y vencerás", también conocido como "Merge
 * hull", para calcular el cierre convexo (CH), de un conjunto finito (S) de puntos
 * en el plano.
 * Este algoritmo está basado en la estrategia "divide y vencerás".
 *
 * Primero se ordenan los puntos por el eje X. Y luego se sigue la siguente
 * regla de recurrencia (aquí es donde se aplica el divide y vencer):
 * - (Caso base) Si |S| <= 3, entonces es trivial calcular CH(S).
 * - (Recursión) Si |S| > 3, CH(S) es la unión de CH(S_{A}) y CH(S_{B}). Donde
 * S_{A} y S_{B} son subconjuntos de S resultado de partirlo a la mitad.
 *
 * El algoritmo tiene una complejidad de O(n log n).
 *
 * ------
 * Diego Montesinos [diegoMontesinos@ciencias.unam.mx]
 * Facultad de Ciencias, U.N.A.M.
 */
define(function (require, exports, module) {
  'use strict';

  var _            = require('underscore');
  var Vector       = require('math/Vector');
  var Polygon      = require('structures/Polygon');
  var ConvexHull2D = require('algorithms/ch2D/ConvexHull2D');

  var MergeHullCH2D = {

    /**
     * Ejecuta el algoritmo "merge hull" para calcular el cierre convexo.
     *
     * @param  {Array} input  El conjunto de puntos de entrada.
     * @return {Polygon}      El cierre convexo calculado, como un polígono.
     */
    run: function (input) {
      if (!this.validateInput(input)) {
        return undefined;
      }

      input.sort(Vector.comparatorByAxis('x'));
      var hull = this.hullOfPointsInRange(0, input.length - 1, input);

      return hull;
    },

    /**
     * Calcula el cierre convexo de los puntos que están entre un rango de índices
     * en un arreglo de puntos. S = p_{start}, p_{start+1}, ..., p_{end}
     *
     * Esta función se llama recursivamente siguiendo las reglas arriba descritas.
     *
     * @param  {Number} start   El índice de inicio del rango.
     * @param  {Number} end     El índice del final del rango.
     * @param  {Array}  points  El conjunto de puntos de entrada.
     * @return {Polygon}        El cierre convexo calculado.
     */
    hullOfPointsInRange: function (start, end, points) {
      var size = (end - start) + 1;
      if (size <= 3) {
        var baseCaseVertices = this.baseCaseVertices(start, end, points);
        return this.makeTriangle(baseCaseVertices);
      }

      var middle = Math.floor(size * 0.5) + start;

      var hullA = this.hullOfPointsInRange(start, middle - 1, points);
      var hullB = this.hullOfPointsInRange(middle, end, points);

      return this.mergeHulls(hullA, hullB);
    },

    /**
     * Devuelve los vértices de CH(S) cuando S es un caso base, es decir, cuando
     * |S| = 2 o |S| = 3.
     *
     * Hay un problema, si |S| = 2, no podemos hacer un cierre convexo pues no
     * se puede hacer polígono con dos puntos. En este caso rellenamos a los vértices
     * con un punto que se sabe no afectará (dummy point).
     *
     * @param  {Number} start   El índice de inicio del rango.
     * @param  {Number} end     El índice del final del rango.
     * @param  {Array}  points  El conjunto de puntos de entrada.
     * @return {Array}          Los vértices del caso base (triangulo).
     */
    baseCaseVertices: function (start, end, points) {
      var vertices = points.slice(start, end + 1);
      if (vertices.length < 3) {
        var p = vertices[0],
            q = vertices[1],
            r = points[end + 1];

        if (!r) {
          r = points[start - 1];
        }

        vertices.push(this.dummyPoint(p, q, r));
      }

      return vertices;
    },

    /**
     * Calcula un punto de relleno para los casos base de tamaño dos.
     *
     * Dicho punto no debe de afectar al cierre convexo de S, por lo tanto debe
     * de estar dentro. Una forma de asegurar que esté dentro es hacer la combinación
     * convexa de tres puntos [a, b, c] de S, con alfa = 1 / 3.
     *
     * @param  {Vector} a  Primer punto de S.
     * @param  {Vector} b  Segundo punto de S.
     * @param  {Vector} c  Tercer punto de S.
     * @return {Vector}    Punto de relleno.
     */
    dummyPoint: function (a, b, c) {
      var alpha = 1.0 / 3.0;
      return new Vector(
        alpha * (a.x + b.x + c.x),
        alpha * (a.y + b.y + c.y)
      );
    },

    /**
     * Calcula la unión, o mezcla, de dos cierres convexos A y B.
     * Este es el paso central y el que le da nombre al algoritmo.
     *
     * Para encontrar la unión de los cierres es necesario encontrar dos puntos
     * de soporte en A y en B. Estos cuatro puntos generan dos líneas dirigidas
     * tangentes a A y a B.
     * Una línea tangente deja a los dos cierres convexos contenidos en el semiplano
     * derecho y la otra los deja en el semiplano izquierdo.
     *
     * Después se unen los dos pedazos de cierre convexo, que delimitan los puntos
     * de soporte.
     *
     * @param  {Polygon} hullA  Un cierre convexo a unir.
     * @param  {Polygon} hullB  El otro cierre convexo.
     * @return {Polygon}        La unión de los cierres convexos.
     */
    mergeHulls: function (hullA, hullB) {
      var checkLeftTangent  = function (turnToLast, turnToNext) { return turnToNext > 0; };
      var checkRightTangent = function (turnToLast, turnToNext) { return turnToNext < 0; };

      var lowerTangent = this.tangentEndPoints({
        hullA      : hullA,
        hullB      : hullB,
        updateA    : this.previousIndexTo,
        updateB    : this.nextIndexTo,
        checkSideA : checkLeftTangent,
        checkSideB : checkRightTangent
      });

      var upperTangent = this.tangentEndPoints({
        hullA      : hullA,
        hullB      : hullB,
        updateA    : this.nextIndexTo,
        updateB    : this.previousIndexTo,
        checkSideA : checkRightTangent,
        checkSideB : checkLeftTangent
      });

      var sliceA = this.sliceOfHull(hullA, upperTangent.origin, lowerTangent.origin);
      var sliceB = this.sliceOfHull(hullB, lowerTangent.end, upperTangent.end);

      return new Polygon(sliceA.concat(sliceB));
    },

    /**
     * Obtiene los extremos de una línea tangente.
     * Una línea tangente deja a los dos cierres convexos contenidos en el semiplano
     * derecho y la otra los deja en el semiplano izquierdo.
     *
     * Para encontrarla ocupamos la idea de Preparata y Hong: elegir un vértice
     * de cada cierre convexo y "caminar" sobre ellos alternadamente hasta
     * que la tangente sea alcanzada.
     * Caminar significa tomar el siguiente vértice (+1) o el anterior (-1).
     *
     * @param  {Object}   args             Los argumentos de la función.
     * @param  {Polygon}  args.hullA       El cierre convexo A.
     * @param  {Polygon}  args.hullB       El cierre convexo B.
     * @param  {Function} args.updateA     La función que va a actualizar el caminar sobre A.
     * @param  {Function} args.updateB     La función que va a actualizar el caminar sobre B.
     * @param  {Function} args.checkSideA  La función que va a checar si A está del lado correcto.
     * @param  {Function} args.checkSideB  La función que va a checar si B está del lado correcto.
     * @return {Object}                    Los puntos extremos de la tangente.
     */
    tangentEndPoints: function (args) {
      var hullA      = args.hullA,
          hullB      = args.hullB,
          updateA    = args.updateA,
          updateB    = args.updateB,
          checkSideA = args.checkSideA,
          checkSideB = args.checkSideB;

      var indexA = hullA.indexOfRightmostVertex();
      var indexB = hullB.indexOfLeftmostVertex();

      var vertexA, vertexB;
      var isTangentToA, isTangentToB;

      var isTangentToBoth = false;
      while (!isTangentToBoth) {
        vertexA = hullA.vertices[indexA];
        vertexB = hullB.vertices[indexB];

        isTangentToA = this.isTangentLine({
          origin     : vertexB,
          indexOfEnd : indexA,
          hull       : hullA,
          checkSide  : checkSideA
        });

        isTangentToB = this.isTangentLine({
          origin     : vertexA,
          indexOfEnd : indexB,
          hull       : hullB,
          checkSide  : checkSideB
        });

        isTangentToBoth = isTangentToA && isTangentToB;

        if (!isTangentToBoth) {
          indexA = this.walkUntilReachTangent({
            origin      : vertexB,
            index       : indexA,
            hull        : hullA,
            update      : updateA,
            checkSide   : checkSideA
          });

          indexB = this.walkUntilReachTangent({
            origin      : vertexA,
            index       : indexB,
            hull        : hullB,
            update      : updateB,
            checkSide   : checkSideB
          });
        }
      }

      return {
        origin : indexA,
        end    : indexB
      };
    },

    /**
     * Camina sobre el cierre convexo hasta alcanzar una tangente.
     * La tangente se forma con un vértice del cierre y otro punto origen.
     * Se devuelve el índice del vértice alcanzado, al que llamamos vértice de
     * soporte.
     *
     * Caminar quiere decir actualizar el índice del vértice actual. Podemos caminar
     * hacia atrás o hacia delante, por lo que se requiere una función que actualice
     * el índice.
     *
     * @param  {Object}   args             Argumentos de la función.
     * @param  {Vector}   args.origin      Punto origen.
     * @param  {Number}   args.index       Índice actual, el que se va actualizar.
     * @param  {Polygon}  args.hull        El cierre convexo.
     * @param  {Function} args.update      Función que actualiza el índice.
     * @param  {Function} args.checkSide   La función que va a checar si está del lado correcto.
     * @return {Number}                    El índice del vértice de soporte.
     */
    walkUntilReachTangent: function (args) {
      var origin    = args.origin,
          index     = args.index,
          hull      = args.hull,
          updateI   = args.update,
          checkSide = args.checkSide;

      var isTanget = false;
      while (!isTanget) {
        isTanget = this.isTangentLine({
          origin     : origin,
          indexOfEnd : index,
          hull       : hull,
          checkSide  : checkSide
        });

        if (!isTanget) {
          index = update(index, hull);
        }
      }

      return index;
    },

    /**
     * Dado el índice de un vértice en un cierre convexo, devuelve el índice del
     * vértice anterior.
     *
     * @param  {Number}  currentIndex Índice del vértice actual.
     * @param  {Polygon} hull         Cierre convexo.
     * @return {Number}               Índice del vértice anterior.
     */
    previousIndexTo: function (currentIndex, hull) {
      if (currentIndex === 0) {
        return hull.vertices.length - 1;
      }

      return currentIndex - 1;
    },

    /**
     * Dado el índice de un vértice en un cierre convexo, devuelve el índice del
     * siguiente vértice.
     *
     * @param  {Number}  currentIndex Índice del vértice actual.
     * @param  {Polygon} hull         Cierre convexo.
     * @return {Number}               Índice del siguiente vértice.
     */
    nextIndexTo: function (currentIndex, hull) {
      return (currentIndex + 1) % hull.vertices.length;
    },

    /**
     * Devuelve los vértice de un pedazo de un cierre convexo delimitado por dos
     * índices.
     *
     * @param  {Polygon} hull  Cierre convexo del que se obtiene la rebanada.
     * @param  {Number} start  Índice del vértice de inicio de rebanada.
     * @param  {Number} end    Índice del vértice de final de rebanada.
     * @return {Array}         Los vértices que hayan caido en la rebanada.
     */
    sliceOfHull: function (hull, start, end) {
      var slice = [];

      var i = start;
      while (i != end) {
        slice.push(hull.vertices[i]);
        i = this.nextIndexTo(i, hull);
      }
      slice.push(hull.vertices[end]);

      return slice;
    }
  };
  _.extend(MergeHullCH2D, ConvexHull2D);

  if (!exports) {
    exports = {};
  }

  module.exports = MergeHullCH2D;
});
