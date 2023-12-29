const { showAdmins } = require("../helpers");

exports.execute = async (ctx) => {
    const { action } = ctx.eventPayload;

    if (!ctx.user) {
        return ctx.api.messages.sendMessageEventAnswer({
            event_id: ctx.eventId,
            peer_id: ctx.peerId,
            user_id: ctx.userId,
            event_data: JSON.stringify({
                "type": "show_snackbar",
                "text": "Укажите ник с помощью /mynick"
            })
        });
    };

    const isOnServer = ctx.user.status == 1;

    if (
        (action == 'out' && !isOnServer) 
        || (action == 'in' && isOnServer)
    ) {
        return ctx.api.messages.sendMessageEventAnswer({
            event_id: ctx.eventId,
            peer_id: ctx.peerId,
            user_id: ctx.userId,
            event_data: JSON.stringify({
                "type": "show_snackbar",
                "text": action == 'in' ? 'Вы уже на сервере' : 'Вас нет на сервере'
            })
        });
    }

    ctx.user.status = action == 'out' ? 2 : 1;
    await ctx.user.save();

    if (action == 'in') {
        await showAdmins(ctx, 1);
    } else {
        await ctx.api.messages.send({
            message: `❗️ [id${ctx.userId}|${ctx.user.nick}], отправьте скриншот /admins в след. сообщении в течение 30 секунд.`,
            random_id: 0,
            peer_id: ctx.peerId
        });
    };

    return ctx.api.messages.sendMessageEventAnswer({
        event_id: ctx.eventId,
        peer_id: ctx.peerId,
        user_id: ctx.userId,
        event_data: JSON.stringify({
            "type": "show_snackbar",
            "text": action == 'in' ? 'Вы зашли на сервер' : 'Отправьте скриншот /admins в след. сообщении.'
        })
    });
};

exports.info = { 
    command: 'logs',
    type: 'callback'
}