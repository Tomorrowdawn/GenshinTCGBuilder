# GenshinTCGBuilder
Genshin, Genius Invokation TCG builder. TCG卡组配卡器,使用遗传算法.

## 使用

我们推荐使用jupyter notebook(或者jupyter lab)运行本项目,可以获得最好的体验.

```
cd GenshinTCGBuilder/
pip install jupyter
jupyter notebook
```

`Trainer`是主要的类, 每个`Trainer`绑定一个数据集. 如果你不是很关心数据集bias之类的细节, 直接调用默认的即可.

先要调用`T.load()`加载已经预先处理好的数据集. 之后调用`T.train()`对数据集进行加工. 之后, 一切准备就绪.

使用`Trainer.predict(name, paras)`即可获得某个角色的最佳配队. 推荐的`paras`是`cb`和`GROUP_SIZE`. `cb`是一个算法权重, 介于`-1`到`+infty`之间. 我们的推荐取值是`-0.1~0.1`. `GROUP_SIZE`是遗传算法的种群大小, 不应低于`2000`.

## 致谢

十分感谢该项目提供的卡组扫描仪
https://jogerj.github.io/genshin-tcg-cbir
