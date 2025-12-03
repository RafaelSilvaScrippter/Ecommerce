export class RouterError extends Error {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}
