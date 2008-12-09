require "pyte/source"
module Pyte
  class Compressor

    YUI_COMPRESSOR = "#{File.dirname(__FILE__)}/../yui/yuicompressor.jar"

    attr_reader :files

    def initialize files
      @files = files
      puts "Pyte: Collecting JavaScript dependencies ..."
      puts files.to_yaml
    end
    
    def compress_to_file location, content
      
      temp = location.gsub(/\.js\Z/, ".uncompressed.js")
      
      file = File.open(temp, "w")
      file.puts content
      file.close
      puts "\nPyte: #{files.size.to_s} files merged to #{temp}"
      
      puts "Pyte: Compress files using YUI Compressor..."
      status = system("java -jar #{YUI_COMPRESSOR} #{temp} --type js --line-break 500 -o #{location}");
      puts  "Pyte: YUI compiled to " + location
      gzip location
    end

    def gzip location
      system("gzip --best --force -c #{location} > #{location}.gz");
      puts "Pyte: GZipped to " + location + ".gz"
    end
    
    def include_list
      javascript_tag("var pyte_preloaded = [#{klasses.join(', ')}];")
    end

    def merge
      if @merge
        @merge
      else
        sources = files.collect do |location|
          file = (Pyte::Source.from location)
          comment = "/*! #{location} */\n"
          comment + file.strip_includes
        end
        @merge = sources.join("\r\n")
      end
    end
  end
end