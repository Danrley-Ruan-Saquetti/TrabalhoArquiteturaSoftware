export type Environment = {
  ENVIRONMENT: 'DEVELOPMENT' | 'PRODUCTION' | 'TEST'
  APP_MAIL: string
  SECRET_PEPPER: string
  DATABASE_URL: string
  REDIS_HOST: string
  REDIS_PORT: number
  REDIS_PASSWORD: string
  JWT_USER_SECRET: string
  JWT_USER_EXPIRATION: string
  JWT_BANK_ACCOUNT_SECRET: string
  JWT_BANK_ACCOUNT_EXPIRATION: string
  PORT: number
  TZ: string
  MAIL_HOST: string
  MAIL_PORT: number
  MAIL_USER: string
  MAIL_PASSWORD: string
  MAIL_DEFAULT_FROM: string
}

export function env<T extends keyof Environment>(name: T, defaultValue?: Environment[T]) {
  return (process.env[name] ?? defaultValue ?? null) as Environment[T]
}