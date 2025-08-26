import React, { useEffect } from "react";
import Hero from "./Hero";
import Cards from "./Cards";
import Loyalty from "./Loyalty";
import Footer from "./Footer";
import SEOManager from "../../utils/SEOManager";

function HomePage() {
    useEffect(() => {
        // Set SEO for homepage without affecting functionality
        SEOManager.setPageSEO(
            "RS Express - Online Bus Booking Sri Lanka | Book Your Journey",
            "Book comfortable bus tickets online with RS Express. Reliable bus service across Sri Lanka with instant booking, secure payments, and excellent customer service.",
            "rs express, bus booking sri lanka, online bus tickets, sri lankan transport, intercity bus, comfortable bus travel",
            "https://rsexpress.lk/"
        );
    }, []);

    return (
      <>
        <Hero />
        <Cards />
        <Loyalty />
        <Footer />
      </>
    );
  }

export default HomePage;