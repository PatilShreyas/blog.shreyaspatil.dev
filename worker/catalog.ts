export interface LinkRelation {
  href: string;
  type?: string;
}

export interface ApiCatalogEntry {
  anchor: string;
  "service-desc"?: LinkRelation[];
  "service-doc"?: LinkRelation[];
  status?: LinkRelation[];
  [key: string]: unknown;
}

export interface ApiCatalogDocument {
  linkset: ApiCatalogEntry[];
}

export function getApiCatalog(baseUrl: string): ApiCatalogDocument {
  const base = baseUrl.replace(/\/$/, "");
  return {
    linkset: [
      {
        anchor: `${base}/posts`,
        "service-desc": [
          {
            href: `${base}/openapi.json`,
            type: "application/vnd.oai.openapi+json",
          },
        ],
        "service-doc": [
          {
            href: `${base}/about`,
            type: "text/html",
          },
        ],
        status: [
          {
            href: `${base}/api/health`,
            type: "application/json",
          },
        ],
      },
      {
        anchor: `${base}/rss.xml`,
        "service-desc": [
          {
            href: `${base}/openapi.json`,
            type: "application/vnd.oai.openapi+json",
          },
        ],
        "service-doc": [
          {
            href: `${base}/about`,
            type: "text/html",
          },
        ],
        status: [
          {
            href: `${base}/api/health`,
            type: "application/json",
          },
        ],
      },
    ],
  };
}
