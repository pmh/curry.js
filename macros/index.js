macro fun {
  case {_ ($params ...) { $body ... $last:expr } } => {
    return #{
      (function ($params ...) {
        $body ...
        return $last
      }).curry()
    }
  }
  case {_ ($params ...) $body:expr } => {
    return #{ fun ($params ...) { $body } }
  }
}

export fun