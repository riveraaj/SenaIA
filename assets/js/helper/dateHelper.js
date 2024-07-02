/**
 * Calculates the elapsed time from a given timestamp to the current time.
 * @param {Date} timestamp - The timestamp to compare with the current time.
 * @returns {string} - A human-readable string representing the elapsed time.
 */
function getElapsedTime(timestamp) {
    const now = new Date();
    const difference = now.getTime() - new Date(timestamp).getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `Hace ${days} día(s)`;
    } else if (hours > 0) {
        return `Hace ${hours} hora(s)`;
    } else if (minutes > 0) {
        return `Hace ${minutes} minuto(s)`;
    } else {
        return `Hace ${seconds} segundo(s)`;
    }
}

/**
 * Updates the text content of all footer elements with the elapsed time from their timestamp.
 */
export function updateElapsedTime() {
    const footers = document.querySelectorAll('footer[data-timestamp]');

    footers.forEach(footer => {
        const timestamp = footer.getAttribute('data-timestamp');
        footer.textContent = getElapsedTime(timestamp);
    });
}