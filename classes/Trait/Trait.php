<?php
namespace Thrail\Commerce\Classes;

trait Hookable {
    /**
     * Add a WordPress action hook.
     *
     * @param string   $hook          The name of the WordPress action to be hooked.
     * @param callable $callback      The callback to be run when the action is executed.
     * @param int      $priority      Optional. The priority at which the function should be fired. Default is 10.
     * @param int      $accepted_args Optional. The number of arguments that should be passed to the callback. Default is 1.
     */
    public function action($hook, $callback, $priority = 10, $accepted_args = 1) {
        add_action($hook, $callback, $priority, $accepted_args);
    }

    /**
     * Add a WordPress filter hook.
     *
     * @param string   $hook          The name of the WordPress filter to be hooked.
     * @param callable $callback      The callback to be run when the filter is applied.
     * @param int      $priority      Optional. The priority at which the function should be fired. Default is 10.
     * @param int      $accepted_args Optional. The number of arguments that should be passed to the callback. Default is 1.
     */
    public function filter($hook, $callback, $priority = 10, $accepted_args = 1) {
        add_filter($hook, $callback, $priority, $accepted_args);
    }
}