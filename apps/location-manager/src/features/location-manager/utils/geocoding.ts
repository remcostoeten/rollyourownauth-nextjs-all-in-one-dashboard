interface GeocodingResult {
  latitude: number;
  longitude: number;
  error?: string;
}

export async function geocodeAddress(
  address: string,
  city: string,
  country: string
): Promise<GeocodingResult> {
  try {
    const query = encodeURIComponent(`${address}, ${city}, ${country}`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      {
        headers: {
          'User-Agent': 'LocationManager/1.0',
        },
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      return {
        latitude: 0,
        longitude: 0,
        error: 'Address not found',
      };
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      latitude: 0,
      longitude: 0,
      error: 'Failed to geocode address',
    };
  }
} 