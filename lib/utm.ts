export type UTMParams = {
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmTerm?: string | null
  utmContent?: string | null
}

export function extractUTMParams(searchParams: URLSearchParams): UTMParams {
  return {
    utmSource: searchParams.get('utm_source'),
    utmMedium: searchParams.get('utm_medium'),
    utmCampaign: searchParams.get('utm_campaign'),
    utmTerm: searchParams.get('utm_term'),
    utmContent: searchParams.get('utm_content'),
  }
}

export function getDeviceType(userAgent?: string | null): string {
  if (!userAgent) return 'unknown'

  const ua = userAgent.toLowerCase()

  if (/tablet|ipad/.test(ua)) return 'tablet'
  if (/mobi|android|iphone/.test(ua)) return 'mobile'

  return 'desktop'
}
