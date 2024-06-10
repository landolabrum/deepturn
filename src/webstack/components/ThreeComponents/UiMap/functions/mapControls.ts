export const flyToView = (
    map: any,
    props: { lngLat?: number[], zoom?: number, offset?: { x: number, y: number }, direction?: 'up' | 'down' | 'left' | 'right' }
) => {
    const { lngLat = [0, 0], zoom = 9, offset = { x: 0, y: 0 }, direction } = props;
    if (!map) return;

    let offsetLngLat = [...lngLat];

    // Calculate offset in map coordinates
    if (direction) {
        const canvas = map.getCanvas();
        const mapWidth = canvas.width;
        const mapHeight = canvas.height;
        let x = 0, y = 0;

        switch (direction) {
            case 'up':
                y = -offset.y;
                break;
            case 'down':
                y = offset.y;
                break;
            case 'left':
                x = -offset.x;
                break;
            case 'right':
                x = offset.x;
                break;
        }

        const point = map.project(lngLat);
        point.x += x;
        point.y += y;
        offsetLngLat = map.unproject(point).toArray();
    }

    map.flyTo({
        center: offsetLngLat,
        zoom: zoom,
        essential: true,
    });
};
