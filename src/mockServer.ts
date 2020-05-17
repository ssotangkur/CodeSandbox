/**
 * A Mock server that simulates network delay
 */

var fetchCount = 0;
/**
 * Factory that creates a mock fetcher
 * @param delay milliseconds to wait before resolving the promise
 */

const createFetcher = (delay: number) => {
  return () => {
    return new Promise<string>(resolve =>
      setTimeout(() => resolve(`Fetch Called ${++fetchCount} times`), delay)
    );
  };
};

export default createFetcher;
