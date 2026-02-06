import type {
  ParticipationType,
  TechEvent,
} from '@/features/events/events-data'
import { Badge } from '@/components/ui/badge'
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from '@/components/ui/map'
import { formatDate } from '@/features/blog/schemas'

const MARKER_COLORS: Record<ParticipationType, string> = {
  attended: 'bg-chart-1',
  spoke: 'bg-chart-2',
  organized: 'bg-chart-3',
  volunteered: 'bg-chart-4',
  mentored: 'bg-chart-5',
}

interface EventsMapProps {
  events: Array<TechEvent>
}

export function EventsMap({ events }: EventsMapProps) {
  return (
    <div className="h-[350px] w-full overflow-hidden rounded-lg border border-border sm:h-[500px]">
      <Map center={[2.3522, 46.6]} zoom={4}>
        <MapControls position="bottom-right" showZoom showCompass />
        {events.map((event) => (
          <MapMarker
            key={event.id}
            longitude={event.location.longitude}
            latitude={event.location.latitude}
          >
            <MarkerContent>
              <div
                className={`size-3 rounded-full ${MARKER_COLORS[event.participationType]} ring-2 ring-background`}
              />
            </MarkerContent>
            <MarkerTooltip>{event.name}</MarkerTooltip>
            <MarkerPopup className="w-64">
              <div className="space-y-2 p-1">
                <h3 className="font-semibold">{event.name}</h3>
                <p className="text-sm text-muted-foreground">{event.city}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(event.date)}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {event.participationType}
                </Badge>
                {event.talkTitle && (
                  <p className="text-sm italic">Talk: {event.talkTitle}</p>
                )}
                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    Event website
                  </a>
                )}
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  )
}
