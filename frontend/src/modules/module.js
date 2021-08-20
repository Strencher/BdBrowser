import fs from "./fs";
import { extname } from "./path";

const globalPaths = [];
const _extensions = {
    ".json": (module, filename) => {
        const filecontent = fs.readFileSync(filename);
        module.exports = JSON.parse(filecontent);
    },
    ".js": (module, filename) => {
        console.log(module, filename)
    }
};

function _require(path) {
    const extension = "." + extname(path);
    const loader = _extensions[extension];
    if (!loader) throw new Error("Unkown File extension " + path);
    const existsFile = fs.existsSync(path);
    if (!path) console.log(path);
    if (!existsFile) throw new Error("Module not found!");
    
    const final = {
        exports: {},
        filename: path,
        _compile: content => {
            let {module} = eval(`((module, global) => {
                ${content}

                return {
                    module
                };
            })({exports: {}}, window)`);
            
            if (Object.keys(module.exports).length) final.exports = module.exports;

            return final.exports;
        }
    };
    loader(final, path);
    return final.exports;
}


export default {
    Module: {globalPaths, _extensions},
    _require
};