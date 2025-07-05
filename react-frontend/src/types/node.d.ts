declare namespace NodeJS {
  interface Timeout {
    ref(): Timeout;
    unref(): Timeout;
    refresh(): Timeout;
    [Symbol.toPrimitive](): number;
  }
} 