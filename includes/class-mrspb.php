<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class MRSPB {

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
		add_action( 'add_meta_boxes', array( __CLASS__, 'add_meta_boxes' ) );
		add_action( 'wp_ajax_mrspb_save', array( __CLASS__, 'ajax_save' ) );
		add_action( 'wp_ajax_mrspb_load', array( __CLASS__, 'ajax_load' ) );
		add_action( 'wp_ajax_mrspb_get_media', array( __CLASS__, 'ajax_get_media' ) );
		add_action( 'admin_post_mrspb_export', array( __CLASS__, 'handle_export' ) );
		add_action( 'admin_post_mrspb_import', array( __CLASS__, 'handle_import' ) );
		add_filter( 'the_content', array( __CLASS__, 'frontend_render' ), 999 );
		add_filter( 'page_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_filter( 'post_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_action( 'admin_bar_menu', array( __CLASS__, 'admin_bar_link' ), 999 );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'frontend_assets' ) );
	}

	public static function activate() {
		// Nothing yet.
	}

	public static function admin_menu() {
		$cap = self::get_capability();
		add_menu_page(
			__( 'Page Builder Pro', 'page-builder-pro' ),
			__( 'Page Builder', 'page-builder-pro' ),
			$cap,
			'page-builder-pro',
			array( __CLASS__, 'render_dashboard' ),
			'dashicons-layout',
			26
		);
		add_submenu_page(
			'page-builder-pro',
			__( 'Dashboard', 'page-builder-pro' ),
			__( 'Dashboard', 'page-builder-pro' ),
			$cap,
			'page-builder-pro',
			array( __CLASS__, 'render_dashboard' )
		);
		add_submenu_page(
			'page-builder-pro',
			__( 'Builder', 'page-builder-pro' ),
			__( 'Builder', 'page-builder-pro' ),
			$cap,
			'page-builder-pro-builder',
			array( __CLASS__, 'render_builder' )
		);
		add_submenu_page(
			'page-builder-pro',
			__( 'Templates', 'page-builder-pro' ),
			__( 'Templates', 'page-builder-pro' ),
			$cap,
			'page-builder-pro-templates',
			array( __CLASS__, 'render_templates' )
		);
		add_submenu_page(
			'page-builder-pro',
			__( 'Settings', 'page-builder-pro' ),
			__( 'Settings', 'page-builder-pro' ),
			'manage_options',
			'page-builder-pro-settings',
			array( __CLASS__, 'render_settings' )
		);
	}

	public static function get_capability() {
		$allowed = get_option( 'mrspb_allowed_roles', array( 'administrator', 'editor' ) );
		if ( ! is_array( $allowed ) ) {
			$allowed = array( 'administrator', 'editor' );
		}
		$user  = wp_get_current_user();
		$match = ! empty( $user->roles ) ? array_intersect( $user->roles, $allowed ) : array();
		return ! empty( $match ) ? 'edit_pages' : 'manage_options';
	}

	public static function enqueue_assets( $hook ) {
		if ( false === strpos( $hook, 'page-builder-pro' ) ) {
			return;
		}
		wp_enqueue_media();
		wp_enqueue_style( 'grapesjs', MRSPB_URL . 'assets/vendor/grapesjs/grapes.min.css', array(), '0.22.2' );
		wp_enqueue_script( 'grapesjs', MRSPB_URL . 'assets/vendor/grapesjs/grapes.min.js', array(), '0.22.2', true );
		wp_enqueue_style( 'mrspb-admin', MRSPB_URL . 'assets/css/admin.css', array( 'grapesjs' ), MRSPB_VERSION );
		wp_enqueue_script( 'mrspb-admin', MRSPB_URL . 'assets/js/admin.js', array( 'grapesjs' ), MRSPB_VERSION, true );
		wp_localize_script(
			'mrspb-admin',
			'mrspbData',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'mrspb_nonce' ),
				'pluginUrl' => MRSPB_URL,
				'postId'  => isset( $_GET['post'] ) ? intval( $_GET['post'] ) : 0,
			)
		);
	}

	public static function render_dashboard() {
		if ( ! current_user_can( self::get_capability() ) ) {
			wp_die( esc_html__( 'You do not have permission.', 'page-builder-pro' ) );
		}
		?>
		<div class="wrap mrspb-wrap">
			<h1><?php esc_html_e( 'Page Builder Pro', 'page-builder-pro' ); ?></h1>
			<div class="mrspb-dashboard">
				<div class="mrspb-card">
					<h2><?php esc_html_e( 'Create a Page', 'page-builder-pro' ); ?></h2>
					<p><?php esc_html_e( 'Build stunning pages with the advanced visual editor.', 'page-builder-pro' ); ?></p>
					<a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=page' ) ); ?>" class="button button-primary"><?php esc_html_e( 'Add New Page', 'page-builder-pro' ); ?></a>
				</div>
				<div class="mrspb-card">
					<h2><?php esc_html_e( 'Templates', 'page-builder-pro' ); ?></h2>
					<p><?php esc_html_e( 'Export or import full page layouts as JSON.', 'page-builder-pro' ); ?></p>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=page-builder-pro-templates' ) ); ?>" class="button button-secondary"><?php esc_html_e( 'Manage Templates', 'page-builder-pro' ); ?></a>
				</div>
				<div class="mrspb-card">
					<h2><?php esc_html_e( 'All Pages', 'page-builder-pro' ); ?></h2>
					<p><?php esc_html_e( 'Edit any existing page with Page Builder Pro.', 'page-builder-pro' ); ?></p>
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>" class="button button-secondary"><?php esc_html_e( 'View Pages', 'page-builder-pro' ); ?></a>
				</div>
			</div>
		</div>
		<?php
	}

	public static function render_settings() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission.', 'page-builder-pro' ) );
		}
		if ( isset( $_POST['mrspb_save_settings'] ) && check_admin_referer( 'mrspb_settings', 'mrspb_settings_nonce' ) ) {
			$roles = isset( $_POST['mrspb_allowed_roles'] ) ? array_map( 'sanitize_text_field', wp_unslash( (array) $_POST['mrspb_allowed_roles'] ) ) : array();
			update_option( 'mrspb_allowed_roles', $roles );
			$colors = array(
				'primary'   => isset( $_POST['mrspb_primary_color'] ) ? sanitize_hex_color( wp_unslash( $_POST['mrspb_primary_color'] ) ) : '',
				'secondary' => isset( $_POST['mrspb_secondary_color'] ) ? sanitize_hex_color( wp_unslash( $_POST['mrspb_secondary_color'] ) ) : '',
				'dark'      => isset( $_POST['mrspb_dark_color'] ) ? sanitize_hex_color( wp_unslash( $_POST['mrspb_dark_color'] ) ) : '',
			);
			$fonts = array(
				'body'    => isset( $_POST['mrspb_body_font'] ) ? sanitize_text_field( wp_unslash( $_POST['mrspb_body_font'] ) ) : '',
				'heading' => isset( $_POST['mrspb_heading_font'] ) ? sanitize_text_field( wp_unslash( $_POST['mrspb_heading_font'] ) ) : '',
			);
			update_option( 'mrspb_global_colors', $colors );
			update_option( 'mrspb_global_fonts', $fonts );
			echo '<div class="updated"><p>' . esc_html__( 'Settings saved.', 'page-builder-pro' ) . '</p></div>';
		}
		$selected = get_option( 'mrspb_allowed_roles', array( 'administrator', 'editor' ) );
		if ( ! is_array( $selected ) ) {
			$selected = array( 'administrator', 'editor' );
		}
		$colors = get_option( 'mrspb_global_colors', array( 'primary' => '#2563eb', 'secondary' => '#7c3aed', 'dark' => '#0f172a' ) );
		$fonts  = get_option( 'mrspb_global_fonts', array( 'body' => '', 'heading' => '' ) );
		?>
		<div class="wrap mrspb-wrap">
			<h1><?php esc_html_e( 'Page Builder Pro Settings', 'page-builder-pro' ); ?></h1>
			<form method="post">
				<?php wp_nonce_field( 'mrspb_settings', 'mrspb_settings_nonce' ); ?>
				<table class="form-table">
					<tr>
						<th><?php esc_html_e( 'Allowed Roles', 'page-builder-pro' ); ?></th>
						<td>
							<?php foreach ( wp_roles()->roles as $key => $role ) : ?>
								<label style="display:inline-block;margin-right:15px;">
									<input type="checkbox" name="mrspb_allowed_roles[]" value="<?php echo esc_attr( $key ); ?>" <?php checked( in_array( $key, $selected, true ) ); ?> />
									<?php echo esc_html( $role['name'] ); ?>
								</label>
							<?php endforeach; ?>
						</td>
					</tr>
					<tr>
						<th><?php esc_html_e( 'Primary Color', 'page-builder-pro' ); ?></th>
						<td><input type="color" name="mrspb_primary_color" value="<?php echo esc_attr( $colors['primary'] ?? '#2563eb' ); ?>" /></td>
					</tr>
					<tr>
						<th><?php esc_html_e( 'Secondary Color', 'page-builder-pro' ); ?></th>
						<td><input type="color" name="mrspb_secondary_color" value="<?php echo esc_attr( $colors['secondary'] ?? '#7c3aed' ); ?>" /></td>
					</tr>
					<tr>
						<th><?php esc_html_e( 'Dark Color', 'page-builder-pro' ); ?></th>
						<td><input type="color" name="mrspb_dark_color" value="<?php echo esc_attr( $colors['dark'] ?? '#0f172a' ); ?>" /></td>
					</tr>
					<tr>
						<th><?php esc_html_e( 'Body Font', 'page-builder-pro' ); ?></th>
						<td><input type="text" name="mrspb_body_font" value="<?php echo esc_attr( $fonts['body'] ?? '' ); ?>" placeholder="e.g. Inter, sans-serif" style="width:300px;" /></td>
					</tr>
					<tr>
						<th><?php esc_html_e( 'Heading Font', 'page-builder-pro' ); ?></th>
						<td><input type="text" name="mrspb_heading_font" value="<?php echo esc_attr( $fonts['heading'] ?? '' ); ?>" placeholder="e.g. Poppins, sans-serif" style="width:300px;" /></td>
					</tr>
				</table>
				<?php submit_button( __( 'Save Settings', 'page-builder-pro' ), 'primary', 'mrspb_save_settings' ); ?>
			</form>
		</div>
		<?php
	}

	public static function render_templates() {
		if ( ! current_user_can( self::get_capability() ) ) {
			wp_die( esc_html__( 'You do not have permission.', 'page-builder-pro' ) );
		}
		$posts = get_posts( array( 'post_type' => 'page', 'post_status' => 'any', 'numberposts' => 100 ) );
		?>
		<div class="wrap mrspb-wrap">
			<h1><?php esc_html_e( 'Templates', 'page-builder-pro' ); ?></h1>
			<div class="mrspb-dashboard">
				<div class="mrspb-card">
					<h2><?php esc_html_e( 'Export Layout', 'page-builder-pro' ); ?></h2>
					<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
						<?php wp_nonce_field( 'mrspb_export', 'mrspb_export_nonce' ); ?>
						<input type="hidden" name="action" value="mrspb_export" />
						<p>
							<select name="export_post_id" required>
								<?php foreach ( $posts as $post ) : ?>
									<option value="<?php echo esc_attr( $post->ID ); ?>"><?php echo esc_html( $post->post_title ); ?> (#<?php echo esc_html( $post->ID ); ?>)</option>
								<?php endforeach; ?>
							</select>
						</p>
						<?php submit_button( __( 'Export JSON', 'page-builder-pro' ), 'secondary' ); ?>
					</form>
				</div>
				<div class="mrspb-card">
					<h2><?php esc_html_e( 'Import Layout', 'page-builder-pro' ); ?></h2>
					<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
						<?php wp_nonce_field( 'mrspb_import', 'mrspb_import_nonce' ); ?>
						<input type="hidden" name="action" value="mrspb_import" />
						<p>
							<select name="import_post_id" required>
								<?php foreach ( $posts as $post ) : ?>
									<option value="<?php echo esc_attr( $post->ID ); ?>"><?php echo esc_html( $post->post_title ); ?> (#<?php echo esc_html( $post->ID ); ?>)</option>
								<?php endforeach; ?>
							</select>
						</p>
						<p>
							<textarea name="import_json" rows="10" style="width:100%;font-family:monospace;" placeholder="Paste exported JSON here..."></textarea>
						</p>
						<?php submit_button( __( 'Import JSON', 'page-builder-pro' ), 'primary' ); ?>
					</form>
				</div>
			</div>
		</div>
		<?php
	}

	public static function handle_export() {
		if ( ! isset( $_POST['mrspb_export_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['mrspb_export_nonce'] ) ), 'mrspb_export' ) ) {
			wp_die( esc_html__( 'Security check failed.', 'page-builder-pro' ) );
		}
		if ( ! current_user_can( self::get_capability() ) ) {
			wp_die( esc_html__( 'Permission denied.', 'page-builder-pro' ) );
		}
		$post_id = isset( $_POST['export_post_id'] ) ? intval( $_POST['export_post_id'] ) : 0;
		if ( ! $post_id ) {
			wp_die( esc_html__( 'Invalid post.', 'page-builder-pro' ) );
		}
		$data = self::get_stored( $post_id );
		$filename = 'mrspb-layout-' . $post_id . '-' . gmdate( 'Y-m-d' ) . '.json';
		header( 'Content-Type: application/json' );
		header( 'Content-Disposition: attachment; filename=' . $filename );
		echo wp_json_encode( $data );
		exit;
	}

	public static function handle_import() {
		if ( ! isset( $_POST['mrspb_import_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['mrspb_import_nonce'] ) ), 'mrspb_import' ) ) {
			wp_die( esc_html__( 'Security check failed.', 'page-builder-pro' ) );
		}
		if ( ! current_user_can( self::get_capability() ) ) {
			wp_die( esc_html__( 'Permission denied.', 'page-builder-pro' ) );
		}
		$post_id = isset( $_POST['import_post_id'] ) ? intval( $_POST['import_post_id'] ) : 0;
		$json    = isset( $_POST['import_json'] ) ? wp_unslash( $_POST['import_json'] ) : '';
		$data    = json_decode( $json, true );
		if ( ! $post_id || ! is_array( $data ) ) {
			wp_die( esc_html__( 'Invalid data.', 'page-builder-pro' ) );
		}
		update_post_meta( $post_id, '_mrspb_html', wp_kses_post( $data['html'] ?? '' ) );
		update_post_meta( $post_id, '_mrspb_css', sanitize_textarea_field( $data['css'] ?? '' ) );
		wp_safe_redirect( admin_url( 'admin.php?page=page-builder-pro-templates&notice=imported' ) );
		exit;
	}

	public static function render_builder() {
		if ( ! current_user_can( self::get_capability() ) ) {
			wp_die( esc_html__( 'You do not have permission.', 'page-builder-pro' ) );
		}
		$post_id = isset( $_GET['post'] ) ? intval( $_GET['post'] ) : 0;
		if ( ! $post_id ) {
			wp_die( esc_html__( 'Select a page to edit.', 'page-builder-pro' ) );
		}
		$post = get_post( $post_id );
		if ( ! $post ) {
			wp_die( esc_html__( 'Page not found.', 'page-builder-pro' ) );
		}
		$stored = self::get_stored( $post_id );
		?>
		<div id="mrspb-builder" data-post-id="<?php echo esc_attr( $post_id ); ?>">
			<div class="mrspb-topbar">
				<div class="mrspb-topbar-left">
					<span class="mrspb-logo"><?php esc_html_e( 'Page Builder Pro', 'page-builder-pro' ); ?></span>
					<span class="mrspb-page-title"><?php echo esc_html( get_the_title( $post_id ) ); ?></span>
				</div>
				<div class="mrspb-topbar-right">
					<a href="<?php echo esc_url( get_permalink( $post_id ) ); ?>" target="_blank" class="mrspb-btn mrspb-preview"><?php esc_html_e( 'Preview', 'page-builder-pro' ); ?></a>
					<button type="button" class="mrspb-btn mrspb-save mrspb-primary"><?php esc_html_e( 'Save', 'page-builder-pro' ); ?></button>
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=' . $post->post_type ) ); ?>" class="mrspb-btn mrspb-close"><?php esc_html_e( 'Close', 'page-builder-pro' ); ?></a>
				</div>
			</div>
			<div id="gjs"></div>
		</div>
		<script id="mrspb-initial" type="application/json"><?php echo wp_json_encode( $stored ); ?></script>
		<?php
	}

	public static function add_meta_boxes() {
		$cap = self::get_capability();
		if ( ! current_user_can( $cap ) ) {
			return;
		}
		$post_types = get_post_types( array( 'public' => true ) );
		foreach ( $post_types as $post_type ) {
			add_meta_box(
				'mrspb_layout_meta',
				__( 'Page Builder Pro', 'page-builder-pro' ),
				array( __CLASS__, 'render_meta_box' ),
				$post_type,
				'side',
				'high'
			);
		}
	}

	public static function render_meta_box( $post ) {
		?>
		<p>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=page-builder-pro-builder&post=' . intval( $post->ID ) ) ); ?>" class="button button-primary button-large" style="width:100%;text-align:center;">
				<?php esc_html_e( 'Edit with Page Builder Pro', 'page-builder-pro' ); ?>
			</a>
		</p>
		<?php
	}

	public static function row_actions( $actions, $post ) {
		$cap = self::get_capability();
		if ( ! current_user_can( $cap ) ) {
			return $actions;
		}
		$actions['mrspb_edit'] = '<a href="' . esc_url( admin_url( 'admin.php?page=page-builder-pro-builder&post=' . $post->ID ) ) . '">' . esc_html__( 'Edit with PBP', 'page-builder-pro' ) . '</a>';
		return $actions;
	}

	public static function admin_bar_link( $wp_admin_bar ) {
		if ( ! is_admin_bar_showing() || ! is_singular() ) {
			return;
		}
		$post_id = get_the_ID();
		if ( ! $post_id ) {
			return;
		}
		$wp_admin_bar->add_node(
			array(
				'id'    => 'mrspb-edit',
				'title' => __( 'Edit with Page Builder Pro', 'page-builder-pro' ),
				'href'  => admin_url( 'admin.php?page=page-builder-pro-builder&post=' . $post_id ),
				'parent' => 'edit',
				'meta'  => array( 'class' => 'mrspb-admin-bar-edit' ),
			)
		);
	}

	public static function get_stored( $post_id ) {
		$html = get_post_meta( $post_id, '_mrspb_html', true );
		$css  = get_post_meta( $post_id, '_mrspb_css', true );
		if ( ! $html ) {
			$post = get_post( $post_id );
			$html = $post ? apply_filters( 'the_content', $post->post_content ) : '';
		}
		return array(
			'html' => $html,
			'css'  => $css,
		);
	}

	public static function ajax_save() {
		check_ajax_referer( 'mrspb_nonce', 'nonce' );
		if ( ! isset( $_POST['post_id'] ) || ! isset( $_POST['html'] ) || ! isset( $_POST['css'] ) ) {
			wp_send_json_error( 'Missing data' );
		}
		$post_id = intval( $_POST['post_id'] );
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			wp_send_json_error( 'Permission denied' );
		}
		$html = wp_kses_post( wp_unslash( $_POST['html'] ) );
		$css  = sanitize_textarea_field( wp_unslash( $_POST['css'] ) );
		update_post_meta( $post_id, '_mrspb_html', $html );
		update_post_meta( $post_id, '_mrspb_css', $css );
		wp_send_json_success( array( 'message' => __( 'Saved', 'page-builder-pro' ) ) );
	}

	public static function ajax_load() {
		check_ajax_referer( 'mrspb_nonce', 'nonce' );
		if ( ! isset( $_GET['post_id'] ) ) {
			wp_send_json_error( 'Missing post_id' );
		}
		$post_id = intval( $_GET['post_id'] );
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			wp_send_json_error( 'Permission denied' );
		}
		wp_send_json_success( self::get_stored( $post_id ) );
	}

	public static function ajax_get_media() {
		check_ajax_referer( 'mrspb_nonce', 'nonce' );
		if ( ! current_user_can( 'upload_files' ) ) {
			wp_send_json_error( 'Permission denied' );
		}
		$attachment_id = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : 0;
		if ( ! $attachment_id ) {
			wp_send_json_error( 'Invalid ID' );
		}
		$src = wp_get_attachment_image_url( $attachment_id, 'full' );
		if ( ! $src ) {
			wp_send_json_error( 'Image not found' );
		}
		wp_send_json_success( array( 'url' => $src, 'alt' => get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ) ) );
	}

	public static function frontend_render( $content ) {
		if ( is_admin() || ! in_the_loop() || ! is_main_query() ) {
			return $content;
		}
		$post_id = get_the_ID();
		if ( ! $post_id ) {
			return $content;
		}
		$html = get_post_meta( $post_id, '_mrspb_html', true );
		if ( ! $html ) {
			return $content;
		}
		$css  = get_post_meta( $post_id, '_mrspb_css', true );
		$out  = self::get_global_styles();
		if ( $css ) {
			$out .= '<style>' . wp_strip_all_tags( $css ) . '</style>';
		}
		$out .= '<div class="mrspb-content">' . $html . '</div>';

		if ( strpos( $html, 'data-aos' ) !== false ) {
			$out .= '<script>document.addEventListener("DOMContentLoaded",function(){if(typeof AOS!=="undefined"){AOS.init({once:true,duration:800});}});</script>';
		}
		if ( strpos( $html, 'swiper' ) !== false || strpos( $html, 'swiper-wrapper' ) !== false ) {
			$out .= '<script>document.addEventListener("DOMContentLoaded",function(){if(typeof Swiper!=="undefined"){document.querySelectorAll(".mrspb-swiper").forEach(function(el){new Swiper(el,{loop:true,pagination:{el:".swiper-pagination",clickable:true},navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}});});}});</script>';
		}
		return $out;
	}

	public static function get_global_styles() {
		$colors = get_option( 'mrspb_global_colors', array( 'primary' => '#2563eb', 'secondary' => '#7c3aed', 'dark' => '#0f172a' ) );
		$fonts  = get_option( 'mrspb_global_fonts', array( 'body' => '', 'heading' => '' ) );
		$css = ':root{';
		$css .= '--mrspb-primary:' . esc_attr( $colors['primary'] ?? '#2563eb' ) . ';';
		$css .= '--mrspb-secondary:' . esc_attr( $colors['secondary'] ?? '#7c3aed' ) . ';';
		$css .= '--mrspb-dark:' . esc_attr( $colors['dark'] ?? '#0f172a' ) . ';';
		$css .= '}';
		$extra = '';
		$body_font = ! empty( $fonts['body'] ) ? sanitize_text_field( $fonts['body'] ) : '';
		$heading_font = ! empty( $fonts['heading'] ) ? sanitize_text_field( $fonts['heading'] ) : '';
		if ( $body_font ) {
			$extra .= '.mrspb-content{font-family:' . $body_font . ';}';
		}
		if ( $heading_font ) {
			$extra .= '.mrspb-content h1,.mrspb-content h2,.mrspb-content h3,.mrspb-content h4,.mrspb-content h5,.mrspb-content h6{font-family:' . $heading_font . ';}';
		}
		return '<style>' . $css . $extra . '</style>';
	}

	public static function frontend_assets() {
		$post_id = get_the_ID();
		if ( ! $post_id ) {
			return;
		}
		$html = get_post_meta( $post_id, '_mrspb_html', true );
		if ( ! $html ) {
			return;
		}
		if ( strpos( $html, 'data-aos' ) !== false ) {
			wp_enqueue_style( 'aos', MRSPB_URL . 'assets/vendor/aos/aos.css', array(), '2.3.4' );
			wp_enqueue_script( 'aos', MRSPB_URL . 'assets/vendor/aos/aos.js', array(), '2.3.4', true );
		}
		if ( strpos( $html, 'swiper' ) !== false || strpos( $html, 'swiper-wrapper' ) !== false ) {
			wp_enqueue_style( 'swiper', MRSPB_URL . 'assets/vendor/swiper/swiper-bundle.min.css', array(), '11.1.14' );
			wp_enqueue_script( 'swiper', MRSPB_URL . 'assets/vendor/swiper/swiper-bundle.min.js', array(), '11.1.14', true );
		}
	}
}
