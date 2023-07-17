const { Keyboard } = require("vk-io")

exports.logs = Keyboard
    .builder()
    .callbackButton({
        label: 'Захожу',
        payload: { command: 'logs', action: 'in' },
        color: Keyboard.POSITIVE_COLOR
    })
    .callbackButton({
        label: 'Вышел',
        payload: { command: 'logs', action: 'out' },
        color: Keyboard.NEGATIVE_COLOR
    });