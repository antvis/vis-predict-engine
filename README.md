# @antv/vis-predict-engine 可视化预测引擎

## 图布局预测
目前布局预测的模型由本引擎内置，支持force/radial的二布局分类，后续会支持dagre、concentric等布局。

### 使用方法
```
import { GraphLayoutPredict } from '@antv/vis-predict-engine';
const { predictLayout, confidence } = await GraphLayoutPredict.predict(data, expectLayout, showLog);
# 入参：①data: 图数据（格式见使用示例），必传; ②expectLayout: 期望布局(枚举，目前支持force、radial); ③
showLog: 是否需要打印日志（布尔，默认false）
# 返回：①predictLayout: 预测布局; ②confidence: 置信度。
```

### 使用示例
```
import { GraphLayoutPredict } from '@antv/vis-predict-engine';
const data = {
    nodes: [
        {
            id: '001',
            label: '电影awa'
        },
        {
            id: '002',
            label: '演员s'
        },
        {
            id: '003',
            label: '电影公司a'
        },
        {
            id: '004',
            label: '杭州'
        },
    ],
    edges: [
        {
            id: '100000',
            label: '主演',
            source: '002',
            target: '001',
        },
        {
            id: '100001',
            label: '出品',
            source: '003',
            target: '001',
        }
    ]
}
const { predictLayout, confidence } = await GraphLayoutPredict.predict(data, 'force');
```

