interface MapConfig {
    style: string;
    zoom: number;
    maxZoom: number;
    center?: [number, number];
    bearing?: number;
    pitch?: number;
    sources?: Record<string, any>;
    sprite?: string;
    glyphs?: string;
    layers?: any[];
    created?: string;
    id?: string;
    modified?: string;
    owner?: string;
    visibility?: string;
}

const maps: MapConfig[] = [
    {
        style: 'mapbox://styles/mapbox/streets-v11', // Ensure this is a valid style
        center: [-73.5804, 45.53483],
        // pitch: 60,
        // bearing: -60,
        maxZoom: 15,
        zoom: 10
    }
    ,
    {
        style: 'mapbox://styles/landolabrum/clvrhndee01i201q17eq2evf1',
        zoom: 0,
        maxZoom: 15,
    },
    {
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-73.5804, 45.53483],
        pitch: 60,
        bearing: -60,
        zoom: 10,
        maxZoom: 15,
    },
    {
        style: 'mapbox://styles/landolabrum/clvlv72k500np01rd1bb44jhc',
        zoom: 3,
        maxZoom: 15,
    },
    {
        style: 'mapbox://styles/landolabrum/clvr7x3f401hh01rj637z5hpz', // Example style, replace with your own
        zoom: 0.6851443156248076,
        maxZoom: 15,
        center: [74.24426803763072, -2.2507114487818853],
        bearing: 0,
        pitch: 0,
        sources: {
            composite: {
                url: 'mapbox://mapbox.mapbox-streets-v8,examples.0fr72zt8',
                type: 'vector'
            }
        },
        sprite: 'mapbox://sprites/examples/cjikt35x83t1z2rnxpdmjs7y7',
        glyphs: 'mapbox://fonts/{username}/{fontstack}/{range}.pbf',
        layers: [
            {
                id: 'background',
                type: 'background',
                layout: {},
                paint: {
                    'background-color': []
                }
            },
            // Add other layers as needed
        ],
        created: '2015-10-30T22:18:31.111Z',
        id: 'cjikt35x83t1z2rnxpdmjs7y7',
        modified: '2015-10-30T22:22:06.077Z',
        owner: 'examples',
        visibility: 'public',
    }
];

export default maps;
