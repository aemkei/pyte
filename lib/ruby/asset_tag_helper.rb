module ActionView
  module Helpers
    module AssetTagHelper

      def javascript_include_tag(*sources)
        options = sources.extract_options!.stringify_keys
        cache   = options.delete("cache")
        # puts "JS sources: #{sources.to_s}"

        tags = ""

        if ActionController::Base.perform_caching && cache
          joined_javascript_name = (cache == true ? "all" : cache) + ".js"
          joined_javascript_path = File.join(JAVASCRIPTS_DIR, joined_javascript_name)

          unless file_exist?(joined_javascript_path)
            
            FileUtils.mkdir_p(File.dirname(joined_javascript_path))
            
            header = "/*! Pyte - JavaScript Deployment */\n"
            
            if sources.include? :pyte
              apps = Pyte::Folder.new Pyte::Settings.application_path
              collector = Pyte::Collector.new apps.files
              klasses = collector.flatten.collect do |file|
                klass = file.gsub(/\.js\Z/, "").gsub("/", ".")
                "'#{klass}'"
              end
              
              header << "var pyte_preloaded = [#{klasses.join(', ')}];"
              sources.concat(collector.flatten)
            end
            
            files = compute_javascript_paths(sources).collect { |file| file.split("?").first.gsub("/javascripts/", "")}
            compressor = Pyte::Compressor.new files.uniq
            content = "#{header} \n #{compressor.merge}"
            compressor.compress_to_file(joined_javascript_path, content)
          end

          tags << javascript_src_tag(joined_javascript_name, options)
        else
          tags << expand_javascript_sources(sources).collect { |source| javascript_src_tag(source, options) }.join("\n")
        end
        if sources.include? :pyte
          app_tag = javascript_tag "new Application('#{Pyte::Settings.namespace}.#{@js_class || 'Abstract'}');"
          tags << app_tag
        end
        tags
      end

      def expand_javascript_sources(sources)
        sources.collect do |source|
          determine_source(source, @@javascript_expansions)
        end.flatten
      end
    end
  end
end