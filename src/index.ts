import server from './server';
import MockCaseServer from './MCS';

server.use((context, next) => { // 加载参数
    context.state = {
        ...context.query,
        ...context.request.body,
    };
    next();
});

server.use(async (context, next) => { // 名中一个开始的 case
    if (context.path === '/changeCase') {
        const {
            caseId
        } = context.state;
        // 查找 case
        

    }

    next();
    
    
});
server.listen(8080);