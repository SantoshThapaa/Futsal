import React from 'react'

const Hero = ({ title, imageUrl, width = "500px", height = "700px" }) => {
    return (
        <div className='hero container'>
            <div className="banner">
                <h1>{title}</h1>
                <p>Book futsal courts instantly, manage your team, join tournaments, and track scores all in one place! Real time availability, easy payments, and hassle free scheduling make your futsal experience smooth and exciting. Ready to play? Let’s kick off!</p>
            </div>
            <div className="banner">
                <img src={imageUrl} alt="hero" className="animated-image" style={{ width, height, objectFit: "contain" }}/>
                <span>
                    <img src="/Vector.png" alt="vector" />
                </span>
            </div>
        </div>

    )
}

export default Hero