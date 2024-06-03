const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: {
        name: 'kedi-foto',
        description: 'Rastgele bir kedi fotoğrafı gönderir.',
    },
    async execute(interaction) {
        const botAvatarURL = interaction.client.user.avatarURL();
        try {
            // Top.gg API ile oylama durumunu kontrol et
            const botID = '1241818111238213703';
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyNDE4MTgxMTEyMzgyMTM3MDMiLCJib3QiOnRydWUsImlhdCI6MTcxNzQyNTc2Mn0.r1QKXbkPmlTLm5jPL4kre7mG0C_OZ5ACkZ4I6qQ-TvE';
            const userID = interaction.user.id;
            const checkURL = `https://top.gg/api/bots/${botID}/check?userId=${userID}`;

            const checkResponse = await fetch(checkURL, {
                headers: {
                    Authorization: token,
                },
            });

            const checkData = await checkResponse.json();

            if (checkData.voted === 1) {
                // Eğer oy vermişse kedi fotoğrafı gönder
                const response = await fetch('https://api.thecatapi.com/v1/images/search');
                const data = await response.json();

                const embed = new MessageEmbed()
                    .setTitle('<:fun:1243846210645917716> Kedimatik')
                    .setDescription('🐱 İşte sana rastgele bir kedi fotoğrafı:')
                    .setImage(data[0].url)
                    .setColor('#fb00ff');

                await interaction.reply({ embeds: [embed] });
            } else {
                // Eğer oy vermemişse mesaj gönder
                const oylazim = new MessageEmbed()
                .setTitle("<:fun:1243846210645917716> Kedimatik kullanmak için Oy Ver")
                .setDescription("Bu komutu kullanabilmen için botumuza Top.gg üzerinden oy vermelisin. [OY VER](https://top.gg/bot/1052989477641007114/vote)")
                .setThumbnail(botAvatarURL)
                .setColor('#fb00ff');

                await interaction.reply({ embeds: [oylazim] });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Bir hata oluştu.', ephemeral: true });
        }
    },
};