// initialize logger

export interface Logger {
  log: Function;
  info: Function;
  warn: Function;
  error: Function;
}

export const getLogger = (): Logger => {
  return console;
};
