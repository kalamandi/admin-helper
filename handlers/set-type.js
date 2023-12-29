const { logs } = require('../keyboards');

exports.execute = async (ctx) => { 
    const { server, type } = ctx.eventPayload;

    const hasThisPeer = await ctx.db.Server.findOne({
        where: { server, type }
    })

    const isTiedPeer = await ctx.db.Server.findOne({
        where: { peer_id: ctx.peerId }
    })
 
    if (hasThisPeer) {
        return ctx.edit(`❌ Ошибка привязки: беседа с таким типом и сервером уже существует.`);
    }
    if (isTiedPeer) {
        return ctx.edit(`❌ Ошибка привязки: данная беседа уже привязана к серверу.`);
    }

    await ctx.db.Server.create({
        server, 
        type,
        peer_id: ctx.peerId
    });
    
    await ctx.edit(`✅ Беседа привязана к серверу №${server}\n\nТип беседы: ${type === 'punishes' ? 'наказания' : 'вход/выход\n\nЕсли на сервере мало администрации, бот будет присылать уведомления.\n\nЧтобы отключить эту функцию, напишите /notify'}`);

    /* В будущем я планирую сделать выдачу наказаний, что добавит ещё один тип. */

    if (type == 'logs') { 
        await ctx.api.messages.send({
            random_id: 0,
            peer_id: ctx.peerId,
            message: 'Вызвал кнопки.',
            keyboard: logs
        })
    };

    return;
}

exports.info = { 
    command: 'setType',
    type: 'callback'
};