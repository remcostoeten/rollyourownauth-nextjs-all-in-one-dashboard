export const noop = () => {};

export function isServer() {
  return typeof window === 'undefined';
}

export function isClient() {
  return !isServer();
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
} 