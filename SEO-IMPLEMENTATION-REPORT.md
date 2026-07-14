# SEO implementation report — Marc in Mind Technologies

Updated: 2026-07-14

## Implemented on the website

- 59 high-intent Coimbatore keyword targets mapped across focused pages
- Unique title, description, canonical and one primary H1 per page
- LocalBusiness / ProfessionalService, WebSite, WebPage, Service and Breadcrumb JSON-LD
- FAQ content and FAQPage JSON-LD on the home, services, contact and nine service pages
- Instagram identity link in `sameAs`, `<link rel="me">`, footer and contact page
- Open Graph metadata for Facebook/social sharing, including locale and image alternative text
- Twitter card metadata
- Local NAP details and Google Business Profile link
- Natural local-intent content on every dedicated service page
- Internal service linking, sitemap, robots.txt and responsive semantic HTML
- Lazy loading and async decoding for the client logo grid

## Important

The keyword targets are selected for commercial/local intent. Exact monthly search volume and competition must be checked in Google Keyword Planner and then refined using Google Search Console after the site collects impressions.

A `meta keywords` tag is intentionally not used. Modern Google web ranking ignores it; keywords are implemented through page topics, titles, headings, body content, internal links and intent-focused landing pages instead.

FAQ markup is retained as machine-readable structured data and is matched to visible FAQ content. Google removed the FAQ rich-result display in 2026, so it should not be presented as a guaranteed search-result enhancement.

## Launch actions

1. Upload the full folder without changing filenames.
2. Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
3. Inspect the homepage and all service URLs in Search Console.
4. Validate JSON-LD with Schema Markup Validator and Google's Rich Results Test where supported.
5. Confirm the Google Business Profile NAP exactly matches: 4/224 A, KS Garden, Sengathurai, Sulur, Coimbatore, Tamil Nadu 641401.
6. Add the exact Facebook profile URL later to the footer and LocalBusiness `sameAs` array.
7. Connect GA4 and Google Search Console; review queries after 28–60 days.
8. Replace placeholder client logos with approved compressed PNG/WebP assets and accurate alt text.
9. Publish verified case studies, testimonials and results; do not add invented ratings or review schema.
