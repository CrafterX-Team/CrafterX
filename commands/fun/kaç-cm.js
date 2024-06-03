const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: {
        name: 'kaç-cm',
        description: 'Malatafının kaç cm olduğunu söyler',
        options: [
            {
                name: 'kisi',
                description: 'Hangi kişinin malatafına bakmak istiyorsun (çok meraklısın sanırım :D)',
                type: 'USER',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        const user = interaction.options.getUser('kisi');
        const hasVoted = await checkUserVote(interaction.user.id);

        const botAvatarURL = interaction.client.user.avatarURL();

        const oylazim = new MessageEmbed()
            .setTitle("<:fun:1243846210645917716> Kaç cm komutu için Oy Ver")
            .setDescription("Bu komutu kullanabilmen için botumuza Top.gg üzerinden oy vermelisin. [OY VER](https://top.gg/bot/1052989477641007114/vote)")
            .setThumbnail(botAvatarURL)
            .setColor('#fb00ff');

        if (!hasVoted) {
            return interaction.reply({ embeds: [oylazim] });
        }

        const lovePercentage = Math.floor(Math.random() * 101); // 0-100 arası rastgele bir sayı

        let description = `**${user.username}** adlı kişinin malatafı kaç cm: ${lovePercentage}`;

        if (lovePercentage === 100) {
            description += '\n<:hmm:1139580793233100851> Dostum ne yaptında bu kadar uzatabildin bizde tavsiye ver\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956>';
        } else if (lovePercentage >= 90) {
            description += '\n<:hmm:1139580793233100851> WoW biraz daha uzarmış ya besle sen yılanı\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:yokmalataf:1139582742871412807>';
        } else if (lovePercentage >= 70) {
            description += '\n<:hmm:1139580793233100851> Bence biraz uzun sahibine bağışlasın\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807>';
        } else if (lovePercentage >= 50) {
            description += '\n<:nice:1139584779575115876> Ortada bir uzunluk iyidir\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807>';
        } else if (lovePercentage >= 30) {
            description += '\n<:eh:1139584363596611724> Biraz daha yakınlaşmanız gerekebilir.\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:malataf:1139581952979111956><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807>';
        } else if (lovePercentage >= 10) {
            description += '\n<:eh:1139584363596611724> Yani idare eder\n<:malataf:1139581952979111956><:malataf:1139581952979111956><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807>';
        } else {
            description += '\n<:eh:1139584363596611724> Ow dostum hiç ilgilenmiyormusun neden bu kadar kısa?\n<:malataf:1139581952979111956><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807><:yokmalataf:1139582742871412807>';
        }

        const embed = new MessageEmbed()
            .setTitle('<:fun:1243846210645917716> Peki sana göre Kaç cm ?')
            .setDescription(description)
            .setColor('#fb00ff');

        interaction.reply({ embeds: [embed] });
    },
};

async function checkUserVote(userId) {
    const url = `https://top.gg/api/bots/1241818111238213703/check?userId=${userId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyNDE4MTgxMTEyMzgyMTM3MDMiLCJib3QiOnRydWUsImlhdCI6MTcxNzQyNTc2Mn0.r1QKXbkPmlTLm5jPL4kre7mG0C_OZ5ACkZ4I6qQ-TvE" // Top.gg API anahtarınızı buraya ekleyin
            }
        });

        return response.data["voted"] === 1;
    } catch (error) {
        console.error(error);
        return false;
    }
}