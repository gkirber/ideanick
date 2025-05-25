const mockSuperjson = {
  stringify: (obj: unknown) => JSON.stringify(obj),
  parse: (str: string) => JSON.parse(str),
  default: {
    stringify: (obj: unknown) => JSON.stringify(obj),
    parse: (str: string) => JSON.parse(str),
  },
}

export default mockSuperjson
