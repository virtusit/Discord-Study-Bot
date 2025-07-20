const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const NewsAPI = require('newsapi');
require('dotenv').config();
const newsapi = new NewsAPI(process.env.news_api_key);

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setName('news')
        .setDescription('Send news about a topic')
        .addStringOption(option =>
            option.setName('topic')
                .setDescription('Enter the topic to be sent')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('quantity')
                .setDescription('Set the quantity to be sent (1-5)')
                .setRequired(false)),

    async execute(interaction) {
        const topic = interaction.options.getString('topic');
        const quantity = interaction.options.getInteger('quantity') || 1;

        // Validação antes do deferReply
        if (quantity < 1 || quantity > 5) {
            return interaction.reply({
                content: 'You can only set a value between 1 and 5.',
                ephemeral: true
            });
        }

        await interaction.deferReply();

        newsapi.v2.everything({
            q: topic,
            language: 'pt',
            sortBy: 'publishedAt'
        }).then(response => {
            const articles = response.articles.slice(0, quantity);
            if (articles.length === 0) {
                interaction.editReply(`No news about ${topic}.`);
                return;
            }

            const newsEmbeds = articles.map(article => {
                return new EmbedBuilder()
                    .setTitle(`${article.title}`)
                    .setURL(`${article.url}`)
                    .setColor('Red')
                    .setDescription(`${article.description}`)
                    .setImage(`${article.urlToImage}`)
                    .setTimestamp(new Date(article.publishedAt))
                    .setFooter({
                        text: `Author: ${article.author} | Source: ${article.source.name}`
                    });
            });

            interaction.editReply({ embeds: newsEmbeds });

        }).catch(error => {
            console.error(error);
            interaction.editReply('Sorry, an error occurred!');
        });
    },
};
