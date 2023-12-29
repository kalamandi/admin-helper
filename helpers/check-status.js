const { Server, User } = require("../database/models");
const { vk } = require('../app');

module.exports = async () => { 
    const servers = await Server.findAll({ where: { type: 'logs' } });

    for (const server of servers) {
        const admins = await User.findAll({ where: { server: server.id } });

        for (const admin of admins) {
            const time = new Date().getTime();
            const user = await User.findOne({ where: { id: admin.id } })

            if (time - new Date(admin.updatedAt).getTime() > 30000 && admin.status === 2) { 
                user.status = 0
                await user.save()
                
                await vk.api.messages.send({
                    message: `❗️ [id${admin.vk_id}|${admin.nick}] не отправил скриншот администрации в течение 30 сек.\nСтатус изменен на оффлайн 🔵`,
                    random_id: 0,
                    peer_id: server.peer_id
                })
            } 
            
            if (time - new Date(admin.updatedAt).getTime() > 1000 * 60 * 60 * 3 && admin.status === 1) {
                user.status = 0
                await user.save()

                await vk.api.messages.send({
                    message: `❗️ [id${admin.vk_id}|${admin.nick}] на сервере более 3 часов\nСтатус изменен на оффлайн 🔵`,
                    random_id: 0,
                    peer_id: server.peer_id
                });
            };
        }
    };

    return setTimeout(module.exports, 10 * 1000)
};