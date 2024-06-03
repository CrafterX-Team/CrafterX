const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

const burçlar = [
    { name: 'Koç', emoji: '♈' },
    { name: 'Boğa', emoji: '♉' },
    { name: 'İkizler', emoji: '♊' },
    { name: 'Yengeç', emoji: '♋' },
    { name: 'Aslan', emoji: '♌' },
    { name: 'Başak', emoji: '♍' },
    { name: 'Terazi', emoji: '♎' },
    { name: 'Akrep', emoji: '♏' },
    { name: 'Yay', emoji: '♐' },
    { name: 'Oğlak', emoji: '♑' },
    { name: 'Kova', emoji: '♒' },
    { name: 'Balık', emoji: '♓' }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('burc-rol-al')
        .setDescription('Burç rolünü seçmeni sağlar.'),
    async execute(interaction) {
        const selectMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select-burc')
                    .setPlaceholder('Burç rolünü seçin...')
                    .addOptions(burçlar.map(burç => ({
                        label: `${burç.emoji} ${burç.name}`,
                        value: burç.name,
                        description: `${burç.name} burç rolü`
                    }))),
            );

        const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('clear-burc')
                    .setLabel('Burç Rolünü Temizle')
                    .setStyle('DANGER'),
            );

        const messageContent = '<:nokta:1244669395796492389> Burç Rolü Seç\nLütfen burç rolünü seçin ya da mevcut burç rolünüzü temizleyin.';

        const message = await interaction.reply({ content: messageContent, components: [selectMenu, button], fetchReply: true });

        const filter = i => i.customId === 'select-burc' || i.customId === 'clear-burc';

        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'select-burc') {
                const selectedRoleName = i.values[0];
                const role = interaction.guild.roles.cache.find(r => r.name === selectedRoleName);

                if (role) {
                    // Kullanıcının zaten bir burç rolü var mı kontrol et
                    const userRoles = i.member.roles.cache;
                    const existingRole = burçlar.find(burç => userRoles.some(role => role.name === burç.name));

                    if (existingRole) {
                        await i.reply({ content: `Zaten bir burç rolünüz var: ${existingRole.name}. Lütfen önce temizleyin.`, ephemeral: true });
                    } else {
                        await i.member.roles.add(role);
                        await i.reply({ content: `Başarıyla ${selectedRoleName} rolünü aldınız!`, ephemeral: true });
                    }
                } else {
                    await i.reply({ content: 'Rol bulunamadı, lütfen tekrar deneyin.', ephemeral: true });
                }
            } else if (i.customId === 'clear-burc') {
                // Kullanıcının burç rolünü kaldır
                const userRoles = i.member.roles.cache;
                const roleToRemove = burçlar.find(burç => userRoles.some(role => role.name === burç.name));

                if (roleToRemove) {
                    const role = interaction.guild.roles.cache.find(r => r.name === roleToRemove.name);
                    await i.member.roles.remove(role);
                    await i.reply({ content: `${roleToRemove.name} rolü başarıyla kaldırıldı.`, ephemeral: true });
                } else {
                    await i.reply({ content: 'Üzerinizde burç rolü bulunmamaktadır.', ephemeral: true });
                }
            }
        });

        collector.on('end', collected => {
            console.log(`Toplam ${collected.size} interaksiyon toplandı.`);
        });
    },
};

//
