<?php
namespace CommerceKit\Commerce\API;

class Settings {

    public function get_settings_permission() {
        return true;
    }
    public function save_settings_permission() {
        return current_user_can( 'manage_options' );
    }
}
