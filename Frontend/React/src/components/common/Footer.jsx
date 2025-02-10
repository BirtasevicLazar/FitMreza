import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    main: [
      { name: 'O nama', path: '/about' },
      { name: 'Treneri', path: '/trainers' },
      { name: 'Cenovnik', path: '/pricing' },
      { name: 'Blog', path: '/blog' },
    ],
    support: [
      { name: 'Pomoć', path: '/help' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Kontakt', path: '/contact' },
    ],
    legal: [
      { name: 'Privatnost', path: '/privacy' },
      { name: 'Uslovi korišćenja', path: '/terms' },
    ]
  };

  const socialLinks = [
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gradient-to-b from-[#0A0A0A] to-[#121212] relative">
      {/* Dekorativna linija */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4F46E5]/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6 pt-16 pb-8">
        {/* Glavni sadržaj */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12">
          {/* Logo i opis sekcija */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-sm w-full flex flex-col items-center lg:items-start"
            >
              <div className="w-full flex justify-center lg:justify-start">
                <Link to="/" className="inline-block">
                  <span className="text-2xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                    Fit<span className="bg-gradient-to-r from-[#4F46E5] via-[#C0C0C0] to-[#4F46E5] bg-clip-text text-transparent">Mreza</span>
                  </span>
                </Link>
              </div>
              <p className="text-white/60 text-sm leading-relaxed text-center lg:text-left">
                Transformišite svoje fitness putovanje uz pomoć najboljih trenera. Personalizovani planovi treninga i ishrane za vaše ciljeve.
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center group transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-white/60 group-hover:text-[#4F46E5] transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Linkovi */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Glavni linkovi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center sm:items-start"
            >
              <h3 className="text-white font-medium mb-4">Navigacija</h3>
              <ul className="space-y-3">
                {footerLinks.main.map((link) => (
                  <li key={link.path} className="text-center sm:text-left">
                    <Link
                      to={link.path}
                      className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Podrška */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center sm:items-start"
            >
              <h3 className="text-white font-medium mb-4">Podrška</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.path} className="text-center sm:text-left">
                    <Link
                      to={link.path}
                      className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Kontakt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center sm:items-start"
            >
              <h3 className="text-white font-medium mb-4">Kontakt</h3>
              <ul className="space-y-3">
                <li className="text-center sm:text-left">
                  <a
                    href="mailto:info@fitmreza.com"
                    className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                  >
                    info@fitmreza.com
                  </a>
                </li>
                <li className="text-center sm:text-left">
                  <a
                    href="tel:+381601234567"
                    className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                  >
                    +381 60 123 4567
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Donji deo sa copyright-om */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white/40 text-sm text-center sm:text-left"
            >
              &copy; {currentYear} FitMreza. Sva prava zadržana.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center space-x-6"
            >
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-white/40 hover:text-white text-sm transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 