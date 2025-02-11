import { motion } from 'framer-motion';
import Hero from './Hero';
import FeaturedTrainers from './FeaturedTrainers';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Sekcija */}
      <Hero />

      {/* Istaknuti Treneri */}
      <FeaturedTrainers />
    </div>
  );
};

export default Home; 