import React from "react";
import Biography from "../../components/Biography";
import Hero from "../../components/Hero";
const About = () => {
  return (
    <>
      <Hero
        title={"Learn More About Us | ZeeCare Medical Institute"}
        imageUrl={"/football.png"}
      />
      <Biography imageUrl={"/about.png"} />
    </>
  );
};

export default About;