import * as tf from '@tensorflow/tfjs';
import './layer/graph-conv-layer';
import './layer/pooling-layer';
import { transGraphData, featureProcess, predictLog } from './utils';
import { Layout, GraphData, PredictGraphData } from '../types';

const LayoutTypes = ['force', 'radial', 'concentric', 'circular'];

let model: any = null;

const loadModel = async () => {
  if (!model) {
    await tf.loadLayersModel(
      'https://gw.alipayobjects.com/os/bmw-prod/c86b2dbb-ed03-421d-b080-2aad75cf4d47.json',
    )
    .then(loadedModel => {
      model = loadedModel;
    });
  }
  return model;
}


const getModel = async () => {
  const loadedModel = await loadModel();
  return loadedModel;
};

const predictRes = async (data: PredictGraphData) => {
  // 孤点时默认使用circular
  if (data.nodes.length === 1) {
    return [0, 0, 0, 1];
  }
  const graphData = featureProcess(data.nodes, data.edges, 32);
  return await model.predict(graphData).data();
};

export default {
  async predict(data: GraphData, expectLayout?: Layout | undefined, showLog?: boolean,  ) {
    const graphData = transGraphData(data);
    await getModel();
    if (Array.isArray(data?.nodes) && data?.nodes.length > 0) {
      const resData = await predictRes(graphData);
      const predictLayout = LayoutTypes[resData.indexOf(Math.max(...resData))] as Layout;
      const confidence = `${(Math.max(...resData) * 100).toFixed(2)}%`;
      if (showLog) {
        predictLog(predictLayout, confidence, expectLayout);
      }
      return { predictLayout, confidence };
    }
    return {};
  },
};
