const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('küfürengel')
        .setDescription('Küfür engelleme sistemini açar veya kapatır.')
        .addStringOption(option => 
            option.setName('durum')
                .setDescription('Küfür engelleme sistemini aç veya kapat.')
                .setRequired(true)
                .addChoices(
                    { name: 'Aç', value: 'true' },
                    { name: 'Kapat', value: 'false' }
                )),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const embed = new MessageEmbed()
                .setColor('#fd494a')
                .setTitle('<:denied:1243275827974504528> Yetki Hatası')
                .setDescription('Bu komutu kullanabilmek için sunucu yöneticisi olmalısınız.');

            return interaction.reply({ embeds: [embed] });
        }

        const durum = interaction.options.getString('durum') === 'true';
        const guildId = interaction.guild.id;

        const guardFilePath = path.join(__dirname, '../Data/guard.json');
        let guardData = {};

        if (fs.existsSync(guardFilePath)) {
            guardData = JSON.parse(fs.readFileSync(guardFilePath, 'utf8'));
        }

        // Guard.json dosyasına küfür engelleme durumunu ekleyin
        guardData[guildId] = guardData[guildId] || {};
        guardData[guildId].KüfürEngel = durum;

        fs.writeFileSync(guardFilePath, JSON.stringify(guardData, null, 4));

        const embed = new MessageEmbed()
            .setColor('#30cb74')
            .setTitle('<:sucses:1243275119414214756> Küfür Engel Durumu Ayarlandı')
            .setDescription(`Küfür engelleme sistemi başarıyla ${durum ? 'açıldı' : 'kapandı'}.`);

        await interaction.reply({ embeds: [embed] });
    },
};
