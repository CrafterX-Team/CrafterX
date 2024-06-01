const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Bir kullanıcıyı susturmak için kullanılır.')
        .addUserOption(option => 
            option.setName('kullanıcı')
            .setDescription('Susturulacak kullanıcıyı etiketleyin')
            .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanıcı');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: 'Kullanıcı bulunamadı.', ephemeral: true });
        }

        const muteChannel = interaction.client.channels.cache.get(interaction.channelId);

        if (!muteChannel) {
            return interaction.reply({ content: 'Mute kanalı bulunamadı.', ephemeral: true });
        }

        // Server.json dosyasından mute rolünün ID'sini al
        const serverDataPath = path.join(__dirname, '..', 'Data', 'server.json');
        let serverData = {};

        if (fs.existsSync(serverDataPath)) {
            serverData = JSON.parse(fs.readFileSync(serverDataPath, 'utf8'));
        }

        const guildId = interaction.guild.id;
        const muteRoleId = serverData[guildId]?.muteRole;

        if (!muteRoleId) {
            return interaction.reply({ content: 'Mute rolü tanımlanmamış.', ephemeral: true });
        }

        const muteRole = interaction.guild.roles.cache.find(role => role.id === muteRoleId);

        if (!muteRole) {
            return interaction.reply({ content: 'Mute rolü bulunamadı.', ephemeral: true });
        }

        // Kullanıcıya mute rolünü ver
        try {
            await member.roles.add(muteRole);
        } catch (error) {
            console.error('Mute rolü verilirken bir hata oluştu:', error);
            return interaction.reply({ content: 'Mute rolü verilirken bir hata oluştu.', ephemeral: true });
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('mute-reason')
                    .setPlaceholder('Bir neden seçin')
                    .addOptions([
                        {
                            label: 'Kışkırtma, trol ve dalgacı davranış',
                            description: '5 dakika mute',
                            value: 'reason_5min',
                        },
                        {
                            label: 'Flood, spam ve capslock kullanımı',
                            description: '10 dakika mute',
                            value: 'reason_10min',
                        },
                        {
                            label: 'Metin kanallarını amacı dışında kullanmak',
                            description: '10 dakika mute',
                            value: 'reason_10min_text',
                        },
                        {
                            label: 'Küfür, argo, hakaret ve rahatsız edici davranış',
                            description: '5 dakika mute',
                            value: 'reason_5min_swear',
                        },
                        {
                            label: 'Abartı küfür ve taciz kullanımı',
                            description: '30 dakika mute',
                            value: 'reason_30min',
                        },
                        {
                            label: 'Dini, ırki ve siyasi değerlere hakaret',
                            description: '2 hafta mute',
                            value: 'reason_2weeks',
                        },
                        {
                            label: 'Sunucu kötüleme ve kişisel hakaret',
                            description: '1 saat mute',
                            value: 'reason_1hour',
                        },
                        {
                            label: 'Menü kapat',
                            description: 'İşlemi iptal et',
                            value: 'reason_cancel',
                        },
                    ])
            );

        const muteEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Mute İşlemi Başlatıldı')
            .setDescription(`${interaction.user} tarafından ${user} kullanıcısı için mute işlemi başlatıldı. ${user} Kullanısına ${new Date().toLocaleString()} tarihinde vermek istediğiniz ceza türünü aşağıdan seçiniz:`);

        const message = await interaction.reply({ embeds: [muteEmbed], components: [row], fetchReply: true, ephemeral: false });

        const filter = i => i.user.id === interaction.user.id && i.customId === 'mute-reason';
        const collector = message.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            const reason = i.values[0];
            // Burada seçilen ceza türüne göre işlem yapmayı sağlayabilirsiniz.
            // Örneğin, seçilen ceza türüne göre belirli bir süreyle mute işlemi yapılabilir.
            await i.reply({ content: `Seçilen ceza türü: ${reason}`, ephemeral: true });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'Zaman aşımına uğradı.', components: [] });
            }
        });
    }
};
