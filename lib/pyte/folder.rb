module Pyte
  class Folder
    attr_reader :folder
    
    def initialize(folder)
      folder += "/" if (folder.rindex "/") != folder.length-1 
      @folder = folder
    end
    
    def files
      @files ||= Dir.new(JAVASCRIPTS_DIR + folder).
        entries.
        delete_if { |x| ! (x =~ /js$/) }.
        collect { |file| folder + file }
    end
    
    def to_s 
      folder + " [" + files.join(", ") + "]"
    end
  end
end