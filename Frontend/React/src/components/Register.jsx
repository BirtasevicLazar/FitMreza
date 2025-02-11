import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    type: 'user',
    specializations: '',
    certifications: '',
    bio: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep = (currentStep) => {
    setError('');
    switch (currentStep) {
      case 1:
        if (!formData.type) return "Izaberite tip naloga";
        break;
      case 2:
        if (!formData.name) return "Unesite ime i prezime";
        if (!formData.email) return "Unesite email adresu";
        if (!formData.email.includes('@')) return "Unesite validnu email adresu";
        break;
      case 3:
        if (!formData.password) return "Unesite lozinku";
        if (formData.password.length < 8) return "Lozinka mora imati najmanje 8 karaktera";
        if (formData.password !== formData.password_confirmation) return "Lozinke se ne poklapaju";
        break;
      case 4:
        if (formData.type === 'trainer') {
          if (!formData.specializations) return "Unesite specijalizacije";
          if (!formData.certifications) return "Unesite sertifikate";
          if (!formData.bio) return "Unesite bio";
        }
        break;
    }
    return "";
  };

  const nextStep = () => {
    const error = validateStep(step);
    if (error) {
      setError(error);
      return;
    }
    if (step < (formData.type === 'trainer' ? 4 : 3)) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post('/register', formData);
      
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        navigate(response.data.user.type === 'trainer' ? '/trainer-profile' : '/user-profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Došlo je do greške prilikom registracije');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Tip Naloga",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'user' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group overflow-hidden rounded-2xl p-6 transition-all ${
                formData.type === 'user' 
                  ? 'bg-[#4F46E5]/10 border-[#4F46E5]' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              } border backdrop-blur-sm`}
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Korisnik</h3>
                <p className="text-white/60">Pronađite trenera i započnite svoje fitness putovanje</p>
              </div>
              {formData.type === 'user' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-[#4F46E5] rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'trainer' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group overflow-hidden rounded-2xl p-6 transition-all ${
                formData.type === 'trainer' 
                  ? 'bg-[#4F46E5]/10 border-[#4F46E5]' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              } border backdrop-blur-sm`}
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Trener</h3>
                <p className="text-white/60">Ponudite svoje usluge i pronađite nove klijente</p>
              </div>
              {formData.type === 'trainer' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-[#4F46E5] rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>
      )
    },
    {
      title: "Lični Podaci",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Ime i prezime</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              placeholder="Unesite vaše ime i prezime"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email adresa</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              placeholder="vasa@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Broj telefona</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              placeholder="Opciono"
            />
          </div>
        </div>
      )
    },
    {
      title: "Bezbednost",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Lozinka</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              placeholder="Minimum 8 karaktera"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Potvrda lozinke</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              placeholder="Ponovite lozinku"
            />
          </div>
        </div>
      )
    },
    {
      title: "Profil Trenera",
      content: formData.type === 'trainer' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Specijalizacije</label>
            <input
              type="text"
              name="specializations"
              value={formData.specializations}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              placeholder="npr. Personalni trening, Yoga, Pilates..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Sertifikati</label>
            <input
              type="text"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              placeholder="npr. NASM-CPT, ACE-CPT..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all resize-none"
              rows="3"
              placeholder="Opišite vaše iskustvo i pristup treningu..."
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-8">
        <div className="w-full max-w-md py-8 md:py-0">
          {/* Welcome Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Registracija
            </h2>
            <p className="text-white/60">
              Već imate nalog?{' '}
              <Link 
                to="/login" 
                className="text-[#4F46E5] hover:text-[#4338CA] transition-colors font-medium"
              >
                Prijavite se
              </Link>
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex justify-between mb-2">
              {steps.slice(0, formData.type === 'trainer' ? 4 : 3).map((s, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    step > i ? 'text-white font-medium' : 'text-white/40'
                  } transition-colors duration-300`}
                >
                  {s.title}
                </span>
              ))}
            </div>
            <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4F46E5] to-[#4338CA]"
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${(step / (formData.type === 'trainer' ? 4 : 3)) * 100}%` 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 md:p-8"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4"
              >
                <p className="text-red-500 text-sm text-center font-medium">{error}</p>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                {step === 1 && (
                  <div className="flex flex-col gap-4 pt-2">
                    <motion.button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'user' })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative group overflow-hidden rounded-xl p-5 transition-all ${
                        formData.type === 'user' 
                          ? 'bg-[#4F46E5]/10 border-[#4F46E5]' 
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05]'
                      } border`}
                    >
                      <div className="relative z-10">
                        <h3 className="text-lg font-bold text-white mb-1.5">Korisnik</h3>
                        <p className="text-sm text-white/60">Pronađite trenera i započnite svoje fitness putovanje</p>
                      </div>
                      {formData.type === 'user' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-5 h-5 bg-[#4F46E5] rounded-full flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'trainer' })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative group overflow-hidden rounded-xl p-5 transition-all ${
                        formData.type === 'trainer' 
                          ? 'bg-[#4F46E5]/10 border-[#4F46E5]' 
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05]'
                      } border`}
                    >
                      <div className="relative z-10">
                        <h3 className="text-lg font-bold text-white mb-1.5">Trener</h3>
                        <p className="text-sm text-white/60">Ponudite svoje usluge i pronađite nove klijente</p>
                      </div>
                      {formData.type === 'trainer' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-5 h-5 bg-[#4F46E5] rounded-full flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-white/80">
                        Ime i prezime
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                        placeholder="Unesite vaše ime i prezime"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-white/80">
                        Email adresa
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                        placeholder="vasa@email.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-white/80">
                        Broj telefona
                      </label>
                      <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                        placeholder="Opciono"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-white/80">
                        Lozinka
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                        placeholder="Minimum 8 karaktera"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-white/80">
                        Potvrda lozinke
                      </label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                        placeholder="Ponovite lozinku"
                      />
                    </div>
                  </div>
                )}

                {step === 4 && formData.type === 'trainer' && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-white/80">
                        Specijalizacije
                      </label>
                      <input
                        type="text"
                        name="specializations"
                        value={formData.specializations}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                        placeholder="npr. Personalni trening, Yoga, Pilates..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-white/80">
                        Sertifikati
                      </label>
                      <input
                        type="text"
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
                        placeholder="npr. NASM-CPT, ACE-CPT..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-white/80">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all resize-none"
                        rows="2"
                        placeholder="Opišite vaše iskustvo i pristup treningu..."
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <motion.button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2 rounded-xl text-white/60 hover:text-white transition-colors ${
                  step === 1 ? 'invisible' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Nazad
              </motion.button>
              <motion.button
                type="button"
                onClick={nextStep}
                disabled={loading}
                className="relative px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : step < (formData.type === 'trainer' ? 4 : 3) ? 'Dalje' : 'Registruj se'}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#4338CA] to-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-white/40"
          >
            <Link to="/terms" className="hover:text-white/60 transition-colors">
              Uslovi korišćenja
            </Link>
            <span className="mx-2">•</span>
            <Link to="/privacy" className="hover:text-white/60 transition-colors">
              Politika privatnosti
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register; 