export type JWTAlgorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'none'

export type JWTOptions = {
  secret: string
  exp: number | string
  algorithm?: JWTAlgorithm
}

export abstract class JWTService {

  abstract encode(payload: Record<string, unknown>, options: JWTOptions): string
  abstract decode<Payload extends object = any>(token: string): Payload
}