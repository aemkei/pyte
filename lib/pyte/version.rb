module Pyte
  module Version
    MAJOR  = 0
    MINOR  = 1
    TINY   = 1
    STRING = [MAJOR, MINOR, TINY].join(".")
    
    def Version.to_s
      STRING
    end
  end
end