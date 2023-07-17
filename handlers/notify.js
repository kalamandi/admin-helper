exports.execute = async (ctx) => { 
    ctx.peer.notify = ctx.peer.notify == 1 ? 0 : 1;
    await ctx.peer.save();

    return ctx.reply(`${ctx.peer.notify == 0 ? '0️⃣' : '1️⃣'} уведомления успешно ${ctx.peer.notify == 0 ? 'отключены' : 'включены'}`);
};


exports.info = {
    command: '/notify',
    type: 'text',
    access: true,
    description: 'отключение уведомлений, если в игре мало админов'
};