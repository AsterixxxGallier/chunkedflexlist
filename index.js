const fs = require("fs");
const loader = require("@assemblyscript/loader");
const ConsoleImport = require('as-console/imports')
const Console = new ConsoleImport()
const imports = { ...Console.wasmImports };
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/untouched.wasm"), imports);
module.exports = wasmModule.exports;
Console.wasmExports = wasmModule.exports;
// wasmModule.exports.init();
