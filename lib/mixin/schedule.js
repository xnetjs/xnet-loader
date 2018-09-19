"use strict";

module.exports = {
	loadSchedule(dir, opts) {
		opts = Object.assign({}, opts);
		this.loadToApp(dir, "schedule", opts);
	}
};
