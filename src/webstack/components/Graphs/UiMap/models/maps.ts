


const maps = [
    {
        style: 'mapbox://styles/landolabrum/clvlv72k500np01rd1bb44jhc',
        zoom: 3,
        maxZoom: 15,
    },
    {
        style: 'mapbox://styles/landolabrum/clvm4pvfg01ai01rjhgw0by9z',
        zoom: 3,
        maxZoom: 15,
    },
    {
        "version": 8,
        "name": "Meteorites",
        "metadata": {
            "mapbox:origin": "basic-template-v1",
            "mapbox:autocomposite": true,
            "mapbox:type": "template",
            "mapbox:sdk-support": {
                "js": "0.45.0",
                "android": "6.0.0",
                "ios": "4.0.0"
            }
        },
        "center": [
            74.24426803763072,
            -2.2507114487818853
        ],
        "zoom": 0.6851443156248076,
        "bearing": 0,
        "pitch": 0,
        "sources": {
            "composite": {
                "url": "mapbox://mapbox.mapbox-streets-v8,examples.0fr72zt8",
                "type": "vector"
            }
        },
        "sprite": "mapbox://sprites/examples/cjikt35x83t1z2rnxpdmjs7y7",
        "glyphs": "mapbox://fonts/{username}/{fontstack}/{range}.pbf",
        "layers": [
            {
                "id": "background",
                "type": "background",
                "layout": {},
                "paint": {
                    "background-color": []
                }
            },
            // { ... }
        ],
        "created": "2015-10-30T22:18:31.111Z",
        "id": "cjikt35x83t1z2rnxpdmjs7y7",
        "modified": "2015-10-30T22:22:06.077Z",
        "owner": "examples",
        "visibility": "public",

    }
]
export default maps;