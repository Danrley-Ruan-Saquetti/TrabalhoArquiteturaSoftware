import { ErrorLog } from '@domain/entities/error-log.entity'

export type ErrorLogSaveProps = {
  origin: string;
  type: string;
  message: string;
  details?: Record<string, any>;
}

export abstract class ErrorLogService {

  abstract save(errorLog: ErrorLogSaveProps): Promise<ErrorLog>
}