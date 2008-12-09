require "pyte/settings"
require "pyte/compressor"
require "pyte/version"
require "pyte/source"
require "pyte/folder"
require "pyte/collector"
require "ruby/asset_tag_helper.rb"

module Pyte
  JAVASCRIPTS_DIR = "public/javascripts/"

  ActionView::Helpers::AssetTagHelper.register_javascript_expansion :defaults => [
    "lib/prototype", 
    "lib/scriptaculous/effects", 
    "lib/scriptaculous/controls", 
    "lib/scriptaculous/dragdrop"
  ]

  ActionView::Helpers::AssetTagHelper.register_javascript_expansion :pyte => [
    "pyte"  
  ]
end