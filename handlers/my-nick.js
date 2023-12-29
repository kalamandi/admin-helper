exports.execute = async (ctx) => { 
    const [ , nick ] = ctx.args;

    if (
        !nick 
        || ctx.args[2] 
        || !nick.includes('_')
    ) {
        return ctx.reply(`❗️ Укажите ник в формате Nick_Name\n\nПример: /mynick Nikolay_Kalamandi`);
    };
    
    if (nick == ctx.user?.nick) return ctx.reply(`У Вас уже установлен этот ник...`); 

    const isNickBusy = await ctx.db.User.findOne({ where: { nick, server: ctx.peer.id } });
    if (isNickBusy) {
        return ctx.reply(`❗️ [id${isNickBusy.vk_id}|Пользователь] с таким ником уже есть в беседе`); 
    }

    if (!ctx.user) { 
        await ctx.db.User.create({
            vk_id: ctx.senderId,
            nick,
            server: ctx.peer.id
        });

        return ctx.reply(`✅ Вы успешно установили себе ник: ${nick}`);
    }
    
    await ctx.reply(`🔄 Вы успешно обновили себе ник: ${ctx.user.nick} → ${nick}`);

    ctx.user.nick = nick;
    await ctx.user.save();
    
    return;
};


exports.info = { 
    command: '/mynick',
    type: 'text',
    description: 'установка/изменение ника'
};