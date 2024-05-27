const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

const iliskiDurumlari = [
    { name: 'Evli', description: 'Evli ilişki durumu rolü' },
    { name: 'İlişkisi Yok', description: 'İlişkisi olmayan rol' },
    { name: 'Açık İlişkide', description: 'Açık ilişkide rol' },
    { name: 'Karışık', description: 'Karışık ilişki durumu rolü' }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('iliski-rol-al')
        .setDescription('İlişki durumu rolünü seçmeni sağlar.'),
    async execute(interaction) {
        const selectMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select-iliski')
                    .setPlaceholder('İlişki durumu rolünü seçin...')
                    .addOptions(iliskiDurumlari.map(iliski => ({
                        label: iliski.name,
                        value: iliski.name,
                        description: iliski.description
                    }))),
            );

        const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('clear-iliski')
                    .setLabel('İlişki Durumu Rolünü Temizle')
                    .setStyle('DANGER'),
            );

        const messageContent = '<:nokta:1244669395796492389> İlişki Durumu Rolü Seç\nLütfen ilişki durumu rolünü seçin ya da mevcut ilişki durumu rolünüzü temizleyin.';

        await interaction.reply({ content: messageContent, components: [selectMenu, button] });

        const filter = i => (i.customId === 'select-iliski' || i.customId === 'clear-iliski') && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'select-iliski') {
                const selectedRoleName = i.values[0];
                const role = interaction.guild.roles.cache.find(r => r.name === selectedRoleName);

                if (role) {
                    // Kullanıcının zaten bir ilişki durumu rolü var mı kontrol et
                    const userRoles = i.member.roles.cache;
                    const existingRole = iliskiDurumlari.find(iliski => userRoles.some(role => role.name === iliski.name));

                    if (existingRole) {
                        await i.reply({ content: `Zaten bir ilişki durumu rolünüz var: ${existingRole.name}. Lütfen önce temizleyin.`, ephemeral: true });
                    } else {
                        await i.member.roles.add(role);
                        await i.reply({ content: `Başarıyla ${selectedRoleName} rolünü aldınız!`, ephemeral: true });
                    }
                } else {
                    await i.reply({ content: 'Rol bulunamadı, lütfen tekrar deneyin.', ephemeral: true });
                }
            } else if (i.customId === 'clear-iliski') {
                // Kullanıcının ilişki durumu rolünü kaldır
                const userRoles = i.member.roles.cache;
                const roleToRemove = iliskiDurumlari.find(iliski => userRoles.some(role => role.name === iliski.name));

                if (roleToRemove) {
                    const role = interaction.guild.roles.cache.find(r => r.name === roleToRemove.name);
                    await i.member.roles.remove(role);
                    await i.reply({ content: `${roleToRemove.name} rolü başarıyla kaldırıldı.`, ephemeral: true });
                } else {
                    await i.reply({ content: 'Üzerinizde ilişki durumu rolü bulunmamaktadır.', ephemeral: true });
                }
            }
        });

        collector.on('end', collected => {
            console.log(`Toplam ${collected.size} interaksiyon toplandı.`);
        });
    },
};
