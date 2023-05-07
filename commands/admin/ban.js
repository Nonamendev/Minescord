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
        .setName(lang.ban.slash.name)
        .setDescription(lang.ban.slash.description)
        
        .addUserOption(option => option.setName(lang.ban.slash.option1.name)
            .setDescription(lang.ban.slash.option1.description)
            .setRequired(true)
        )

        .addStringOption(option => option.setName(lang.ban.slash.option2.name)
            .setDescription(lang.ban.slash.option2.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const guild = interaction.guild;
        const ownerId = guild.ownerId;

        const author = interaction.user.username;
        const mention = interaction.user.toString();

        const user = interaction.options.getUser(lang.ban.slash.option1.name);
        const reason = interaction.options.getString(lang.ban.slash.option2.name);
        
        const member = interaction.guild.members.cache.get(user.id);
        const hasadmin = member.roles.cache.some(role => role.permissions.has(PermissionFlagsBits.Administrator));
        
        // -------------------
        //     PERMS CHECK
        // -------------------
        
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) 
        {
            const permission = new EmbedBuilder()
                .setTitle(lang.universal.permission.title)
                .setDescription(lang.universal.permission.description)
                .setColor(lang.universal.permission.color)
                .setTimestamp();
            
            return interaction.reply({
                content: mention,
                embeds: [permission],
                ephemeral: true
            });
        }
        
        // -------------------
        //     LIMIT CHECK
        // -------------------

        if(reason.length < 10 || reason.length > 100) 
        {    
            const error = new EmbedBuilder()
                .setTitle(lang.ban.embed.error.reason.title)
                .setDescription(lang.ban.embed.error.reason.description)
                .setColor(lang.ban.embed.error.reason.color)
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [error],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //     ADMIN CHECK
        // -------------------

        if(hasadmin || user.id === ownerId) 
        {
            const admin = new EmbedBuilder()
                .setTitle(lang.ban.embed.error.admin.title)
                .setDescription(lang.ban.embed.error.admin.description)
                .setColor(lang.ban.embed.error.admin.color)
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [admin],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //      BOT CHECK
        // -------------------

        if(user.bot) 
        {
            const bot = new EmbedBuilder()
                .setTitle(lang.ban.embed.error.bot.title)
                .setDescription(lang.ban.embed.error.bot.description)
                .setColor(lang.ban.embed.error.bot.color)
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [bot],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //      KICK USER
        // -------------------

        await interaction.guild.members.ban(user, { reason });

        sucess = new EmbedBuilder()
            .setTitle(lang.ban.embed.sucess.title)
            .setDescription(lang.ban.embed.sucess.description.replace('{author_name}', author).replace('{victim}', user).replace('{reason}', reason))
            .setColor(lang.ban.embed.sucess.color)
            .setTimestamp();

            return interaction.reply({
                content: mention,
                embeds: [sucess],
                ephemeral: false
            }
        );
    },
};