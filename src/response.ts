class Response {
    data?: any
    statusCode?: number
    message?: string
    static success(data?: any, message?: string) {
      return new Response(data, 200, message)
    }
  
    constructor(data?: any, status?: number, message?: string) {
      this.data = data
      this.statusCode = status
      this.message = message
    }
  }

  
  export default Response