"use strict";

const mixinDeep = require('mixin-deep');

module.exports = {
	loadController(dir, opts) {
    const instances = new Map();
    
    mixinDeep(this.app.Controller.prototype, this.app.extend.controller || {})

		opts = Object.assign(
			{
				caseStyle: "upper",
				initializer: (obj, opt) => {
					const app = this.app;
					const { target, property } = opt;
					Object.defineProperty(target, property, {
						get: function() {
							if (instances.has(property)) {
								return instances.get(property);
							}

							const cls = obj({
								Controller: app.Controller,
								Sequelize: app.Sequelize
							});
							const instance = new cls(app);
							instances.set(property, instance);
							return instance;
						}
					});

					return null;
				}
			},
			opts
		);
		this.loadToApp(dir, "controller", opts);
	}
};
