import { useMemo, useState } from 'react'
import type { TechEvent } from '@/features/events/get-events'
import {
  Map,
  MapClusterLayer,
  MapControls,
  MapPopup,
} from '@/components/ui/map'
import { EventCard } from '@/features/events/event-card'

type LocationProperties = {
  key: string
  longitude: number
  latitude: number
}

interface EventsMapProps {
  events: Array<TechEvent>
}

export function EventsMap({ events }: EventsMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    coordinates: [number, number]
    events: Array<TechEvent>
  } | null>(null)

  const eventsByLocation = useMemo(() => {
    const groups: Record<string, Array<TechEvent>> = {}
    for (const event of events) {
      const key = `${event.latitude},${event.longitude}`
      ;(groups[key] ??= []).push(event)
    }
    return groups
  }, [events])

  const geojson = useMemo(
    (): GeoJSON.FeatureCollection<GeoJSON.Point, LocationProperties> => ({
      type: 'FeatureCollection',
      features: Object.entries(eventsByLocation).map(([key, group]) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [group[0].longitude, group[0].latitude],
        },
        properties: {
          key,
          longitude: group[0].longitude,
          latitude: group[0].latitude,
        },
      })),
    }),
    [eventsByLocation],
  )

  return (
    <div className="h-[350px] w-full overflow-hidden rounded-lg border border-border sm:h-[500px]">
      <Map center={[2.3522, 46.6]} zoom={4}>
        <MapControls position="bottom-right" showZoom showCompass />
        <MapClusterLayer<LocationProperties>
          data={geojson}
          clusterRadius={50}
          clusterMaxZoom={14}
          clusterColors={[
            'hsl(153, 52%, 43%)',
            'hsl(163, 42%, 50%)',
            'hsl(144, 45%, 46%)',
          ]}
          pointColor="hsl(153, 52%, 43%)"
          onPointClick={(feature) => {
            const key = feature.properties.key
            const group = eventsByLocation[key]
            setSelectedLocation({
              coordinates: [
                feature.properties.longitude,
                feature.properties.latitude,
              ],
              events: group,
            })
          }}
        />
        {selectedLocation && (
          <MapPopup
            longitude={selectedLocation.coordinates[0]}
            latitude={selectedLocation.coordinates[1]}
            onClose={() => setSelectedLocation(null)}
            className="w-64 p-0!"
            closeButton
          >
            <div className="divide-y divide-border">
              {selectedLocation.events.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </MapPopup>
        )}
      </Map>
    </div>
  )
}
