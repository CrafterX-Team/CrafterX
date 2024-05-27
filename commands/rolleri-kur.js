const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolleri-kur')
        .setDescription('Sunucuya özel rolleri kurar.'),
    async execute(interaction) {
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
                { name: 'Ateş Kırmızısı', color: '#FF0000' },
                { name: 'Mor', color: '#800080' },
                { name: 'Sarı', color: '#FFFF00' },
                { name: 'Yeşil', color: '#008000' },
                { name: 'Mavi', color: '#0000FF' },
                { name: 'Beyaz', color: '#FFFFFF' },
                { name: 'Siyah', color: '#000000' },
                { name: 'Evli', color: '#FFD700' },
                { name: 'İlişkisi Yok', color: '#FF4500' },
                { name: 'Açık İlişkide', color: '#9400D3' },
                { name: 'Karışık', color: '#000000' },
            ];

            // Mevcut rolleri al
            const existingRoles = guild.roles.cache.map(role => role.name);

            // Eksik rolleri tutacak bir dizi oluştur
            const missingRoles = [];

            // Her rol için kontrol et ve eksik olanları ve sunucuda zaten olanları bul
            for (const { name, color } of roller) {
                if (existingRoles.includes(name)) {
                    // Eğer rol zaten varsa, eksik roller listesine ekle
                    missingRoles.push(name);
                } else {
                    // Eğer rol yoksa, eksik rolleri oluştur
                    await guild.roles.create({
                        name: name,
                        color: color,
                        reason: `${name} rolü oluşturuldu.`
                    });
                }
            }

            // Eğer eksik rol varsa, eksik rolleri oluştur ve mesaj olarak göster
            if (missingRoles.length > 0) {
                const embed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('Hata: Roller Zaten Var')
                    .setDescription(`Aşağıdaki roller zaten sunucuda mevcut olduğu için tekrar oluşturulamaz: ${missingRoles.join(', ')}`)
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
