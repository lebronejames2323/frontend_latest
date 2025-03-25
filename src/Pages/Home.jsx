import withAuth from "../high-order-component/withAuth";
import Header from "../sections/Header";
import Hero from "../sections/Hero";
import Category from "../sections/Category";
import Types from "../sections/Types";
import Services from "../sections/Services";
import Productsgrid from "../sections/Productsgrid";
import Banner from "../sections/Banner";
import Reviews from "../sections/Reviews";
import Insta from "../sections/Insta";
import Footer from "../sections/Footer";

function Home() {

    return (
    <>
    <Header />
    <Hero />
    <Category />
    <Types />
    <Services />
    <Productsgrid />
    <Banner />
    <Insta />
    <Footer />
    </>
    );
}

export default withAuth(Home);
