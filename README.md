# GMappedLocatedPost WP Plugin

This is a WordPress plugin which allows you to localize your posts. 

* Contributors: [Paul Tournemaine](https://github.com/ptournem)
* Tags: google map, wordpress
* Requires at least: 4.5
* Tested up to: 4.6.1
* Stable tag: 1.1.0
* License: GPLv2 or later
* License URI: http://www.gnu.org/licenses/gpl-2.0.html

## Installation 

After activating the plugin, go to the settings page and fill your Google Map Api Key. 

## Usage 

Add a location on the map for the post you want to be shown by clicking on the google map on the post edit page

Add the shortcode [googleMappedPosts] on the page in which you want to display your located posts.

Here is a list of parameters for the shortcode:

* height : give the size in pixel (default 500)
* nb_post : number of posts shown (default -1 to show all posts)
* category : the category name from which you want posts to be displayed (default empty for all category)
* desc : show post in a desc order ( older to newer ), set it to *false* to change the order (default *true*)
* zoom : the google map initial zoom when the page containing the shortcode is loaded (default 10)

All parameters are optional

## New functionalities 

If you need other functionalities, feel free to ask. I'll try to add them as quick as possible

## Changelog


1.1.0 : you are now able to change the initial google map zoom

## Licence

* License: GPLv2 or later
* License URI: http://www.gnu.org/licenses/gpl-2.0.html

