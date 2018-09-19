"use strict";

const path = require("path");
const fs = require("fs");
const assert = require('assert');
const is = require('is-type-of')

module.exports = {
	loadPlugin(pluginOpts) {

    const installedPlugins = [];
    

		for (const name in pluginOpts) {
			const pluginOpt = pluginOpts[name];
			if (!pluginOpt.enable) {
				continue;
      }
      const pluginPath = this.getPluginPath(pluginOpt)
      const plugin = require(pluginPath);

			assert(is.object(plugin), "plugin must is a object");
			assert(is.function(plugin.install),"plugin's install must is a function");

			if (installedPlugins.indexOf(name) > -1) {
				continue;
      }
			plugin.install.apply(plugin, [this.app, pluginOpt.config]);
			installedPlugins.push(name);
		}
	},

	getPluginPath(opt) {
		if (opt.path) {
			return opt.path;
		}

		const lookupDirs = [];
    const name = opt.package || opt.name;
    const baseDir = this.opts.baseDir;

		lookupDirs.push(path.join(baseDir, "node_modules"));
		lookupDirs.push(path.join(process.cwd(), "node_modules"));

		for (let dir of lookupDirs) {
			dir = path.join(dir, name);
			if (fs.existsSync(dir)) {
				return fs.realpathSync(dir);
			}
    }
    
    throw new Error(`Can not find plugin ${name} in "${lookupDirs.join(', ')}"`);
	}
};
