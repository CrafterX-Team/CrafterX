const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const player = createAudioPlayer();
let connection;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('müzik')
        .setDescription('Müzik komutları sağlar.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('oynat')
                .setDescription('Bir YouTube URL\'sinden müzik çalar.')
                .addStringOption(option => option.setName('url').setDescription('YouTube URL\'si').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('duraklat')
                .setDescription('Çalan müziği duraklatır.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('devam')
                .setDescription('Duraklatılan müziği devam ettirir.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('durdur')
                .setDescription('Çalan müziği durdurur ve botu sesli kanaldan çıkarır.')),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'oynat') {
            const url = interaction.options.getString('url');
            if (!ytdl.validateURL(url)) {
                return interaction.reply('Geçerli bir YouTube URL\'si girin!');
            }

            const channel = interaction.member.voice.channel;
            if (!channel) {
                return interaction.reply('Sesli kanalda olmalısınız!');
            }

            connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            const stream = ytdl(url, { filter: 'audioonly' });
            const resource = createAudioResource(stream);

            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                player.stop();
                connection.destroy();
            });

            await interaction.reply(`Şu anda oynatılıyor: ${url}`);
        } else if (subcommand === 'duraklat') {
            if (player.state.status !== AudioPlayerStatus.Playing) {
                return interaction.reply('Şu anda müzik çalmıyor!');
            }

            player.pause();
            await interaction.reply('Müzik duraklatıldı!');
        } else if (subcommand === 'devam') {
            if (player.state.status !== AudioPlayerStatus.Paused) {
                return interaction.reply('Müzik duraklatılmamış!');
            }

            player.unpause();
            await interaction.reply('Müzik devam ettirildi!');
        } else if (subcommand === 'durdur') {
            if (player.state.status !== AudioPlayerStatus.Playing && player.state.status !== AudioPlayerStatus.Paused) {
                return interaction.reply('Şu anda müzik çalmıyor!');
            }

            player.stop();
            connection.destroy();
            await interaction.reply('Müzik durduruldu ve bot sesli kanaldan ayrıldı!');
        }
    },
};


