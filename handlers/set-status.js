exports.execute = async (ctx) => { 
    const [, nick, status ] = ctx.args;
    if (!nick || !status || !['0', '1'].includes(status)) return ctx.reply('❗️ Введите никнейм и корректный статус.\n\nПример использования: /status Nikolay_Kalamandi 1 -- онлайн/0 -- оффлайн');

    const changed = await ctx.db.User.findOne({
        where: { 
            server: ctx.peer.id,
            nick
        }
    });

    if (!changed) return ctx.reply('❗️ Никого с таким ником не найдено.');
    
    changed.status = status
    await changed.save()

    return ctx.reply(`✅ Статус [id${changed.vk_id}|${changed.nick}] успешно изменён на ${status == 1 ? 'онлайн' : 'оффлайн'}`);
};

exports.info = { 
    command: '/status',
    type: 'text',
    access: true,
    description: 'изменить статус пользователя'
}