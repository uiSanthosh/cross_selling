import { AnnouncementBar } from '@/components/AnnouncementBar';
import { CartHydrator } from '@/components/CartHydrator';
import { Hero } from '@/components/Hero';
import { Nav } from '@/components/Nav';
import { Toast } from '@/components/Toast';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Explore } from '@/components/sections/Explore';
import { Faq } from '@/components/sections/Faq';
import { Footer } from '@/components/sections/Footer';
import { Specs } from '@/components/sections/Specs';
import { Certs, Features, Happy, Intent, Reviews } from '@/components/sections/StaticSections';

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Hero />
        <hr className="divider" />
        <Features />
        <Certs />
        <Happy />
        <Intent />
        <Specs />
        <Reviews />
        <Faq />
        <Explore />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
      <CartHydrator />
    </>
  );
}
