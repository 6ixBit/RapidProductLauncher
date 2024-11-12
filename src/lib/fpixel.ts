declare global {
  interface Window {
    fbq: any;
  }
}

export const FB_PIXEL_ID = '863914565950188';

export const pageview = () => {
  window.fbq('track', 'PageView');
};

export const purchase = (value, currency, contentIds, contentType) => {
  window.fbq('track', 'Purchase', {
    value: value,
    currency: currency,
    content_ids: contentIds,
    content_type: contentType,
  });
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
  window.fbq('track', name, options);
};
