import type { GetServerSideProps } from 'next';
import { getAllPosts } from '../lib/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/content', priority: '0.8', changefreq: 'weekly' },
  { path: '/friends', priority: '0.5', changefreq: 'monthly' },
];

function generateSitemap(posts: ReturnType<typeof getAllPosts>): string {
  const staticEntries = staticPages
    .map(
      (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n');

  const blogEntries = posts
    .map(
      (post) => `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${blogEntries}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = getAllPosts();
  const xml = generateSitemap(posts);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapPage() {
  return null;
}
