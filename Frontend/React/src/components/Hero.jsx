import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroBackground from '../assets/images/gym.jpg';

const Hero = () => {
  return (
    <div className="relative min-h-[100vh] w-full overflow-hidden bg-[#0A0A0A]">
      {/* Background wrapper */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative h-full w-full"
        >
          <img 
            src={heroBackground} 
            alt="Fitness Background" 
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.35] contrast-[1.1]"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" 
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" 
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="absolute inset-0 bg-black/20" 
          />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative min-h-[100vh] w-full">
        <div className="mx-auto flex min-h-[100vh] max-w-screen-xl flex-col items-center justify-center px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex w-full flex-col items-center space-y-12 pt-20 sm:pt-0"
          >
            {/* Heading */}
            <div className="relative text-center max-w-4xl">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="block text-4xl font-light tracking-wide text-white/90 sm:text-5xl md:text-6xl"
              >
                Transformišite Svoje
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-3 block text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
              >
                <motion.span 
                  initial={{ backgroundPosition: '200% 0' }}
                  animate={{ backgroundPosition: '0% 0' }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                  className="bg-gradient-to-r from-[#4F46E5] via-[#C0C0C0] to-[#4F46E5] bg-[length:200%_auto] bg-clip-text text-transparent"
                >
                  Fitness
                </motion.span>
                <span className="text-white"> Putovanje</span>
              </motion.span>
            </div>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {['Personalizovani Plan', 'Stručni Treneri', '24/7 Podrška'].map((feature, index) => (
                <motion.span
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm"
                >
                  <motion.span 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 360, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="mr-2 text-[#4F46E5]"
                  >
                    ◆
                  </motion.span>
                  {feature}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center rounded-full bg-[#4F46E5] px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#4338CA] overflow-hidden"
                >
                  <span className="relative z-10">Započni Besplatno</span>
                  <motion.div
                    initial={{ x: '100%' }}
                    whileHover={{ x: '-100%' }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/about"
                  className="group inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:text-white"
                >
                  <span>Saznaj Više</span>
                  <motion.svg 
                    className="ml-2 h-4 w-4"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </motion.svg>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" 
          />
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" 
          />
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: "🎯",
    title: "Personalizovani Planovi",
    description: "Prilagođeni treninzi i planovi ishrane za vaše ciljeve"
  },
  {
    icon: "👥",
    title: "Stručni Treneri",
    description: "Povezivanje sa sertifikovanim fitness profesionalcima"
  },
  {
    icon: "📊",
    title: "Praćenje Napretka",
    description: "Detaljni uvid u vaše fitness putovanje"
  },
  {
    icon: "🤝",
    title: "Podrška 24/7",
    description: "Uvek dostupna pomoć i motivacija"
  }
];

const stats = [
  { value: "1000+", label: "Aktivnih Korisnika" },
  { value: "50+", label: "Profesionalnih Trenera" },
  { value: "95%", label: "Zadovoljnih Klijenata" },
  { value: "24/7", label: "Podrška" }
];

export default Hero; 