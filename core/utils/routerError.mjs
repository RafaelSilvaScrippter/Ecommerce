export class RouterError extends Error {
  constructor(status, message) {
    try {
      super(message);
      this.status = status;
    } catch (err) {
      console.log(err + message);
    }
  }
}
