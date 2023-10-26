export const normalizeData = <T>(data: T[], key: keyof T): Record<string, T> =>
  data.reduce((res: Record<string, T>, item: T) => {
    res[item[key] as unknown as string] = item;
    return res;
  }, {} as Record<string, T>);

export const denormalizeData = <T>(data: Record<string, T>): T[] => Object.values(data);
