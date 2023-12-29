const { getAdmins } = require('../helpers');
const { logs } = require('../keyboards');

exports.execute = async (ctx) => { 
    const { cmds } = require('../app');

    const admins = await getAdmins(ctx)
    const isAdmin = admins.find(x => x.member_id === ctx.senderId);

    const cmdsFiltred = [];

    cmds.forEach(c => {
        if (c.info.type != 'text') {
            return;
        }

        if (c.info.access && !isAdmin) {
            return;
        };
        
        return cmdsFiltred.push(c)
    });

    let commands = cmdsFiltred
        .map(cmd => `▫ ${cmd.info.command} -- ${cmd.info.description}`)
        .join('\n');

    return ctx.reply({
        message: `📖 Все доступные команды для ${isAdmin ? 'администратора' : 'пользователя'}:\n\n${commands}`,
        keyboard: logs
    })
}

exports.info = { 
    command: '/phelp',
    type: 'text',
    description: 'просмотр списка команд'
}