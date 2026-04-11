import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { profileAPI } from '@/services/api';
import {
  Phone, GraduationCap, Sparkles, CheckCircle, Loader2,
  ArrowRight, SkipForward, PartyPopper,
} from 'lucide-react';
import { toast } from 'sonner';

const SKILLS_OPTIONS = [
  'AI Tools', 'Content Writing', 'Graphic Design', 'Video Editing',
  'Data Entry', 'Programming', 'Voice Acting', 'Translation',
  'Social Media', 'SEO', 'Copywriting', 'Web Development',
  'Mobile Development', 'Data Analysis', 'Machine Learning',
  'Photo Editing', 'Customer Service', 'Teaching',
];

const INTERESTS_OPTIONS = [
  'Freelancing', 'Passive Income', 'AI Side Hustles', 'Remote Work',
  'E-commerce', 'Digital Marketing', 'Crypto & Web3', 'Stock Trading',
  'Content Creation', 'Affiliate Marketing', 'Online Courses',
  'Print on Demand', 'Dropshipping', 'App Development',
];

const EDUCATION_LEVELS = [
  { value: 'high_school', label: 'High School' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'postgraduate', label: 'Postgraduate' },
  { value: 'other', label: 'Other' },
];

const DEGREE_TYPES = [
  'BA', 'BSc', 'BCom', 'BTech', 'BE', 'BCA', 'BBA',
  'MA', 'MSc', 'MTech', 'MBA', 'MCA', 'PhD', 'other',
];

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [completion, setCompletion] = useState(user?.profileCompletionPercentage || 30);
  const [showCelebration, setShowCelebration] = useState(false);

  // Phone section
  const [phone, setPhone] = useState(user?.phone || '');
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(user?.isPhoneVerified || false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const phoneOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Education section
  const [education, setEducation] = useState(user?.education || '');
  const [degreeType, setDegreeType] = useState(user?.degreeType || '');
  const [educationSaved, setEducationSaved] = useState(!!user?.education);
  const [educationLoading, setEducationLoading] = useState(false);

  // Skills section
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user?.skills || []);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [skillsSaved, setSkillsSaved] = useState((user?.skills || []).length > 0);
  const [skillsLoading, setSkillsLoading] = useState(false);

  useEffect(() => {
    if (completion >= 100 && !showCelebration) {
      setShowCelebration(true);
    }
  }, [completion, showCelebration]);

  // Phone handlers
  const handleSendPhoneOtp = async () => {
    if (!phone) {
      toast.error('Please enter a phone number');
      return;
    }
    setPhoneLoading(true);
    try {
      await profileAPI.updatePhone({ phone });
      setPhoneSent(true);
      toast.success('Verification code sent to your email');
      phoneOtpRefs.current[0]?.focus();
    } catch {
      toast.error('Failed to send verification code');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handlePhoneOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...phoneOtp];
    newOtp[index] = value.slice(-1);
    setPhoneOtp(newOtp);
    if (value && index < 5) {
      phoneOtpRefs.current[index + 1]?.focus();
    }
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      verifyPhoneOtp(newOtp.join(''));
    }
  };

  const handlePhoneOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !phoneOtp[index] && index > 0) {
      phoneOtpRefs.current[index - 1]?.focus();
    }
  };

  const verifyPhoneOtp = async (otp: string) => {
    setPhoneLoading(true);
    try {
      const res = await profileAPI.verifyPhone({ otp });
      setPhoneVerified(true);
      setCompletion(res.data.profileCompletionPercentage);
      toast.success('Phone verified! 🎉');
      await refreshProfile();
    } catch {
      toast.error('Invalid OTP');
      setPhoneOtp(['', '', '', '', '', '']);
      phoneOtpRefs.current[0]?.focus();
    } finally {
      setPhoneLoading(false);
    }
  };

  // Education handlers
  const handleSaveEducation = async () => {
    if (!education) {
      toast.error('Please select your education level');
      return;
    }
    setEducationLoading(true);
    try {
      const res = await profileAPI.updateEducation({ education, degreeType });
      setEducationSaved(true);
      setCompletion(res.data.profileCompletionPercentage);
      toast.success('Education saved!');
      await refreshProfile();
    } catch {
      toast.error('Failed to save education');
    } finally {
      setEducationLoading(false);
    }
  };

  // Skills handlers
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSaveSkills = async () => {
    if (selectedSkills.length === 0 && selectedInterests.length === 0) {
      toast.error('Please select at least one skill or interest');
      return;
    }
    setSkillsLoading(true);
    try {
      const res = await profileAPI.updateSkills({
        skills: selectedSkills,
        interests: selectedInterests,
      });
      setSkillsSaved(true);
      setCompletion(res.data.profileCompletionPercentage);
      toast.success('Skills saved!');
      await refreshProfile();
    } catch {
      toast.error('Failed to save skills');
    } finally {
      setSkillsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Get personalized AI opportunities matched to your skills
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Completion</span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{completion}%</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-bg-accent rounded-full"
              initial={{ width: '30%' }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Celebration */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-center"
            >
              <PartyPopper className="w-12 h-12 text-white mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Profile Complete! 🎉</h2>
              <p className="text-white/80 mb-4">You'll now get personalized recommendations</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 1: Phone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${phoneVerified ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-primary-100 dark:bg-primary-900/30'}`}>
                {phoneVerified ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Phone className="w-5 h-5 text-primary-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Phone Number</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">+25% completion</p>
              </div>
            </div>
            {!phoneVerified && (
              <button
                onClick={() => {}}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1"
              >
                <SkipForward className="w-3 h-3" /> Skip
              </button>
            )}
          </div>

          {phoneVerified ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Phone verified: {phone || user?.phone}
            </p>
          ) : !phoneSent ? (
            <div className="flex gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition text-sm"
              />
              <button
                onClick={handleSendPhoneOtp}
                disabled={phoneLoading}
                className="px-5 py-3 text-sm font-semibold text-white rounded-xl gradient-bg-accent hover:opacity-90 transition disabled:opacity-50"
              >
                {phoneLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Enter the 6-digit code sent to your email</p>
              <div className="flex justify-center gap-2">
                {phoneOtp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { phoneOtpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePhoneOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handlePhoneOtpKeyDown(index, e)}
                    className="w-11 h-13 text-center text-lg font-bold rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                    disabled={phoneLoading}
                  />
                ))}
              </div>
              {phoneLoading && (
                <p className="text-sm text-primary-500 text-center mt-2 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Section 2: Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${educationSaved ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-primary-100 dark:bg-primary-900/30'}`}>
                {educationSaved ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <GraduationCap className="w-5 h-5 text-primary-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Education</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">+20% completion</p>
              </div>
            </div>
            {!educationSaved && (
              <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1">
                <SkipForward className="w-3 h-3" /> Skip
              </button>
            )}
          </div>

          {educationSaved ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {EDUCATION_LEVELS.find(e => e.value === education)?.label || education} {degreeType ? `— ${degreeType}` : ''}
            </p>
          ) : (
            <div className="space-y-3">
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="">Select Education Level</option>
                {EDUCATION_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
              <select
                value={degreeType}
                onChange={(e) => setDegreeType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="">Select Degree Type (Optional)</option>
                {DEGREE_TYPES.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <button
                onClick={handleSaveEducation}
                disabled={educationLoading}
                className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl gradient-bg-accent hover:opacity-90 transition disabled:opacity-50"
              >
                {educationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Education'}
              </button>
            </div>
          )}
        </motion.div>

        {/* Section 3: Skills & Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${skillsSaved ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-primary-100 dark:bg-primary-900/30'}`}>
                {skillsSaved ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Sparkles className="w-5 h-5 text-primary-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Skills & Interests</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">+25% completion</p>
              </div>
            </div>
            {!skillsSaved && (
              <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1">
                <SkipForward className="w-3 h-3" /> Skip
              </button>
            )}
          </div>

          {skillsSaved ? (
            <div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4" /> Saved!
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[...selectedSkills, ...selectedInterests].map(item => (
                  <span key={item} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Skills</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_OPTIONS.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                        selectedSkills.includes(skill)
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Interests</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                        selectedInterests.includes(interest)
                          ? 'bg-accent-500 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSaveSkills}
                disabled={skillsLoading}
                className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl gradient-bg-accent hover:opacity-90 transition disabled:opacity-50"
              >
                {skillsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Skills & Interests'}
              </button>
            </div>
          )}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white rounded-xl gradient-bg-accent hover:opacity-90 transition shadow-lg shadow-primary-500/25"
          >
            {completion >= 100 ? 'Go to Dashboard' : 'Save & Continue to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
