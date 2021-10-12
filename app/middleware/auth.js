// eslint-disable-next-line strict
module.exports = (options = { required: true }) => {
  return async (ctx, next) => {
    // 获取请求头中的token数据
    let token = ctx.headers.authorization;
    token = token
      ? token.split('Bearer ')[1] // Bearer空格token数据
      : null;
    // 验证token，无效401

    if (token) {
      try {
        // 3. token 有效，根据 userId 获取用户数据挂载到 ctx 对象中给后续中间件使用
        const data = ctx.service.user.verifyToken(token);
        ctx.user = await ctx.model.User.findById(data.userId);
      } catch (err) {
        ctx.throw(401);
      }
    } else if (options.required) {
      ctx.throw(401);
    }

    // next 执行后续中间件
    await next();
  };
};
