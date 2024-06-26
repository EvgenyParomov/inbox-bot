import { Scenes, session, Telegraf } from "telegraf";
import { z } from "zod";
import type { AppContext } from "./shared/context";
import { ONBOARDING_SCENE_ID, onboardingScene } from "./scenes/onboarding";
import { noteScene } from "./scenes/note";
import { askTokenScene } from "./scenes/ask-token";
import { askInboxPageScene } from "./scenes/ask-inbox-page";
import { Postgres } from "@telegraf/session/pg";
import * as parsePgUrl from "pg-connection-string";

const EnvSchema = z.object({
  BOT_TOKEN: z.string(),
  WEBHOOK_DOMAIN: z.string().optional(),
  WEBHOOK_PORT: z.coerce.number().optional(),
  PG_URL: z.string().optional(),
});

const env = EnvSchema.parse(process.env);

const bot = new Telegraf<AppContext>(env.BOT_TOKEN);

const stage = new Scenes.Stage<AppContext>(
  [onboardingScene, noteScene, askTokenScene, askInboxPageScene],
  {
    ttl: 10,
  }
);

const { port, host, database, user, password } = env.PG_URL
  ? parsePgUrl.parse(env.PG_URL)
  : ({} as Record<string, string>);

if (port && host && database && user && password) {
  console.log("Postgres start");
  const store = Postgres<{}>({
    user: user,
    host: host,
    database: database,
    password: password,
  });
  bot.use(session({ store }));
} else {
  bot.use(session());
}
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.scene.enter(ONBOARDING_SCENE_ID);
});

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
