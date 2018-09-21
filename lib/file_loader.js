"use strict";

const path = require("path");
const glob = require("glob");
const is = require("is-type-of");
const GETEXPORTS = Symbol("FileLoader#getExports");
const GETPROPERTY = Symbol("FileLoader#getProperty");

class FileLoader {
	constructor(opts) {
		this.opts = Object.assign(
			{
				glob: {
					cwd: opts.dir,
					pattern: "*.js",
					dot: false,
					matchBase: true,
					nodir: true
				},
				initializer: false,
				call: true,
				inject: undefined,
				caseStyle: "lower" // ["camel", "upper", "lower"]
			},
			opts
    );
	}

	load() {
		const opts = this.opts;
		const globOpts = opts.glob;

		const files = glob.sync(globOpts.pattern, globOpts);
		if (!files) {
			return undefined;
		}
    const target = opts.target;
		files.reduce((target, relativePath, index) => {
			const absolutePath = path.join(opts.dir, relativePath);
			let property = this[GETPROPERTY](relativePath);
			let exports = this[GETEXPORTS](absolutePath, opts, property);

			if (exports === null) {
				return;
			}

			target[property] = exports;

			return target;
    }, target);
    
		// return target;
	}

	[GETPROPERTY](relativePath) {
		const caseStyle = this.opts.caseStyle;

		let properties = relativePath
			.substring(0, relativePath.lastIndexOf("."))
			.split("/");

		properties = properties.map((property, index, properties) => {
			if (index === properties.length - 1) {
				switch (caseStyle) {
					case "lower":
						property = property[0].toLowerCase() + property.slice(1);
						break;
          case "upper":
            property = property[0].toUpperCase() + property.slice(1);
						break;
					default:
				}
			}
			return property;
		});

		return properties.join(".");
	}

	[GETEXPORTS](filePath, { initializer, call, inject }, property) {
		const target = this.opts.target;
		let exports = loadFile(filePath);

		// console.log(initializer, filePath)
		if (initializer) {
			exports = initializer(exports, { property, target });
		}

		if (
			is.class(exports) ||
			is.generatorFunction(exports) ||
			is.asyncFunction(exports)
		) {
			return exports;
		}

		if (call && is.function(exports)) {
			exports = exports(inject);
		}

		return exports;
	}
}

const loadFile = filePath => {
	try {
		const extname = path.extname(filePath);
		if (extname && !require.extensions[extname]) {
			return fs.readFileSync(filePath);
		}

		const obj = require(filePath);
		if (!obj) return obj;

		if (obj.__esModule) return "default" in obj ? obj.default : obj;
		return obj;
	} catch (err) {
		throw err;
	}
};

module.exports = FileLoader;
