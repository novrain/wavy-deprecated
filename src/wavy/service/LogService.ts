import * as fs from 'fs'
import * as path from 'path'
import * as winston from 'winston'
import { ElectronService } from './ElectronService'

export abstract class Logger {
  constructor(protected name: string) { }

  debug(...args: any[]): void {
    this.doLog('debug', ...args)
  }

  info(...args: any[]): void {
    this.doLog('info', ...args)
  }

  warn(...args: any[]): void {
    this.doLog('warn', ...args)
  }

  error(...args: any[]): void {
    this.doLog('error', ...args)
  }

  log(...args: any[]): void {
    this.doLog('log', ...args)
  }

  protected abstract doLog(level: string, ...args: any[]): void
}

export class ConsoleLogger extends Logger {
  protected doLog(level: string, ...args: any[]): void {
    (console as any)[level](`%c[${this.name}]`, 'color: #aaa', ...args)
  }
}

export abstract class LogService {
  abstract create(name: string): Logger
}

const initializeWinston = (electron: ElectronService) => {
  const logDirectory = electron.app.getPath('userData')
  // eslint-disable-next-line
  const winston = require('winston')

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory)
  }

  return winston.createLogger({
    transports: [
      new winston.transports.File({
        level: 'debug',
        filename: path.join(logDirectory, 'log.txt'),
        format: winston.format.simple(),
        handleExceptions: false,
        maxsize: 5242880,
        maxFiles: 5,
      }),
    ],
    exitOnError: false,
  })
}

export class WinstonAndConsoleLogger extends ConsoleLogger {
  constructor(private winstonLogger: winston.Logger, name: string) {
    super(name)
  }

  protected doLog(level: string, ...args: any[]): void {
    super.doLog(level, ...args);
    (this.winstonLogger as any)[level](...args)
  }
}

export class ElectronLogService {
  private log: winston.Logger

  /** @hidden */
  constructor(electron: ElectronService) {
    this.log = initializeWinston(electron)
  }

  create(name: string): Logger {
    return new WinstonAndConsoleLogger(this.log, name)
  }
}
