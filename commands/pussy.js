const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pussy')
        .setDescription('Rastgele bir pussy resmi gönderir.'),

    async execute(interaction) {
        try {
            // Kontrol et, eğer kanal NSFW değilse uyarı gönder
            if (!interaction.channel.nsfw) {
                await interaction.reply('Bu komutu sadece NSFW kanallarda kullanabilirsin.');
                return;
            }

            const response = await axios.get('https://nekobot.xyz/api/image?type=pussy');
            const imageUrl = response.data.message;

            const embed = new MessageEmbed()
                .setColor('#fd494a')
                .setTitle('<:18:1243845125076160543> İşte size pussy')
                .setImage(imageUrl);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Hata:', error);
            await interaction.reply('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    },
};