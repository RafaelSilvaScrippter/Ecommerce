export class Routes {
  routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
  };

  get(route, handler) {
    this.routes["GET"][route] = handler;
  }
  post(route, handler) {
    this.routes["POST"][route] = handler;
  }
}
