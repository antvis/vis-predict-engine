/* eslint-disable */
import * as tf from '@tensorflow/tfjs';

class GraphPoolingLayer extends tf.layers.Layer {
  computeOutputShape(inputShape) {
    return [1, 4];
  }

  call(inputs) {
    return tf.tidy(() => {
      const nodesNum = inputs[0].shape[0];
      const kernel = [];
      for (let i = 0; i < nodesNum; i++) {
        kernel.push(1 / nodesNum);
      }
      const poolingKernel = tf.tensor2d([kernel]);
      const output = tf.dot(poolingKernel, inputs[0]);
      return tf.softmax(output);
    });
  }
}

GraphPoolingLayer['className'] = 'GraphPoolingLayer';

tf.serialization.registerClass(GraphPoolingLayer);

export default GraphPoolingLayer;
