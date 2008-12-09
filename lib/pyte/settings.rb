module Pyte
  class Settings
    cattr_accessor :application_path
    def Settings.namespace
      path = Settings::application_path
      if (path.rindex ".") != path.length-1
        path = path.slice(0, path.length-1)
      end
      path.gsub("/", ".")
    end
  end
end