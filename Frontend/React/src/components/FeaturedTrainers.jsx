import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Custom styles for Swiper
const swiperStyles = {
  '.featured-trainers-slider .swiper-pagination-bullet': {
    background: 'rgba(255, 255, 255, 0.2)',
    opacity: 1,
  },
  '.featured-trainers-slider .swiper-pagination-bullet-active': {
    background: '#4F46E5',
  },
  '.featured-trainers-slider .swiper-button-next, .featured-trainers-slider .swiper-button-prev': {
    color: '#4F46E5',
  },
  '.featured-trainers-slider .swiper-button-disabled': {
    opacity: 0.3,
  },
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const FeaturedTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await api.get('/featured-trainers');
        setTrainers(response.data.trainers);
        setError(null);
      } catch (error) {
        console.error('Error fetching trainers:', error);
        setError('Nije moguće učitati trenere trenutno.');
        setTrainers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const getDefaultImage = () => {
    return `${import.meta.env.VITE_API_URL}/images/default-profile.png`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-white/60 text-center">
          <p>{error}</p>
          <Link to="/login" className="text-[#4F46E5] hover:underline mt-2 inline-block">
            Prijavi se
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Istaknuti Treneri
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-2xl mx-auto"
          >
            Upoznajte naše sertifikovane trenere koji će vam pomoći da dostignete svoje fitness ciljeve
          </motion.p>
        </div>

        {/* Trainers Slider */}
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="featured-trainers-slider !pb-12"
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {trainers.map((trainer) => (
            <SwiperSlide key={trainer.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl group hover:shadow-[#4F46E5]/20 transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src={trainer.cover_image_url}
                    alt={`${trainer.name}'s cover`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
                </div>

                {/* Profile Image */}
                <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#1A1A1A] shadow-xl">
                      <img
                        src={trainer.profile_image_url}
                        alt={trainer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full ring-2 ring-[#4F46E5]/20 ring-offset-2 ring-offset-[#1A1A1A]" />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-16 p-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    {trainer.name}
                  </h3>
                  
                  {/* Specializations */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {trainer.trainer_details?.specializations?.split(',').slice(0, 3).map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-sm font-medium"
                      >
                        {spec.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Bio Preview */}
                  <p className="text-white/60 text-sm line-clamp-3 mb-6">
                    {trainer.trainer_details?.bio || 'Bio nije unet'}
                  </p>

                  {/* View Profile Button */}
                  <Link
                    to={`/trainer/${trainer.id}`}
                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-medium transition-all duration-300 group"
                  >
                    <span>Pogledaj Profil</span>
                    <svg 
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Apply custom styles */}
      <style>
        {Object.entries(swiperStyles)
          .map(([selector, styles]) => 
            `${selector} { ${Object.entries(styles)
              .map(([property, value]) => `${property}: ${value}`)
              .join('; ')} }`
          )
          .join('\n')}
      </style>
    </section>
  );
};

export default FeaturedTrainers; 