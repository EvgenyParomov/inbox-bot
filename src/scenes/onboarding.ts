import { Markup, Scenes } from "telegraf";
import type { AppContext } from "../shared/context";
import { ASK_TOKEN_SCENE_ID } from "./ask-token";

export const ONBOARDING_SCENE_ID = "ONBOARDING_SCENE_ID";
export const onboardingScene = new Scenes.BaseScene<AppContext>(
  ONBOARDING_SCENE_ID
);

onboardingScene.enter((ctx) => {
  ctx.reply("Привет! Для начала работы тебе потребуется зарегистрироваться", {
    reply_markup: Markup.inlineKeyboard([
      Markup.button.callback("Зарегистрироваться", "register"),
    ]).reply_markup,
  });
});

onboardingScene.action("register", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.scene.enter(ASK_TOKEN_SCENE_ID);
});
