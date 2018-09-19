"use strict";

module.exports = {
	loadConfig(dir, opts) {
		opts = Object.assign({}, opts);
		this.loadToApp(dir, "config", opts);
	}
};
