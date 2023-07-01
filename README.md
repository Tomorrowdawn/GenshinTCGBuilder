# GenshinTCGBuilder
Genshin, Genius Invokation TCG builder. TCG卡组配卡器,使用遗传算法.

## 依赖

geatpy
numpy

## 使用

我们推荐使用jupyter notebook(或者jupyter lab)运行本项目,可以获得最好的体验.

```
cd GenshinTCGBuilder/
pip install jupyter
jupyter notebook
```

使用`Trainer.train()`计算必要的矩阵，之后准备就绪。

使用`Trainer.predict(name, paras)`即可获得某个角色的最佳配队. 推荐的`paras`是`cb`和`GROUP_SIZE`. `cb`是一个算法权重, 介于`-1`到`+infty`之间. 我们的推荐取值是`-0.1~0.1`. `GROUP_SIZE`是遗传算法的种群大小, 不应低于`2000`.

### 新增数据

如果版本更新，需要在`scanner/images/X`下增加卡牌图片，同时维护`characters_index.csv`和`actions_index.csv`文件以保持一致（具体请参考[此项目](https://jogerj.github.io/genshin-tcg-cbir)的要求）。在`/uils.py`中我们提供了id映射工具，完成以上配置后需要运行`char_id_mapping`和`action_id_mapping`生成最新的索引数据。最后将文件移入`data/`下，即完成版本更新。

如果需要添加训练数据，请保证该数据使用原神的标准牌组预览格式（1200x1630,不符合该尺寸的必须缩放至该尺寸），然后将其加入`scanner/python/datasets/`中，再调用`pretreat.py`中的`update`方法。首次调用时请保证`data/`中没有版本控制文件（一般是`scanned.json`）。

## 致谢

十分感谢该项目提供的卡组扫描仪
https://jogerj.github.io/genshin-tcg-cbir
