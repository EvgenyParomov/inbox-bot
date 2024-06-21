import { Scenes } from "telegraf";
import type { AppContext } from "../shared/context";
import { z } from "zod";
import { message } from "telegraf/filters";

export const NOTE_SCENE_ID = "NOTE_SCENE_ID";
export const noteScene = new Scenes.BaseScene<AppContext>(NOTE_SCENE_ID);

const NoteStateSchema = z.object({
  token: z.string(),
  pageId: z.string(),
});

noteScene.enter((ctx) => {
  const { token, pageId } = NoteStateSchema.parse(ctx.scene.state);
  ctx.replyWithMarkdownV2("Всё что отправишь будет в notion");
  ctx.reply(`Параметры: ${token} ${pageId}`);
});

noteScene.on(message("text"), (ctx) => {
  const { token, pageId } = NoteStateSchema.parse(ctx.scene.state);

  ctx.scene.leave();
});
