const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spam-engel')
        .setDescription('Sunucuda spam engelleme sistemini açıp veya kapatır.')
        .addStringOption(option =>
            option.setName('durum')
                .setDescription('Spam engelleme durumu')
                .setRequired(true)),
    async execute(interaction) {
        const spamFilterStatus = interaction.options.getString('durum');
        const guildId = interaction.guildId;
        const guardFilePath = path.join(__dirname, '../Data/guard.json');

        let guardData = {};
        if (fs.existsSync(guardFilePath)) {
            guardData = JSON.parse(fs.readFileSync(guardFilePath, 'utf8'));
        }

        // Sunucu için mevcut ayarları al
        let guildSettings = guardData[guildId];
        if (!guildSettings) {
            guildSettings = {};
        }

        // Spam engelleme durumunu güncelle
        guildSettings.spamFilter = spamFilterStatus === 'aç' ? true : false;

        // Güncellenmiş ayarları guard.json dosyasına kaydet
        guardData[guildId] = guildSettings;
        fs.writeFileSync(guardFilePath, JSON.stringify(guardData, null, 4));

        // Yanıtla
        await interaction.reply({ content: `Spam engelleme başarıyla ${spamFilterStatus === 'aç' ? 'açıldı' : 'kapatıldı'}.`, ephemeral: true });

        // Spam engelleme durumunu kontrol et
        if (spamFilterStatus === 'aç') {
            // Kullanıcının son bir dakika içinde gönderdiği mesajları al
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            const userMessages = messages.filter(msg => msg.author.id === interaction.user.id && (Date.now() - msg.createdTimestamp) < 1000); // 1 saniyeden daha kısa aralıklarla gönderilen mesajlar

            // Eğer kullanıcı son bir saniye içinde 3'ten fazla mesaj göndermişse, spam olarak kabul edilir
            if (userMessages.size > 3) {
                // Mesajı gönderen kişiyi uyar
                await interaction.channel.send(`<@${interaction.user.id}>, lütfen spam yapmayın!`);

                // Spam yaptığı mesajları sil
                userMessages.forEach(async msg => {
                    try {
                        await msg.delete();
                    } catch (error) {
                        console.error('Mesaj silinemedi:', error);
                    }
                });
            }
        }
    },
};