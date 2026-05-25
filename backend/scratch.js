const req = {
  params: {
    "0": "testing-plugin-changes/thank-you"
  }
};
let isThankYou = false;
let pageSlug = '';
let urlPreSlug = '';

const rawSlug = String(req.params.slug || req.params[0] || '').trim();
let cleanSlug = rawSlug.replace(/^\/+|\/+$/g, '');
const slugParts = cleanSlug.split('/');
console.log("slugParts:", slugParts);

if (slugParts[slugParts.length - 1] === 'thank-you') {
  pageSlug = slugParts.length > 1 ? slugParts[slugParts.length - 2] : '';
  urlPreSlug = slugParts.length > 2 ? slugParts.slice(0, slugParts.length - 2).join('/') : '';
  isThankYou = true;
} else {
  pageSlug = slugParts[slugParts.length - 1];
  urlPreSlug = slugParts.slice(0, slugParts.length - 1).join('/');
}
console.log({isThankYou, pageSlug, urlPreSlug});
