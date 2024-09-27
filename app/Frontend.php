<?php
    namespace Thrail\Commerce;
    use Thrail\Commerce\Classes\Trait\Hookable;

    /**
     * Frontend handler class
     */
    class Frontend {
        use Hookable;

        // Name of the option where settings are stored
        protected $settings_option_name = 'thrail_settings';

        /**
         * Initialize the class
         */
        public function __construct() {
            // Fetch the settings array from the database
            $settings = get_option( $this->settings_option_name, [] );

            // Check if the 'Enable Footer Hook' setting is 'on'
            if ( isset( $settings['Enable Footer Hook'] ) && $settings['Enable Footer Hook'] === 'on' ) {
                $this->action( 'wp_footer', [ $this, 'add_footer_hook' ] );
            }
        }
        public function add_footer_hook() {
            echo '<p style="color: green; text-align: center" class="notice notice-success">Footer hook has been enabled!</p>';
        }
    }