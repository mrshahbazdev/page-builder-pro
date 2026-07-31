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
		add_action( 'wp_ajax_mrspb_get_template', array( __CLASS__, 'ajax_get_template' ) );
		add_action( 'admin_post_mrspb_export', array( __CLASS__, 'handle_export' ) );
		add_action( 'admin_post_mrspb_import', array( __CLASS__, 'handle_import' ) );
		add_filter( 'the_content', array( __CLASS__, 'frontend_render' ), 999 );
		add_filter( 'page_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_filter( 'post_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_action( 'admin_bar_menu', array( __CLASS__, 'admin_bar_link' ), 999 );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'frontend_assets' ) );
		add_action( 'wp_ajax_mrspb_template_list', array( __CLASS__, 'ajax_template_list' ) );
		add_action( 'wp_ajax_mrspb_submit_form', array( __CLASS__, 'ajax_submit_form' ) );
		add_action( 'wp_ajax_nopriv_mrspb_submit_form', array( __CLASS__, 'ajax_submit_form' ) );
		add_action( 'init', array( __CLASS__, 'register_post_types' ) );
		add_action( 'wp_ajax_mrspb_save_section', array( __CLASS__, 'ajax_save_section' ) );
		add_action( 'wp_ajax_mrspb_get_sections', array( __CLASS__, 'ajax_get_sections' ) );
		add_action( 'wp_ajax_mrspb_delete_section', array( __CLASS__, 'ajax_delete_section' ) );
		add_action( 'wp_ajax_mrspb_save_page_settings', array( __CLASS__, 'ajax_save_page_settings' ) );
		add_action( 'wp_ajax_mrspb_load_page_settings', array( __CLASS__, 'ajax_load_page_settings' ) );
		add_shortcode( 'mrspb_posts', array( __CLASS__, 'shortcode_posts' ) );
		add_filter( 'body_class', array( __CLASS__, 'body_class' ) );
		add_filter( 'document_title_parts', array( __CLASS__, 'document_title_parts' ) );
	}

	public static function activate() {
		self::register_post_types();
		flush_rewrite_rules();
	}

	public static function register_post_types() {
		register_post_type(
			'mrspb_section',
			array(
				'labels'       => array(
					'name'          => __( 'Global Sections', 'page-builder-pro' ),
					'singular_name' => __( 'Global Section', 'page-builder-pro' ),
				),
				'public'       => false,
				'show_ui'      => false,
				'show_in_menu' => false,
				'supports'     => array( 'title' ),
				'rewrite'      => false,
			)
		);
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
		wp_enqueue_script( 'lottie', MRSPB_URL . 'assets/vendor/lottie/lottie.min.js', array(), '5.12.2', true );
		wp_enqueue_style( 'mrspb-admin', MRSPB_URL . 'assets/css/admin.css', array( 'grapesjs' ), MRSPB_VERSION );
		wp_enqueue_script( 'mrspb-admin', MRSPB_URL . 'assets/js/admin.js', array( 'grapesjs', 'lottie' ), MRSPB_VERSION, true );

		$templates = self::get_templates_list();
		$post_id = filter_input( INPUT_GET, 'post', FILTER_VALIDATE_INT );
		$post_id = $post_id ? $post_id : 0;
		$page_settings = $post_id ? self::get_page_settings( $post_id ) : array();
		wp_localize_script(
			'mrspb-admin',
			'mrspbData',
			array(
				'ajaxUrl'       => admin_url( 'admin-ajax.php' ),
				'nonce'         => wp_create_nonce( 'mrspb_nonce' ),
				'pluginUrl'     => MRSPB_URL,
				'postId'        => $post_id,
				'templates'     => $templates,
				'pageSettings'  => $page_settings,
			)
		);
	}

	public static function get_templates_list() {
		$dir   = MRSPB_DIR . 'assets/templates/';
		$files = array();
		WP_Filesystem();
		global $wp_filesystem;
		if ( ! $wp_filesystem->is_dir( $dir ) ) {
			return $files;
		}
		$iterator = new DirectoryIterator( $dir );
		foreach ( $iterator as $file ) {
			if ( $file->isFile() && $file->getExtension() === 'json' ) {
				$slug = sanitize_file_name( $file->getBasename( '.json' ) );
				$contents = $wp_filesystem->get_contents( $file->getPathname() );
				$json = $contents ? json_decode( $contents, true ) : array();
				$name = ! empty( $json['name'] ) ? $json['name'] : $slug;
				$files[] = array(
					'slug' => $slug,
					'name' => $name,
					'url'  => MRSPB_URL . 'assets/templates/' . $file->getBasename(),
				);
			}
		}
		return $files;
	}

	public static function ajax_get_template() {
		check_ajax_referer( 'mrspb_nonce', 'nonce' );
		if ( ! current_user_can( self::get_capability() ) ) {
			wp_send_json_error( 'Permission denied' );
		}
		$slug = isset( $_GET['slug'] ) ? sanitize_file_name( wp_unslash( $_GET['slug'] ) ) : '';
		if ( ! $slug ) {
			wp_send_json_error( 'Missing slug' );
		}
		$path = MRSPB_DIR . 'assets/templates/' . $slug . '.json';
		WP_Filesystem();
		global $wp_filesystem;
		if ( ! $wp_filesystem->is_file( $path ) ) {
			wp_send_json_error( 'Template not found' );
		}
		$contents = $wp_filesystem->get_contents( $path );
		$json = $contents ? json_decode( $contents, true ) : array();
		if ( ! is_array( $json ) || ! isset( $json['html'] ) ) {
			wp_send_json_error( 'Invalid template' );
		}
		wp_send_json_success( $json );
	}

	public static function ajax_template_list() {
		check_ajax_referer( 'mrspb_nonce', 'nonce' );
		if ( ! current_user_can( self::get_capability() ) ) {
			wp_send_json_error( 'Permission denied' );
		}
		wp_send_json_success( self::get_templates_list() );
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
					<h2><?php esc_html_e( 'Pre-Made Templates', 'page-builder-pro' ); ?></h2>
					<p><?php esc_html_e( 'Hero, Pricing, About, Contact and SaaS layouts are available in the builder.', 'page-builder-pro' ); ?></p>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=page-builder-pro-builder&post=2' ) ); ?>" class="button button-secondary"><?php esc_html_e( 'Open Builder', 'page-builder-pro' ); ?></a>
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
		$prebuilt = self::get_templates_list();
		?>
		<div class="wrap mrspb-wrap">
			<h1><?php esc_html_e( 'Templates', 'page-builder-pro' ); ?></h1>
			<div class="mrspb-dashboard">
				<div class="mrspb-card">
					<h2><?php esc_html_e( 'Pre-Made Templates', 'page-builder-pro' ); ?></h2>
					<ul>
						<?php foreach ( $prebuilt as $tpl ) : ?>
							<li><?php echo esc_html( $tpl['name'] ); ?> <code><?php echo esc_html( $tpl['slug'] ); ?></code></li>
						<?php endforeach; ?>
					</ul>
					<p><?php esc_html_e( 'Load these inside the builder from the Templates dropdown.', 'page-builder-pro' ); ?></p>
				</div>
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
		$json    = isset( $_POST['import_json'] ) ? sanitize_textarea_field( wp_unslash( $_POST['import_json'] ) ) : '';
		$data    = json_decode( $json, true );
		if ( ! $post_id || ! is_array( $data ) ) {
			wp_die( esc_html__( 'Invalid data.', 'page-builder-pro' ) );
		}
		update_post_meta( $post_id, '_mrspb_html', self::sanitize_builder_html( $data['html'] ?? '' ) );
		update_post_meta( $post_id, '_mrspb_css', sanitize_textarea_field( $data['css'] ?? '' ) );
		wp_safe_redirect( admin_url( 'admin.php?page=page-builder-pro-templates&notice=imported' ) );
		exit;
	}

	public static function render_builder() {
		if ( ! current_user_can( self::get_capability() ) ) {
			wp_die( esc_html__( 'You do not have permission.', 'page-builder-pro' ) );
		}
		$post_id = filter_input( INPUT_GET, 'post', FILTER_VALIDATE_INT );
		if ( ! $post_id ) {
			wp_die( esc_html__( 'Select a page to edit.', 'page-builder-pro' ) );
		}
		$post = get_post( $post_id );
		if ( ! $post ) {
			wp_die( esc_html__( 'Page not found.', 'page-builder-pro' ) );
		}
		$stored = self::get_stored( $post_id );
		$templates = self::get_templates_list();
		?>
		<div id="mrspb-builder" data-post-id="<?php echo esc_attr( $post_id ); ?>">
			<div class="mrspb-topbar">
				<div class="mrspb-topbar-left">
					<span class="mrspb-logo"><?php esc_html_e( 'Page Builder Pro', 'page-builder-pro' ); ?></span>
					<span class="mrspb-page-title"><?php echo esc_html( get_the_title( $post_id ) ); ?></span>
				</div>
				<div class="mrspb-topbar-center">
					<button type="button" class="mrspb-btn" id="mrspb-undo" title="Undo"><?php esc_html_e( 'Undo', 'page-builder-pro' ); ?></button>
					<button type="button" class="mrspb-btn" id="mrspb-redo" title="Redo"><?php esc_html_e( 'Redo', 'page-builder-pro' ); ?></button>
					<button type="button" class="mrspb-btn" id="mrspb-code" title="Code"><?php esc_html_e( 'Code', 'page-builder-pro' ); ?></button>
					<button type="button" class="mrspb-btn" id="mrspb-fullscreen" title="Fullscreen"><?php esc_html_e( 'Full', 'page-builder-pro' ); ?></button>
					<button type="button" class="mrspb-btn" id="mrspb-sections" title="Global Sections"><?php esc_html_e( 'Sections', 'page-builder-pro' ); ?></button>
					<button type="button" class="mrspb-btn" id="mrspb-page-settings" title="Page Settings"><?php esc_html_e( 'Page Settings', 'page-builder-pro' ); ?></button>
					<button type="button" class="mrspb-btn" id="mrspb-theme-toggle" title="Toggle Dark/Light"><?php esc_html_e( 'Dark', 'page-builder-pro' ); ?></button>
				</div>
				<div class="mrspb-topbar-right">
					<?php if ( ! empty( $templates ) ) : ?>
					<select id="mrspb-template" class="mrspb-btn">
						<option value=""><?php esc_html_e( 'Load Template', 'page-builder-pro' ); ?></option>
						<?php foreach ( $templates as $tpl ) : ?>
							<option value="<?php echo esc_attr( $tpl['slug'] ); ?>"><?php echo esc_html( $tpl['name'] ); ?></option>
						<?php endforeach; ?>
					</select>
					<?php endif; ?>
					<a href="<?php echo esc_url( get_permalink( $post_id ) ); ?>" target="_blank" class="mrspb-btn mrspb-preview"><?php esc_html_e( 'Preview', 'page-builder-pro' ); ?></a>
					<button type="button" class="mrspb-btn mrspb-save mrspb-primary"><?php esc_html_e( 'Save', 'page-builder-pro' ); ?></button>
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=' . $post->post_type ) ); ?>" class="mrspb-btn mrspb-close"><?php esc_html_e( 'Close', 'page-builder-pro' ); ?></a>
				</div>
			</div>
			<div id="gjs"></div>
			<div id="mrspb-modal-overlay" class="mrspb-modal-overlay" style="display:none;">
				<div id="mrspb-modal" class="mrspb-modal-box">
					<div class="mrspb-modal-header">
						<h2 id="mrspb-modal-title"><?php esc_html_e( 'Modal', 'page-builder-pro' ); ?></h2>
						<button type="button" class="mrspb-modal-close" id="mrspb-modal-close">&times;</button>
					</div>
					<div id="mrspb-modal-body" class="mrspb-modal-body"></div>
					<div class="mrspb-modal-footer">
						<button type="button" class="mrspb-btn mrspb-primary" id="mrspb-modal-save"><?php esc_html_e( 'Save', 'page-builder-pro' ); ?></button>
					</div>
				</div>
			</div>
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
		$html = wp_kses( wp_unslash( $_POST['html'] ), self::get_allowed_html() );
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

	public static function ajax_submit_form() {
		check_ajax_referer( 'mrspb_public_nonce', 'nonce' );
		$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;
		$form_id = isset( $_POST['form_id'] ) ? sanitize_text_field( wp_unslash( $_POST['form_id'] ) ) : '';
		$to      = get_option( 'admin_email' );
		$subject = sprintf(
			/* translators: %s: site name */
			__( 'New form submission from %s', 'page-builder-pro' ),
			get_bloginfo( 'name' )
		);
		$lines   = array(
			__( 'Form ID', 'page-builder-pro' ) . ': ' . ( $form_id ? $form_id : 'contact' ),
			__( 'Page', 'page-builder-pro' ) . ': ' . ( $post_id ? get_permalink( $post_id ) : '' ),
		);
		$exclude = array( 'action', 'nonce', 'post_id', 'form_id', '_wp_http_referer' );
		foreach ( $_POST as $key => $value ) {
			if ( in_array( $key, $exclude, true ) ) {
				continue;
			}
			$label = sanitize_text_field( $key );
			if ( 'email' === $key ) {
				$val = sanitize_email( $value );
			} elseif ( 'message' === $key ) {
				$val = sanitize_textarea_field( $value );
			} else {
				$val = is_array( $value ) ? implode( ', ', array_map( 'sanitize_text_field', $value ) ) : sanitize_text_field( $value );
			}
			$lines[] = $label . ': ' . $val;
		}
		$body = implode( "\n", $lines );
		wp_mail( $to, $subject, $body );
		wp_send_json_success( array( 'message' => __( 'Sent', 'page-builder-pro' ) ) );
	}

	public static function get_page_settings( $post_id ) {
		$defaults = array(
			'page_title' => '',
			'body_class' => '',
			'custom_css' => '',
			'custom_js'  => '',
		);
		$meta = get_post_meta( $post_id, '_mrspb_page_settings', true );
		if ( ! is_array( $meta ) ) {
			$meta = array();
		}
		return wp_parse_args( $meta, $defaults );
	}

	public static function ajax_save_page_settings() {
		check_ajax_referer( 'mrspb_nonce', 'nonce' );
		$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;
		if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
			wp_send_json_error( 'Permission denied' );
		}
		$settings = array(
			'page_title' => isset( $_POST['page_title'] ) ? sanitize_text_field( wp_unslash( $_POST['page_title'] ) ) : '',
			'body_class' => isset( $_POST['body_class'] ) ? sanitize_text_field( wp_unslash( $_POST['body_class'] ) ) : '',
			'custom_css' => isset( $_POST['custom_css'] ) ? sanitize_textarea_field( wp_unslash( $_POST['custom_css'] ) ) : '',
			'custom_js'  => isset( $_POST['custom_js'] ) ? sanitize_textarea_field( wp_unslash( $_POST['custom_js'] ) ) : '',
		);
		update_post_meta( $post_id, '_mrspb_page_settings', $settings );
		wp_send_json_success( array( 'message' => __( 'Saved', 'page-builder-pro' ) ) );
	}

	public static function ajax_load_page_settings() {
		check_ajax_referer( 'mrspb_nonce', 'nonce' );
		$post_id = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;
		if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
			wp_send_json_error( 'Permission denied' );
		}
		wp_send_json_success( self::get_page_settings( $post_id ) );
	}

	public static function ajax_save_section() {
		check_ajax_referer( 'mrspb_nonce', 'nonce' );
		if ( ! current_user_can( self::get_capability() ) ) {
			wp_send_json_error( 'Permission denied' );
		}
		$title = isset( $_POST['title'] ) ? sanitize_text_field( wp_unslash( $_POST['title'] ) ) : '';
		$html  = isset( $_POST['html'] ) ? wp_kses( wp_unslash( $_POST['html'] ), self::get_allowed_html() ) : '';
		$css   = isset( $_POST['css'] ) ? sanitize_textarea_field( wp_unslash( $_POST['css'] ) ) : '';
		$section_id = isset( $_POST['section_id'] ) ? intval( $_POST['section_id'] ) : 0;
		if ( ! $title ) {
			wp_send_json_error( 'Title required' );
		}
		$data = array(
			'post_type'   => 'mrspb_section',
			'post_title'  => $title,
			'post_status' => 'publish',
		);
		if ( $section_id ) {
			$data['ID'] = $section_id;
			wp_update_post( $data );
		} else {
			$section_id = wp_insert_post( $data );
		}
		if ( is_wp_error( $section_id ) ) {
			wp_send_json_error( $section_id->get_error_message() );
		}
		update_post_meta( $section_id, '_mrspb_section_html', $html );
		update_post_meta( $section_id, '_mrspb_section_css', $css );
		wp_send_json_success( array( 'id' => $section_id, 'title' => $title ) );
	}

	public static function ajax_get_sections() {
		check_ajax_referer( 'mrspb_nonce', 'nonce' );
		if ( ! current_user_can( self::get_capability() ) ) {
			wp_send_json_error( 'Permission denied' );
		}
		$sections = get_posts(
			array(
				'post_type'      => 'mrspb_section',
				'posts_per_page' => 100,
				'post_status'    => 'publish',
			)
		);
		$out = array();
		foreach ( $sections as $s ) {
			$out[] = array(
				'id'    => $s->ID,
				'title' => $s->post_title,
				'html'  => get_post_meta( $s->ID, '_mrspb_section_html', true ),
				'css'   => get_post_meta( $s->ID, '_mrspb_section_css', true ),
			);
		}
		wp_send_json_success( $out );
	}

	public static function ajax_delete_section() {
		check_ajax_referer( 'mrspb_nonce', 'nonce' );
		$section_id = isset( $_POST['section_id'] ) ? intval( $_POST['section_id'] ) : 0;
		if ( ! $section_id || ! current_user_can( self::get_capability() ) ) {
			wp_send_json_error( 'Permission denied' );
		}
		wp_delete_post( $section_id, true );
		wp_send_json_success();
	}

	public static function shortcode_posts( $atts ) {
		$atts = shortcode_atts(
			array(
				'post_type' => 'post',
				'count'     => 6,
				'columns'   => 3,
			),
			$atts,
			'mrspb_posts'
		);
		$query = new WP_Query(
			array(
				'post_type'      => sanitize_text_field( $atts['post_type'] ),
				'posts_per_page' => intval( $atts['count'] ),
			)
		);
		if ( ! $query->have_posts() ) {
			wp_reset_postdata();
			return '';
		}
		$cols = max( 1, min( 4, intval( $atts['columns'] ) ) );
		$grid = 'repeat(' . $cols . ', 1fr)';
		$out  = '<div class="mrspb-post-grid" style="display:grid;grid-template-columns:' . $grid . ';gap:24px;">';
		while ( $query->have_posts() ) {
			$query->the_post();
			$thumb = get_the_post_thumbnail_url( get_the_ID(), 'medium' );
			$out  .= '<article class="mrspb-post-card" style="background:#fff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.05);overflow:hidden;">';
			if ( $thumb ) {
				$out .= '<img src="' . esc_url( $thumb ) . '" alt="" style="width:100%;height:180px;object-fit:cover;">';
			}
			$out .= '<div style="padding:20px;"><h3 style="margin:0 0 10px;font-size:18px;"><a href="' . esc_url( get_permalink() ) . '" style="text-decoration:none;color:#0f172a;">' . esc_html( get_the_title() ) . '</a></h3><p style="margin:0;color:#475569;">' . esc_html( wp_trim_words( get_the_excerpt(), 20 ) ) . '</p></div>';
			$out .= '</article>';
		}
		wp_reset_postdata();
		$out .= '</div>';
		return $out;
	}

	public static function body_class( $classes ) {
		if ( ! is_singular() ) {
			return $classes;
		}
		$post_id = get_queried_object_id();
		if ( get_post_meta( $post_id, '_mrspb_html', true ) ) {
			$classes[] = 'mrspb-page';
		}
		$settings = self::get_page_settings( $post_id );
		if ( ! empty( $settings['body_class'] ) ) {
			$body_classes = explode( ' ', sanitize_text_field( $settings['body_class'] ) );
			foreach ( $body_classes as $c ) {
				$c = sanitize_html_class( $c );
				if ( $c ) {
					$classes[] = $c;
				}
			}
		}
		return $classes;
	}

	public static function document_title_parts( $title ) {
		if ( ! is_singular() ) {
			return $title;
		}
		$post_id = get_queried_object_id();
		$settings = self::get_page_settings( $post_id );
		if ( ! empty( $settings['page_title'] ) ) {
			$title['title'] = sanitize_text_field( $settings['page_title'] );
		}
		return $title;
	}

	public static function get_allowed_html() {
		$allowed = wp_kses_allowed_html( 'post' );
		$common  = array(
			'class'   => true,
			'id'      => true,
			'style'   => true,
			'title'   => true,
			'dir'     => true,
			'lang'    => true,
			'role'    => true,
			'aria-*'  => true,
			'data-*'  => true,
		);

		$allowed['form'] = array_merge(
			$common,
			array(
				'action'          => true,
				'method'          => true,
				'enctype'         => true,
				'name'            => true,
				'target'          => true,
				'accept-charset'  => true,
				'novalidate'      => true,
			)
		);

		$allowed['input'] = array_merge(
			$common,
			array(
				'type'        => true,
				'name'        => true,
				'value'       => true,
				'placeholder' => true,
				'required'    => true,
				'checked'     => true,
				'disabled'    => true,
				'readonly'    => true,
				'min'         => true,
				'max'         => true,
				'step'        => true,
				'size'        => true,
				'maxlength'   => true,
				'pattern'     => true,
				'autocomplete' => true,
				'autofocus'   => true,
				'multiple'    => true,
			)
		);

		$allowed['textarea'] = array_merge(
			$allowed['textarea'],
			array(
				'rows'       => true,
				'cols'       => true,
				'placeholder' => true,
				'required'   => true,
				'minlength'  => true,
				'maxlength'  => true,
				'wrap'       => true,
			)
		);

		$allowed['button'] = array_merge(
			$allowed['button'],
			array(
				'type'  => true,
				'name'  => true,
				'value' => true,
			)
		);

		$allowed['select'] = array_merge(
			$common,
			array(
				'name'     => true,
				'multiple' => true,
				'required' => true,
				'size'     => true,
			)
		);

		$allowed['option'] = array_merge(
			$common,
			array(
				'value'    => true,
				'selected' => true,
			)
		);

		$allowed['optgroup'] = array_merge(
			$common,
			array(
				'label'    => true,
				'disabled' => true,
			)
		);

		$allowed['label'] = array_merge(
			$common,
			array( 'for' => true )
		);

		$allowed['fieldset'] = $common;
		$allowed['legend']   = $common;

		$allowed['iframe'] = array_merge(
			$common,
			array(
				'src'             => true,
				'width'           => true,
				'height'          => true,
				'frameborder'     => true,
				'allowfullscreen' => true,
				'loading'         => true,
				'title'           => true,
				'scrolling'       => true,
			)
		);

		$svg_common = array_merge(
			$common,
			array(
				'viewBox'               => true,
				'xmlns'                 => true,
				'fill'                  => true,
				'stroke'                => true,
				'stroke-width'          => true,
				'width'                 => true,
				'height'                => true,
				'preserveAspectRatio'   => true,
			)
		);

		$allowed['svg'] = $svg_common;
		foreach ( array( 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs', 'use' ) as $tag ) {
			$allowed[ $tag ] = array_merge(
				$svg_common,
				array(
					'd'             => true,
					'cx'            => true,
					'cy'            => true,
					'r'             => true,
					'x'             => true,
					'y'             => true,
					'x1'            => true,
					'y1'            => true,
					'x2'            => true,
					'y2'            => true,
					'points'        => true,
					'transform'     => true,
					'href'          => true,
				)
			);
		}

		$allowed['lottie-player'] = array_merge(
			$common,
			array(
				'src'       => true,
				'background' => true,
				'speed'     => true,
				'loop'      => true,
				'autoplay'  => true,
				'controls'  => true,
				'mode'      => true,
			)
		);

		$media_common = array_merge(
			$common,
			array(
				'src'       => true,
				'controls'  => true,
				'autoplay'  => true,
				'loop'      => true,
				'muted'     => true,
				'playsinline' => true,
				'poster'    => true,
				'preload'   => true,
				'width'     => true,
				'height'    => true,
			)
		);

		$allowed['video']  = $media_common;
		$allowed['audio']  = $media_common;
		$allowed['source'] = array_merge( $common, array( 'src' => true, 'type' => true, 'media' => true ) );
		$allowed['track']  = array_merge( $common, array( 'src' => true, 'kind' => true, 'srclang' => true, 'label' => true ) );
		$allowed['canvas'] = $common;
		$allowed['dialog'] = $common;
		$allowed['details'] = $common;
		$allowed['summary'] = $common;
		$allowed['meter'] = array_merge( $common, array( 'value' => true, 'min' => true, 'max' => true, 'low' => true, 'high' => true, 'optimum' => true ) );
		$allowed['progress'] = array_merge( $common, array( 'value' => true, 'max' => true ) );

		return $allowed;
	}

	public static function sanitize_builder_html( $html ) {
		return wp_kses( $html, self::get_allowed_html() );
	}

	public static function inject_form_nonces( $html ) {
		$nonce = wp_nonce_field( 'mrspb_public_nonce', 'nonce', true, false );
		if ( ! $nonce ) {
			return $html;
		}
		return preg_replace( '/(<form[^>]*>)/i', '$1' . $nonce, $html );
	}

	public static function replace_dynamic_content( $html ) {
		$post_id = get_the_ID();
		if ( ! $post_id ) {
			return $html;
		}
		$title   = get_post_field( 'post_title', $post_id );
		$excerpt = get_post_field( 'post_excerpt', $post_id );
		if ( ! $excerpt ) {
			$excerpt = wp_trim_words( strip_shortcodes( get_post_field( 'post_content', $post_id ) ), 55 );
		}
		$html    = preg_replace_callback(
			'/(<[a-z0-9]+\b(?=[^>]*class="[^"]*mrspb-dynamic[^"]*")(?=[^>]*data-dyn="(post_title|post_excerpt)")[^>]*>)(.*?)(<\/[a-z0-9]+>)/is',
			function( $m ) use ( $title, $excerpt ) {
				$content = ( 'post_title' === $m[2] ) ? $title : $excerpt;
				return $m[1] . esc_html( $content ) . $m[4];
			},
			$html
		);
		$image_url = get_the_post_thumbnail_url( $post_id, 'full' );
		if ( $image_url ) {
			$html = preg_replace_callback(
				'/<img\b(?=[^>]*class="[^"]*mrspb-dynamic[^"]*")(?=[^>]*data-dyn="featured_image")[^>]*>/i',
				function( $m ) use ( $image_url ) {
					$replaced = preg_replace( '/src="[^"]*"/i', 'src="' . esc_url( $image_url ) . '"', $m[0] );
					return $replaced ? $replaced : $m[0];
				},
				$html
			);
		}
		return $html;
	}

	public static function frontend_assets() {
		if ( ! is_singular() ) {
			return;
		}
		$post_id = get_queried_object_id();
		if ( ! $post_id ) {
			return;
		}
		$html = get_post_meta( $post_id, '_mrspb_html', true );
		if ( ! $html ) {
			return;
		}

		$css = get_post_meta( $post_id, '_mrspb_css', true );
		$settings = self::get_page_settings( $post_id );
		wp_register_style( 'mrspb-frontend-base', false, array(), MRSPB_VERSION );
		wp_enqueue_style( 'mrspb-frontend-base' );
		$inline_css = self::get_global_styles_css() . self::get_frontend_base_css() . ( $css ? wp_strip_all_tags( $css ) : '' ) . ( ! empty( $settings['custom_css'] ) ? wp_strip_all_tags( $settings['custom_css'] ) : '' );
		wp_add_inline_style( 'mrspb-frontend-base', $inline_css );

		$deps = array();
		if ( strpos( $html, 'data-aos' ) !== false ) {
			wp_enqueue_style( 'mrspb-aos', MRSPB_URL . 'assets/vendor/aos/aos.css', array(), MRSPB_VERSION );
			wp_enqueue_script( 'mrspb-aos', MRSPB_URL . 'assets/vendor/aos/aos.js', array(), MRSPB_VERSION, true );
			$deps[] = 'mrspb-aos';
		}
		if ( strpos( $html, 'swiper' ) !== false || strpos( $html, 'swiper-wrapper' ) !== false ) {
			wp_enqueue_style( 'mrspb-swiper', MRSPB_URL . 'assets/vendor/swiper/swiper-bundle.min.css', array(), MRSPB_VERSION );
			wp_enqueue_script( 'mrspb-swiper', MRSPB_URL . 'assets/vendor/swiper/swiper-bundle.min.js', array(), MRSPB_VERSION, true );
			$deps[] = 'mrspb-swiper';
		}
		if ( strpos( $html, 'data-gsap' ) !== false ) {
			wp_enqueue_script( 'mrspb-gsap', MRSPB_URL . 'assets/vendor/gsap/gsap.min.js', array(), MRSPB_VERSION, true );
			wp_enqueue_script( 'mrspb-scrolltrigger', MRSPB_URL . 'assets/vendor/gsap/ScrollTrigger.min.js', array( 'mrspb-gsap' ), MRSPB_VERSION, true );
			$deps[] = 'mrspb-gsap';
			$deps[] = 'mrspb-scrolltrigger';
		}
		if ( strpos( $html, 'mrspb-lottie' ) !== false ) {
			wp_enqueue_script( 'mrspb-lottie', MRSPB_URL . 'assets/vendor/lottie/lottie.min.js', array(), MRSPB_VERSION, true );
			$deps[] = 'mrspb-lottie';
		}

		wp_register_script( 'mrspb-frontend', MRSPB_URL . 'assets/js/frontend.js', $deps, MRSPB_VERSION, true );
		wp_enqueue_script( 'mrspb-frontend' );
		$inline_js = ! empty( $settings['custom_js'] ) ? sanitize_textarea_field( $settings['custom_js'] ) : '';
		if ( $inline_js ) {
			wp_add_inline_script( 'mrspb-frontend', $inline_js );
		}
		wp_localize_script(
			'mrspb-frontend',
			'mrspbData',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'postId'  => $post_id,
				'strings' => array(
					'success' => __( 'Thank you! We will get back to you soon.', 'page-builder-pro' ),
				),
			)
		);
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
		$html = self::replace_dynamic_content( $html );
		$html = self::inject_form_nonces( $html );
		$html = do_shortcode( $html );
		return '<div class="mrspb-content">' . $html . '</div>';
	}

	public static function get_frontend_base_css() {
		$css  = ':root{--mrspb-spacer:8px;}';
		$css .= '.mrspb-content{box-sizing:border-box;}';
		$css .= '.mrspb-content *{box-sizing:inherit;}';
		$css .= '.mrspb-form{margin:0;}';
		$css .= '.mrspb-form input,.mrspb-form textarea,.mrspb-form select,.mrspb-form button{font-family:inherit;}';
		$css .= '.mrspb-form-message{padding:20px;background:#dcfce7;color:#166534;border-radius:8px;text-align:center;}';
		$css .= '.mrspb-countdown .mrspb-countdown-label{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#64748b;}';
		$css .= '.mrspb-faq-item .mrspb-faq-answer{max-height:0;overflow:hidden;transition:max-height .3s ease;padding:0 15px;}';
		$css .= '.mrspb-faq-item.open .mrspb-faq-answer{max-height:500px;padding:0 15px 15px;}';
		$css .= '.mrspb-faq-question{display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:15px;font-weight:600;}';
		$css .= '.mrspb-star-rating{color:#fbbf24;font-size:24px;letter-spacing:2px;}';
		$css .= '.mrspb-cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;display:flex;justify-content:space-between;align-items:center;padding:15px 20px;background:#1e293b;color:#fff;}';
		$css .= '.mrspb-cookie-banner button{padding:8px 16px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;}';
		$css .= '.mrspb-lottie{display:block;margin:0 auto;}';
		$css .= '.mrspb-modal,.mrspb-modal[open]{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.5);}';
		$css .= '.mrspb-modal.mrspb-open,.mrspb-modal[open]{display:flex;}';
		$css .= '.mrspb-modal-content{background:#fff;padding:30px;border-radius:12px;max-width:600px;width:90%;position:relative;box-shadow:0 20px 50px rgba(0,0,0,.2);}';
		$css .= '.mrspb-modal-close{position:absolute;top:10px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;}';
		$css .= '.mrspb-before-after{position:relative;overflow:hidden;user-select:none;}';
		$css .= '.mrspb-before-after img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}';
		$css .= '.mrspb-before-after .mrspb-slider{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;z-index:3;}';
		$css .= '.mrspb-before-after .mrspb-handle{position:absolute;top:0;bottom:0;width:4px;background:#fff;transform:translateX(-50%);z-index:2;box-shadow:0 0 10px rgba(0,0,0,.3);}';
		$css .= '.mrspb-typewriter{font-weight:700;color:#2563eb;}';
		$css .= '.mrspb-particles{position:absolute;inset:0;pointer-events:none;}';
		$css .= '.mrspb-video-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1;}';
		$css .= '.mrspb-floating-bar{position:fixed;left:0;right:0;z-index:9998;padding:12px 20px;background:#fff;box-shadow:0 -4px 12px rgba(0,0,0,.08);display:flex;justify-content:space-between;align-items:center;}';
		$css .= '.mrspb-floating-bar.top{top:0;}.mrspb-floating-bar.bottom{bottom:0;}';
		$css .= '.mrspb-social-share{display:flex;gap:10px;flex-wrap:wrap;}';
		$css .= '.mrspb-social-share button{padding:8px 16px;border:none;border-radius:6px;background:#f1f5f9;color:#334155;cursor:pointer;font-weight:600;}';
		$css .= '.mrspb-masonry{columns:3 250px;column-gap:16px;}';
		$css .= '.mrspb-masonry > *{break-inside:avoid;margin-bottom:16px;}';
		$css .= '.mrspb-timeline{position:relative;padding-left:30px;}';
		$css .= '.mrspb-timeline::before{content:"";position:absolute;left:8px;top:0;bottom:0;width:2px;background:#e2e8f0;}';
		$css .= '.mrspb-timeline-item{position:relative;margin-bottom:24px;padding-left:24px;}';
		$css .= '.mrspb-timeline-item::before{content:"";position:absolute;left:-23px;top:4px;width:14px;height:14px;border-radius:50%;background:#2563eb;}';
		$css .= '.mrspb-pie-chart{width:120px;height:120px;transform:rotate(-90deg);}';
		$css .= '.mrspb-pie-chart circle{fill:none;stroke-width:3;}';
		$css .= '.mrspb-pie-chart .mrspb-pie-bg{stroke:#e2e8f0;}';
		$css .= '.mrspb-pie-chart .mrspb-pie{stroke:#2563eb;stroke-linecap:round;}';
		$css .= '.mrspb-post-card img{height:180px;object-fit:cover;}';
		$css .= '.mrspb-counter{font-size:48px;font-weight:700;color:#2563eb;text-align:center;}';
		$css .= '.mrspb-tabs [data-tab],.mrspb-tabs-buttons [data-tab]{padding:10px 20px;background:#f1f5f9;color:#475569;border:none;border-radius:6px 6px 0 0;cursor:pointer;}';
		$css .= '.mrspb-tabs [data-tab].active,.mrspb-tabs-buttons [data-tab].active{background:#2563eb;color:#fff;}';
		$css .= '[data-tab-panel]{display:none;}';
		$css .= '[data-tab-panel].active{display:block;}';
		$css .= '.mrspb-accordion-item{border:1px solid #e2e8f0;border-radius:8px;margin-bottom:10px;overflow:hidden;}';
		$css .= '.mrspb-accordion-header{padding:15px;font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:#fff;}';
		$css .= '.mrspb-accordion-content{padding:0 15px 15px;color:#475569;background:#fff;max-height:0;overflow:hidden;transition:max-height .3s ease;}';
		$css .= '.mrspb-accordion-item.open .mrspb-accordion-content{max-height:500px;}';
		$css .= '.mrspb-grid{display:grid;gap:var(--grid-gap,24px);}';
		$css .= '.mrspb-grid:not([data-columns]),.mrspb-grid[data-columns="1"]{grid-template-columns:1fr;}';
		$css .= '.mrspb-grid[data-columns="2"]{grid-template-columns:repeat(2,1fr);}';
		$css .= '.mrspb-grid[data-columns="3"]{grid-template-columns:repeat(3,1fr);}';
		$css .= '.mrspb-grid[data-columns="4"]{grid-template-columns:repeat(4,1fr);}';
		$css .= '.mrspb-grid[data-columns="5"]{grid-template-columns:repeat(5,1fr);}';
		$css .= '.mrspb-grid[data-columns="6"]{grid-template-columns:repeat(6,1fr);}';
		$css .= '.mrspb-flex{display:flex;gap:var(--flex-gap,24px);}';
		$css .= '.mrspb-flex[data-wrap="wrap"]{flex-wrap:wrap;}';
		$css .= '.mrspb-flex[data-align="center"]{align-items:center;}';
		$css .= '.mrspb-flex[data-justify="center"]{justify-content:center;}';
		$css .= '.mrspb-flex[data-justify="between"]{justify-content:space-between;}';
		$css .= '.mrspb-flex > *{flex:1;}';
		$css .= '.mrspb-flex[data-fit] > *{flex:0 0 auto;}';
		$css .= '.mrspb-container{width:100%;max-width:1200px;margin:0 auto;padding:0 20px;}';
		$css .= '.mrspb-section{position:relative;padding:80px 0;}';
		$css .= '.mrspb-text-center{text-align:center;}';
		$css .= '.mrspb-text-left{text-align:left;}';
		$css .= '.mrspb-text-right{text-align:right;}';
		$css .= '.mrspb-p-0{padding:0;}.mrspb-p-1{padding:8px;}.mrspb-p-2{padding:16px;}.mrspb-p-3{padding:24px;}.mrspb-p-4{padding:32px;}.mrspb-p-5{padding:48px;}.mrspb-p-6{padding:64px;}';
		$css .= '.mrspb-m-0{margin:0;}.mrspb-m-1{margin:8px;}.mrspb-m-2{margin:16px;}.mrspb-m-3{margin:24px;}.mrspb-m-4{margin:32px;}.mrspb-m-5{margin:48px;}.mrspb-m-6{margin:64px;}';
		$css .= '.mrspb-rounded{border-radius:8px;}.mrspb-rounded-lg{border-radius:16px;}.mrspb-rounded-xl{border-radius:24px;}.mrspb-shadow{box-shadow:0 4px 12px rgba(0,0,0,.05);}.mrspb-shadow-lg{box-shadow:0 10px 30px rgba(0,0,0,.1);}';
		$css .= '.mrspb-hover-lift{transition:transform .3s ease,box-shadow .3s ease;}.mrspb-hover-lift:hover{transform:translateY(-6px);box-shadow:0 12px 24px rgba(0,0,0,.12);}';
		$css .= '.mrspb-hover-scale{transition:transform .3s ease;}.mrspb-hover-scale:hover{transform:scale(1.03);}';
		$css .= '.mrspb-sticky{position:sticky;top:0;z-index:9997;}';
		$css .= '.mrspb-scroll-progress{position:fixed;top:0;left:0;height:4px;background:var(--mrspb-primary,#2563eb);width:0%;z-index:10001;transition:width .1s linear;}';
		$css .= '@media (max-width:1024px){.mrspb-grid[data-columns]:not([data-columns="1"]){grid-template-columns:repeat(2,1fr);}}';
		$css .= '@media (max-width:768px){.mrspb-grid[data-columns]{grid-template-columns:1fr;}.mrspb-flex{flex-direction:column;}}';
		return $css;
	}

	public static function get_global_styles_css() {
		$colors = get_option( 'mrspb_global_colors', array( 'primary' => '#2563eb', 'secondary' => '#7c3aed', 'dark' => '#0f172a' ) );
		$fonts  = get_option( 'mrspb_global_fonts', array( 'body' => '', 'heading' => '' ) );
		$css = ':root{';
		$css .= '--mrspb-primary:' . esc_attr( $colors['primary'] ?? '#2563eb' ) . ';';
		$css .= '--mrspb-secondary:' . esc_attr( $colors['secondary'] ?? '#7c3aed' ) . ';';
		$css .= '--mrspb-dark:' . esc_attr( $colors['dark'] ?? '#0f172a' ) . ';';
		$css .= '}';
		$extra  = '@media (max-width:1024px){.mrspb-hide-tablet{display:none !important;}}@media (max-width:768px){.mrspb-hide-mobile{display:none !important;}}@media (min-width:1025px){.mrspb-hide-desktop{display:none !important;}}';
		$body_font = ! empty( $fonts['body'] ) ? sanitize_text_field( $fonts['body'] ) : '';
		$heading_font = ! empty( $fonts['heading'] ) ? sanitize_text_field( $fonts['heading'] ) : '';
		if ( $body_font ) {
			$extra .= '.mrspb-content{font-family:' . $body_font . ';}';
		}
		if ( $heading_font ) {
			$extra .= '.mrspb-content h1,.mrspb-content h2,.mrspb-content h3,.mrspb-content h4,.mrspb-content h5,.mrspb-content h6{font-family:' . $heading_font . ';}';
		}
		return $css . $extra;
	}

	public static function get_global_styles() {
		return '<style>' . self::get_global_styles_css() . '</style>';
	}
}
