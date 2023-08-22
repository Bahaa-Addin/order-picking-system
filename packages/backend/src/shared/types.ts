export type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
};

export type Nullable<T> = T | null | undefined;
