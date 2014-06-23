var config = module.exports;

config["CurryJS Test Suite"] = { rootPath    : "./"
                               , environment : "node"
                               , sources     : [ "src/lib/curry.js"       ]
                               , tests       : [ "src/spec/curry-spec.js" ]
                               };