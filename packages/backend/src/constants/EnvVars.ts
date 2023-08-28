/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */


export default {
  NodeEnv: (process.env.NODE_ENV ?? 'development'),
  Port: (process.env.PORT ?? 4000),
  DatabaseUrl: (process.env.DATABASE_URL ?? 'mongodb+srv://bahaa:BemvBNixFGkp0OVs@seoudi.pcbwpox.mongodb.net/test?retryWrites=true&w=majority'),
} as const;
