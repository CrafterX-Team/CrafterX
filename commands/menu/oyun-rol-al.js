const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

const oyunlar = [
    { name: 'League of Legends', description: 'League of Legends rolü' },
    { name: 'Minecraft', description: 'Minecraft rolü' },
    { name: 'Among Us', description: 'Among Us rolü' },
    { name: 'Valorant', description: 'Valorant rolü' },
    { name: 'Fortnite', description: 'Fortnite rolü' },
    { name: 'CS:GO', description: 'CS:GO rolü' },
    { name: 'Rainbow Six Siege', description: 'Rainbow Six Siege rolü' },
    { name: 'PUBG', description: 'PUBG rolü' },
    { name: 'Red Dead Redemption 2', description: 'Red Dead Redemption 2 rolü' },
    { name: 'Cyberpunk 2077', description: 'Cyberpunk 2077 rolü' }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oyun-rol-al')
        .setDescription('Oyun rollerini seçmeni sağlar.'),
    async execute(interaction) {
        const selectMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select-oyun')
                    .setPlaceholder('Oyun rollerini seçin...')
                    .addOptions(oyunlar.map(oyun => ({
                        label: oyun.name,
                        value: oyun.name,
                        description: oyun.description
                    })))
                    .setMaxValues(10)
            );

        const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('clear-oyun')
                    .setLabel('Oyun Rollerini Temizle')
                    .setStyle('DANGER'),
            );

        const messageContent = '<:nokta:1244669395796492389> Oyun Rolleri Seç\nLütfen oyun rollerini seçin ya da mevcut oyun rollerinizi temizleyin.';

        const message = await interaction.reply({ content: messageContent, components: [selectMenu, button], fetchReply: true });

        const filter = i => (i.customId === 'select-oyun' || i.customId === 'clear-oyun');

        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'select-oyun') {
                const selectedRoles = i.values.map(roleName => interaction.guild.roles.cache.find(r => r.name === roleName)).filter(role => role);

                if (selectedRoles.length > 0) {
                    const userRoles = i.member.roles.cache;
                    const existingRoles = oyunlar.filter(oyun => userRoles.some(role => role.name === oyun.name));
                    
                    for (const role of selectedRoles) {
                        if (!existingRoles.find(r => r.name === role.name)) {
                            await i.member.roles.add(role);
                        }
                    }

                    await i.reply({ content: `Başarıyla ${selectedRoles.map(role => role.name).join(', ')} rollerini aldınız!`, ephemeral: true });
                } else {
                    await i.reply({ content: 'Rol bulunamadı, lütfen tekrar deneyin.', ephemeral: true });
                }
            } else if (i.customId === 'clear-oyun') {
                const userRoles = i.member.roles.cache;
                const rolesToRemove = oyunlar.filter(oyun => userRoles.some(role => role.name === oyun.name));

                if (rolesToRemove.length > 0) {
                    for (const oyun of rolesToRemove) {
                        const role = interaction.guild.roles.cache.find(r => r.name === oyun.name);
                        await i.member.roles.remove(role);
                    }
                    await i.reply({ content: `Oyun rolleriniz başarıyla kaldırıldı.`, ephemeral: true });
                } else {
                    await i.reply({ content: 'Üzerinizde oyun rolü bulunmamaktadır.', ephemeral: true });
                }
            }
        });

        collector.on('end', collected => {
            console.log(`Toplam ${collected.size} interaksiyon toplandı.`);
            disableComponents(message);
        });

        function disableComponents(message) {
            const components = message.components.map(component => {
                component.components.forEach(c => c.setDisabled(true));
                return component;
            });
            message.edit({ components });
        }
    },
};


//
