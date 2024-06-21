import { Input, Scenes } from "telegraf";
import { message } from "telegraf/filters";
import type { AppContext } from "../shared/context";
import * as fs from "fs";
import * as path from "path";
import { NOTE_SCENE_ID } from "./note";

export const ASK_INBOX_PAGE_SCENE_ID = "ASK_INBOX_PAGE_SCENE_ID";
export const askInboxPageScene = new Scenes.BaseScene<AppContext>(
  ASK_INBOX_PAGE_SCENE_ID
);

askInboxPageScene.enter(async (ctx) => {
  await ctx.reply("Введите id станицы inbox");

  await ctx.replyWithPhoto(
    Input.fromReadableStream(
      fs.createReadStream(path.resolve(__dirname, "../assets/instruct.png"))
    )
  );
});

askInboxPageScene.on(message("text"), (ctx) => {
  ctx.scene.enter(NOTE_SCENE_ID, {
    ...ctx.scene.state,
    pageId: ctx.message.text,
  });
});
