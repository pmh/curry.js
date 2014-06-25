macro fun {
  rule { $name:ident ($params:ident (,) ...) = { $body ... $last:expr } } => {
    var $name = (function $name ($params (,) ...) {
      $body ...
      return $last
    }).curry()
  }

  rule { $name:ident ($params:ident (,) ...) = $body:expr } => {
    fun $name ($params (,) ...) = { $body }
  }
}

export fun