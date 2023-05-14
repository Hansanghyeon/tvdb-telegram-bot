import * as R from "https://deno.land/x/fp_ts@v2.11.4/Record.ts";
import * as A from "https://deno.land/x/fp_ts@v2.11.4/Array.ts";
import { pipe } from "https://deno.land/x/fp_ts@v2.11.4/function.ts";
import * as O from "https://deno.land/x/fp_ts@v2.11.4/Option.ts";


function obj2list(obj: Record<string, any>) {
  const template = (key, value) => `${key}\n${value}`
  return pipe(
    obj,
    R.toArray,
    A.filter(([key]) => key !== 'overview'),
    A.map(([key, value]) => template(key, value)),
    list => list.join('\n\n')
  )
}

export default obj2list
