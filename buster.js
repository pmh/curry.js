var config = module.exports;

config["CurryJS Test Suite"] = { rootPath    : "./"
                               , environment : "node"
                               , sources     : [ "src/lib/**/*.js"
                                               ]
                               , tests       : [ 
                                               , "src/spec/**/*.js"
                                               ]
                               };