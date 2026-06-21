export class Result<T> {

  private constructor(
    public readonly ok: boolean = true,
    public readonly status: number = 200,
    public readonly value: T | null = null,
    public readonly error: unknown | null = null,
  ) { }

  static success<T>(value: T, status = 200) {
    return new Result<T>(true, status, value, null)
  }

  static failure<T>(error: unknown, status = 400) {
    return new Result<T>(false, status, null, error)
  }

  toJSON() {
    return {
      ok: this.ok,
      status: this.status,
      value: this.value,
      error: this.error,
    }
  }
}