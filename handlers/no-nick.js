exports.execute = async (ctx) => {
    const nicks = await ctx.db.User.findAll({
        where: { 
            server: ctx.peer.id
        }
    });

    try {
        const users = await vk.api.messages.getConversationMembers({
            peer_id: ctx.peerId
        })    

        const text = users.profiles
        .filter(item => !nicks.find(x => x.vk_id === item.id) && item.id > 0)
        .map((item) => `▪️ [id${item.id}|${item.first_name} ${item.last_name}]`)
        .join('\n')

        return ctx.send(`ℹ️ [id${ctx.user.vk_id}|${ctx.user.nick}], пользователи без ника:\n\n${text === '' ? 'не найдены' : text}`);
    } catch (error) {
        return ctx.reply('Я не могу получить участников беседы.\n\nПожалуйста, выдйте администратора и попробуйте снова.');        
    }
};


exports.info = {
    command: '/nonick',
    type: 'text',
    access: true,
    description: 'список участников беседы без ника'
}