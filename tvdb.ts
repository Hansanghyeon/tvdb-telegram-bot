import axiod from "https://deno.land/x/axiod/mod.ts";

const TVDB_API_KEY = Deno.env.get('TVDB_API_KEY')
const TVDB_PIN = Deno.env.get('TVDB_PIN')

const TVDB_ENDPOINT = 'https://api4.thetvdb.com/v4'

const headers = (token?: string) => {
  let result = {
    aceept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (!!token) {
    result['Authorization'] = `Bearer ${token}`
  }

  return result
}

// tvdb login
export async function tvdbLogin() {
  const res = await axiod({
    method: "post",
    url: `${TVDB_ENDPOINT}/login`,
    headers: headers(),
    data: JSON.stringify({
      apikey: TVDB_API_KEY,
      pin: TVDB_PIN
    })
  })
    .then(res => res.data)
    .catch(err => console.error(err))

  return res
}

/**
 * 토른을 변수로 저장하는이유
 * deno 데몬이 떠있는동안 계속 동일한 토큰을 사용한다.
 * 데몬이 종료되었을때는 token을 다시 받아야와야한다.
 */
let TVDB_TOKEN = tvdbLogin()

// search test
export async function tvdbSearch(query) {
  await axiod({
    method: "get",
    url: `${TVDB_ENDPOINT}/search`,
    headers: headers(TVDB_TOKEN),
    params: {
      query: `검색어`
    }
  })
    .then(res => res.data)
    .catch(err => console.error(err))
}
