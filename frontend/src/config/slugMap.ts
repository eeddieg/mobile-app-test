// Maps local slug → WP page ID
// Source: your /api/wp/pages response
export const SLUG_TO_PAGE_ID: Record<string, number> = {
  'dikaiouxoi':          0,   // fetch by WP slug below instead
  'grafeio-asthenon':    0,
  'iatreio-epifylakas':  0,
  'grammi-ypostiriksis': 2721,
  'faq':                 0,
  'apostoli':            0,
  'dioikisi':            0,
  'dioikitiko-tmima':    2824,
  'trapeza-aimatos':     2831,
  'epitropes':           0,
  'nomothesia':          0,
  'dioikisi-kia':        0,
  'tmimata-kia':         0,
  'dioikitiko-kia':      0,
  'istoriko':            0,
  'dioikisi-kith':       2292,
  'tmimata-kith':        0,
  'iatriko-prosopiko':   0,
  'nosileutiko':         2067,
  'psixologoi':          2070,
  'arthra':              0,
  'aimodosia':           0,
  'vinteo':              0,
}

// WP slugs (URL-encoded Greek) for pages not yet in API pull
// Used as fallback: fetch by ?slug=
export const SLUG_TO_WP_SLUG: Record<string, string> = {
  'dikaiouxoi':         '%ce%b4%ce%b9%ce%ba%ce%b1%ce%b9%ce%bf%cf%8d%cf%87%ce%bf%ce%b9-%cf%80%ce%b5%cf%81%ce%af%ce%b8%ce%b1%ce%bb%cf%88%ce%b7%cf%82',
  'grafeio-asthenon':   '%ce%b3%cf%81%ce%b1%cf%86%ce%b5%ce%af%ce%bf-%ce%b4%ce%b9%ce%b1%cf%87%ce%b5%ce%af%cf%81%ce%b9%cf%83%ce%b7%cf%82-%ce%b1%cf%83%ce%b8%ce%b5%ce%bd%cf%8e%ce%bd',
  'iatreio-epifylakas': '%ce%b9%ce%b1%cf%84%cf%81%ce%b5%ce%af%ce%bf-%ce%b5%cf%80%ce%b9%cf%86%cf%85%ce%bb%ce%b1%ce%ba%ce%ae%cf%82',
  'apostoli':           '%ce%b1%cf%80%ce%bf%cf%83%cf%84%ce%bf%ce%bb%ce%ae',
  'dioikisi':           '%ce%b4%ce%b9%ce%bf%ce%af%ce%ba%ce%b7%cf%83%ce%b7',
  'dioikisi-kia':       '%ce%b4%ce%b9%ce%bf%ce%af%ce%ba%ce%b7%cf%83%ce%b7-%ce%ba%ce%b9%ce%b1',
  'tmimata-kia':        '%ce%b9%ce%b1%cf%84%cf%81%ce%b9%ce%ba%ce%ac-%cf%84%ce%bc%ce%ae%ce%bc%ce%b1%cf%84%ce%b1-%ce%ba%ce%b9%ce%b1',
  'dioikitiko-kia':     '%ce%b4%ce%b9%ce%bf%ce%b9%ce%ba%ce%b7%cf%84%ce%b9%ce%ba%cf%8c-%cf%84%ce%bc%ce%ae%ce%bc%ce%b1-%ce%ba%ce%b9%ce%b1',
  'istoriko':           '%ce%b9%cf%83%cf%84%ce%bf%cf%81%ce%b9%ce%ba%ce%bf',
  'tmimata-kith':       '%ce%b9%ce%b1%cf%84%cf%81%ce%b9%ce%ba%ce%ac-%cf%84%ce%bc%ce%ae%ce%bc%ce%b1%cf%84%ce%b1-%ce%ba%ce%b9%ce%b8',
  'iatriko-prosopiko':  '%ce%b9%ce%b1%cf%84%cf%81%ce%b9%ce%ba%cf%8c-%cf%80%cf%81%ce%bf%cf%83%cf%89%cf%80%ce%b9%ce%ba%cf%8c',
  'arthra':             '%ce%b5%cf%80%ce%b9%cf%83%cf%84%ce%b7%ce%bc%ce%bf%ce%bd%ce%b9%ce%ba%ce%ac-%ce%ac%cf%81%ce%b8%cf%81%ce%b1',
  'aimodosia':          '%ce%b1%ce%b9%ce%bc%ce%bf%ce%b4%ce%bf%cf%83%ce%af%ce%b1',
  'vinteo':             '%ce%b2%ce%af%ce%bd%cf%84%ce%b5%ce%bf',
  'faq':                '%cf%83%cf%85%cf%87%ce%bd%ce%ad%cf%82-%ce%b5%cf%81%cf%89%cf%84%ce%ae%cf%83%ce%b5%ce%b9%cf%82',
  'epitropes':          '%ce%b5%cf%80%ce%b9%cf%84%cf%81%ce%bf%cf%80%ce%ad%cf%82',
  'nomothesia':         '%ce%bd%ce%bf%ce%bc%ce%bf%ce%b8%ce%b5%cf%83%ce%b9%ce%b1-%ce%b4%ce%b9%ce%b1%cf%84%ce%b1%ce%b3%ce%b5%cf%82',
}
