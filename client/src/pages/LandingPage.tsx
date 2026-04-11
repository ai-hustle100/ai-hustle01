import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Mission from '@/components/sections/Mission';
import Founders from '@/components/sections/Founders';
import Contact from '@/components/sections/Contact';

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <About />
      <Mission />
      {/* <Founders /> */}
      <Contact />
    </main>
  );
}
