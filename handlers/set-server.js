const { Keyboard } = require("vk-io");
const { getAdmins }= require("../helpers");

exports.execute = async (ctx) => { 
    const admins = await getAdmins(ctx);

    if (!admins[0]) return ctx.reply('Я не могу получить администраторов беседы.\n\nПожалуйста, выдйте администратора и попробуйте снова.');
    if (!admins.find(x => x.member_id === ctx.senderId)) return ctx.reply(`Установить сервер может только администратор беседы.`);

    const [, server] = ctx.args[1]
    if (!server) return ctx.send('Вы не указали номер сервера.')

    const isTiedPeer = await ctx.db.Server.findOne({
        where: { peer_id: ctx.peerId }
    })

    if (isTiedPeer) return ctx.reply(`❌ Ошибка привязки: данная беседа уже привязана к серверу.`);

    return ctx.send({
        message: 'Теперь укажите тип беседы',
        keyboard: Keyboard.builder()
        .callbackButton({
            label: 'Логирование (входы/выходы)',
            payload: { 
                command: 'setType',
                type: 'logs',
                server
            }
        }).inline()
    });
}

exports.info = { 
    command: '/setserver',
    type: 'text',
    access: true,
    description: 'привязка беседы к серверу'
}