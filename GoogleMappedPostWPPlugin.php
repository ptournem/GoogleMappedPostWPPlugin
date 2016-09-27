<?php

/*
  Plugin Name: GMappedLocatedPost
  Description: Allow to localize your posts and show a linked map with them
  Version: 1.1.0
  Author: Paul Tournemaine
  Author URI: https://github.com/ptournem
  License: GPL2
  License URI:        https://www.gnu.org/licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) {
    die('You can not access this file.');
    exit;
}

class googleMappedPostWPPlugin {

    public function __construct() {
        // add settings
        include_once plugin_dir_path(__FILE__) . '/class/googleMappedPostSettings.class.php';
        new googleMappedPostSettings();

        // add metaboxes
        include_once plugin_dir_path(__FILE__) . '/class/googleMappedPostMetaBoxes.class.php';
        new googleMappedPostMetaBoxes();

        // add Shortcode
        include_once plugin_dir_path(__FILE__) . '/class/googleMappedPostShortCode.class.php';
        new googleMappedPostShortCode();
    }

}

new googleMappedPostWPPlugin();
