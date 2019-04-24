import Koa from 'koa';
import KoaBodyParser from 'koa-bodyparser';
import MockCaseServer, { MockCase } from './MCS';
import { ParameterizedContext } from 'koa';
import { changeCase, logChange, logNowState } from './log';
import { findIndexByUrlPath, recordState } from './utils';
import UrlPattern from 'url-pattern';
import chalk from 'chalk';


const server = new Koa();

server.use(KoaBodyParser());

server.use((context, next) => { // 加载参数
    context.state = {
        ...context.query,
        ...context.request.body,
    };
    next();
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
            MockCaseServer.setState(nowCase.defaultState);
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
    next();
});

server.use(async (ctx: ParameterizedContext, next: () => Promise<any>) => { // 匹配 change
    if (MockCaseServer.currentCase) {
        const changeIndex = findIndexByUrlPath(ctx.path, MockCaseServer.currentCase);
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
                changedState = match.change({ // 改变
                    ...ctx.state,
                    pattern,
                }, {
                    ...originState,
                });
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
    next();
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
    console.log(chalk.bgWhite.green('Please wait to record your state...'));
    // 记录状态
    recordState(MockCaseServer.currentCase.name, MockCaseServer.state);
    console.log(chalk.bgBlack.white('See you next time!'));
});
export default server;

