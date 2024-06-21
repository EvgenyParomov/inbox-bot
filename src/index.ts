import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { z } from "zod";

const EnvSchema = z.object({
  BOT_TOKEN: z.string(),
  WEBHOOK_DOMAIN: z.string().optional(),
  WEBHOOK_PORT: z.coerce.number().optional(),
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
  await ctx.reply(`Hello worlds ${ctx.state.role}`);
});

bot.on("callback_query", async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

  // Using context shortcut
  await ctx.answerCbQuery();
});

process.env.NODE_ENV;

if (env.WEBHOOK_PORT && env.WEBHOOK_DOMAIN) {
  console.log("Webhook start");
  bot.launch({
    webhook: {
      // Public domain for webhook; e.g.: example.com
      domain: env.WEBHOOK_DOMAIN,

      // Port to listen on; e.g.: 8080
      port: env.WEBHOOK_PORT,
    },
  });
} else {
  console.log("Long polling start");
  bot.launch();
}

// Start webhook via launch method (preferred)

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
