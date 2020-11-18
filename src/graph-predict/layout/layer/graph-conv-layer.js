import * as tf from '@tensorflow/tfjs';

class GraphConvLayer extends tf.layers.Layer {
  constructor(options) {
    super(options);
    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });
    this.useBias = true;
    this.biasInitializer = tf.initializers.zeros();
    this.biasRegularizer = null;
  }

  computeOutputShape() {
    return [null, this.units];
  }

  build() {
    super.build();
    this.kernel = this.addWeight(
      'kernel',
      [this.inputDim, this.units],
      null,
      this.kernelInitializer,
      this.kernelRegularizer,
      true,
    );

    if (this.useBias) {
      this.bias = this.addWeight(
        'bias',
        [this.units],
        null,
        this.biasInitializer,
        this.biasRegularizer,
        true,
      );
    } else {
      this.bias = null;
    }
    this.built = true;
  }

  call(inputs) {
    return tf.tidy(() => {
      const featureShape = inputs[0].shape;
      // 兼容特征大小为1的时候
      const features = (featureShape[0] === 1 && inputs[0].squeeze([0])) || inputs[0];
      const basis = inputs[1].squeeze([0]);
      let output = tf.dot(basis, features);
      output = tf.dot(output, this.kernel.read());
      if (this.bias) output = output.add(this.bias.read());
      if (typeof this.activation === 'string') {
        let activation = tf[this.activation];
        if (this.activation === 'primary') {
          activation = x => x;
        }
        return activation(output);
      }
      return this.activation(output);
    });
  }

  getConfig() {
    const basicConfig = super.getConfig();
    const config = {
      units: this.units,
      support: this.support,
      activation: this.activation,
      useBias: this.useBias,
      inputDim: this.inputDim,
      kernelInitializer: this.kernelInitializer,
      biasInitializer: this.biasInitializer,
      kernelRegularizer: this.kernelRegularizer,
      biasRegularizer: this.biasRegularizer,
      activityRegularizer: this.activityRegularizer,
      kernelConstraint: this.kernelConstraint,
      biasConstraint: this.biasConstraint,
    };
    return {
      ...basicConfig,
      ...config,
    };
  }
}

GraphConvLayer.className = 'GraphConvLayer';

tf.serialization.registerClass(GraphConvLayer);

export default GraphConvLayer;
