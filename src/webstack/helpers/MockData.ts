export function mockDateTime(isTime=false) {
    const now = new Date();
    if (isTime) {
        // Return the time in HH:MM format
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    } else {
        // Return the date in Month-YY format
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let month = months[now.getMonth()];
        let year = now.getFullYear().toString().substr(-2);
        return `${month}-${year}`;
    }
}