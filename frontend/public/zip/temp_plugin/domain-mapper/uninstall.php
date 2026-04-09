<?php
/**
 * Uninstall script.
 *
 * Runs when the plugin is deleted via wp-admin → Plugins.
 * Removes all plugin options and transients from the database.
 *
 * @package DomainMapper
 */

// Only allow direct execution from WordPress uninstall hook.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

// Remove main options row.
delete_option( 'dm_settings' );

// Flush all plugin transients.
global $wpdb;

// phpcs:ignore WordPress.DB.DirectDatabaseQuery
$wpdb->query(
    $wpdb->prepare(
        "DELETE FROM {$wpdb->options}
         WHERE option_name LIKE %s
            OR option_name LIKE %s
            OR option_name LIKE %s
            OR option_name LIKE %s",
        $wpdb->esc_like( '_transient_dm_page_' ) . '%',
        $wpdb->esc_like( '_transient_timeout_dm_page_' ) . '%',
        $wpdb->esc_like( '_transient_dm_api_' ) . '%',
        $wpdb->esc_like( '_transient_timeout_dm_api_' ) . '%'
    )
);

// Remove scheduled cron event.
wp_clear_scheduled_hook( 'dm_hourly_sync' );

// Remove debug log.
$log_file = WP_CONTENT_DIR . '/dm-debug.log';
if ( file_exists( $log_file ) ) {
    // phpcs:ignore WordPress.WP.AlternativeFunctions.unlink_unlink
    @unlink( $log_file );
}
