const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { ownerIds } = require('../config.json'); // config.json'dan ownerIds'yi çekiyoruz

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Bot hakkında bilgi verir.'),
    async execute(interaction) {
        const { client } = interaction;
        
        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        
        // Bot sahiplerini mention formatında birleştir
        const owners = ownerIds.map(id => `<@${id}>`).join(', ');

        const embed = new MessageEmbed()
            .setColor('#e97b4c')
            .setTitle('<:botinfo:1242206378706079935> Bot Bilgileri')
            .addFields(
                { name: 'Bot İsmi', value: client.user.username, inline: true },
                { name: 'Bot ID', value: client.user.id, inline: true },
                { name: 'Toplam Sunucu Sayısı', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Toplam Kullanıcı Sayısı', value: `${totalMembers}`, inline: true },
                { name: 'Bot Sahipleri', value: owners, inline: true }
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
