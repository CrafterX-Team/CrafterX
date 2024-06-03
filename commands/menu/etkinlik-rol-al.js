const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

const etkinlikler = [
    { name: 'Çekiliş Katılımcısı', description: 'Çekilişlerden Haberdar Olmak İçin Rolü Alınız' },
    { name: 'Etkinlik Katılımcısı', description: 'Etkinliklerden Haberdar Olmak İçin Rolü Alınız' },
    // Ek etkinlikler buraya eklenebilir
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('etkinlik-rol-al')
        .setDescription('Etkinlik rolünü seçmeni sağlar.'),
    async execute(interaction) {
        const selectMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select-etkinlik')
                    .setPlaceholder('Etkinlik rolünü seçin...')
                    .setMinValues(1)
                    .setMaxValues(2)
                    .addOptions(etkinlikler.map(etkinlik => ({
                        label: etkinlik.name,
                        value: etkinlik.name,
                        description: etkinlik.description
                    }))),
            );

        const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('clear-etkinlik')
                    .setLabel('Etkinlik Rolünü Temizle')
                    .setStyle('DANGER'),
            );

        const messageContent = '<:nokta:1244669395796492389> Etkinlik Rolü Seç\nLütfen en fazla 2 adet etkinlik rolünü seçin ya da mevcut etkinlik rollerinizi temizleyin.';

        const message = await interaction.reply({ content: messageContent, components: [selectMenu, button], fetchReply: true });

        const filter = i => i.customId === 'select-etkinlik' || i.customId === 'clear-etkinlik';

        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'select-etkinlik') {
                const selectedRoleNames = i.values;
                const roles = interaction.guild.roles.cache.filter(role => selectedRoleNames.includes(role.name));

                if (roles.size === selectedRoleNames.length) {
                    // Kullanıcının zaten seçili etkinlik rolleri var mı kontrol et
                    const userRoles = i.member.roles.cache;
                    const existingRoles = etkinlikler.filter(etkinlik => userRoles.some(role => role.name === etkinlik.name));

                    if (existingRoles.length + roles.size > 2) {
                        await i.reply({ content: `Maksimum 2 etkinlik rolü seçebilirsiniz.`, ephemeral: true });
                    } else if (existingRoles.length > 0) {
                        await i.reply({ content: `Zaten bir veya daha fazla etkinlik rolünüz var: ${existingRoles.map(role => role.name).join(', ')}. Lütfen önce temizleyin.`, ephemeral: true });
                    } else {
                        await i.member.roles.add(roles);
                        await i.reply({ content: `Başarıyla ${selectedRoleNames.join(', ')} rollerini aldınız!`, ephemeral: true });
                    }
                } else {
                    await i.reply({ content: 'Bir veya daha fazla rol bulunamadı, lütfen tekrar deneyin.', ephemeral: true });
                }
            } else if (i.customId === 'clear-etkinlik') {
                // Kullanıcının etkinlik rollerini kaldır
                const userRoles = i.member.roles.cache;
                const rolesToRemove = etkinlikler.filter(etkinlik => userRoles.some(role => role.name === etkinlik.name));

                if (rolesToRemove.length > 0) {
                    const roles = interaction.guild.roles.cache.filter(role => rolesToRemove.some(r => r.name === role.name));
                    await i.member.roles.remove(roles);
                    await i.reply({ content: `${rolesToRemove.map(role => role.name).join(', ')} rolleri başarıyla kaldırıldı.`, ephemeral: true });
                } else {
                    await i.reply({ content: 'Üzerinizde etkinlik rolü bulunmamaktadır.', ephemeral: true });
                }
            }
        });

        collector.on('end', collected => {
            console.log(`Toplam ${collected.size} interaksiyon toplandı.`);
        });
    },
};

//
