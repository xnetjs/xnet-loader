"use strict";

module.exports = {
	loadRouter(dir, opts) {
		const app = this.app;

		opts = Object.assign(
			{
				initializer: function(obj, opt) {
					return obj(app);
				}
			},
			opts
		);

    this.loadToApp(dir, "routers", opts);
	}
};
