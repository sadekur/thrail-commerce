<?php
namespace CommerceKit\Commerce\API;

use CommerceKit\Commerce\Classes\Trait\Hookable;

class Tips {
    use Hookable;

    public function tips_permission() {
        return true;
    }

    public function commerce_kit_save_tips( $request ) {

        $tips_settings      = $request->get_json_params() ?? [];
        $current_settings   = get_option( 'commercekit-tips-settings', [] );
        $updated_settings   = array_merge( $current_settings, $tips_settings );
        update_option( 'commercekit-tips-settings', $updated_settings );
        return rest_ensure_response( 'success' );
    }

    public function commerce_kit_get_tips() {
        $tips_settings = get_option( 'commercekit-tips-settings', [] );
        return rest_ensure_response( $tips_settings );
    }
}