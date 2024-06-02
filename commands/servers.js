const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('Botun bulunduğu sunucuların isimlerini gösterir.')
        .setDefaultPermission(false),
    async execute(interaction) {
        const ownerIds = config.ownerIds;
        
        // Komutu kullanan kişinin bot sahibi olup olmadığını kontrol edin
        if (!ownerIds.includes(interaction.user.id)) {
            return interaction.reply({ content: 'Bu komutu kullanma izniniz yok.', ephemeral: true });
        }

        // Botun bulunduğu tüm sunucuların isimlerini toplayın
        const guilds = interaction.client.guilds.cache.map(guild => guild.name);

        const embed = new MessageEmbed()
            .setTitle('Botun Bulunduğu Sunucular')
            .setDescription(guilds.join('\n'))
            .setColor('#0099ff');

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};