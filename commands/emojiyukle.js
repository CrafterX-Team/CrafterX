const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojiyukle')
        .setDescription('Sunucuya emoji yükler.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Yüklenecek emoji URL\'si')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('isim')
                .setDescription('Yüklenecek emoji adı')
                .setRequired(true)),
    async execute(interaction) {
        // Komutu kullanan kullanıcının bir sunucu yöneticisi olup olmadığını kontrol et
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const embed = new MessageEmbed()
                .setColor('#fd494a')
                .setTitle('<:denied:1243275827974504528> Yetki Hatası')
                .setDescription('Bu komutu kullanabilmek için sunucu yöneticisi olmalısınız.');
            return await interaction.reply({ embeds: [embed] });
        }

        const url = interaction.options.getString('url');
        const name = interaction.options.getString('isim');

        try {
            const emoji = await interaction.guild.emojis.create(url, name);
            const embed = new MessageEmbed()
                .setColor('#30cb74')
                .setTitle('<:sucses:1243275119414214756> Başarılı!')
                .setDescription(`Emoji başarıyla yüklendi: ${emoji.toString()}`);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = new MessageEmbed()
                .setColor('#fd494a')
                .setTitle('<:denied:1243275827974504528> Hata!')
                .setDescription('Emoji yüklenirken bir hata oluştu.');
            await interaction.reply({ embeds: [embed] });
        }
    },
};
