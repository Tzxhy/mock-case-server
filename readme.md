# mock-server
该mock-server可配合airtest进行测试使用，为有状态的请求提供有状态的mock数据（称为 **mData** ）。

## 你需要知道的
### 测试的状态
测试 **case** 是有状态 **state** 的。何为状态？每一个请求的响应，并不是持久不变的，而是会随着请求人身份的不同、某些状态的改变等而改变。从测试的角度上，应该明确各个 case 的起始状态 mData ，某操作带给 mData 的change。因此，我们需要给每个 case 命名一个唯一 id 。






## 姿势

### 安装 server
```bash
npm install mock-case-server
```

### 初始化
```bash
cd path/to/your/config/dir
mcs init # 初始化一个 mock-case-server 项目
```
此时目录的结构为：
- package.json
- cases case 文件存放目录
- index.js case 入口文件
- responses 存放现有的JSON相应

charles 配置。
