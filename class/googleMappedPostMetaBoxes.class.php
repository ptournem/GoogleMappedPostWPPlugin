<?php
if (!defined('ABSPATH')) {
    die('You can not access this file.');
    exit;
}

class googleMappedPostMetaBoxes {

    public function __construct() {
	// Post Meta Box
	add_action('load-post.php', array($this, 'post_meta_boxes_setup'));
	add_action('load-post-new.php', array($this, 'post_meta_boxes_setup'));
	add_action('admin_enqueue_scripts', array($this, 'admin_enqueue'));
    }

    /**
     * Add the google map script for admin panels
     * @global string $typenow
     * @return type
     */
    public function admin_enqueue() {
	global $typenow;
	$api_key = get_option('api_key');
	if ($api_key == null || $api_key == '') {
	    return;
	}
	if ($typenow != 'post') {
	    return;
	}
	//wp_enqueue_style('wp-color-picker');
	wp_enqueue_script('meta-box-google-mapped-post', plugin_dir_url(__DIR__) . 'js/meta-boxes.js', array('jquery'));
	wp_enqueue_script('google_map', "https://maps.googleapis.com/maps/api/js?key=$api_key&signed_in=true&callback=initMap", array('meta-box-google-mapped-post'), false, true);
    }

    /**
     * Setup meta-boxes action 
     */
    public function post_meta_boxes_setup() {
	/* Add meta boxes on the 'add_meta_boxes' hook. */
	add_action('add_meta_boxes', array($this, 'add_post_meta_boxes'));
	/* Save post meta on the 'save_post' hook. */
	add_action('save_post', array($this, 'save_post_class_meta'), 10, 2);
    }

    /**
     * Save post location metadata
     * @param int $post_id
     * @param obj $post
     * @return type
     */
    public function save_post_class_meta($post_id, $post) {
	/* Verify the nonce before proceeding. */
	if (!isset($_POST['google_mapped_post_class_nonce']) || !wp_verify_nonce($_POST['google_mapped_post_class_nonce'], basename(__FILE__))) {
	    return $post_id;
	}

	/* Get the post type object. */
	$post_type = get_post_type_object($post->post_type);

	/* Check if the current user has permission to edit the post. */
	if (!current_user_can($post_type->cap->edit_post, $post_id)) {
	    return $post_id;
	}

	/* Get the posted data and sanitize it for use as an HTML class. */
	$new_meta_value = ( isset($_POST['google-mapped-post-coord']) ? $_POST['google-mapped-post-coord'] : '' );

	/* Get the meta key. */
	$meta_key = 'google-mapped-post-coord';

	/* Get the meta value of the custom field key. */
	$meta_value = get_post_meta($post_id, $meta_key, true);

	/* If a new meta value was added and there was no previous value, add it. */
	if ($new_meta_value && '' == $meta_value) {
	    add_post_meta($post_id, $meta_key, $new_meta_value, true);
	}

	/* If the new meta value does not match the old value, update it. */ elseif ($new_meta_value && $new_meta_value != $meta_value) {
	    update_post_meta($post_id, $meta_key, $new_meta_value);
	}

	/* If there is no new meta value but an old value exists, delete it. */ elseif ('' == $new_meta_value && $meta_value) {
	    delete_post_meta($post_id, $meta_key, $meta_value);
	}
    }

    /**
     * Add the post location meta boxe
     */
    public function add_post_meta_boxes() {
	add_meta_box(
		'google-mapped-post-class', // Unique ID
		esc_html__('Localize the post', 'Localize the post'), // Title
		array($this, 'show_post_meta_boxes'), // Callback function
		'post', // Admin page (or post type)
		'normal', // Context
		'default'  // Priority
	);
    }

    /**
     * Display the post location meta boxes
     * @param type $object
     * @param type $box
     */
    public function show_post_meta_boxes($object, $box) {
	wp_nonce_field(basename(__FILE__), 'google_mapped_post_class_nonce');
	?>

	<p>
	    <label for="google-mapped-post-coord">Select the post location on the Google Map.</label>
	    <br />
	    <input class="widefat" type="hidden" name="google-mapped-post-coord" id="google-mapped-post-coord" value="<?php echo esc_attr(get_post_meta($object->ID, 'google-mapped-post-coord', true)); ?>" size="30" />
	<div id="map" style="height: 400px;"></div>
	</p>
	<?php
    }

}
