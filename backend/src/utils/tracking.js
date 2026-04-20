/**
 * Utility to generate tracking scripts for landing pages and thank you pages
 */

function generateTrackingScripts(tracking = {}, pageId = '', industry = '') {
  let scripts = '';

  if (!tracking) return '';

  // 1. Base gtag.js initialization (always include if measurement ID or conversion ID is present)
  if (tracking.ga4MeasurementId || tracking.googleAdsConversionId) {
    const mainId = tracking.ga4MeasurementId || (tracking.googleAdsConversionId ? tracking.googleAdsConversionId.split('/')[0] : '');
    if (mainId) {
      scripts += `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${mainId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      ${tracking.ga4MeasurementId ? `gtag('config', '${tracking.ga4MeasurementId}');` : ''}
    </script>
    `;
    }
  }

  // 2. GA4 Event
  if (tracking.ga4MeasurementId) {
    scripts += `
    <script>
      gtag('event', '${tracking.ga4EventName || 'lead_submission'}', {
        'page_id': '${pageId}',
        'industry': '${industry || 'unknown'}'
      });
    </script>
    `;
  }

  // 3. Google Ads Conversion
  if (tracking.googleAdsConversionId && tracking.googleAdsLabel) {
    scripts += `
    <script>
      gtag('event', 'conversion', {
        'send_to': '${tracking.googleAdsConversionId}/${tracking.googleAdsLabel}'
      });
    </script>
    `;
  }

  // 4. Meta Pixel
  if (tracking.metaPixelId) {
    scripts += `
    <!-- Meta Pixel -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${tracking.metaPixelId}');
      fbq('track', '${tracking.metaEventName || 'Lead'}', {
        'page_id': '${pageId}',
        'industry': '${industry || 'unknown'}'
      });
    </script>
    <noscript>
      <img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${tracking.metaPixelId}&ev=${tracking.metaEventName || 'Lead'}&noscript=1"/>
    </noscript>
    `;
  }

  // 5. Custom tracking scripts (smart wrapping)
  if (tracking.customTracking && tracking.customTracking.length > 0) {
    scripts += '<!-- Custom Tracking -->\n';
    tracking.customTracking.forEach(script => {
      const trimmed = script.trim();
      if (!trimmed) return;
      if (trimmed.startsWith('<script')) {
        scripts += trimmed + '\n';
      } else {
        scripts += `<script>\n${trimmed}\n</script>\n`;
      }
    });
  }

  return scripts;
}

module.exports = {
  generateTrackingScripts
};
