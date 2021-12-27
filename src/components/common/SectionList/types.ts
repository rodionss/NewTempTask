export type Data<T> = {
  key: string;
  list: T[];
};

export type Section<T> = {
  title: string;
  data: Data<T>[];
};

export type RenderSectionArgumentType<T> = {
  item: Data<T>;
};

export type RenderSectionHeaderArgumentType<T> = {
  section: Section<T>;
};

export type OnEndReachedArgumentType = {
  distanceFromEnd: number;
};
