<?php

/*
  Plugin Name: GoogleMappedPostWPPlugin
  Description: Allow to localize your posts and show a linked map with them
  Version: 0.1
  Author: Paul Tournemaine
  Author URI: http://www.paultournemaine.fr
  License: GPL2
  License URI:        https://www.gnu.org/licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) {
    die('You can not access this file.');
    exit;
}

class googleMappedPostWPPlugin {

    public function __construct() {
	include_once plugin_dir_path(__FILE__) . '/class/googleMappedPostMetaBoxes.class.php';
	new googleMappedPostMetaBoxes();
	include_once plugin_dir_path(__FILE__) . '/class/googleMappedPostSettings.class.php';
	new googleMappedPostSettings();
    }

}

new googleMappedPostWPPlugin();
