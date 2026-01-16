import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://infinitygamecenter.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
