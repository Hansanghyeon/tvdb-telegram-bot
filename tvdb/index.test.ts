import "https://deno.land/std@0.186.0/dotenv/load.ts";
import { assertObjectMatch } from "https://deno.land/std@0.187.0/testing/asserts.ts"
import { tvdbMessage } from './index.ts'

Deno.test('tvdb 로그인, 검색, 텔레그램 메세지지로 변환', async () => {
  const query = 'The Eminence in Shadow'

  const result = await tvdbMessage(query)

  assertObjectMatch(result, {
    thumbnail: 'https://artworks.thetvdb.com/banners/v4/series/407520/posters/63aa961fc5730.jpg',
    name: '어둠의 실력자가 되고 싶어서!',
    overview: `“어둠의 실력자”\r\n\r\n그것은 주인공도 라스트 보스도 아니다.\r\n\r\n평소에는 실력을 숨기고 모브에 투철하고, 이야기에 어둠으로 개입해 은밀하게 실력을 보여주는 존재.\r\n\r\n\r\n이『어둠의 실력자』를 동경해, 매일 모브로서 눈에 띄지 않고 생활하면서, 힘을 찾아 정진하던 소년은사고로 목숨을 잃고 이세계로 환생한다.\r\n\r\n‘시드카게노’로 다시 태어난 소년은, 이를 다행으로 여기고 이세계에서‘어둠의 실력자＇라는 설정을 즐기기로 한다.\r\n\r\n‘망상’으로 만들어낸 『어둠의 교단』을 쓰러뜨리기 위해(장난으로) 암약하고 있었는데, 아무래도 망상으로 만들어낸 『어둠의 교단』이 정말로 존재하는데……?\r\n\r\n\r\n게다가 별생각 없이 부하로 삼은 소녀들의 『착각』으로 인해 ‘시드’를 숭배하고,\r\n\r\n‘시드’는 본인도 모르는 사이에 진짜 『어둠의 실력자』가 되어간다.\r\n그리고 ‘시드’가 이끄는 어둠의 조직 『섀도우 가든』은, 이윽고 세상의 어둠을 멸망시켜 간다────!!`
  })
})
