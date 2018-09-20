"use strict";

const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const debug = require("debug")("xnet-loader:config");

module.exports = {
	loadEnvConfig(dir, env) {
		const envPath = path.join(dir, ".env." + env);
		if (fs.existsSync(envPath)) {
			dotenv.config({ path: envPath });
		} else {
			debug("env file: %s not found!", envPath);
		}
	},
	loadConfig(dir, opts) {
		opts = Object.assign({}, opts);
		this.loadToApp(dir, "config", opts);
	}
};
