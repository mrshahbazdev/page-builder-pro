<?php
/**
 * Plugin Name: Page Builder Pro
 * Description: Advanced drag-and-drop page builder for WordPress with live preview, templates, responsive controls and role-based access.
 * Version: 1.4.0
 * Author: mrshahbazdev
 * Author URI: https://github.com/mrshahbazdev
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: page-builder-pro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MRSPB_VERSION', '1.4.0' );
define( 'MRSPB_FILE', __FILE__ );
define( 'MRSPB_DIR', plugin_dir_path( __FILE__ ) );
define( 'MRSPB_URL', plugin_dir_url( __FILE__ ) );

require_once MRSPB_DIR . 'includes/class-mrspb.php';

add_action( 'plugins_loaded', array( 'MRSPB', 'init' ) );
register_activation_hook( MRSPB_FILE, array( 'MRSPB', 'activate' ) );
