define(function (require, exports, module) {
  'use strict';

  var AlgorithmRunner = function () {
    this.reset();
  };

  AlgorithmRunner.prototype.reset = function () {
    this.steps = undefined;
    this.stepIndex = 0;

    this.currentStep = undefined;
    this.currentData = undefined;

    this.doing = false;
  };

  AlgorithmRunner.prototype.setup = function (initialStep, inputData) {
    this.steps = [ initialStep ];
    this.stepIndex = 0;

    this.currentStep = initialStep;
    this.currentData = inputData;
  };

  AlgorithmRunner.prototype.run = function () {
    this.forward();
  };

  AlgorithmRunner.prototype.forward = function () {
    if (this.doing) {
      return;
    }

    this.doing = true;
    this.currentStep.forward(this.currentData, this.done.bind(this));
  };

  AlgorithmRunner.prototype.done = function (outputData, nextStep) {
    this.doing = false;

    this.currentData = outputData;
    this.stepIndex++;

    if (nextStep !== undefined) {
      this.steps.push(nextStep);
      this.currentStep = this.steps[this.stepIndex];
    }

    if (this.hasNext()) {
      this.forward();
    } else {
      console.log('Termine!');
      console.log(this.currentData);
    }
  };

  AlgorithmRunner.prototype.hasNext = function () {
    return (this.steps !== undefined) && (this.stepIndex < this.steps.length);
  };

  AlgorithmRunner.prototype.hasPrevious = function () {
    return (this.steps !== undefined) && (this.stepIndex >= 0);
  };

  if (!exports) {
    exports = {};
  }

  module.exports = AlgorithmRunner;
});
