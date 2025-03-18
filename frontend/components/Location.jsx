import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Location = () => {
    const locationArray = [
        {
            name: "Kathmandu Futsal",
            imageUrl: "https://tse3.mm.bing.net/th?id=OIP.dfsu2Y6j9mlrUpJMp4j4gAHaFj&pid=Api",
        },
        {
            name: "Dhobighat Futsal",
            imageUrl: "https://tse1.mm.bing.net/th?id=OIP.yAW1Fn-A85opztBuCoDqWAHaE8&pid=Api",
        },
        {
            name: "Chabahil Futsal",
            imageUrl: "https://tse1.mm.bing.net/th?id=OIP.Zzjof88hpzzt0iY7p9OHyAHaDY&pid=Api",
        },
        {
            name: "Baneswor Futsal",
            imageUrl: "https://tse2.mm.bing.net/th?id=OIP.0YdOJvnrQ_jbWq4O1CLcFgHaE8&pid=Api",
        },
        {
            name: "Bhaktapur Futsal",
            imageUrl: "https://tse1.mm.bing.net/th?id=OIP.Zzjof88hpzzt0iY7p9OHyAHaDY&pid=Api",
        },
        {
            name: "Lalitpur Futsal",
            imageUrl: "https://tse3.mm.bing.net/th?id=OIP.dfsu2Y6j9mlrUpJMp4j4gAHaFj&pid=Api",
        }
    ];

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
                    {locationArray.map((location, index) => (
                        <div key={index} className="card">
                            <div
                                className="location-name"
                            >
                                {location.name}
                            </div>
                            <img src={location.imageUrl} alt="location" />
                        </div>
                    ))}
                </Carousel>
            </div>
        </>
    );
};

export default Location;
