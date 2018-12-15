export function formatTravelTime(time: number): string {
    const hours = String(Math.floor(time / 60)) ;
    const minutes = String(time % 60);
    return `${hours}ч ${minutes}м`;
}
