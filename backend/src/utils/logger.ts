/**
 * Simple logger utility
 * Provides colored console logging with timestamps
 */

import { env } from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const colors = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  reset: '\x1b[0m',
};

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (env.isTest) return false;
    if (level === 'debug' && !env.isDevelopment) return false;
    return true;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const color = colors[level];
    const reset = colors.reset;
    const levelStr = level.toUpperCase().padEnd(5);

    console.log(`${color}[${timestamp}] ${levelStr}${reset} ${message}`, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }
}

export const logger = new Logger();
