class Payload {
  private header: Record<string, unknown>
  private body: Record<string, unknown>

  constructor(header: Record<string, unknown>, body: Record<string, unknown>) {
    this.header = header
    this.body = body
  }

  static set(header: Record<string, unknown>, body:Record<string, unknown>) {
    return new Payload(header, body)
  }
}
export default Payload
