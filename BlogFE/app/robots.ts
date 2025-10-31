import { MetadataRoute } from 'next'
import { CONFIG_ENV } from '@/constants/config.env'

export default function robots(): MetadataRoute.Robots {
  const feUrl = CONFIG_ENV.FE_URL

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',

        disallow: ['/login', '/register', '/dashboard/', '/_next/']
      }
    ],

    sitemap: `${feUrl}/sitemap.xml`
  }
}
