const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Yardım komutlarını gösterir'),
    async execute(interaction) {
        const client = interaction.client; // Client nesnesini al

        const helpEmbed = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle('Yardım Menüsü')
            .setDescription('Aşağıdaki menüden yardım almak istediğiniz konuyu seçin\n \n<:duyuru:1245385921113882644>**Beta**\nCrafterX bir süre beta aşamasında kalıcaktır yani bazı komutlar kaldırılabilir yada onun yerine başka bir slash komutu ile değiştirilebilir!')
            .setThumbnail(client.user.displayAvatarURL()); // Botun avatarını thumbnail olarak ekle

        const helpMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('help_select')
                    .setPlaceholder('Bir seçenek belirleyin')
                    .addOptions([
                        {
                            label: 'Moderasyon',
                            description: 'Moderasyon sistemi hakkında bilgi',
                            value: 'command_1',
                            emoji: '<:mod:1243845695723667508>',
                        },
                        {
                            label: 'Nsfw',
                            description: 'Nsfw sistemi hakkında bilgi',
                            value: 'command_2',
                            emoji: '<:18:1243845125076160543>',
                        },
                        {
                            label: 'Fun',
                            description: 'Fun sistemi hakkında bilgi',
                            value: 'command_3',
                            emoji: '<:fun:1243846210645917716>',
                        },
                        {
                            label: 'Kayıt',
                            description: 'Kayıt sistemi hakkında bilgi',
                            value: 'command_4',
                            emoji: '<:kayit:1244264190965841960>',

                            
                        },
                        {
                            label: 'Menü',
                            description: 'Menü sistemi hakkında bilgi',
                            value: 'command_5',
                            emoji: '<:Menu:1245385064184025221>',

                            
                        },
                    ]),
            );

        await interaction.reply({ embeds: [helpEmbed], components: [helpMenu] });

        const filter = i => i.customId === 'help_select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            let selectedEmbed;

            if (i.values[0] === 'command_1') {
                selectedEmbed = new MessageEmbed()
                    .setColor('#4966fd')
                    .setTitle('Moderasyon Komutları')
                    .setDescription('</ban:1242480313217712151>\nSeçtiğiniz kullanıcıyı banlar\n</kick:1242485399910355055>\nSeçtiğiniz kullanıcıyı banlar\n</kanal-aç:1243577583249915927>\nSeçtiğiniz kanalın kilidini açar\n</kanal-kilit:1243577583249915925>\nSeçtiğiniz kanalı kilitler\n</yavaş-mod:1242972776151912475>\nSeçtiğiniz kanala yavaş mod ekler\n</sil:1242972776151912471>\nBelirttiğiniz sayı kadar mesaj siler\n</rol-ver:1242972776151912474>\nSeçtiğiniz kullanıcıya rol verir\n</rol-al:1243577583249915928>\nSeçtiğiniz kullanıcıdan rol alır')
                    .setFooter('Moderasyon © CrafterX')
                    .setThumbnail(client.user.displayAvatarURL()); // Botun avatarını thumbnail olarak ekle
            } else if (i.values[0] === 'command_2') {
                selectedEmbed = new MessageEmbed()
                    .setColor('#fd494a')
                    .setTitle('Nsfw Komutları')
                    .setDescription('</ass:1243847215005437965>\nRastgele bir ass(göt) resmi gönderir\n</pussy:1243847215005437967>\nRastgele bir pussy resmi gönderir.\n</hentai:1243847215005437966>\nRastgele bir hentai resmi gönderir.\n</yaoi:1243847916238667818>\nRastgele bir yaoi resmi gönderir.')
                    .setFooter('Nsfw © CrafterX')
                    .setThumbnail(client.user.displayAvatarURL()); // Botun avatarını thumbnail olarak ekle
            } else if (i.values[0] === 'command_3') {
                selectedEmbed = new MessageEmbed()
                    .setColor('#fd49d5')
                    .setTitle('Fun Komutları')
                    .setDescription('</kahve:1242972776151912473>\nBir fincan kahve içersiniz.')
                    .setFooter('Fun © CrafterX')
                    .setThumbnail(client.user.displayAvatarURL()); // Botun avatarını thumbnail olarak ekle
            }
         else if (i.values[0] === 'command_4') {
            selectedEmbed = new MessageEmbed()
                .setColor('#30cbb8')
                .setTitle('Kayıt Komutları')
                .setDescription('</kayıt:1245171951761227936>\nBelirttiğiniz kullanıcıyı kayıt edersiniz.\n</kayıtsız:1245171951761227932>\nBelirttiğiniz kullanıcıya kayıtsız rol verirsiniz.\n</yetkiliayarla:1245171951941455906>\nSeçtiğiniz rolü kayıt edicek yetkililer için ayarlarsınız.\n</erkekrol:1243604864622133390>\nBelirttiğiniz erkek rolü yapar.\n</kadınrol:1243632885886488609>\nBelirttiğiniz kadın rolü yapar.')
                .setFooter('Kayıt © CrafterX')
                .setThumbnail(client.user.displayAvatarURL()); // Botun avatarını thumbnail olarak ekle
        }

        else if (i.values[0] === 'command_5') {
            selectedEmbed = new MessageEmbed()
                .setColor('#30afcb')
                .setTitle('Menü Komutları')
                .setDescription('</rolleri-kur:1245171951941455902>\nMenü Sistemi İçin Gerekli Olan Rolleri Kurar.\n</burc-rol-al:1245171951761227928>\nBurç Menü Sistemi.\n</etkinlik-rol-al:1245171951761227929>\nEtkinlik Menü Sistemi.\n</iliski-rol-al:1245171951761227931>\nİlişki Durumu Menü Sistemi.\n</oyun-rol-al:1245171951761227935>\nOyun Seçim Menü Sisemi.\n</renk-rol-al:1245171951761227937>\nRenk Seçim Menüsüa')
                .setFooter('Menü © CrafterX')
                .setThumbnail(client.user.displayAvatarURL()); // Botun avatarını thumbnail olarak ekle
        }

            await i.update({ embeds: [selectedEmbed], components: [helpMenu] });

            // 30 saniye sonra menüyü kaldır
            setTimeout(async () => {
                await interaction.editReply({ components: [] });
            }, 30000);
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'Zaman aşımına uğradı. Lütfen tekrar deneyin.', components: [] });
            }
        });
    },
};


