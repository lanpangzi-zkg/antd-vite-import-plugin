import core from "@babel/core";
import * as t from "@babel/types";
import { paramCase } from "param-case";
import babelParser from "@babel/parser";
import traverse from "@babel/traverse";

const SUFFIX_QUEUE = ['jsx', 'tsx', 'js', 'ts'];

function antdViteImportPlugin() {
    return {
        name: 'antd-vite-import-plugin',
        transform(code, file) {
            if (!(/(node_modules)/).test(file) && SUFFIX_QUEUE.includes(file.split('.').slice(-1)[0])) {
                const ast = babelParser.parse(code, {
                    sourceType: "module",
                });
                const modifyImports = [];
                traverse(ast, {
                    ImportDeclaration(path) {
                        if (path.node.source.value === 'antd') {
                            path.node.specifiers.forEach((specifier) => {
                                const name = paramCase(specifier.imported.name);
                                const jsSource = t.stringLiteral(`${path.node.source.value}/lib/${name}`);
                                modifyImports.push(t.importDeclaration([t.importDefaultSpecifier(specifier.local)], jsSource));
                                const cssSource = t.stringLiteral(`${path.node.source.value}/lib/${name}/style/index.css`)
                                modifyImports.push(t.importDeclaration([], cssSource));
                            });
                            path.replaceWithMultiple(modifyImports);
                        }
                    }
                });
                if (modifyImports.length > 0) {
                    return {
                        code: core.transformFromAstSync(ast).code,
                        map: this?.getCombinedSourcemap(),
                    }
                }
            }
            return {
                code,
                map: null
            };
        }
    }
}
export default antdViteImportPlugin;