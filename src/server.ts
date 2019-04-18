import Koa from 'koa';
import KoaBodyParser from 'koa-bodyparser';

const server = new Koa();


server.use(KoaBodyParser());

server.use(async (context, next) => {
    context.response.body = 'fsefsefsefs';
    await next();
});

// server.listen(8080);
export default server;

