<?php
namespace CommerceKit\Commerce\API;

use CommerceKit\Commerce\Classes\Trait\Hookable;

class Tips {
    use Hookable;

    public function tips_permission() {
        return true;
    }
}