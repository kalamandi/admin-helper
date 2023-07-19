exports.execute = async (ctx) => { 
    const [, min_admins = false ] = ctx.args;
    if (!min_admins 
        || !Number(min_admins) 
        || ctx.peer.notify == 0 
        || ctx.peer.min_admins == min_admins) return ctx.reply(ctx.peer.notify == 0 ? '🔕 Уведомления при маленьком количестве админов на сервере отключены.\n\nДля включения напишите /notify' : `🔔 Уведомления приходят когда на сервере меньше ${ctx.peer.min_admins} администраторов.\n\nДля изменения минимального числа администраторов, напишите /minadm [новое число]`);

    ctx.peer.min_admins = min_admins;
    await ctx.peer.save();

    return ctx.reply(`🔄 Теперь уведомления будут приходить когда на сервере менее ${ctx.peer.min_admins} администраторов.`);
};

exports.info = { 
    command: '/minadm',
    type: 'text',
    access: true,
    description: 'изменить мин. число админов на сервере'
};