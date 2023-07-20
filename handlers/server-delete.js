exports.execute = async (ctx) => { 
    const [, confirm = false ] = ctx.args
    if (!confirm || confirm != ctx.peer.server) return ctx.reply(`Напишите <</sdell ${ctx.peer.server}>> для подтверждения`);

    const { id: server } = ctx.peer;
    
    await ctx.peer.destroy()
    await ctx.db.User.destroy({ where: { server } });

    return ctx.send('Сервер и все ники удалены из базы данных.');
};

exports.info = { 
    command: '/sdell',
    type: 'text',
    access: true,
    description: 'отвязка сервера'
}