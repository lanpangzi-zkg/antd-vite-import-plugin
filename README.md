# antd-vite-import-plugin
本插件适用于react+antd3.x开发体系的前端项目，可以实现antd3.x版本在vite的按需加载。类似babel-plugin-import提供的功能；

# 使用方式
```
---vite.config.js---
import antdViteImportPlugin from './antd-vite-import-plugin';
...

plugins: [
		reactRefresh(),
		antdViteImportPlugin(),
        ...
	],
```