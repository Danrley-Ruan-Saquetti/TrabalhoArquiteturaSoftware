import { Injectable, Scope } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { HashService } from '@domain/adapters/crypto/hash.service'

@Injectable({ scope: Scope.REQUEST })
export class HashServiceImplementation extends HashService {

  async hash(value: string) {
    return await bcrypt.hash(value, 10)
  }

  async compare(value: string, hash: string) {
    return await bcrypt.compare(value, hash)
  }
}