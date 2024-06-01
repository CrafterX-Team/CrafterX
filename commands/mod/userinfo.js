const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kullanıcı-bilgi')
    .setDescription('Belirtilen kullanıcının detaylı bilgilerini gösterir')
    .addUserOption(option => option.setName('user').setDescription('Bilgilerini görüntülemek istediğiniz kullanıcı').setRequired(true))
    .addBooleanOption(option => option.setName('gizli').setDescription('Kullanıcının bilgilerini gizli göster').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const isPrivate = interaction.options.getBoolean('gizli');

// Rozet isimlerini belirli emoji ID'si ile değiştir
const badgeEmojiIds = {
  "house_balance": "1200776838490890271",
  "active_developer": "1200776835118669914",
  "house_bravery":"1201109159660236851",
  "house_brilliance":"1201109156996849685",
};

    try {
      const fetchedUser = await interaction.guild.members.fetch(user.id);

      const joinedDate = fetchedUser.joinedAt;
      const formattedJoinDate = `${joinedDate.getDate()}.${joinedDate.getMonth() + 1}.${joinedDate.getFullYear()}`;
      const formattedJoinTime = `${joinedDate.getHours()}:${joinedDate.getMinutes()}:${joinedDate.getSeconds()}`;

      const flags = fetchedUser.user.flags; // Hatanın düzeltilmiş kısmı

      const badges = flags
        ? [...flags.toArray()].map(flag => {
          const emojiId = badgeEmojiIds[flag.toLowerCase()] || 'defaultEmojiID'; // Rozet ismine göre emoji ID'sini al, eğer tanımlı değilse varsayılan emoji ID'sini kullan
          return `<:${flag.toLowerCase()}:${emojiId}>`;
        }).join(' ')
        : 'Rozet Yok';

      const embed = new MessageEmbed()
        .setColor('#4ce94f')
        .setTitle('CrafterX Kullanıcı bilgi')
        .addField('Kullanıcı Adı', fetchedUser.displayName)
        .addField('Kullanıcı Etiketi', user.tag)
        .addField('Kullanıcı ID', user.id)
        .addField('Sunucuya Katılım Tarihi', `**Tarih**: \`${formattedJoinDate}\``)
        .addField('Rozetler', badges)
        .addField('Yapılan Etkinlik', fetchedUser.presence?.activities.length ? fetchedUser.presence.activities[0].name : 'Durum Yazılmamış..')
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 }));

      const joinButton = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel('Sunucuya Katıl')
            .setURL('https://discord.gg/nostge') // SUNUCU_ID kısmını kendi sunucu ID'nizle değiştirin
            .setStyle('LINK')
            .setEmoji('<:link:1242204228248797204>') // İstediğiniz bir emojiyi ekleyebilirsiniz
        );

      await interaction.reply({ embeds: [embed], components: [joinButton], ephemeral: isPrivate });

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '<:denied:1242201411492778034> Kullanıcı bilgileri alınırken bir hata oluştu.', ephemeral: isPrivate });
    }
  },
};