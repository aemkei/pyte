module Pyte
  class Source

    @@cache = {}

    RE_BLOCK = /(Class[\s]*\.include[\s]*\([^\)]*\));?/
    RE_COMMENTS = /(\/\/((?!\n).)*)|(\/\*((?!\*\/).|\n)*\*\/)/
    RE_CLASSES = /[\"|\']([a-zA-Z\.0-9]*)[\"|\']/

    attr_reader :location

    def Source.from location
      if (@@cache.has_key? location)
        @@cache.fetch location
      else
        file = Source.new location
         @@cache.store location, file
      end
    end

    def initialize location
      @location = location
    end

    def class_name
      @class_name ||= location.gsub("/", ".").gsub(/\.js\Z/, "")
    end

    def content
      @content ||= File.open(JAVASCRIPTS_DIR + location, "r").read
    end

    def required_classes
      @required_classes ||= content.
        scan(RE_BLOCK).join("\n").  # reads all Class.include blocks
        gsub(RE_COMMENTS, "").      # removes comments
        scan(RE_CLASSES).           # collects classes
        flatten.
        uniq
    end
    
    def required_files
      @required_files ||= required_classes.collect do |klass| 
        klass.gsub(".", "/") + ".js" 
      end
    end 

    def to_s
      location
    end

    def strip_includes
      @strip_includes ||= content.gsub(RE_BLOCK, "")
    end

  end
end