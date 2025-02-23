const DEFAULT_PORT = 3000;

/**
 * @typedef Environment
 * @property {number} port
 * @property {string} connectionString
 */

let parsedEnv = null;

/**
 * Validate the environment variables and return them as an object or `null` if
 * validation fails.
 * @param {NodeJS.ProcessEnv} env
 * @param {import('./logger').Logger} logger
 * @returns {Environment | null}
 */
export function environment(env, logger) {
  if (parsedEnv) {
    return parsedEnv;
  }

  const { PORT: port, DATABASE_URL: envConnectionString } = env;

  let error = false;

  if (!envConnectionString || envConnectionString.length === 0) {
    logger.error('DATABASE_URL must be defined as a string');
    error = true;
  }
  
  /**
   * The port to listen on.
   * @type {number}
   */

  let usedPort;
  const parsedPort = Number.parseInt(port ?? '', 10);
  if (port && Number.isNaN(parsedPort)) {
    logger.error('PORT must be defined as a number', port);
    usedPort = parsedPort;
    error = true;
  } else if (parsedPort) {
    usedPort = parsedPort;
  } else {
    logger.info('PORT not defined, using default port', DEFAULT_PORT);
    usedPort = DEFAULT_PORT;
  }

  if (error) {
    return null;
  }
  /**
   * The connection string for the database.
   * @type {string}
   */
  const connectionString = envConnectionString;

  parsedEnv = {
    port: usedPort,
    connectionString,
  };

  return parsedEnv;
}
