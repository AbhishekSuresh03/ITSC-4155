export const smoothCoordinates = (coordinates) => {
    if (coordinates.length < 3) return coordinates;
  
    const smoothed = [];
    for (let i = 1; i < coordinates.length - 1; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];
      const next = coordinates[i + 1];
  
      // Average latitude and longitude
      const avgLat = (prev.latitude + curr.latitude + next.latitude) / 3;
      const avgLon = (prev.longitude + curr.longitude + next.longitude) / 3;
  
      smoothed.push({ latitude: avgLat, longitude: avgLon });
    }
  
    return smoothed;
};

export const calculateDistance = (loc1, loc2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 3958.8; // Earth's radius in miles

  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.latitude)) *
      Math.cos(toRad(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
};
  