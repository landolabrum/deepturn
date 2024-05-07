const mapVessels = [
    {
        "listingId": "12345",
        "title": "Cozy Cottage by the Lake",
        "description": "Enjoy a relaxing stay at our cozy lakefront cottage. Perfect for weekend getaways and family vacations.",
        "location": {
            lat: 20,
            lon: 20,
            "address": "123 Lakeview Drive, Lakeside, FL 32034",
            "city": "Lakeside",
            "state": "Florida",
            "country": "USA",
            "coordinates": {
                "latitude": 37.7749,
                "longitude": -122.4194
            }
        },
        "host": {
            "hostId": "98765",
            "name": "John Doe",
            "contact": {
                "email": "john.doe@example.com",
                "phone": "+1234567890"
            },
            "superhost": true
        },
        "propertyDetails": {
            "type": "Cottage",
            "guests": 4,
            "bedrooms": 2,
            "beds": 3,
            "bathrooms": 1.5
        },
        "amenities": {
            "essentials": ["Wi-Fi", "TV", "Heating", "Air Conditioning"],
            "safetyFeatures": ["Smoke Detector", "Carbon Monoxide Detector", "First Aid Kit"],
            "kitchen": ["Refrigerator", "Microwave", "Dishwasher", "Coffee Maker"],
            "parking": {
                "available": true,
                "type": "On-site parking"
            },
            "extras": ["Pool", "Hot Tub", "Gym"]
        },
        "availability": {
            "minimumStay": 2,
            "maximumStay": 30,
            "checkIn": "3:00 PM",
            "checkOut": "11:00 AM",
            "bookingWindow": {
                "start": "2024-01-01",
                "end": "2024-12-31"
            }
        },
        "pricing": {
            "basePricePerNight": 150.00,
            "cleaningFee": 50.00,
            "extraGuests": {
                "allowed": true,
                "fee": 20.00,
                "maxGuests": 6
            },
            "discounts": {
                "weekly": 10,
                "monthly": 20
            }
        },
        "ratings": {
            "overall": 4.8,
            "accuracy": 4.9,
            "cleanliness": 4.7,
            "checkIn": 4.9,
            "communication": 4.9,
            "location": 4.8,
            "value": 4.8
        },
        "reviews": [
            {
                "reviewId": "abc123",
                "author": "Jane Smith",
                "date": "2024-04-22",
                "rating": 5,
                "text": "Had a wonderful stay at the cottage! The view was fantastic and the host was very accommodating. Will definitely come back."
            },
            {
                "reviewId": "def456",
                "author": "Mike Johnson",
                "date": "2024-03-18",
                "rating": 4.5,
                "text": "Great place but the road to get there was a bit rough. Everything else was perfect!"
            }
        ],
        "images": [
            {
                "url": "https://example.com/images/listing1.jpg",
                "description": "Front view of the cottage"
            },
            {
                "url": "https://example.com/images/listing2.jpg",
                "description": "Living room"
            }
        ],
        "houseRules": {
            "petsAllowed": false,
            "smokingAllowed": false,
            "partiesAllowed": false,
            "additionalRules": "Please respect the property and the neighbors. Quiet hours from 10 PM to 7 AM."
        }
    }
]
export default mapVessels;