
import { IO } from "https://deno.land/x/fp_ts@v2.11.4/IO.ts"
import * as RA from "https://deno.land/x/fp_ts@v2.11.4/ReadonlyNonEmptyArray.ts";
import * as S from "https://deno.land/x/fp_ts@v2.11.4/string.ts";
import { pipe, flow } from "https://deno.land/x/fp_ts@v2.11.4/function.ts";
import * as TE from "https://deno.land/x/fp_ts@v2.11.4/TaskEither.ts";

interface converDataProps {
  search: {
    status: string 
    data: Array<Record<string, any>>,
    links: any
  },
  series: {
    status: string
    data: Record<string, string>,
  }
}

/**
 * 검색결과, 시리즈 검색결과 필요
 */
export function convertData(res: converDataProps) {
  let search_data = res.search.data
  let series_data = res.series.data

  let result = {
    thumbnail: search_data[0].image_url,
    name: series_data.name,
    overview: series_data.overview,
  }

  return result 
}
