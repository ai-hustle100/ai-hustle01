import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Target, Rocket, Heart, Gem } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Accuracy',
    description: 'Every platform is thoroughly researched and verified. We never list unproven opportunities.',
  },
  {
    icon: Rocket,
    title: 'Innovation',
    description: 'We constantly discover and add the latest AI-powered platforms and earning methods.',
  },
  {
    icon: Heart,
    title: 'Community',
    description: 'Building a supportive community of hustlers who share tips, experiences, and success stories.',
  },
  {
    icon: Gem,
    title: 'Transparency',
    description: 'Honest reviews with real pros and cons. No paid promotions, only genuine recommendations.',
  },
];

export default function Mission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="mission" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-primary-950/30 dark:via-surface-dark dark:to-accent-950/20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Mission statement */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">Our Mission</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-6">
              Empowering Everyone to
              <span className="gradient-text"> Earn with AI</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              We believe the future of work is decentralized, flexible, and powered by AI.
              Our mission is to democratize access to AI-driven earning opportunities,
              ensuring everyone — regardless of background or location — can participate
              in the AI economy.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              From training AI models to selling AI-generated art, from freelancing with
              AI coding assistants to teaching AI skills online — we curate and review
              every opportunity so you can focus on earning.
            </p>

            {/* Stats */}
            <div className="mt-10 flex gap-8">
              {[
                { value: '50+', label: 'Platforms Reviewed' },
                { value: '12+', label: 'Categories' },
                { value: '100%', label: 'Free to Use' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="p-5 rounded-2xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 card-hover"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mb-4">
                  <value.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
