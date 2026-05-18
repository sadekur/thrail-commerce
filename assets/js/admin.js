jQuery(document).ready(function ($) {

    function isCommerceKitScreen() {
        const params = new URLSearchParams(window.location.search);
        return params.get('page') === 'commerce-kit';
    }

    const $menu = $('#adminmenu li.toplevel_page_commerce-kit');

    // Map every feature key that owns a submenu to a selector for that submenu's <li>.
    // Add new entries here whenever a new feature gets its own submenu page.
    const featureSubmenus = {
        'stock-threshold-for-wc': 'a[href*="#/stock-threshold"]',
        'woocommerce-tips':        'a[href*="#/commerce-kit-tip-settings"]',
    };

    function syncSubmenus(settings) {
        Object.keys(featureSubmenus).forEach(function (featureKey) {
            var $item = $menu.find(featureSubmenus[featureKey]).closest('li');
            if (settings[featureKey] === 'on') {
                $item.show();
            } else {
                $item.hide();
            }
        });
    }

    // Sync submenu visibility as soon as the page is ready using the PHP-localized data.
    syncSubmenus((window.COMMERCEKIT && window.COMMERCEKIT.settings_data) ? window.COMMERCEKIT.settings_data : {});

    // React dispatches this event after every feature save — no reload needed.
    window.addEventListener('commerceKitSettingsUpdated', function (e) {
        syncSubmenus(e.detail || {});
    });

    function updateActiveMenu() {
        if (!isCommerceKitScreen()) return;
        $menu.find('.wp-submenu li').removeClass('current');
        const hash = window.location.hash || '';
        if (hash && hash !== '#/') {
            $menu.find('a[href*="' + hash + '"]').closest('li').addClass('current');
        } else {
            $menu.find('a[href="admin.php?page=commerce-kit"]').closest('li').addClass('current');
        }
    }

    $(document).on('click', '#adminmenu a[href="admin.php?page=commerce-kit"]', function (e) {
        if (!isCommerceKitScreen()) return;
        e.preventDefault();
        window.location.hash = '';
        updateActiveMenu();
    });

    updateActiveMenu();
    $(window).on('hashchange', updateActiveMenu);
});