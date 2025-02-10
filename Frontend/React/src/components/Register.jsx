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
        
        navigate(response.data.user.type === 'trainer' ? '/trainer-dashboard' : '/user-dashboard');
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'user' })}
              className={`card hover-card p-6 ${formData.type === 'user' ? 'border-[#E8E8E8]' : 'border-transparent'}`}
            >
              <h3 className="text-xl font-bold mb-2">Korisnik</h3>
              <p className="text-[#E8E8E8]/70">Pronađite trenera i započnite svoje fitness putovanje</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'trainer' })}
              className={`card hover-card p-6 ${formData.type === 'trainer' ? 'border-[#E8E8E8]' : 'border-transparent'}`}
            >
              <h3 className="text-xl font-bold mb-2">Trener</h3>
              <p className="text-[#E8E8E8]/70">Ponudite svoje usluge i pronađite nove klijente</p>
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Lični Podaci",
      content: (
        <div className="space-y-4">
          <div>
            <label className="form-label">Ime i prezime</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Unesite vaše ime i prezime"
            />
          </div>
          <div>
            <label className="form-label">Email adresa</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="vasa@email.com"
            />
          </div>
          <div>
            <label className="form-label">Broj telefona</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="input-field"
              placeholder="Opciono"
            />
          </div>
        </div>
      )
    },
    {
      title: "Bezbednost",
      content: (
        <div className="space-y-4">
          <div>
            <label className="form-label">Lozinka</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Minimum 8 karaktera"
            />
          </div>
          <div>
            <label className="form-label">Potvrda lozinke</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="input-field"
              placeholder="Ponovite lozinku"
            />
          </div>
        </div>
      )
    },
    {
      title: "Profil Trenera",
      content: formData.type === 'trainer' && (
        <div className="space-y-4">
          <div>
            <label className="form-label">Specijalizacije</label>
            <input
              type="text"
              name="specializations"
              value={formData.specializations}
              onChange={handleChange}
              className="input-field"
              placeholder="npr. Personalni trening, Yoga, Pilates..."
            />
          </div>
          <div>
            <label className="form-label">Sertifikati</label>
            <input
              type="text"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              className="input-field"
              placeholder="npr. NASM-CPT, ACE-CPT..."
            />
          </div>
          <div>
            <label className="form-label">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Opišite vaše iskustvo i pristup treningu..."
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Registracija</h2>
          <p className="mt-2 text-[#E8E8E8]/70">
            Već imate nalog?{' '}
            <Link to="/login" className="text-[#E8E8E8] hover:text-white">
              Prijavite se
            </Link>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.slice(0, formData.type === 'trainer' ? 4 : 3).map((s, i) => (
              <span
                key={i}
                className={`text-sm ${step > i ? 'text-[#E8E8E8]' : 'text-[#E8E8E8]/50'}`}
              >
                {s.title}
              </span>
            ))}
          </div>
          <div className="h-2 bg-[#000000] rounded-full border-2 border-[#E8E8E8]/10">
            <motion.div
              className="h-full bg-[#E8E8E8] rounded-full"
              initial={{ width: "0%" }}
              animate={{ 
                width: `${(step / (formData.type === 'trainer' ? 4 : 3)) * 100}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="form-container">
          {error && (
            <div className="error-text bg-red-500/10 border border-red-500 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step - 1].content}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              className={`btn btn-secondary ${step === 1 ? 'invisible' : ''}`}
            >
              Nazad
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="loading-spinner -ml-1 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Učitavanje...
                </span>
              ) : step < (formData.type === 'trainer' ? 4 : 3) ? 'Dalje' : 'Registruj se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 