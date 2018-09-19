"use strict";

module.exports = {
	loadMiddleware(dir, opts) {
		opts = Object.assign({
      initializer: (obj, opt) => {
        const app = this.app;
        const property = opt.property;
        const fn = obj;
        app.pushMiddleware(property, fn);

        return null;
      }
    }, opts);
		this.loadToApp(dir, "middlewares", opts);
	}
};
