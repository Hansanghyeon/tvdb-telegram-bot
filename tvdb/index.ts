import axiod from "https://deno.land/x/axiod/mod.ts"
import { IO } from "https://deno.land/x/fp_ts@v2.11.4/IO.ts"
import * as RA from "https://deno.land/x/fp_ts@v2.11.4/ReadonlyNonEmptyArray.ts";
import * as S from "https://deno.land/x/fp_ts@v2.11.4/string.ts";
import { pipe, flow } from "https://deno.land/x/fp_ts@v2.11.4/function.ts";
import * as TE from "https://deno.land/x/fp_ts@v2.11.4/TaskEither.ts";
import * as R from "https://deno.land/x/fp_ts@v2.11.4/Record.ts";
import * as A from "https://deno.land/x/fp_ts@v2.11.4/Array.ts";
import { Predicate } from "https://deno.land/x/fp_ts@v2.11.4/Predicate.ts";
import * as O from "https://deno.land/x/fp_ts@v2.11.4/Option.ts";
import { convertData } from './convert.ts'

const TVDB_API_KEY = Deno.env.get('TVDB_API_KEY')
const TVDB_PIN = Deno.env.get('TVDB_PIN')

const TVDB_ENDPOINT = 'https://api4.thetvdb.com/v4'

interface getHeaderResultType {
  [key: string]: string
}
const getHeaders = (token?: string): getHeaderResultType => {
  let result: getHeaderResultType = {
    accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (!!token) {
    result['Authorization'] = `Bearer ${token}`
  }

  return result
}

// tvdb login
export async function tvdbLogin(): Promise<any> {
  const headers = getHeaders()
  const { data: { token } }= await axiod({
    method: "post",
    url: `${TVDB_ENDPOINT}/login`,
    headers,
    data: JSON.stringify({
      apikey: TVDB_API_KEY,
      pin: TVDB_PIN
    })
  })
    .then(res => res.data)
    .catch(err => console.error(err))

  return token
}

/**
 * 토른을 변수로 저장하는이유
 * deno 데몬이 떠있는동안 계속 동일한 토큰을 사용한다.
 * 데몬이 종료되었을때는 token을 다시 받아야와야한다.
 */
let TVDB_TOKEN = await tvdbLogin()

// search test
export async function tvdbSearch(query: string) {
  const headers = getHeaders(TVDB_TOKEN)
  const res = await axiod({
    method: "get",
    url: `${TVDB_ENDPOINT}/search`,
    headers, 
    params: {
      query
    }
  })
    .then(res => res.data)
    .catch(err => console.error(err))
  
  return res
}

/**
 * sonar가 알림하는 문구를가지고 에피소트를 찾기
 **/
export function sonarrSearchEpisode(msg: string): string {
	return flow(
	  S.replace('Episode Grabbed\n', ''),
	  S.split(' - '),
	  RA.head,
	)(msg)
}

/**
 * 시리즈 아이디를 찾기
 **/
interface findSeriesItemProps {
  objectID: string;
  overviews: Record<string, any>;
  [key: string]: any;
}
function findSeries(data: findSeriesItemProps[]) {
  const isSeriesObject: Predicate<findSeriesItemProps> = (item) => 
    item.objectID.startsWith('series-') && 'kor' in item.overviews;

  const result = pipe(
    data,
    A.filter(isSeriesObject),
    A.head,
  )

  return result
}

async function tvdbSearchSeries(id: string) {
  const headers = getHeaders(TVDB_TOKEN)
  const res = await axiod({
    method: "get",
    url: `${TVDB_ENDPOINT}/series/${id}/translations/kor`,
    headers,
  })
    .then(res => res.data)
    .catch(err => console.error(err))

  return res
}

export async function tvdbMessage(query: string) {
  const search_res = await tvdbSearch(query)

  const search_find_series = pipe(
    findSeries(search_res?.data),
    O.fold(
      // onEmpty
      () => undefined,
      // NonEmpty
      itme => itme
    )
  )

  if (search_find_series === undefined)
    throw new Error(`===== 시리즈를 찾을 수 없습니다=====\n검색어: ${query}`)

  const series_id = pipe(
    search_find_series,
    item => item.objectID,
    S.replace('series-', '')
  )
  const series_res = await tvdbSearchSeries(series_id as string)

  const search = search_res
  search.data = [search_find_series]
  const result = {
    search,
    series: series_res,
  }

  const res = pipe(
    // data 검색완료
    result,
    convertData
  )
  return res
}
