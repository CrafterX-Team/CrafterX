const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hentai')
        .setDescription('Rastgele bir hentai resmi gönderir.'),

    async execute(interaction) {
        try {
            // Kontrol: NSFW kanalında mı kullanıldı?
            if (!interaction.channel.nsfw) {
                return interaction.reply('Bu komut sadece NSFW (Not Safe For Work) kanallarında kullanılabilir.');
            }

            const response = await axios.get('https://nekobot.xyz/api/image?type=hentai');
            const imageUrl = response.data.message;

            const embed = new MessageEmbed()
                .setColor('#fd494a')
                .setTitle('<:18:1243845125076160543> İşte size hentai')
                .setImage(imageUrl);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Hata:', error);
            await interaction.reply('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    },
};