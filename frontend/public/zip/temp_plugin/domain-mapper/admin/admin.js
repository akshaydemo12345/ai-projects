/* global dmAdmin, jQuery */
( function ( $ ) {
    'use strict';

    var nonce   = dmAdmin.nonce;
    var ajaxUrl = dmAdmin.ajaxUrl;
    var i18n    = dmAdmin.i18n;

    // ── Verify API key ────────────────────────────────────────────────────────
    $( '#dm-verify-btn' ).on( 'click', function () {
        var $btn    = $( this );
        var $status = $( '#dm-verify-status' );
        var apiKey  = $( '#dm_api_key' ).val();
        var $saveBtn = $('#dm-save-btn');

        if (!apiKey || apiKey.length < 10) {
            $status.css( 'color', '#d63638' ).text( '❌ API Key is too short/invalid' );
            return;
        }

        $btn.prop( 'disabled', true ).text( i18n.verifying );
        $status.hide().text( '' );
        // Removed: $saveBtn.prop('disabled', true);

        $.post( ajaxUrl, {
            action : 'dm_verify_api',
            nonce  : nonce,
            api_key: apiKey,
        } )
        .done( function ( res ) {
            if ( res.success ) {
                $status.css( { color: '#00a32a', display: 'inline' } ).text( '✅ API Verified' );
                $( '#dm_api_key' ).css( 'border-color', '#00a32a' );
                $( '#dm_verified_token' ).val(res.data.token);
                // Removed: $saveBtn.prop('disabled', false); // Enable save button

                // Update badge live
                $('#dm-status-badge').css('background', '#0073aa').text('✅ Active');

                // Hide notice
                $('#dm-notice-inactive').fadeOut();
            } else {
                var msg = ( res.data && res.data.message ) ? res.data.message : i18n.failed;
                $status.css( { color: '#d63638', display: 'inline' } ).text( '❌ ' + msg );
                showNotice( msg, 'error' );
            }
        } )
        .fail( function () {
            $status.css( { color: '#d63638', display: 'inline' } ).text( '❌ Verification error' );
        } )
        .always( function () {
            $btn.prop( 'disabled', false ).text( 'Verify Now' );
        } );
    } );

    // Reset verification if user changes the API key
    $('#dm_api_key').on('input', function() {
        $('#dm_verified_token').val('');
        // Removed: $('#dm-save-btn').prop('disabled', true);
        $('#dm-verify-status').hide();
        $(this).css('border-color', '#ccd0d4');

        // Reset badge to inactive
        $('#dm-status-badge').css('background', '#d63638').text('❌ Inactive');
    });

    // ── Flush cache ───────────────────────────────────────────────────────────
    $( '#dm-flush-cache-btn' ).on( 'click', function () {
        var $btn    = $( this );
        var $status = $( '#dm-flush-status' );

        $btn.prop( 'disabled', true );
        $status.css( 'color', '#646970' ).text( i18n.flushing );

        $.post( ajaxUrl, {
            action : 'dm_flush_cache',
            nonce  : nonce,
        } )
        .done( function ( res ) {
            if ( res.success ) {
                $status.css( 'color', '#00a32a' ).text( '✅ Cache flushed' );
            } else {
                $status.css( 'color', '#d63638' ).text( i18n.flushFailed );
            }
        } )
        .fail( function () {
            $status.css( 'color', '#d63638' ).text( i18n.flushFailed );
        } )
        .always( function () {
            $btn.prop( 'disabled', false );
        } );
    } );

    // ── Form Validation ──────────────────────────────────────────────────────
    $( '#dm-settings-form' ).on( 'submit', function ( e ) {
        var apiKey         = $( '#dm_api_key' ).val().trim();
        var verifiedToken  = $( '#dm_verified_token' ).val();
        
        // 1. Basic empty check
        if ( ! apiKey ) {
            showNotice( 'API Key is required.' );
            $( '#dm_api_key' ).focus();
            e.preventDefault();
            return false;
        }

        // 2. Length check
        if ( apiKey.length < 10 ) {
            showNotice( 'API Key must be at least 10 characters long.' );
            $( '#dm_api_key' ).focus();
            e.preventDefault();
            return false;
        }

        // 3. Verification check
        // If the token is empty, it means the key was changed or never verified in this session
        if ( ! verifiedToken ) {
            showNotice( 'Please click "Verify Now" to validate your API Key before saving.' );
            e.preventDefault();
            return false;
        }

        return true;
    });

    /**
     * Helper to show a native WordPress notice inline.
     */
    function showNotice(message, type = 'error') {
        var $container = $('#dm-js-notices');
        $container.empty(); // Clear old ones

        var html = '<div class="notice notice-' + type + ' is-dismissible"><p><strong>Domain Mapper:</strong> ' + message + '</p></div>';
        var $notice = $(html);
        
        $container.append($notice);

        // Simple scroll to top of form
        $('html, body').animate({
            scrollTop: $container.offset().top - 100
        }, 200);
    }

} )( jQuery );
