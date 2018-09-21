"use strict";

const allowExtends = ["controller"];
module.exports = {
	loadExtend(dir, opts) {
		opts = Object.assign(
			{
				glob: {
					cwd: dir,
					pattern: "*(" + allowExtends.map(v => v + ".js").join("|") + ")",
					dot: false,
					matchBase: true,
					nodir: true
				}
			},
			opts
		);
		this.loadToApp(dir, "extend", opts);
	}
};
