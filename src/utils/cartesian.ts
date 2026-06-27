export function cartesianProduct(groups: string[][]): string[][] {
  return groups.reduce<string[][]>(
    (accumulator, group) => {
      const next: string[][] = [];

      for (const prefix of accumulator) {
        for (const value of group) {
          next.push([...prefix, value]);
        }
      }

      return next;
    },
    [[]],
  );
}
