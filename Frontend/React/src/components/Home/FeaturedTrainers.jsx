import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const TrainerCard = ({ trainer }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[500px] rounded-2xl overflow-hidden group relative bg-white/[0.02] shadow-lg"
    >
      {/* Image Container */}
      <div className="relative h-[280px] overflow-hidden">
        <img
          src={trainer.profile_image_url}
          alt={trainer.name}
          loading="eager"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transform transition-all duration-500 
            ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
            group-hover:scale-110`}
        />
      </div>

      {/* Content Container */}
      <div className="relative p-6 flex flex-col h-[220px]">
        {/* Name and Specializations */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 truncate">
            {trainer.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {trainer.trainer_details?.specializations?.split(',')
              .slice(0, 2)
              .map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400"
                >
                  {spec.trim()}
                </span>
              ))}
          </div>
        </div>

        {/* Bio */}
        <p className="text-white/60 text-sm line-clamp-2 mb-4 flex-grow">
          {trainer.trainer_details?.bio || 'Bio nije unet'}
        </p>

        {/* Button */}
        <Link
          to={`/trainer/${trainer.id}`}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl 
            bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium 
            transform transition-all duration-300 hover:from-indigo-500 hover:to-indigo-600
            hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
        >
          <span>Pogledaj Profil</span>
          <svg
            className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

const FeaturedTrainers = () => {
  const [trainers, setTrainers] = useState([]);
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
      }
    };

    fetchTrainers();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-400 text-center">
          <p>{error}</p>
          <Link to="/login" className="text-indigo-500 hover:text-indigo-400 mt-2 inline-block">
            Prijavi se
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
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
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          watchSlidesProgress={true}
          className="!pb-14"
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
        >
          <AnimatePresence>
            {trainers.map((trainer, index) => (
              <SwiperSlide key={trainer.id}>
                <TrainerCard trainer={trainer} />
              </SwiperSlide>
            ))}
          </AnimatePresence>
        </Swiper>
      </div>

      <style>{`
        .swiper-pagination {
          position: relative;
          bottom: 0 !important;
          margin-top: 2rem;
        }

        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.2);
          opacity: 1;
          width: 10px;
          height: 10px;
          margin: 0 6px !important;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active {
          background: #4F46E5;
          transform: scale(1.3);
          width: 12px;
          height: 12px;
        }
      `}</style>
    </section>
  );
};

export default FeaturedTrainers; 