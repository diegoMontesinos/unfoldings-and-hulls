define(function (require) {
  'use strict';

  var Vector = require('www/src/math/Vector.js');
  var expect = chai.expect;

  describe('Vector', function () {

    describe('#Vector', function () {
      it('Sin parametros, construye el vector cero', function () {
        var v = new Vector();
        expect(v.x).to.equal(0.0);
        expect(v.y).to.equal(0.0);
        expect(v.z).to.equal(0.0);
      });

      it('Construye un vector de dos dimensiones', function () {
        var v = new Vector(1.0, 1.0);
        expect(v.x).to.equal(1.0);
        expect(v.y).to.equal(1.0);
        expect(v.z).to.equal(0.0);
      });

      it('Construye un vector de tres dimensiones', function () {
        var v = new Vector(1.0, 1.0, 1.0);
        expect(v.x).to.equal(1.0);
        expect(v.y).to.equal(1.0);
        expect(v.z).to.equal(1.0);
      });
    });

    describe('#v.equals', function () {
      it('Un vector es igual a el mismo', function () {
        var v = new Vector();
        expect(v.equals(v)).to.be.true;
      });

      it('Un vector es igual a otro coordenada a coordenada', function () {
        var v1 = new Vector(1.0, 1.0, 1.0);
        var v2 = new Vector(1.0, 1.0, 1.0);
        expect(v1.equals(v2)).to.be.true;
      });

      it('Un vector es igual a otro por un EPSILON de diferencia', function () {
        var v1 = new Vector(1.0, 1.0, 1.0);
        var v2 = new Vector(1.0 + 1e-13, 1.0, 1.0);
        expect(v1.equals(v2)).to.be.true;
      });

      it('Dos vectores son distintos si lo son coordenada a coordenada', function () {
        var v1 = new Vector(1.0, 1.0, 0.0);
        var v2 = new Vector(1.0, 1.0, 1.0);
        expect(v1.equals(v2)).to.be.false;
      });
    });

    describe('#v.add', function () {
      it('La suma de dos vectores es sumar sus coordenadas', function () {
        var v = new Vector(0.0, 1.0, 0.0);
        v.add(new Vector(1.0, 1.0, 1.0));

        expect(v.x).to.equal(1.0);
        expect(v.y).to.equal(2.0);
        expect(v.z).to.equal(1.0);
      });
    });

    describe('#Vector.area2', function () {
      it('El area2 calcula el area con signo del paralelogramo', function () {
        var area2 = Vector.area2(
          new Vector(),
          new Vector(1.0, 0.0),
          new Vector(1.0, 1.0)
        );
        expect(area2).to.equal(1.0);

        area2 = Vector.area2(
          new Vector(),
          new Vector(1.0, 1.0),
          new Vector(1.0, 0.0)
        );
        expect(area2).to.equal(-1.0);
      });
    });

    describe('#Vector.areaSign', function () {
      it('Verifica la vuelta a la derecha', function () {
        var a = new Vector();
        var b = new Vector(1.0, 1.0);
        var c;

        var areaSign;
        for (var i = 0; i < 10; i++) {
          c = new Vector(i, i + 0.5);
          areaSign = Vector.areaSign(a, b, c);

          expect(areaSign).to.equal(1.0);
        }
      });

      it('Verifica la vuelta a la izquierda', function () {
        var a = new Vector();
        var b = new Vector(1.0, 1.0);
        var c;

        var areaSign;
        for (var i = 0; i < 10; i++) {
          c = new Vector(i, i - 0.5);
          areaSign = Vector.areaSign(a, b, c);

          expect(areaSign).to.equal(-1.0);
        }
      });
    });

    describe('#Vector.areCollinear', function () {
      it('Un punto es colineal consigo mismo', function () {
        var v = new Vector(1.0, 1.0);
        expect(Vector.areCollinear(v, v, v)).to.be.true;
      });

      it('Puntos en la misma linea, son colineales', function () {
        var a = new Vector(1.0, 1.0);
        var b = new Vector(2.0, 3.0);
        var c = new Vector(0.5 * (a.x + b.x), 0.5 * (a.y + b.y));

        expect(Vector.areCollinear(a, b, c)).to.be.true;
      });

      it('Puntos en un triangulo, no son colineales', function () {
        var a = new Vector();
        var b = new Vector(1.0, 0.0);
        var c = new Vector(1.0, 1.0);

        expect(Vector.areCollinear(a, b, c)).to.be.false;
      });
    });

    describe('#Vector.comparatorByAxis', function () {
      it('Compara por los ejes', function () {
        var comparatorByX = Vector.comparatorByAxis('x');
        var comparatorByY = Vector.comparatorByAxis('y');
        var comparatorByZ = Vector.comparatorByAxis('z');

        var v1 = new Vector(0.0, 0.0, 20.0);
        var v2 = new Vector(-1.0, 1.0, 20.0);

        expect(comparatorByX(v1, v2) > 0).to.be.true;
        expect(comparatorByY(v1, v2) < 0).to.be.true;
        expect(comparatorByZ(v1, v2) === 0).to.be.true;
      });
    });

    describe('#Vector.lexicographicalComparator', function () {
      it('Compara lexicograficamente dos vectores con la misma x', function () {
        var v1 = new Vector(10.0, -10.0);
        var v2 = new Vector(10.0, 0.0);

        expect(Vector.lexicographicalComparator(v1, v2) < 0).to.be.true;
      });

      it('Compara lexicograficamente dos vectores con la misma x, y', function () {
        var v1 = new Vector(5.0, 5.0, -9.0);
        var v2 = new Vector(5.0, 5.0, 0.0);

        expect(Vector.lexicographicalComparator(v1, v2) < 0).to.be.true;
      });
    });
  });
});
