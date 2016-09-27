<?php

class googleMappedPostShortCode {

    /**
     * Allow to know if the script should be printed
     * @var boolean 
     */
    static $add_script = false;

    /**
     * Store the api key
     * @var string 
     */
    private $api_key = null;

    public function __construct() {
	// register shortcode
	add_action('init', array($this, 'register_shortcodes'));

	// get api key value
	$this->api_key = get_option('api_key');

	// add script registration and print if the api_key is OK
	if ($this->isApiKeyOK()) {
	    add_action('init', array($this, 'register_script'));
	    add_action('wp_footer', array($this, 'print_script'));
	}
    }

    /**
     * Register the shortcode
     */
    function register_shortcodes() {
	add_shortcode('googleMappedPosts', array($this, 'display'));
    }

    /**
     * Display the shortcode
     * @param type $atts
     * @param type $content
     * @return string
     */
    function display($atts, $content = null) {

	// default value
	$a = shortcode_atts(array(
	    'height' => 500,
	    'nb_post' => -1, //all post 
	    'desc' => 'true', // sort order desc
	    'category' => '', // posts from all category
	    'zoom' => 10, // google map zoom
		), $atts);
	// tell the script are to be printed
	self::$add_script = true;

	// add the DOM element
	$return_string = '<div id="google-mapped-shortcode" attr-zoom="'.$a['zoom'].'" style="' . ($this->isApiKeyOK() ? "height: $a[height]px;" : '') . '" ' .
		($this->isApiKeyOK() ? '<p><strong>Bad Google Map Api Key provided, see GoogleMappedPosts settings !</strong></p>' : '<p>No posts found !</p>')
		. '</div>';

	// post to display on map
	$localizedPost = array();

	// get the post list
	$post_list = get_posts(array(
	    'numberposts' => $a['nb'], // filter on number of posts
	    'orderby' => 'date',
	    'order' => ($a['desc'] == 'true') ? 'DESC' : 'ASC', // filter on sort order
	    'category_name' =>$a['category'], // filter on category name
	));

	// get data for each post
	foreach ($post_list as $post) {
	    $p = array();
	    $p['title'] = $post->post_title;
	    $p['date'] = $post->post_date;
	    $p['content'] = wp_trim_words($post->post_content, 25, " ...");
	    $p['link'] = get_post_permalink($post->ID);
	    $p['thumbnail'] = wp_get_attachment_url(get_post_thumbnail_id($post->ID));
	    $p['location'] = esc_attr(get_post_meta($post->ID, googleMappedPostMetaBoxes::META_LOCATION_KEY, true));

	    // add the post to the localiwed post array if the location is OK
	    if (preg_match('/-?[0-9\.]+;-?[0-9\.]+/', $p['location'])) {
		$localizedPost[] = $p;
	    }
	}

	// add the variable for js
	$return_string .= "<script> var GoogleMappedPosts = " . json_encode($localizedPost) . "</script>";

	// return the string
	return $return_string;
    }

    /**
     * Register script to be displayed
     */
    function register_script() {
	wp_register_script('googleMappedPostsScript-shortcode', plugin_dir_url(__DIR__) . 'js/shortcode.js', array(), '1.0', true);
	wp_register_script('googleMappedPostsScript-googleMap', "https://maps.googleapis.com/maps/api/js?key=" . $this->api_key . "&signed_in=true&callback=initMap", array(), '1.0', true);
    }

    /**
     * print script if necessary
     * @return type
     */
    function print_script() {
	if (!self::$add_script) {
	    return;
	}

	wp_print_scripts(array('googleMappedPostsScript-shortcode', 'googleMappedPostsScript-googleMap'));
    }

    /**
     * Check if the api key is OK
     * @return bool
     */
    private function isApiKeyOK() {
	return $this->api_key != null && $this->api_key != "";
    }

}
