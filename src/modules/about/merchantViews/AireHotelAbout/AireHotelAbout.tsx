// Relative Path: ./AireHotelAbout.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
import styles from './AireHotelAbout.scss';

const data = [
  { name: 'Jan', AireHotel: 4000, Airbnb: 2400, Vrbo: 2400 },
  { name: 'Feb', AireHotel: 3000, Airbnb: 1398, Vrbo: 2210 },
  { name: 'Mar', AireHotel: 2000, Airbnb: 9800, Vrbo: 2290 },
  { name: 'Apr', AireHotel: 2780, Airbnb: 3908, Vrbo: 2000 },
  { name: 'May', AireHotel: 1890, Airbnb: 4800, Vrbo: 2181 },
  { name: 'Jun', AireHotel: 2390, Airbnb: 3800, Vrbo: 2500 },
  { name: 'Jul', AireHotel: 3490, Airbnb: 4300, Vrbo: 2100 },
];

const competitionData = [
  { name: 'Airbnb', Shortcomings: 60 },
  { name: 'Vrbo', Shortcomings: 45 },
  { name: 'Others', Shortcomings: 30 },
];

const AireHotelAbout: React.FC = () => {
    return (
        <>
            <style jsx>{styles}</style>
            <div className='aire-hotel-about card padding'>
                <h1>AireHotel: Redefining Luxury Hospitality</h1>
                <h3>Unparalleled Luxury, Impeccable Service</h3>
                <p>
                    AireHotel is more than just a place to stay; it is a sanctuary of elegance and sophistication for the modern traveler. Our signature luxury hotel suites, bespoke transportation, and comprehensive travel services are meticulously designed to provide an unparalleled experience. Discover why AireHotel stands head and shoulders above the competition.
                </p>

                <div className='charts-container'>
                    <div className='chart'>
                        <h4>Monthly Booking Comparison</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="AireHotel" stroke="#8884d8" />
                                <Line type="monotone" dataKey="Airbnb" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="Vrbo" stroke="#ffc658" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className='chart'>
                        <h4>Revenue by Platform</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="AireHotel" fill="#8884d8" />
                                <Bar dataKey="Airbnb" fill="#82ca9d" />
                                <Bar dataKey="Vrbo" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <h3>The Shortcomings of Our Competition</h3>
                <p>
                    While our competitors like Airbnb and Vrbo have carved out significant market share, they often fall short in areas that matter most to discerning travelers. Common issues include inconsistent quality, lack of personalized services, and inadequate customer support. AireHotel addresses these shortcomings with our commitment to excellence in every aspect of your stay.
                </p>
                <div className='chart'>
                    <h4>Competition Shortcomings</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={competitionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Shortcomings" fill="#d84d4d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <h3>The AireHotel Member Experience</h3>
                <p>
                    As an AireHotel member, you gain access to a world of exclusive benefits and personalized services. From booking your suite to arranging travel through our network of private and first-class airlines, every detail is curated to ensure a seamless and luxurious experience.
                </p>
                <div className='member-experience'>
                    <h4>Travel with AireHotel</h4>
                    <p>
                        Our partnerships with premier airlines and private jet services guarantee that your journey is as luxurious as your stay. Experience unparalleled comfort and convenience, with personalized itineraries tailored to your preferences.
                    </p>
                </div>

                <h3>Revolutionizing Property Viewing with Our App and Webapp</h3>
                <p>
                    The AireHotel app and webapp, airehotel.com, offer a revolutionary way to explore our properties. Utilize our 3D globe feature to virtually visit any location, and experience intuitive navigation through our sleek, user-friendly interface. Whether you{`&apos;`}re booking a suite or exploring amenities, our digital platforms make it effortless.
                </p>
            </div>
        </>
    );
};

export default AireHotelAbout;
