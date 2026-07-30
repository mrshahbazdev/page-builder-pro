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
		add_filter( 'the_content', array( __CLASS__, 'frontend_render' ), 999 );
		add_filter( 'page_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_filter( 'post_row_actions', array( __CLASS__, 'row_actions' ), 10, 2 );
		add_action( 'admin_bar_menu', array( __CLASS__, 'admin_bar_link' ), 999 );
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
			echo '<div class="updated"><p>' . esc_html__( 'Settings saved.', 'page-builder-pro' ) . '</p></div>';
		}
		$selected = get_option( 'mrspb_allowed_roles', array( 'administrator', 'editor' ) );
		if ( ! is_array( $selected ) ) {
			$selected = array( 'administrator', 'editor' );
		}
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
				</table>
				<?php submit_button( __( 'Save Settings', 'page-builder-pro' ), 'primary', 'mrspb_save_settings' ); ?>
			</form>
		</div>
		<?php
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
		$css = get_post_meta( $post_id, '_mrspb_css', true );
		$out = '';
		if ( $css ) {
			$out .= '<style>' . wp_strip_all_tags( $css ) . '</style>';
		}
		$out .= '<div class="mrspb-content">' . $html . '</div>';
		return $out;
	}
}
