import React from 'react';
import Hero from '../../components/Hero';
import Biography from '../../components/Biography';
import Location from '../../components/Location';
import MessageForm from '../../components/MessageForm';

const Home = () => {
    return (
        <>
            <Hero title={"Welcome to FutZone Website | Your ultimate futsal booking hub!"} imageUrl={"/football.png"} />
            <Biography />
            <Location />
            <MessageForm />
        </>
    )
}

export default Home