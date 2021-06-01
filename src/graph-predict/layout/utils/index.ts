import * as tf from '@tensorflow/tfjs';
import { GraphData, Layout, PlainObject, FinalNode, FinalEdge } from '../../types';

export const featureProcess = (nodes: FinalNode[], edges: FinalEdge[], featureCount: number) => {
  const nodesMap: PlainObject = {};
  const nodesNumber = nodes.length;

  const adjacentMatrix = new Array(nodesNumber);
  const featureMatrix = new Array(nodesNumber);

  // 构建邻接矩阵
  for (let i = 0; i < adjacentMatrix.length; i++) {
    adjacentMatrix[i] = new Array(nodesNumber).fill(0);
  }

  // 构建节点特征矩阵
  for (let i = 0; i < featureMatrix.length; i++) {
    featureMatrix[i] = new Array(featureCount).fill(0);
  }

  for (let i = 0; i < adjacentMatrix.length; i++) {
    for (let j = 0; j < adjacentMatrix.length; j++) {
      if (i === j) adjacentMatrix[i][j] = 1;
    }
  }

  nodes.forEach((node, index) => {
    nodesMap[node.id] = index;
    const outDegree = edges.filter(item => item.from === node.id).length;
    const inDegree = edges.filter(item => item.to === node.id).length;

    // 特征矩阵初始化
    for (let i = 0; i < featureCount; i++) {
      featureMatrix[index][i] = (outDegree + inDegree) / featureCount;
    }
  });

  edges.forEach(edge => {
    const { to, from } = edge;
    const toIndex = nodesMap[to];
    const fromIndex = nodesMap[from];
    if (toIndex === undefined || fromIndex === undefined) return;
    adjacentMatrix[fromIndex][toIndex] = 1;
    adjacentMatrix[toIndex][fromIndex] = 1;
  });

  const adjTensor = tf.tensor2d(adjacentMatrix);
  const featureTensor = tf.tensor2d(featureMatrix);
  // @ts-ignore
  const D = tf.diag(tf.pow(adjTensor.sum(1), tf.tensor(-0.5)).flatten(), 0); // 加权平均邻接特征
  const adjNormlized = adjTensor
    .dot(D)
    .transpose()
    .dot(D);

  // 节点特征矩阵为稀疏矩阵，需要对特征值进行最小值剪裁，否则会出现NaN
  const featuerNormlized = featureTensor.div(
    featureTensor
      .sum(1)
      .reshape([-1, 1])
      .clipByValue(1e-8, Infinity),
  );

  return [featuerNormlized.expandDims(0), adjNormlized.expandDims(0)];
};

export const transGraphData = (data: GraphData) => {
  const { nodes = [], edges = [] } = data;
  const nodesData: FinalNode[] = [];
  const edgesData: FinalEdge[]= [];
  nodes.forEach(item => {
    nodesData.push({ id: String(item.id) });
  });
  edges.forEach(edge => {
    edgesData.push({
      from: String(edge.source || edge.from ),
      to: String(edge.target || edge.to ),
    });
  });
  return {
    nodes: nodesData,
    edges: edgesData,
  };
};

export const predictLog = (predictedRes: Layout, confidence: string, expectLayout?: Layout | undefined) => {
  console.log('%c@antv/vis-predict-engine图布局预测', 'color: #99CCCC;font-size: 16px;');
  if(expectLayout){
    console.log(
      '%c期望布局',
      'background: #FFCC99;color:#fff;padding:5px;border-radius:5px;',
      expectLayout,
    );
  }
  console.log(
    '%c预测布局',
    'background: #CCCCFF;color: #fff;padding:5px;border-radius:5px;',
    predictedRes,
  );
  console.log(
    '%c置信度',
    'background: #FF9966;color: #fff;padding:5px;border-radius:5px;',
    confidence,
  );
};

export default { featureProcess, transGraphData, predictLog };
