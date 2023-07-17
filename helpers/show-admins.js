const { Op } = require("sequelize");

module.exports = async (ctx, action = false) => {  // context, vk, user, peer, action
    const users = await ctx.db.User.findAll({
        where: { 
            server: ctx.peer.id,
            status: {
                [Op.or]: [1, 2]
            }
        }
    }) 

    let text = users.map((u, i) => `${i + 1}. ${u.nick}`).join('\n');
    let title
    
    if (!action) title = `[id${ctx.senderId}|${ctx.user.nick}], `;
    else action === -1 ? `➖ ${ctx.user.nick} вышел с сервера` : `➕ ${ctx.user.nick} зашел на сервер`; 

    if (text === '') text = '\n❗️ На сервере никого нет';
    else text = `На сервере:\n\n${text}\n\nВсего: ${users.length} чел.`

    return ctx.api.messages.send({
        message: `${title}\n${text}`,
        random_id: 0,
        peer_id: ctx.peerId
    });
};