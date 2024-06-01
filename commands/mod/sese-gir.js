const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sese-gir')
        .setDescription('Botu belirtilen ses kanalına sokar.')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Botun gireceği ses kanalı')
                .setRequired(true)),
    async execute(interaction) {
        const { guild } = interaction;
        const member = guild.members.cache.get(interaction.user.id);

        // Yetkili rolü kontrolü
        if (!member.permissions.has(Permissions.FLAGS.CONNECT)) {
            return interaction.reply({ content: '# <:denied:1243275827974504528> **Hata**\nBu komutu kullanmaya yetkiniz yok!', ephemeral: true });
        }

        // Ses kanalının belirlenmesi
        const voiceChannel = interaction.options.getChannel('kanal');

        if (!voiceChannel || voiceChannel.type !== 'GUILD_VOICE') {
            return interaction.reply({ content: '# <:denied:1243275827974504528> **Hata**\nGeçersiz ses kanalı belirtildi!', ephemeral: true });
        }

        // Botun ses kanalına girmesi ve bağlantının sürekli kalması
        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            });

            connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                    // Reconnected successfully
                } catch (error) {
                    // Destroy the connection if it cannot reconnect in a timely manner
                    connection.destroy();
                    // Optionally, try to reconnect manually here
                    joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: guild.id,
                        adapterCreator: guild.voiceAdapterCreator,
                    });
                }
            });

            const embed = new MessageEmbed()
                .setColor('#30cb74')
                .setTitle('<:sucses:1243275119414214756> Bot Ses Kanalına Girdi')
                .setDescription(`Bot başarıyla <#${voiceChannel.id}> kanalına girdi!`)
                .setTimestamp();
            interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '# <:denied:1243275827974504528> **Hata**\nBot ses kanalına girerken bir hata oluştu!', ephemeral: true });
        }
    },
};
