import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Services from "@/components/home/Services";
import WhyChoose from "@/components/home/WhyChoose";
import Gallery from "@/components/home/Gallery";
import Insurance from "@/components/home/Insurance";
import CTA from "@/components/home/CTA";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import Location from "@/components/home/Location";
import Contact from "@/components/home/Contact";

export default function Home() {
  const [data, setData] = useState({ providers: [], gallery: [], testimonials: [], faqs: [] });

  useEffect(() => {
    (async () => {
      try {
        const [providers, gallery, testimonials, faqs] = await Promise.all([
          base44.entities.InsuranceProvider.list().catch(() => []),
          base44.entities.GalleryImage.list().catch(() => []),
          base44.entities.Testimonial.list().catch(() => []),
          base44.entities.FAQ.list().catch(() => []),
        ]);
        setData({ providers, gallery, testimonials, faqs });
      } catch (e) {
        // keep empty defaults
      }
    })();
  }, []);

  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <WhyChoose />
      <Gallery images={data.gallery} />
      <Insurance providers={data.providers} />
      <CTA />
      <Testimonials testimonials={data.testimonials} />
      <FAQ faqs={data.faqs} />
      <Location />
      <Contact />
    </>
  );
}