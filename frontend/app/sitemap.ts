import type { MetadataRoute } from 'next';

const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/home', '/feed', '/matches', '/chat', '/profile', '/settings', '/onboarding'];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
