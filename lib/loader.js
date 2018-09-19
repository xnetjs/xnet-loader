const FileLoader = require("./file_loader");

class Loader {
	constructor(opts) {
		this.opts = opts;
		this.app = this.opts.app;
	}

	loadToApp(dir, property, opts) {
    const target = this.app[property] || (this.app[property] = {});
		const loaderOpts = Object.assign(
			{
				dir: dir,
				target: target,
				inject: this.app
			},
			opts
    );
		new FileLoader(loaderOpts).load();
	}

	loadToContent(dir, property, opts) {}
}

const loaders = [
	require("./mixin/config"),
	require("./mixin/controller"),
	require("./mixin/router"),
  require("./mixin/plugin"),
  require("./mixin/middleware"),
  require("./mixin/schedule"),
];

for (const loader of loaders) {
	Object.assign(Loader.prototype, loader);
}
module.exports = Loader;
