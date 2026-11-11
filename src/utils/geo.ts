import type { Property } from '../types';

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Approximate city-centre coordinates used as a fallback for listings that
 * were created without an exact map pin.
 */
export const CITY_COORDINATES: Record<string, Coordinates> = {
  kozhikode: { lat: 11.2588, lng: 75.7804 },
  calicut: { lat: 11.2588, lng: 75.7804 },
  ramanattukara: { lat: 11.1738, lng: 75.8647 },
  feroke: { lat: 11.1895, lng: 75.8361 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  ernakulam: { lat: 9.9312, lng: 76.2673 },
  kakkanad: { lat: 10.0159, lng: 76.3419 },
  malappuram: { lat: 11.0732, lng: 76.074 },
  tirur: { lat: 10.9167, lng: 75.9234 },
  kottakkal: { lat: 11.0, lng: 76.0 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  kannur: { lat: 11.8745, lng: 75.3704 },
  thrissur: { lat: 10.5276, lng: 76.2144 },
  kollam: { lat: 8.8932, lng: 76.6141 },
  trivandrum: { lat: 8.5241, lng: 76.9366 },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
};

/** Resolve the best available coordinates for a property. */
export function resolvePropertyCoordinates(
  property: Pick<Property, 'mapCoordinates' | 'city' | 'district'>
): Coordinates | null {
  if (property.mapCoordinates) {
    return property.mapCoordinates;
  }

  const cityKey = property.city?.trim().toLowerCase();
  if (cityKey && CITY_COORDINATES[cityKey]) {
    return CITY_COORDINATES[cityKey];
  }

  const districtKey = property.district?.trim().toLowerCase();
  if (districtKey && CITY_COORDINATES[districtKey]) {
    return CITY_COORDINATES[districtKey];
  }

  return null;
}

/** Great-circle distance between two points in kilometres. */
export function haversineDistanceKm(from: Coordinates, to: Coordinates): number {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const latDelta = toRadians(to.lat - from.lat);
  const lngDelta = toRadians(to.lng - from.lng);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(lngDelta / 2) *
      Math.sin(lngDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Human-friendly distance label, e.g. "450 m", "2.4 km", "18 km". */
export function formatDistance(distanceKm: number): string {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) return '';

  if (distanceKm < 1) {
    const metres = Math.max(10, Math.round((distanceKm * 1000) / 10) * 10);
    return `${metres} m`;
  }

  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }

  return `${Math.round(distanceKm)} km`;
}

/** Find the closest known city to a set of coordinates. */
export function findNearestCity(coords: Coordinates): string | null {
  let nearest: { city: string; distance: number } | null = null;

  for (const [city, cityCoords] of Object.entries(CITY_COORDINATES)) {
    const distance = haversineDistanceKm(coords, cityCoords);
    if (!nearest || distance < nearest.distance) {
      nearest = { city, distance };
    }
  }

  if (!nearest) return null;

  return nearest.city.charAt(0).toUpperCase() + nearest.city.slice(1);
}

/**
 * Promise wrapper around the browser geolocation API with friendly errors.
 */
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('Location services are not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? 'Location permission was denied. Allow location access and try again.'
            : error.code === error.POSITION_UNAVAILABLE
              ? 'Your location is currently unavailable. Please try again.'
              : error.code === error.TIMEOUT
                ? 'Locating you took too long. Please try again.'
                : 'Unable to access your location.';
        reject(new Error(message));
      },
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  });
}
