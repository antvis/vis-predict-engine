import * as tf from '@tensorflow/tfjs';
import './layer/graph-conv-layer';
import './layer/pooling-layer';
import { transGraphData, featureProcess, predictLog } from './utils';
import { Layout, GraphData, PredictGraphData } from '../types';

let model: any = null;

const load = tf
  .loadLayersModel(
    'https://gw-office.alipayobjects.com/bmw-prod/d6ba24de-1587-45ab-a2c8-1f1d17488db4.json',
  )
  .then(loadedModel => {
    model = loadedModel;
    return model;
  });

const getModel = async () => {
  const loadedModel = await load;
  return loadedModel;
};

const predictRes = async (data: PredictGraphData) => {
  const graphData = featureProcess(data.nodes, data.edges, 16);
  const res = await model.predict(graphData).data();
  return res;
};

export default {
  async predict(data: GraphData, expectLayout: Layout, showLog: boolean = false) {
    const graphData = transGraphData(data);
    await getModel();
    const res = await predictRes(graphData);
    const predictLayout = res[0] > res[1] ? Layout.force : Layout.radial;
    const confidence = `${(Math.max(res[0], res[1]) * 100).toFixed(2)}%`;
    if (showLog) {
      predictLog(expectLayout, predictLayout, confidence);
    }
    return { predictLayout, confidence };
  },
};
