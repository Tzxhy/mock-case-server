# mock-state-server
该 mock-state-server(简称 mcs) 为有状态的请求提供有状态的mock数据（称为 **mData** ）。
This mcs(shorthand for mock-case-server) provides stateful mock data.

## 你需要知道的
## You need know
### 测试的状态
### state of case
测试 **case** 是有状态 **state** 的。何为状态？每一个请求的响应，并不是持久不变的，而是会随着请求人身份的不同、某些状态的改变等而改变。从测试的角度上，应该明确各个 case 的起始状态 mData ，某操作带给 mData 的change。因此，我们需要给每个 case 命名一个唯一 id 。
Test cases are stateful. What's state? One response (http response, e.g.) will change with the different requesters, or some different params you provide. From the aspect of case, we should know the case's default state, and some operations can modify those state. So, we need to name every case.

## 姿势
## Prepare
### 安装 server
### install
```bash
npm install mock-case-server -g
```

### 初始化
### initial case-project
```bash
cd path/to/your/case/dir
mcs init
```
此时目录的结构为：
Now, you can see:
- package.json
- cases case dir
    - case1.js case-test
- index.js entry
- responses some existing json res
- log.log 


### 命令行帮助
### cli help
```bash
mcs -h
```

### 编写自己的 case
在 case 目录中，编写 case2.js，如：
```js

var Case = require('mock-case-server').MockCase;
var case2 = new Case('case2', {
    defaultState: {
        name: 'test',
        tooManyRequest: false,
    },
    description: 'for case2 test',
});
let requestTime = 0;
case2.addChange({
    path: '/test',
    change: function (query, originState) {
        requestTime++;

        const data = {
            name: originState,
        };
        if (requestTime > 2) {
            data.tooManyRequest = true;
        }
        // filed 'query' cantains url params and body params, and url pattern 
        return data;
    },
    data: function (query, changedState) {
        return {
            tooManyRequest: changedState.tooManyRequest,
        };
    }
});
module.exports = case2;


// in ../index.js
// add this
const case2 = require('./cases/case2');
MockCaseServer.loadCases([case1, case2]);
```
Note: 
1. path可以为常规字符串，或者[url-pattern](https://www.npmjs.com/package/url-pattern)。可直接从 mock-case-server 中引入。
2. change / data 方法中 query 参数包含 url 参数和 body 参数，还有个 pattern字段，表明从 url-pattern 解析出的参数。
3. change 后返回的对象，会和原来的originState合并，因此在代码中不必手动合并。 data 返回的对象仅用于前端，不会改变状态对象。

___
In addChange:
1. path can be regular string, or instance of [url-pattern](https://www.npmjs.com/package/url-pattern) which can be import directly from 'mock-case-server'.
2. param 'query' in change/data contains url params (/path?param=xxxx) and body params (both form and json). Apart from that, there is a field named pattern, indicated url-param-matched data.
3. method data return an object for FE, and it will not modify the state object.

## 开始测试
## Start
1. 发送设置 case 的请求：http://localhost:8080/changeCase?caseId=[caseName]
2. 发送你定义的 changes 相关 api。
3. 当前 case 完成，切换下一个 case，重复流程1.每一个 case 的状态都是独立的，互不影响。
___
1. send a request to set exact case before start testing: http://localhost:8080/changeCase?caseId=[caseName]
2. you are free to send API you set in your changes.
3. Send another changeCase request like step 1 if you wanna another case. Each case is run in its own space, and not affect other cases' state.

