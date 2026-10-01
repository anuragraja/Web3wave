import { HomePageClient } from '@/components/HomePageClient'
import { getPublicEventsApi } from '@/src/api/events'
import { mapBackendEventToLumaEvent } from '@/src/utils/eventUtils'
import { LumaEvent } from '@/components/LumaEventGrid'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let initialEvents: LumaEvent[] = []

  try {
    const res = await getPublicEventsApi()
    if (res.success && Array.isArray(res.data)) {
      initialEvents = res.data
        .map(mapBackendEventToLumaEvent)
        .filter((e) => !e.status || e.status === 'PUBLISHED')
    }
  } catch {
    initialEvents = []
  }

  return <HomePageClient initialEvents={initialEvents} />
}
