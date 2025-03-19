import axios from "axios";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Location = () => {
    const [locations, setlocations] = useState([]);
    useEffect(()=> {
        const fetchCourts= async ()=>{
            try {
                const response = await axios.get("http://localhost:4000/api/courts/all")
                setlocations(response.data.courts);
            }catch(error){
                console.error("Error fetching court data:", error);
            }
        };
        fetchCourts();
    }, []);

    const responsive = {
        extraLarge: {
            breakpoint: { max: 3000, min: 1324 },
            items: 4,
            slidesToSlide: 1,
        },
        large: {
            breakpoint: { max: 1324, min: 1005 },
            items: 3,
            slidesToSlide: 1,
        },
        medium: {
            breakpoint: { max: 1005, min: 700 },
            items: 2,
            slidesToSlide: 1,
        },
        small: {
            breakpoint: { max: 700, min: 0 },
            items: 1,
            slidesToSlide: 1,
        },
    };

    return (
        <>
            <div className="container location">
                <h2>Futsal Locations</h2>
                <Carousel
                    responsive={responsive}
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                >
                    {locations.length >0 ? (
                        locations.map((location, index) => (
                        <div key={index} className="card">
                            <div
                                className="location-name"
                            >
                                {location.name}
                            </div>
                            <img src={location.courtAvatar.url} alt="location" />
                        </div>
                    ))
                ):(
                    <div>No Courts available.</div>
                )}
                </Carousel>
            </div>
        </>
    );
};

export default Location;
