import * as O from 'fp-ts/lib/Option'

export const mapPromise = <T, B>(f: (f: T) => B) => (op: O.Option<Promise<T>>) => O.map<Promise<T>, Promise<B>>(p => p.then(f))(op)