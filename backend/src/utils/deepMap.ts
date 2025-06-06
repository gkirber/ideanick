import _ from 'lodash'

type ReplaceFn = ({ path, key, value }: { path: string; key: string; value: Value }) => Value
export type Value =
  | object
  | number
  | string
  | boolean
  | null
  | undefined
  | ((...args: unknown[]) => unknown)
  | symbol
  | Value[]

const recursion = ({
  input,
  replaceFn,
  seen,
  pathStartsWith,
  parentKey,
}: {
  input: Value
  replaceFn: ReplaceFn
  seen: WeakSet<object>
  pathStartsWith: string
  parentKey: string
}): Value => {
  if (['object', 'function', 'symbol'].includes(typeof input) && input !== null) {
    if (seen.has(input as object)) {
      return '!!!CIRCULAR!!!'
    } else {
      seen.add(input as object)
    }
  }
  const result = replaceFn({ path: pathStartsWith.replace(/\.$/, ''), key: parentKey, value: input })
  if (!result) {
    return result
  }
  if (_.isArray(result)) {
    return result.map((item, index) =>
      recursion({
        input: item,
        replaceFn,
        seen,
        pathStartsWith: `${pathStartsWith}${index}.`,
        parentKey: index.toString(),
      })
    )
  }
  if (_.isObject(result)) {
    const object: Record<string, Value> = {}
    for (const [key, value] of Object.entries(result)) {
      object[key] = recursion({
        input: value,
        replaceFn,
        seen,
        pathStartsWith: `${pathStartsWith}${key}.`,
        parentKey: key,
      })
    }
    return object
  }
  return result
}

export const deepMap = <T = Value>(input: Value, replaceFn: ReplaceFn): T => {
  const seen = new WeakSet<object>()
  const mappedObject = recursion({ input, replaceFn, seen, pathStartsWith: '', parentKey: '' })
  const clonedMappedObject = _.cloneDeep(mappedObject)
  return clonedMappedObject as T
}
