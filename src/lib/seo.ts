/** Canonical origin for absolute URLs in metadata and structured data. */
export const SITE_URL = "https://findhive.lovable.app";
export const SITE_NAME = "findhive";

export function abs(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function ldScript(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function collectionPageLd(opts: {
  name: string;
  description: string;
  path: string;
  items: { id: string; title: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: abs(opts.path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.slice(0, 24).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: abs(`/product/${p.id}`),
      })),
    },
  };
}

export function productLd(p: {
  id: string;
  title: string;
  description: string;
  image: string[];
  price: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  brand?: string;
  sku?: string;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    image: p.image.map((src) => ({ "@type": "ImageObject", url: src })),
    sku: p.sku ?? p.id,
    brand: { "@type": "Brand", name: p.brand ?? SITE_NAME },
    offers: {
      "@type": "Offer",
      url: abs(`/product/${p.id}`),
      priceCurrency: "USD",
      price: p.price.toFixed(2),
      itemCondition: "https://schema.org/NewCondition",
      availability: p.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
      },
    },
  };
  if (p.reviewCount > 0 && p.rating > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: p.rating.toFixed(1),
      reviewCount: p.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return data;
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleLd(a: {
  title: string;
  description: string;
  path: string;
  date: string;
  author: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    url: abs(a.path),
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(a.path) },
    datePublished: a.date,
    dateModified: a.date,
    author: { "@type": "Person", name: a.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(a.image ? { image: a.image } : {}),
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description:
      "findhive is a warehouse-backed online retailer of Pokémon TCG products, trading cards, watches, jewelry and home fitness equipment.",
    email: "support@findhive.shop",
    sameAs: [
      "https://www.facebook.com/",
      "https://twitter.com/",
      "https://www.instagram.com/",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@findhive.shop",
        availableLanguage: ["English"],
      },
    ],
  };
}

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
