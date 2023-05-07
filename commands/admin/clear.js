const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

module.exports =
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.clear.slash.name)
        .setDescription(lang.clear.slash.description)
        
        .addIntegerOption(option => option.setName(lang.clear.slash.option.name)
            .setDescription(lang.clear.slash.option.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const author = interaction.user.username;
        const mention = interaction.user.toString();
        const value = interaction.options.getInteger(lang.clear.slash.option.name);
        
        // -------------------
        //     PERMS CHECK
        // -------------------
        
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) 
        {
            permission = new EmbedBuilder()
                .setTitle(lang.universal.permission.title)
                .setDescription(lang.universal.permission.description)
                .setColor(lang.universal.permission.color)
                .setTimestamp();
            
                return interaction.reply({
                    content: mention,
                    embeds: [permission],
                    ephemeral: true
                }
            );
        }
        
        // -------------------
        //     LIMIT CHECK
        // -------------------

        if(value < 1 || value > 100) 
        {    
            error = new EmbedBuilder()
                .setTitle(lang.clear.embed.error.title)
                .setDescription(lang.clear.embed.error.description)
                .setColor(lang.clear.embed.error.color)
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [error],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //    SUCESS CLEAR
        // -------------------        
        
        await interaction.channel.bulkDelete(value, true);
        
        sucess = new EmbedBuilder()
            .setTitle(lang.clear.embed.sucess.title)
            .setDescription(lang.clear.embed.sucess.description.replace('{value}', value).replace('{author}', author))
            .setColor(lang.clear.embed.sucess.color)
            .setTimestamp();

            return interaction.reply({
                content: mention,
                embeds: [sucess],
                ephemeral: false
            }
        );
    },
};