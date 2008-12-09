require "pyte/source"
module Pyte
  class Collector
    
    attr_reader :files, :tree
    
    def initialize(files)
      @files = files
      @file_cache = {}   
      @tree = create_tree_from_file files, []
    end
        
    def create_tree_from_file(files, tree, depth=0)
      if files.length > 0
        files.each do |location|
          #debug_print location, depth
          tree.unshift subtree = [] 
          requires = (Pyte::Source.from location).required_files
          create_tree_from_file requires, subtree, depth+1
          subtree.push location
        end
      end
      tree
    end
    
    def debug_print location, depth
      indent = "  " * depth
      puts "" if depth == 0
      puts indent + "- " + location
    end
    
    def flatten
      @flatten ||= tree.flatten.compact.uniq
    end
  end
end