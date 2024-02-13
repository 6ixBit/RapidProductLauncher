import HeroSection2 from './HeroSection2';
import AllFeatures from './AllFeatures';
import CTA from './CTA';
import Footer from './Footer';
import MainFeatures from './MainFeatures';
import Testimonials from './Testimonials';
import TrustedCompanies from './TrustedCompanies';

export const LandingPage2 = () => {
  return (
    <>
      <HeroSection2
        title="lorem ipsum dolor onsectetur elit"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at"
        image="/mockups/office.jpeg"
      />
      <TrustedCompanies />
      <AllFeatures />
      <MainFeatures />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
};
