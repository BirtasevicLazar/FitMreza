import { motion } from 'framer-motion';
import Hero from './Hero';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Sekcija */}
      <Hero />

      {/* Kako Radi Sekcija */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="content-section"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Kako <span className="gradient-text">FitMreza</span> Radi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card relative"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-main border-2 border-primary flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Sekcija */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="content-section relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Spremni da Započnete Svoje
              <span className="gradient-text block mt-2">Fitness Putovanje?</span>
            </h2>
            <p className="text-lg text-muted mb-8">
              Pridružite se hiljadama zadovoljnih korisnika koji su već transformisali svoje živote uz FitMrezu.
            </p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a href="/register" className="btn btn-primary">
                Registruj se Besplatno
              </a>
              <a href="/trainers" className="btn btn-secondary">
                Pronađi Trenera
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

const howItWorks = [
  {
    title: "Kreiraj Profil",
    description: "Registruj se i postavi svoje fitness ciljeve i preference."
  },
  {
    title: "Pronađi Trenera",
    description: "Pretraži i poveži se sa trenerom koji najbolje odgovara tvojim potrebama."
  },
  {
    title: "Započni Trening",
    description: "Dobij personalizovani plan i započni svoje fitness putovanje."
  }
];

export default Home; 