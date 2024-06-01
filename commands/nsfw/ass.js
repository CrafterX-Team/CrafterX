const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ass')
        .setDescription('Rastgele bir ass(göt) resmi gönderir.'),

    async execute(interaction) {
        try {
            // NSFW kontrolü
            if (!interaction.channel.nsfw) {
                return await interaction.reply('Bu komut sadece NSFW kanallarında kullanılabilir.');
            }

            const response = await axios.get('https://nekobot.xyz/api/image?type=ass');
            const imageUrl = response.data.message;

            const embed = new MessageEmbed()
                .setColor('#fd494a')
                .setTitle('<:18:1243845125076160543> İşte size ass')
                .setImage(imageUrl);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Hata:', error);
            await interaction.reply('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    },
};