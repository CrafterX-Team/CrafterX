const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../Data/server.json');

// Veriyi server.json dosyasına yazma fonksiyonu
function writeData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Veriyi server.json dosyasından okuma fonksiyonu
function readData() {
    if (!fs.existsSync(dataPath)) return {};
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmute')
        .setDescription('Mute rolünü ayarlar')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Ayarlanacak mute rolü')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return interaction.reply('Bu komutu kullanmak için yetkiniz yok.');
        }

        const role = interaction.options.getRole('role');

        const data = readData();
        if (!data[interaction.guild.id]) {
            data[interaction.guild.id] = {};
        }

        data[interaction.guild.id].muteRole = role.id;
        writeData(data);

        await interaction.reply(`Mute rolü başarıyla ayarlandı: ${role.name}`);
    }
};
