export function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    let formattedTime = '';
    if (hours > 0) {
      formattedTime += `${hours}h `;
    }
    if (minutes > 0) {
      formattedTime += `${minutes}m `;
    }
    if (remainingSeconds > 0 || formattedTime === '') {
      formattedTime += `${remainingSeconds}s`;
    }
  
    return formattedTime.trim();
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

export function formatPace(pace) { //NOT SURE IF THIS IS RIGHT, SOMEONE ELSE CAN VERIFY THIS
    const totalMinutes = pace / 60;
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
  
    return `${minutes}m ${seconds}s per mile`;
  }