const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolleri-kur')
        .setDescription('Sunucuya özel rolleri kurar.'),
    async execute(interaction) {
        // Kullanıcı sunucu yöneticisi mi kontrol edelim
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'Bu komutu kullanabilmek için sunucu yöneticisi olmalısınız.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        const { guild } = interaction;

        try {
            // Rollerin isimlerini ve renklerini tanımla
            const roller = [
                { name: 'Koç', color: '#FF6347' },
                { name: 'Boğa', color: '#8A2BE2' },
                { name: 'İkizler', color: '#7FFF00' },
                { name: 'Yengeç', color: '#00FFFF' },
                { name: 'Aslan', color: '#FF8C00' },
                { name: 'Başak', color: '#FFFF00' },
                { name: 'Terazi', color: '#4682B4' },
                { name: 'Akrep', color: '#800080' },
                { name: 'Yay', color: '#00FF00' },
                { name: 'Oğlak', color: '#0000FF' },
                { name: 'Kova', color: '#6495ED' },
                { name: 'Balık', color: '#000080' },
                { name: '▬▬▬▬▬▬▬▬', color: '#050000' },
                { name: 'League of Legends', color: '#FFA500' },
                { name: 'Minecraft', color: '#008000' },
                { name: 'Among Us', color: '#FF1493' },
                { name: 'Valorant', color: '#7289DA' },
                { name: 'Fortnite', color: '#8B4513' },
                { name: 'CS:GO', color: '#A52A2A' },
                { name: 'Rainbow Six Siege', color: '#FF69B4' },
                { name: 'PUBG', color: '#FFD700' },
                { name: 'Red Dead Redemption 2', color: '#8B0000' },
                { name: 'Cyberpunk 2077', color: '#20B2AA' },
                { name: '▬▬▬▬▬▬▬▬', color: '#050000' },
                { name: 'Kırmızı', color: '#FF0000' },
                { name: 'Mor', color: '#800080' },
                { name: 'Sarı', color: '#FFFF00' },
                { name: 'Yeşil', color: '#008000' },
                { name: 'Mavi', color: '#0000FF' },
                { name: 'Beyaz', color: '#FFFFFF' },
                { name: 'Siyah', color: '#000000' },
                { name: '▬▬▬▬▬▬▬▬', color: '#050000' },
                { name: 'Evli', color: '#FFD700' },
                { name: 'İlişkisi Yok', color: '#FF4500' },
                { name: 'Açık İlişkide', color: '#9400D3' },
                { name: 'Karışık', color: '#000000' },
                { name: '▬▬▬▬▬▬▬▬', color: '#050000' },
                { name: 'Çekiliş Katılımcısı', color: '#800080' }, // Çekiliş katılımcısı rolü eklendi
                { name: 'Etkinlik Katılımcısı', color: '#FF4500' } // Etkinlik katılımcısı rolü eklendi
            ];


            // Mevcut rolleri al
            const existingRoles = guild.roles.cache.map(role => role.name);

            // Eksik rolleri tutacak bir dizi oluştur
            const missingRoles = [];

            // Her rol için kontrol et ve eksik olanları bul
            for (const { name, color } of roller) {
                if (!existingRoles.includes(name)) {
                    // Eğer rol yoksa, eksik roller listesine ekle
                    missingRoles.push({ name, color });
                }
            }

            // Eksik rolleri oluştur
            for (const { name, color } of missingRoles) {
                await guild.roles.create({
                    name: name,
                    color: color,
                    reason: `${name} rolü eksik olduğu için yeniden oluşturuldu.`
                });
            }

            if (missingRoles.length > 0) {
                // Eğer eksik rol varsa, eksik rolleri oluştur ve mesaj olarak göster
                const embed = new MessageEmbed()
                    .setColor('#30cb74')
                    .setTitle('Özel Roller Kuruldu')
                    .setDescription(`Eksik roller başarıyla oluşturuldu: ${missingRoles.map(role => role.name).join(', ')}`)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed], ephemeral: true });
            } else {
                // Eğer eksik rol yoksa, rollerin zaten mevcut olduğunu bildir
                const embed = new MessageEmbed()
                    .setColor('#30cb74')
                    .setTitle('Özel Roller Kuruldu')
                    .setDescription('Tüm özel roller zaten mevcut!')
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed], ephemeral: true });
            }
        } catch (error) {
            // Hata durumunda hata mesajı gönder
            console.error(error);
            await interaction.editReply({ content: 'Roller oluşturulurken bir hata oluştu!', ephemeral: true });
        }
    },
};
