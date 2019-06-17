import Koa from 'koa';
import KoaBodyParser from 'koa-bodyparser';
import MockCaseServer, { MockCase } from './MCS';
import { ParameterizedContext } from 'koa';
import { changeCase, logChange, logNowState } from './log';
import { findMatchIndexByUrlPath, recordState, getRouteByUrlPath } from './utils';
import UrlPattern from 'url-pattern';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const server = new Koa();

server.use(KoaBodyParser());
server.use(async (ctx, next) => {
    console.log('url: ', ctx.path);
    return next();
});


// pac 文件
server.use((ctx: ParameterizedContext, next: any) => {
    if (ctx.path === '/pac.pac') {
        ctx.body = fs.readFileSync(path.resolve('pac.pac'), {
            encoding: 'utf8',
        });
        // ctx.set('Content-Type', 'application/x-ns-proxy-autoconfig')
        return;
    }
    return next();
});

server.use((context, next) => { // 加载参数
    context.state = {
        ...context.query,
        ...context.request.body,
    };
    return next();
});

server.use((ctx: ParameterizedContext, next: any) => { // 切换 case，以及检测当前是否有 case
    if (ctx.path === '/changeCase') {
        const {
            caseId
        } = ctx.state;

        const nowCase: MockCase | undefined = MockCaseServer.findCaseByName(caseId);
        
        if (!nowCase) { // 未找到该 case，报错
            ctx.body = {
                code: 404,
                msg: `Not found caseId ${caseId}.`,
            };
            return;
        } else { // 初始化状态
            changeCase(caseId);
            MockCaseServer.setState(JSON.parse(JSON.stringify(nowCase.defaultState)));
            ctx.body = {
                code: 0,
                msg: `Ok, now use ${caseId} for coming tests...`,
            };
            return;
        }
    }
    if (!MockCaseServer.currentCase) {
        ctx.body = {
            code: 500,
            msg: 'Please set caseId before start case!',
        };
        return;
    }
    return next();
});


function setResponseContentType(ctx: ParameterizedContext, value: string) {
    ctx.set('content-type', value || 'text/plain');
}

// 代理转发
server.use(async (ctx: ParameterizedContext, next: any) => {
    const path = ctx.path;
    const matchItem = getRouteByUrlPath(path, MockCaseServer.currentCase);
    if (matchItem && matchItem.transferTo) {
        let targetUrl = matchItem.transferTo;
        if (matchItem.path instanceof UrlPattern) { // 拼参数
            const matches = matchItem.path.match(path);
            console.log('matches', matches);
            
            for (const key in matches) {
                targetUrl = targetUrl.replace(`{{${key}}}`, matches[key]);
            }
        }
        const res = (await axios.get(targetUrl).catch(e => console.log(e))) || {data: '', headers: ''} ;
        const {
            data = {},
        } = res;
        
        ctx.body = data;
        // 设置响应头
        setResponseContentType(ctx, res.headers['content-type']);
        return;
    }
    return next();
});

server.use(async (ctx: ParameterizedContext, next: () => Promise<any>) => { // 匹配 change
    if (MockCaseServer.currentCase) {
        const changeIndex = findMatchIndexByUrlPath(ctx.path, MockCaseServer.currentCase);
        if (changeIndex !== -1) {
            const originState = MockCaseServer.state;
            const match = MockCaseServer.currentCase.matches[changeIndex];
            let urlPatternMatch = {};
            if (match.path instanceof UrlPattern) {
                urlPatternMatch = match.path.match(ctx.path);
            }
            const pattern = {
                ...urlPatternMatch,
            };
            let changedState: object = {};
            if (match.change) { // 存在 change 方法
                ctx.status = 200;
                changedState = (await match.change({ // 改变
                    ...ctx.state,
                    pattern,
                }, {
                    ...originState,
                })) || {};
            }

            MockCaseServer.setState({ // 保存状态
                ...originState,
                ...changedState,
            });

            const data = await match.data({ // 获得返回前端的数据
                ...ctx.state,
                pattern,
            }, {
                ...MockCaseServer.state,
            });
            ctx.body = data;
            logChange(ctx.path, MockCaseServer.currentCase.description, ctx.state, data);
            logNowState(MockCaseServer.state);

            return;
        }
    }
    return next();
});



server.use((ctx: ParameterizedContext) => {
    const {
        path
    } = ctx;
    ctx.body = {
        code: 404,
        msg: `Please add CHANGE '${path}' into CASE \`${MockCaseServer.currentCase.name}\` or check your request.`,
    };
    return;
});


server.on('close', () => {
    if (!MockCaseServer.currentCase) {
        return;
    }
    console.log(chalk.bgWhite.green('Please wait to record your state...'));
    // 记录状态
    recordState(MockCaseServer.currentCase.name, MockCaseServer.state);
    console.log(chalk.bgBlack.white('See you next time!'));
});
export default server;

