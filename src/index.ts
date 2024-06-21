import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { z } from "zod";

const EnvSchema = z.object({
  BOT_TOKEN: z.string(),
});

const env = EnvSchema.parse(process.env);

const bot = new Telegraf(env.BOT_TOKEN);

bot.command("quit", async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.on(message("text"), async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.state.role}`
  );

  // Using context shortcut
  await ctx.reply(`Hello ${ctx.state.role}`);
});

bot.on("callback_query", async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

  // Using context shortcut
  await ctx.answerCbQuery();
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
console.log("Bot Started");
