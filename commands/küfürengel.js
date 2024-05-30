const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

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
        // Kullanıcı bir sunucu yöneticisi mi kontrol edelim
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply('Bu komutu kullanabilmek için sunucu yöneticisi olmalısınız.');
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

        await interaction.reply(`Küfür engelleme sistemi başarıyla ${durum ? 'açıldı' : 'kapandı'}.`);
    },
};
