import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Globe, Cpu, DollarSign, Shield, Clock, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Global Opportunities',
    description: 'Access platforms from around the world. Work remotely, earn globally.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Discovery',
    description: 'We curate and verify the best AI-driven earning opportunities for you.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: DollarSign,
    title: 'Real Earnings',
    description: 'Every platform listed has verified earning potential with transparent info.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Verified & Safe',
    description: 'All platforms are vetted for legitimacy. No scams, only real opportunities.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: 'Work on your schedule. Most platforms offer complete time flexibility.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Lightbulb,
    title: 'Detailed Guides',
    description: 'Step-by-step instructions to get started on every platform.',
    color: 'from-indigo-500 to-violet-500',
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 bg-white dark:bg-surface-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">About Us</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-4">
            Why Choose <span className="gradient-text">AI Hustle?</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            We're building the most comprehensive platform for AI-powered side hustles,
            helping thousands discover legitimate earning opportunities.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-gray-50 dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 card-hover"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
