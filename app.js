const { VK, Keyboard } = require('vk-io');
const fs = require('fs');

const vk = new VK({
    token: process.env.BOT_TOKEN
});

const setServerHandler = require('./handlers/set-server');

const sequelize = require('./database/index');
const db = require('./database/models');
const { getAdmins, showAdmins } = require('./helpers');

const src = [];

vk.updates.on('message_event', async (ctx) => { 
    if (process.env.TECH == 1) return

    ctx.edit = async (text) => { 
        return vk.api.messages.edit({
            peer_id: ctx.peerId,
            conversation_message_id: ctx.conversationMessageId,
            message: text,
        })
    }

    ctx.db = db

    const cmd = src.find(x => ctx.eventPayload.command == x.info.command && x.info.type === 'callback')
    if (!cmd) return

    if (cmd.info.access) {
        const admins = await getAdmins(ctx)
        if (!admins.find(x => x.member_id == ctx.senderId)) return
    }

    ctx.peer = await ctx.db.Server.findOne({ where: { peer_id: ctx.peerId } })
    if (!ctx.peer && ctx.eventPayload.command != 'setType') return

    ctx.user = await ctx.db.User.findOne({ 
        where: { 
            vk_id: ctx.userId,
            server: ctx.peer?.id ?? 0
        }
    })
    
    return cmd.execute(ctx)
});

vk.updates.on('message_new', async (ctx) => {
    if (ctx.peerType != 'chat') return ctx.send('Бот работает только в чатах для администрации Black Russia')
    console.log(`[NEW MESSAGE]: ${ctx.text ? ctx.text : ctx.attachments[0].type} | PID: ${ctx.peerId} | SID: ${ctx.senderId}`)

    ctx.db = db
    ctx.peer = await ctx.db.Server.findOne({ where: { peer_id: ctx.peerId } })
    if (!ctx.peer && ctx.args[0] != '/setserver') return

    ctx.user = await ctx.db.User.findOne({ where: { vk_id: ctx.senderId, server: ctx.peer.id } })
    if (!ctx.user && ctx.args[0] != '/mynick') return

    if (ctx.user?.status === 2) { 
        if (ctx.message?.attachments?.find(x => x.type === 'photo') 
            || ctx?.text?.match(/краш/gi)) { 

            ctx.user.status = 0
            await ctx.user.save()

            return showAdmins(ctx, -1)
        };
                
        return ctx.reply('❗️ Пришлите скриншот администрации в игре (/admins)')
    };

    ctx.args = ctx?.text?.split(' ')
    if (ctx.args?.[0]) ctx.args[0] = ctx.args[0].toLowerCase()
    else return

    if (ctx.args[0].toLowerCase() === '/admins') return showAdmins(ctx)

    const cmd = src.find(x => ctx.args[0] == x.info.command && x.info.type === 'text')
    if (!cmd) return

    if (cmd.info.access) {
        const admins = await getAdmins(ctx)
        if (!admins.find(x => x.member_id === ctx.senderId)) return ctx.reply('Вы не администратор')
    };

    return cmd.execute(ctx)
});

const run = async () => { 
    try { 
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) { 
        return console.error('Database connecting aborted:', e)
    };

    const files = fs.readdirSync('./handlers')
    files.map(f => src.push(require(`./handlers/${f}`)))

    console.log('Connected to database')

    vk.updates.start().catch(console.error)
    console.log('Бот запущен.')

    exports.cmds = src;
    exports.vk = vk

    require('./helpers/check-min-admins')()
    require('./helpers/check-status')()
};

run()
