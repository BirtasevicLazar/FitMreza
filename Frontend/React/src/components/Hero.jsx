import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Pozadinski efekat */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#000000] to-[#000000]" />
        <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')]" />
      </div>

      {/* Glavni sadržaj */}
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Leva strana - Text */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex-1 text-center lg:text-left"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Transformišite Svoje
              <span className="gradient-text block mt-2">Fitness Putovanje</span>
            </h1>
            <p className="text-lg lg:text-xl text-[#E8E8E8]/80 mb-8 max-w-2xl">
              Povežite se sa profesionalnim trenerima, pratite svoj napredak i dostignite svoje fitness ciljeve brže nego ikad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register" className="btn btn-primary text-center">
                Započni Besplatno
              </Link>
              <Link to="/about" className="btn btn-secondary text-center">
                Saznaj Više
              </Link>
            </div>
          </motion.div>

          {/* Desna strana - Feature kartice */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="card hover-card p-6"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-[#E8E8E8]/70">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Statistike */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-[#E8E8E8]/70">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
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