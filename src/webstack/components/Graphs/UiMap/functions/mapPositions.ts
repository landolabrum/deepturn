export const flyToView = (map: any,
    props: { lngLat?: number[], zoom?: number }
) => {
    const { lngLat = [0, 0], zoom = 9 } = props;
    if (!map) return;
    map.flyTo({
        center: lngLat,
        zoom: zoom,
        essential: true,
    });
}