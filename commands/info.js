const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { ownerIds } = require('../config.json');
const os = require('os');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Bot hakkında detaylı bilgi verir.'),
    async execute(interaction) {
        const { client } = interaction;

        // Botun çalışma süresi
        const uptime = ms(client.uptime, { long: true });

        // Sistem bilgileri
        const totalMemory = (os.totalmem() / 1024 / 1024).toFixed(2);
        const usedMemory = ((process.memoryUsage().heapUsed) / 1024 / 1024).toFixed(2);
        const cpuCores = os.cpus().length;

        // Bot sahiplerini mention formatında birleştir
        const owners = ownerIds.map(id => `<@${id}>`).join(', ');

        const embed = new MessageEmbed()
            .setColor('#e97b4c')
            .setTitle('<:botinfo:1242206378706079935> Bot Bilgileri')
            .setDescription('Bu botun detaylı bilgileri.')
            .addFields(
                { name: 'Bot İsmi', value: client.user.username, inline: true },
                { name: 'Bot ID', value: client.user.id, inline: true },
                { name: 'Toplam Sunucu Sayısı', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Toplam Kullanıcı Sayısı', value: `${client.users.cache.size}`, inline: true },
                { name: 'Uptime', value: uptime, inline: true },
                { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
                { name: 'Sistem Belleği (RAM)', value: `${usedMemory}/${totalMemory} MB`, inline: true },
                { name: 'CPU Çekirdek Sayısı', value: `${cpuCores}`, inline: true },
                { name: 'Bot Sahipleri', value: owners, inline: true }
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter('© CrafterX');

        await interaction.reply({ embeds: [embed] });
    },
};
