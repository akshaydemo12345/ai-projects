<?php
/**
 * Runs on plugin uninstall (WP_UNINSTALL_PLUGIN is defined by WordPress).
 */
defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

delete_option( 'ailp_settings' );
flush_rewrite_rules();
