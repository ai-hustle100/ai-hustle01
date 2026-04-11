import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Share2, MessageSquare, Globe } from 'lucide-react';

const founders = [
  {
    name: 'Gaurav Dotiyal',
    role: 'Founder & CEO',
    bio: 'Full-stack developer and AI enthusiast passionate about making technology accessible to everyone. Built AI Hustle to help people discover earning opportunities in the AI economy.',
    avatar: 'GD',
    color: 'from-primary-500 to-accent-500',
    social: {
      linkedin: '#',
      twitter: '#',
      website: '#',
    },
  },
  {
    name: 'AI Hustle Team',
    role: 'Core Team',
    bio: 'A dedicated team of researchers, developers, and content creators who verify and curate the best platforms. We test every opportunity before listing it on AI Hustle.',
    avatar: 'AH',
    color: 'from-accent-500 to-emerald-500',
    social: {
      linkedin: '#',
      twitter: '#',
      website: '#',
    },
  },
];

export default function Founders() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="founders" className="py-24 bg-white dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">The Team</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-4">
            Meet the <span className="gradient-text">Founders</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            The people behind AI Hustle who are committed to helping you succeed.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="p-8 rounded-2xl bg-gray-50 dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 card-hover text-center">
                {/* Avatar */}
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${founder.color} flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-105 transition-transform duration-300`}>
                  <span className="text-3xl font-bold text-white">{founder.avatar}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {founder.name}
                </h3>
                <p className="text-sm font-medium text-primary-500 mb-4">{founder.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                  {founder.bio}
                </p>

                {/* Social links */}
                <div className="flex justify-center gap-3">
                  {[
                    { icon: Share2, href: founder.social.linkedin },
                    { icon: MessageSquare, href: founder.social.twitter },
                    { icon: Globe, href: founder.social.website },
                  ].map(({ icon: Icon, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
