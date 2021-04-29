import * as tf from '@tensorflow/tfjs';
import './layer/graph-conv-layer';
import './layer/pooling-layer';
import { transGraphData, featureProcess, predictLog } from './utils';
import { Layout, GraphData, PredictGraphData } from '../types';

const LayoutTypes = ['force', 'radial', 'concentric', 'circular'];
let model: any = null;

const load = tf
  .loadLayersModel(
    'https://gw.alipayobjects.com/os/bmw-prod/c86b2dbb-ed03-421d-b080-2aad75cf4d47.json',
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
  const graphData = featureProcess(data.nodes, data.edges, 32);
  const res = await model.predict(graphData).data();
  return res;
};

export default {
  async predict(data: GraphData, expectLayout?: Layout | undefined, showLog?: boolean,  ) {
    const graphData = transGraphData(data);
    await getModel();
    const resData = await predictRes(graphData);
    const predictLayout = LayoutTypes[resData.indexOf(Math.max(...resData))] as Layout;
    const confidence = `${(Math.max(...resData) * 100).toFixed(2)}%`;
    if (showLog) {
      predictLog(predictLayout, confidence, expectLayout);
    }
    return { predictLayout, confidence };
  },
};
