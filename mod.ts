// =============== bootstrap
import "https://deno.land/std@0.186.0/dotenv/load.ts";
// =============== deps
import { Bot } from "https://deno.land/x/telegram@v0.1.1/mod.ts";
import { pipe, flow }  from "https://deno.land/x/fp_ts@v2.11.4/function.ts";
import { chain } from "https://deno.land/x/fp_ts@v2.11.4/IO.ts"
// =============== module
import { getShibes } from './shibe_api.ts'
import { tvdbMessage } from './tvdb/index.ts'
import obj2list from './tvdb/obj2list.ts'

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
    let query = text.replace('Episode Grabbed\n', '')
    query = query.split(' - ')
    query = query[0]

    try {
      const msgObj = await tvdbMessage(query)
      const message = pipe(
        msgObj,
        obj2list,
      )
      await ctx.reply(message)
    } catch (error) {
      console.log('===error===')
      console.error(error.message)
    }
  }

  if (text === '/shibe' || text === '/shibe@hyeon_function_test_bot') {
    await ctx.reply(await getShibes());
  }
})

bot.launch()
