// SEO utility component for managing document title and meta tags
// This is a lightweight alternative to React Helmet

class SEOManager {
  static setTitle(title) {
    if (typeof document !== 'undefined') {
      document.title = title;
    }
  }

  static setMetaDescription(description) {
    if (typeof document !== 'undefined') {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }

  static setMetaKeywords(keywords) {
    if (typeof document !== 'undefined') {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }
  }

  static setCanonicalUrl(url) {
    if (typeof document !== 'undefined') {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', url);
      }
    }
  }

  static setPageSEO(title, description, keywords, canonicalUrl) {
    this.setTitle(title);
    this.setMetaDescription(description);
    this.setMetaKeywords(keywords);
    if (canonicalUrl) {
      this.setCanonicalUrl(canonicalUrl);
    }
  }
}

export default SEOManager;
