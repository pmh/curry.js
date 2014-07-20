let describe = macro {
  case { _ $desc { $body ... } } => {
    return #{ require("buster").spec.describe($desc, function () { $body ... }) }
  }

  case { _ } => { return #{ describe } }
}
export describe

let it = macro {
  case { _ $desc { $body ... } } => {
    return #{ ;require("buster").spec.it($desc, function () { $body ... }) }
  }

  case { _ } => { return #{ it } }
}
export it

let test = macro {
  rule { $desc { $($a:expr =>= $b:expr) ... } } => {
    ;$(require("buster").assert.equals($a, $b, $desc)) ...
  }

  rule { $desc { $a:expr =!= $b:expr } } => {
    ;require("buster").assert.exception(function(){ $a }, $b)
  }
  
  rule { $desc { $a:expr } } => {
    ;require("buster").assert($a, $desc)
  }
}
export test