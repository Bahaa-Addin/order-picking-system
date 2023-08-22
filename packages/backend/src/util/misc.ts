/**
 * Miscellaneous shared functions go here.
 */


/**
 * Get a random number between 1 and 1,000,000,000,000
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * Wait for a certain number of milliseconds.
 */
export function tick(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

// export function splitPathByDot(path: string, delimiter: string) {
//   return path.split(delimiter).reduce((splitKeys, key, index, arr) => {
//     if (index === arr.length - 1) {
//       splitKeys[key] = value;
//     } else {
//       acc[splitKey] = acc[splitKey] || {};
//     }
//     return acc[splitKey];
//   });
// }