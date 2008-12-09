# desc "Explaining what the task does"
# task :pyte do
#   # Task goes here
# end

namespace :pyte do
  JS_PATH = "public/javascripts/"
  OUTPUT_FILE = JS_PATH + "production.js"

  desc "Collects all JavaScript classes and compress to single."
  task :compress => :environment do

    # puts Pyte::Settings.application_path
    # 
    # apps = Pyte::Folder.new Pyte::Settings.application_path
    # puts "Pyte: Applications: #{apps.files.join(', ')}"
    # collector = Pyte::Collector.new apps.files
    # puts "\nPyte: Flattened dependency:\n#{collector.flatten.to_yaml}"
    # compressor = Pyte::Compressor.new collector.flatten
    # compressor.compress_to_file OUTPUT_FILE
  end
end