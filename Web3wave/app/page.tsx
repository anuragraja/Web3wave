import { HomePageClient } from '@/components/HomePageClient'
import { getPublicEventsApi } from '@/src/api/events'
import { mapBackendEventToLumaEvent } from '@/src/utils/eventUtils'
import { LumaEvent } from '@/components/LumaEventGrid'

export const revalidate = 60 // Server-side revalidation every 60 seconds

export default async function Home() {
  let initialEvents: LumaEvent[] = []

  try {
    const res = await getPublicEventsApi()
    if (res.success && Array.isArray(res.data)) {
      initialEvents = res.data.map(mapBackendEventToLumaEvent)
    }
  } catch {
    initialEvents = []
  }

  return <HomePageClient initialEvents={initialEvents} />
}
