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

class googleMappedPostWPPlugin{
    public function __construct(){
        // Ajout du parametrage du plugin
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    /**
    * Enregistrement des settings, des sections et des champs
    */
    public function register_settings()
    {
        register_setting('google_mapped_posts_settings', 'api_key');
        add_settings_section('google_mapped_posts_api_section', 'Paramètres d\'API', array($this, 'api_section'), 'google_mapped_posts_settings');
        add_settings_field('google_mapped_posts_api_key', 'Google Map Api Key', array($this, 'api_key_html'), 'google_mapped_posts_settings', 'google_mapped_posts_api_section');
    }

    /**
    * Display du champ Api Key
    */
    public function api_key_html()
    {?>
        <input type="text" id="api_key" name="api_key" value="<?php echo get_option('api_key')?>"/>
    <?php
    }

    /**
    * Ajout du menu dans l'administration
    */
    public function add_admin_menu()
    {
        add_menu_page('Google Mapped Post Plugin', 'GoogleMapped Post', 'manage_options', 'GoogleMappedPostWPPlugin', array($this, 'menu_page_html'));
    }

    /**
    * Title de la section API
    */
    public function api_section(){
      echo "<i>Renseigner les parametre de google Map.</i>";
    }

    /**
    * Display de la page admin
    */
    public function menu_page_html()
    {
        echo '<h1>'.get_admin_page_title().'</h1>';
        echo '<p>Google Mapped Post Plugin Settings</p>';
        ?>
        <form method="post" action="options.php">
          <?php settings_fields('google_mapped_posts_settings') ?>
          <?php do_settings_sections('google_mapped_posts_settings') ?>
          <?php submit_button(); ?>
        </form>
        <?php
    }
}

new googleMappedPostWPPlugin();
