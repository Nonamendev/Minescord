const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

const path = require('path');
const configPath = path.resolve(__dirname, '../../resources/config.json');
const config = require(configPath);
const fs = require('fs');

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName("language")
        .setDescription("[Native] change the server bot language"),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction)
    {
        const name = interaction.user.username;
        const mention = interaction.user.toString();

        // -------------------
        //     PERMS CHECK
        // -------------------
        
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) 
        {
            const permissionEmbed = new EmbedBuilder()
                .setTitle(lang.universal.permission.title)
                .setDescription(lang.universal.permission.description)
                .setColor(lang.universal.permission.color)
                .setTimestamp();
            
            return interaction.reply({
                content: mention,
                embeds: [permissionEmbed],
                ephemeral: true
            });
        }        

        // -------------------
        //    EMBED BUILDER
        // -------------------

        const mainEmbed = new EmbedBuilder()
            .setTitle("Bot language")
            .setDescription("> 👋 • Hello **" + name + "**! Welcome to lang panel!\n\n> 🌎 • Default bot language is English, but you can change the bot's commands to your preferred language. Choose from the variety of languages available in the panel below.\n\n> ⭐ • We strive to make our bot accessible to everyone by providing language options and adding more languages to the panel. Thank you for using Minescord!")
            .setColor("Random")
            .setTimestamp()
            .setImage("https://cdn.wallpapersafari.com/81/10/B2Rt0U.jpg");

        // -------------------
        //    MENU BUILDER
        // -------------------
            
        const langMenu = new StringSelectMenuBuilder()
            .setCustomId('langs')
            .setPlaceholder('Select a language')

			.addOptions(
                { label: 'English', description: 'Select the English language', value: 'en', emoji: '🇺🇸' },
                { label: 'Português', description: 'Selecione a língua Portuguesa', value: 'pt', emoji: '🇧🇷' },
                { label: 'Español', description: 'Seleccione el idioma Español', value: 'es', emoji: '🇪🇸' },
            );

        const modules = new ActionRowBuilder().addComponents(langMenu);

        // -------------------
        //     SEND EMBED
        // -------------------

        const messageEmbed = await interaction.reply({
            content: mention,
            embeds: [mainEmbed],
            components: [modules],
            ephemeral: false
        });

        // -------------------
        //    MENU INTERACT
        // -------------------

        const collector = messageEmbed.createMessageComponentCollector({ time: 30000, max: 1 });

        collector.on("collect", async (i) => 
        {
            const choice = i.values[0];

            if(i.customId === "langs") 
            {
                if(choice === 'en') 
                {
                    config.lang = "en";
                    fs.writeFileSync(configPath, JSON.stringify(config));

                    const englishEmbed = new EmbedBuilder()
                        .setTitle("Success!")
                        .setDescription("> Now the bot language has been set to English! **Remember**, you need to restart the bot in your console for the changes to take effect!")
                        .setColor("#4287f5")
                        .setTimestamp();
                    
                    return i.reply({
                        content: mention,
                        embeds: [englishEmbed],
                        ephemeral: false
                    });
                }

                if(choice === 'pt') 
                {
                    config.lang = "pt";
                    fs.writeFileSync(configPath, JSON.stringify(config));

                    const portugueseEmbed = new EmbedBuilder()
                        .setTitle("Sucesso!")
                        .setDescription("> Agora a linguaguem do bot foi definida para Português! **Lembre-se** , você precisa reiniciar o bot no seu console para que as alterações entrem em vigor!")
                        .setColor("#42f54b")
                        .setTimestamp();
                    
                    return i.reply({
                        content: mention,
                        embeds: [portugueseEmbed],
                        ephemeral: false
                    });
                }
                
                if(choice === 'es') 
                {
                    config.lang = "es";
                    fs.writeFileSync(configPath, JSON.stringify(config));

                    const spanishEmbed = new EmbedBuilder()
                        .setTitle("¡Éxito!")
                        .setDescription("> Ahora el idioma del bot es español. **Recuerda**, ¡necesitas reiniciar el bot en tu consola para que los cambios surtan efecto!")
                        .setColor("#eff542")
                        .setTimestamp();
                    
                    return i.reply({
                        content: mention,
                        embeds: [spanishEmbed],
                        ephemeral: false
                    });
                }
            }
        });
    }
};