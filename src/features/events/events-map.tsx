import { useMemo, useState } from 'react'
import type { TechEvent } from '@/features/events/get-events'
import { Badge } from '@/components/ui/badge'
import {
  Map,
  MapClusterLayer,
  MapControls,
  MapPopup,
} from '@/components/ui/map'
import { formatDate } from '@/features/blog/schemas'

type EventProperties = {
  slug: string
  name: string
  city: string
  date: string | Date
  participationType: string
  talkTitle?: string
  url?: string
}

interface EventsMapProps {
  events: Array<TechEvent>
}

export function EventsMap({ events }: EventsMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<{
    coordinates: [number, number]
    properties: EventProperties
  } | null>(null)

  const geojson = useMemo(
    (): GeoJSON.FeatureCollection<GeoJSON.Point, EventProperties> => ({
      type: 'FeatureCollection',
      features: events.map((event) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [event.longitude, event.latitude],
        },
        properties: {
          slug: event.slug,
          name: event.name,
          city: event.city,
          date: event.date,
          participationType: event.participationType,
          talkTitle: event.talkTitle,
          url: event.url,
        },
      })),
    }),
    [events],
  )

  return (
    <div className="h-[350px] w-full overflow-hidden rounded-lg border border-border sm:h-[500px]">
      <Map center={[2.3522, 46.6]} zoom={4}>
        <MapControls position="bottom-right" showZoom showCompass />
        <MapClusterLayer<EventProperties>
          data={geojson}
          clusterRadius={50}
          clusterMaxZoom={14}
          clusterColors={[
            'hsl(153, 52%, 43%)',
            'hsl(163, 42%, 50%)',
            'hsl(144, 45%, 46%)',
          ]}
          pointColor="hsl(153, 52%, 43%)"
          onPointClick={(feature, coordinates) => {
            setSelectedEvent({ coordinates, properties: feature.properties })
          }}
        />
        {selectedEvent && (
          <MapPopup
            longitude={selectedEvent.coordinates[0]}
            latitude={selectedEvent.coordinates[1]}
            onClose={() => setSelectedEvent(null)}
            className="w-56"
            closeButton
          >
            <div className="space-y-2">
              <h3 className="font-semibold">{selectedEvent.properties.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedEvent.properties.city}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(selectedEvent.properties.date)}
              </p>
              <Badge variant="secondary" className="text-xs">
                {selectedEvent.properties.participationType}
              </Badge>
              {selectedEvent.properties.talkTitle && (
                <p className="text-sm italic">
                  Talk: {selectedEvent.properties.talkTitle}
                </p>
              )}
              {selectedEvent.properties.url && (
                <a
                  href={selectedEvent.properties.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline"
                >
                  Event website
                </a>
              )}
            </div>
          </MapPopup>
        )}
      </Map>
    </div>
  )
}
