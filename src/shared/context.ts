import type { Context, Scenes } from "telegraf";

export interface AppContext extends Context {
  scene: Scenes.SceneContextScene<AppContext>;
}
