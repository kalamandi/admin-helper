exports.execute = async (ctx) => { 
    await ctx.reply(`🕒 Начало рассылки...`);
    
    const users = await ctx.api.messages.getConversationMembers({
        peer_id: ctx.peerId
    }).catch(console.error);
            
    if (!users.items?.[0]) return ctx.reply('❗️ Не удалось получить участников беседы...');

    let total = 0;
    const unsended = [];

    const usersOnServer = await ctx.db.User.findAll({
        where: {
            server: ctx.peer.id,
            status: 1
        }
    });

    for (const user of users.items) {
        const userOnServer = usersOnServer.find(x => x.vk_id == user.member_id);

        if (!user.is_admin && user.member_id > 0 && !userOnServer) {
            total ++;

            await ctx.api.messages.send({
                message: `❗️ На сервере слишком мало администрации. Пожалуйста, зайдите на сервер для исправления ситуации.`,
                random_id: 0,
                peer_id: user.member_id,
            }).catch(e => {
                console.error(e)
                unsended.push(user.member_id)
            })
        };
    };

    await ctx.reply(`✅ Рассылка завершена.\n\nОтправлено сообщений: ${total - unsended.length}\nНе отправлено: ${unsended.length}${unreaded[0] ? `\n\n${unsended.map((us, i) => `[id${us}|${i + 1}]`).join(', ')}, напишите боту в ЛС любое сообщение.` : ''}`)

    return;
};

exports.info = { 
    command: '/gogame',
    type: 'text',
    access: true,
    description: 'рассылка администраторам о просьбе зайти в игру'
};