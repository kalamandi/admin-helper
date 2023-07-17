const { getAdmins } = require('../helpers');
const { cmds } = require('../app');
const { logs } = require('../keyboards');

exports.execute = async (ctx) => { 
    const admins = await getAdmins(ctx)
    const isAdmin = admins.find(x => x.member_id === ctx.senderId)

    let commands = cmds.filter(x => x.info.type == 'text' && access == isAdmin ? true : false)
        .map(cmd => `▫ ${cmd.text} -- ${cmd.description}`)
        .join('\n');

    return ctx.reply({
        message: `📖 Все доступные команды для ${isAdmin ? 'администратора' : 'пользователя'}:\n\n${commands}`,
        keyboard: logs
    })
}

exports.info = { 
    command: '/phelp',
    type: 'text',
    access: false,
    description: 'просмотр списка команд'
}