import React from "react";

const Biography = ({ imageUrl }) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>About FutZone</p>
          <h3>Who We Are</h3>
          <p>
            Welcome to FutZone, the ultimate futsal booking and management platform! 
            We connect players, teams, and futsal venues in one seamless experience, making it easier than ever to book courts, manage tournaments, and track game stats.
          </p>
          <p>
          Your Futsal, Your Way! Whether you're a casual player looking for a quick match or a team planning a league, FutZone simplifies everything. 
            Book courts instantly, track live schedules, and manage payments effortlessly.
          </p>
          <p>
          Building the Future of Futsal. We're passionate about revolutionizing futsal with modern technology. Join the Game, Anytime, Anywhere! Play, compete, and experience the future of futsal with FutZone.  
            Book your next game now and be part of a growing community that lives and breathes the sport!  
          </p>
        </div>
      </div>
    </>
  );
};

export default Biography;
