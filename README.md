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

## 致谢

十分感谢该项目提供的卡组扫描仪
https://jogerj.github.io/genshin-tcg-cbir
