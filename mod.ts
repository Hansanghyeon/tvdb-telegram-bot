// =============== bootstrap
import "https://deno.land/std@0.186.0/dotenv/load.ts";
// =============== deps
import { Bot } from "https://deno.land/x/telegram@v0.1.1/mod.ts";
import { pipe, flow }  from "https://deno.land/x/fp_ts@v2.11.4/function.ts";
import { chain } from "https://deno.land/x/fp_ts@v2.11.4/IO.ts"
// =============== module
import { getShibes } from './shibe_api.ts'
import { searchPipe } from './tvdb/index.ts'

const bot = new Bot(Deno.env.get("BOT_TOKEN") as string);

// Error handler
// bot 토큰이 잘못되었을떄?
// bot 모듈이 잘못되었을때?
bot.use(async (ctx, next) => {
  try {
    await next(ctx);
  } catch (err) {
    console.error(err.message)
  }
});

// start app!
bot.on("text", async (ctx) => {
  const text = ctx.message?.text;

  if (text.includes('Episode Grabbed\n')) {
    await ctx.reply('에피소트 찾았다는 문구')
    searchPipe(text)
  }

  if (text === '/shibe' || text === '/shibe@hyeon_function_test_bot') {
    await ctx.reply(await getShibes());
  }
})

bot.launch()
