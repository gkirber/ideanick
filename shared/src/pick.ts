import lodashPick from 'lodash/pick'

export const pick = <TObject extends object, TKeys extends keyof TObject>(
  obj: TObject,
  keys: TKeys[]
): Pick<TObject, TKeys> => {
  return lodashPick(obj, keys)
}
