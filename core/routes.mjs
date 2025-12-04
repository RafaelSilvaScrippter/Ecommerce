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
  delete(route, handler) {
    this.routes["DELETE"][route] = handler;
  }
  put(route, handler) {
    this.routes["PUT"][route] = handler;
  }

  matchRoute(url, routePattern) {
    const urlParts = url.split("/").filter(Boolean);
    const patternParts = routePattern.split("/").filter(Boolean);

    if (urlParts.length !== patternParts.length) return null;

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(":")) {
        const key = patternParts[i].slice(1);
        params[key] = urlParts[i];
      } else if (patternParts[i] !== urlParts[i]) {
        return null;
      }
    }

    return params; // sucesso
  }

  findHandler(method, url) {
    const methodRoutes = this.routes[method];
    for (const routerPattern in methodRoutes) {
      const params = this.matchRoute(url, routerPattern);
      if (params) {
        return { handler: methodRoutes[routerPattern], params };
      }
    }
    return null;
  }
}
