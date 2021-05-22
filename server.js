const {
    Telegraf,
    Markup,
    Scenes,
    session
} = require('telegraf');
const fetch = require('node-fetch');


let number = 0;
var bot = new Telegraf('TOKEN_Telegram')


const clima = new Scenes.WizardScene(

    'clima_id',

    ctx => {
        ctx.reply('Ingrese la ciudad');

        return ctx.wizard.next();
    },

    ctx => {
        ctx.reply('Ingrese el codigo pais \nEjemplo: Uruguay=UY');
        ctx.wizard.state.nameCity = ctx.message.text;
        return ctx.wizard.next();
    },


    ctx => {
        ctx.wizard.state.countryCode = ctx.message.text;
        const nameCity = ctx.wizard.state.nameCity;
        const countryCode = ctx.wizard.state.countryCode;


        ctx.reply(` Voy a buscar el clima en: ${nameCity},${countryCode}`)

        const appID = 'TOKEN_openweathermap'

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${nameCity},${countryCode}&units=metric&lang=sp&appid=${appID}`

        fetch(url)
            .then(result => result.json())
            .then(data => {

                if (data.cod === "404") {
                    ctx.reply(`Ciudad no encontrada, intentelo nuevamente`)

                }

                const {
                    name,
                    main: {
                        temp,
                        temp_max,
                        temp_min,
                        humidity
                    },
                    wind: {
                        speed

                    },
                    weather: [{

                        description

                    }]
                } = data

                ctx.reply(`Clima en ${name}:\n\nTiempo actual: ${description} \n\nTemperatura actual: ${temp} ℃  \n\nTemperatura maxima: ${temp_max} ℃ 
                \nTemperatura minima: ${temp_min} ℃ \n\nViento: ${speed} km/h \n\nHumedad: ${humidity} %`)

            })

        return ctx.scene.leave();
    }

)

const stage = new Scenes.Stage([clima]);
bot.use(session());
bot.use(stage.middleware());

function addNumber() {

    number++;
}

bot.start((ctx) => {

    return ctx.reply(
        '¡Hola! ¿Qué necesitas? 😀',
        Markup.keyboard([
            Markup.button.callback('¡Quiero saber el clima!☀️', 'clima'),
            Markup.button.callback('¡Quiero contar! 🔢', 'suma'),

        ]).resize().oneTime()
    )

});

bot.hears('¡Quiero saber el clima!☀️',


    Scenes.Stage.enter('clima_id')

)

bot.hears('¡Quiero contar! 🔢', ctx => {

        addNumber(),

            ctx.reply(`Numero sumado: ${number}`)

    }

)

bot.launch();
