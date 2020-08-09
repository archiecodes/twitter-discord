const t = new (require("twitter"))({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_TOKEN_SECRET
});
const d = new (require("discord.js")).Client();
let lastTweet = 0;

d.login(process.env.DISCORD_TOKEN).then(() => {
    console.log("Bot is running!");

    d.on("message", msg => {
        if (msg.author.bot || msg.channel.id !== process.env.DISCORD_CHANNEL) return;
        if (msg.content.length > 250) return msg.reply(`That looks a little too long to tweet [${msg.content.length} characters, 250 max]`);
        if (lastTweet > new Date().getTime() - 60000) return msg.reply("Please wait 60 seconds before attempting to tweet again");
        lastTweet = new Date().getTime();

        t.post("statuses/update", {status: msg.content}, (err, tweet) => {
            if (err) return msg.reply("Sorry, something went wrong when using the twitter api!");
            msg.reply(`Tweet ${tweet.id} https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
        });
    });
});