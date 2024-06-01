const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gelen-giden')
        .setDescription('Giriş ve çıkış log kanalı ayarla')
        .addChannelOption(option => 
            option.setName('kanal')
                .setDescription('Log kanalını seçin')
                .setRequired(true)),
    async execute(interaction) {
        // Komutu çalıştıran kullanıcının yetkilerini kontrol et
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return await interaction.reply({ content: 'Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız!', ephemeral: true });
        }

        const fs = require('fs');
        const logChannel = interaction.options.getChannel('kanal');

        // Verileri okuyup yazmak için server.json dosyasını aç
        const serverData = JSON.parse(fs.readFileSync('./Data/server.json', 'utf-8'));

        if (!serverData[interaction.guild.id]) {
            serverData[interaction.guild.id] = {};
        }

        // Log kanalını ayarla
        serverData[interaction.guild.id].logChannel = logChannel.id;
        fs.writeFileSync('./Data/server.json', JSON.stringify(serverData, null, 2));

        // Bilgilendirici bir embed mesajı oluştur
        const { MessageEmbed } = require('discord.js');
        const embed = new MessageEmbed()
            .setColor('#0000FF')
            .setTitle('Log Kanalı Ayarlandı')
            .setDescription(`Giriş-çıkış log kanalı ${logChannel} olarak ayarlandı.`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
