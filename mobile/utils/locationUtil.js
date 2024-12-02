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
  