# mock-state-server
该 mock-state-server(简称 mcs) 为有状态的请求提供有状态的mock数据（称为 **mData** ）。
This mcs(shorthand for mock-case-server) provides stateful mock data.

## 你需要知道的
## You need know
### 测试的状态
### state of case
测试 **case** 是有状态 **state** 的。何为状态？每一个请求的响应，并不是持久不变的，而是会随着请求人身份的不同、某些状态的改变等而改变。从测试的角度上，应该明确各个 case 的起始状态 mData ，某操作带给 mData 的change。因此，我们需要给每个 case 命名一个唯一 id 。
Test cases are stateful. What's state? One response (http response, e.g.) will change with the different requesters, or some different params you provide. From the aspect of case, we should know the case's default state, and some operations can modify those state. So, we need to name every case to determine whether we are using the same case in one test.

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
mcs init [-p port] [-h host]
```
此时目录的结构为：
Now, you can see:
- package.json
- cases case dir
    - case1.js: initial case
    - case2.js: initial case
- .mcs.config: mcs config file
- responses: some existing json res
- log.log


### 命令行帮助
### CLI help
```bash
mcs -h
```

### 编写自己的 case
### Write your case
进入 cases 目录，键入: 
Into directory cases, input:
```base
mcs new testCase
# mcs new [case-name]
# if file name exists, it will throw an Error.
```
得到默认模板：
get defalut template:
```js
const Case = require('mock-case-server').MockCase;
const UrlPattern = require('mock-case-server').UrlPattern;

// you may need to change case name.
const myCase = new Case('{{caseName}}', {
    defaultState: { // used to initial this case origin state
        login: false,
        money: 0,
        name: 'test',
    },
    description: '', // description. uesd in log
});
myCase.addChange({
    path: '/change1',
    change(query, originState) {
        // filed 'query' cantains url params and body params
        for (let i in query) {
            originState[i] = query[i];
        }
        return originState;
    },
    data(query, changedState) {
        return changedState;
    }
});
myCase.addChange({
    path: new UrlPattern('/makeMoney(/:money)'),
    change(query, originState) {
        // filed 'query' also cantains pattern field
        if (query.pattern.money) {
            originState.money += Number(query.pattern.money);
        }
        return originState;
    },
    data(query, changedState) {
        return changedState;
    }
});

// if you don't use this case, just comment out the next line.
module.exports = myCase;

```
Note: 
1. path可以为常规字符串，或者[url-pattern](https://www.npmjs.com/package/url-pattern)。
2. change / data 方法中 `query` 参数包含 url 参数和 body 参数，还有个 pattern 字段，表明从 url-pattern 解析出的参数。
3. change 后返回的对象，会和原来的originState合并，不必手动合并。 data 返回的对象仅用于前端，不会改变状态对象。
4. 可以添加 transferTo 字段，只用于生成对应的 charles map项。
___
Method `addChange`:
1. path can be regular string, or instance of [url-pattern](https://www.npmjs.com/package/url-pattern).
2. param `query` in change/data contains url params (/path?param=xxxx) and body params (both form and json, using koa-bodyparser). Apart from that, there is a field named `pattern`, indicated url-param-matched data.
3. method `data` return an object for FE, and it will not modify the state object.
4. you can add field `transferTo` in `change`, used to generete charles map item.

## 开始测试
## Start
1. 发送设置 case 的请求（如果加载了多个 case 的话）：http://localhost:8080/changeCase?caseId=[caseName]
2. 发送你定义的 changes 相关 api。
3. 当前 case 完成，切换下一个 case，重复流程1.每一个 case 的状态都是独立的，互不影响。
___
1. send a request to set current case before start testing(if you provide more than one case): http://localhost:8080/changeCase?caseId=[caseName]
2. you are free to send APIs you set in your case changes.
3. Send a changeCase request like step 1 if you switch to another case. Each case is run in its own scope, and not affect other cases' state.

## 定义
## Definition
```ts
interface Change {
    path: string | UrlPattern,
    change?(query: object, originState: object): object;
    data(query: object, changedState: object): object;
    transferTo?: string; // For charles to map
}
```
每一个 Change 可以包含这4个属性，当存在 transferTo 时，会忽略 change和 data，仅作为 charles 的map remote 项（mac 上只有这个代理工具好用一点）。

Every `Change` can contains these four fileds. When filed `transferTo` provided, `change` and `data` are ignored. Only used to generate charles map rempte item. [charles map remote](https://www.charlesproxy.com/documentation/tools/map-remote/)

## Q&A
- Q: run 'mcs start', show: Error: Cannot find module 'mock-case-server'?
- A: make sure your NODE_PATH rights. (`npm root -g` shows global root)

## changeLog
- 0.0.5
    - 在使用`mcs init -p port -h host`时，可以提供一个 host，用于 charles 中直接 import
    - 在运行`mcs init -h [host] && mcs start`后，会生成一个 charles 的 map.xml，可在 map remote 中直接 import(**注意备份原来的数据**)
    - `mcs start` 添加选项 -c，代表使用上次关闭服务时的 state
    - `mcs start` 添加选项 -w，只要 cases 目录一改变，就重启服务（状态会被保存）
    - 不必添加字段`change`，如果不需要更新数据的话
    - 添加字段`transferTo`，代表只作为 charles 的 map remote 项
    - 每一次改变一个 case 的 changes（比如修改 path、新增 change 等），需要手动charles 中 import 一下 map.xml。
___
- 0.0.5
    - you can set a proxy host when `mcs init`
    - after run `mcs init -h [host] && mcs start`, will generate a charles map file.
    - add `mcs start` option: -c, means continue with last case state and caseId.
    - add `mcs start` option: -w, if dir `cases` changes(file added, modified, removed), auto restart server(state preserved).
    - you don't have to provide `change` field in addChange.
    - add `transferTo` field in `addChange`, which just write map for charles(see example)
    - every time you add `change`, you may need to import new charles map.xml in your root dir.

- 0.0.4
    - 如果只有一个 case，则不需要设置 caseId;
    - 增加 mcs new 指令，添加一个 case.js 模板文件;
    - 去除根目录下 index.js 入口文件，只需要 cases 文件夹下每个文件默认导出一个 case 实例即可。
    - 增加测试用例。
    - fix: 去除创建项目时无用的 console.log

___

- 0.0.4
    - if there is only one case, no need to call changeCase.
    - add `mcs new [case-name]`, which can add a new case in dir 'cases'
    - remove root directory's entry `index.js`. Just use dir 'cases' to load all cases.
    - add some test cases.
    - fix: remove some useless log

