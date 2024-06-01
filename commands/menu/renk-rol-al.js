const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

const renkler = [
    { name: 'Kırmızı', emoji: '🔴', description: 'Kırmızı renk rolü' },
    { name: 'Mor', emoji: '🟣', description: 'Mor renk rolü' },
    { name: 'Sarı', emoji: '🟡', description: 'Sarı renk rolü' },
    { name: 'Yeşil', emoji: '🟢', description: 'Yeşil renk rolü' },
    { name: 'Mavi', emoji: '🔵', description: 'Mavi renk rolü' },
    { name: 'Beyaz', emoji: '⚪', description: 'Beyaz renk rolü' },
    { name: 'Siyah', emoji: '⚫', description: 'Siyah renk rolü' }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('renk-rol-al')
        .setDescription('Renk rolünü seçmeni sağlar.'),
    async execute(interaction) {
        const selectMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select-renk')
                    .setPlaceholder('Renk rolünü seçin...')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(renkler.map(renk => ({
                        label: `${renk.emoji} ${renk.name}`,
                        value: renk.name,
                        description: renk.description
                    }))),
            );

        const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('clear-renk')
                    .setLabel('Renk Rolünü Temizle')
                    .setStyle('DANGER'),
            );

        const messageContent = '<:nokta:1244669395796492389> Renk Rolü Seç\nLütfen bir renk rolü seçin ya da mevcut renk rolünüzü temizleyin.';

        await interaction.reply({ content: messageContent, components: [selectMenu, button] });

        const filter = i => (i.customId === 'select-renk' || i.customId === 'clear-renk') && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'select-renk') {
                const selectedRoleName = i.values[0];
                const role = interaction.guild.roles.cache.find(r => r.name === selectedRoleName);

                if (role) {
                    // Kullanıcının zaten bir renk rolü var mı kontrol et
                    const userRoles = i.member.roles.cache;
                    const existingRole = renkler.find(renk => userRoles.some(role => role.name === renk.name));

                    if (existingRole) {
                        await i.reply({ content: `Zaten bir renk rolünüz var: ${existingRole.name}. Lütfen önce temizleyin.`, ephemeral: true });
                    } else {
                        await i.member.roles.add(role);
                        await i.reply({ content: `Başarıyla ${selectedRoleName} rolünü aldınız!`, ephemeral: true });
                    }
                } else {
                    await i.reply({ content: 'Rol bulunamadı, lütfen tekrar deneyin.', ephemeral: true });
                }
            } else if (i.customId === 'clear-renk') {
                // Kullanıcının renk rolünü kaldır
                const userRoles = i.member.roles.cache;
                const roleToRemove = renkler.find(renk => userRoles.some(role => role.name === renk.name));

                if (roleToRemove) {
                    const role = interaction.guild.roles.cache.find(r => r.name === roleToRemove.name);
                    await i.member.roles.remove(role);
                    await i.reply({ content: `${roleToRemove.name} rolü başarıyla kaldırıldı.`, ephemeral: true });
                } else {
                    await i.reply({ content: 'Üzerinizde renk rolü bulunmamaktadır.', ephemeral: true });
                }
            }
        });

        collector.on('end', collected => {
            console.log(`Toplam ${collected.size} interaksiyon toplandı.`);
        });
    },
};
