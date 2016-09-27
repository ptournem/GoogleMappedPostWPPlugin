
=== GMappedLocatedPost ===
Contributors: oeildenuit
Donate link: paypal.me/ptournem/25
Tags: google map, location
Requires at least: 4.5
Tested up to: 4.6.1
Stable tag: 1.1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This is a WordPress plugin which allows you to localize your posts. 

== Description ==
This plugin allows you to :

 - Add a location on the map for the post you want to be shown by clicking on the google map on the post edit page
 - Add the shortcode [googleMappedPosts] on the page in which you want to display your located posts.

Here is a list of parameters for the shortcode:

 - height : give the size in pixel (default 500)
 - nb_post : number of posts shown (default -1 to show all posts)
 - category : the category name from which you want posts to be displayed (default empty for all category)
 - desc : show post in a desc order ( older to newer ), set it to *false* to change the order (default *true*)
 - zoom : the google map initial zoom when the page containing the shortcode is loaded (default 10)

All parameters are optional

== Installation ==

After activating the plugin, go to the settings page and fill your Google Map Api Key. 

see : https://developers.google.com/maps/documentation/javascript/get-api-key

== Screenshots ==

1. This is the basic usage of the plugin to display a map of located posts
2. This is the result (you only see one post here, but there are some more 
that you can access by clicking on buttons)

== Changelog ==

1.1 : you are now able to change the initial google map zoom
