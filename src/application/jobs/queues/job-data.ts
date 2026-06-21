export abstract class DataJob<Data = any> {

  static KEY_JOB = ''

  constructor(private data: Data) { }

  getData() {
    return this.data
  }
}