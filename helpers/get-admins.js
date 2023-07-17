module.exports = async (ctx) => { 
    try {
        const members = await ctx.api.messages.getConversationMembers({
            peer_id: ctx.peerId
        });

        const admins = members.items.filter(m => m.is_admin);

        return admins;
    } catch (error) {
        console.error(err)
        await ctx.reply('Я не могу получить администраторов беседы.\n\nПожалуйста, выдйте администратора и попробуйте снова.');
        
        return [];   
    }
};