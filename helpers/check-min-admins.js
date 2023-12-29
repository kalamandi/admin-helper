const { Op } = require("sequelize");
const { User, Server } = require("../database/models");

const { vk } = require('../app');
const { logs }= require('../keyboards');

module.exports = async () => { 
    const date = new Date();
    if (
        date.getUTCHours() + 3 < 9 
        || date.getUTCHours() + 3 > 23
    ) {
        return;
    }s;
    
    const servers = await Server.findAll({ where: { type: 'logs', notify: 1 } });
    servers.forEach(async(server) => {        
        const admins = await User.count({ 
            where: { 
                server: server.id, 
                status: { [Op.or]: [1, 2] }
            }
        });

        if (admins >= server.min_admins) {
            return;
        }

        const users = await vk.api.messages
            .getConversationMembers({
                peer_id: server.peer_id
            })
            .catch(console.error);
                
        if (!users.items?.[0]) {
            return
        };

        let text = [];

        users.items.forEach((user, index) => {  
            if (user.is_admin || user.member_id < 0) {
                return;
            }
            
            const arrayLength = Math.floor(index / 92)
            
            if (!text[arrayLength]) {
                text.push(`[id${user.member_id}|🟥]`);
                return;
            };

            text[arrayLength] += `[id${user.member_id}|🟥]`;

        });

        if (!text[0]) {
            return
        };

        await vk.api.messages.send({
            message: `❗️ Внимание, на сервере менее ${server.min_admins} администраторов, зайдите на сервер для исправления ситуации.${text[1] ? '' : `\n\n${text[0]}`}\n\nОтключить это уведомление можно с помощью команды /notify`,
            random_id: 0,
            peer_id: server.peer_id,
            keyboard: logs
        });

        if (text.length > 1) {  
            for (const t of text) {
                await vk.api.messages.send({
                    message: t,
                    random_id: 0,
                    peer_id: server.peer_id
                });
            }
        };
    });

    return setTimeout(module.exports, 1000*60*10);
};