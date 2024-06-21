import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import type { AppContext } from "../shared/context";
import { ASK_INBOX_PAGE_SCENE_ID } from "./ask-inbox-page";

export const ASK_TOKEN_SCENE_ID = "ASK_TOKEN_SCENE_ID";
export const askTokenScene = new Scenes.BaseScene<AppContext>(
  ASK_TOKEN_SCENE_ID
);

askTokenScene.enter((ctx) => {
  ctx.replyWithHTML(
    `Введи токен для Notion <a href="https://www.notion.so/my-integrations">можно посмотреть здесь</a>`
  );
});

askTokenScene.on(message("text"), (ctx) => {
  ctx.scene.enter(ASK_INBOX_PAGE_SCENE_ID, {
    ...ctx.scene.state,
    token: ctx.message.text,
  });
});
