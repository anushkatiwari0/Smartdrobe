/**
 * Centralized logging utility using Winston
 * Replaces console.log/error throughout the application
 */

import winston from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transports to use
const transports = [
  // Console transport for all environments
  new winston.transports.Console(),

  // File transports for production
  ...(process.env.NODE_ENV === 'production'
    ? [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/all.log' }),
      ]
    : []),
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  levels,
  format,
  transports,
});

/**
 * Structured logger for API routes
 */
export const apiLogger = {
  /**
   * Log an error
   */
  error: (context: string, error: unknown, metadata?: Record<string, unknown>) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`[${context}] ${errorMessage}`, metadata);
  },

  /**
   * Log a warning
   */
  warn: (context: string, message: string, metadata?: Record<string, unknown>) => {
    logger.warn(`[${context}] ${message}`, metadata);
  },

  /**
   * Log an informational message
   */
  info: (context: string, message: string, metadata?: Record<string, unknown>) => {
    logger.info(`[${context}] ${message}`, metadata);
  },

  /**
   * Log HTTP request/response
   */
  http: (context: string, message: string, metadata?: Record<string, unknown>) => {
    logger.http(`[${context}] ${message}`, metadata);
  },

  /**
   * Log debug information (development only)
   */
  debug: (context: string, message: string, metadata?: Record<string, unknown>) => {
    logger.debug(`[${context}] ${message}`, metadata);
  },
};

export default logger;
