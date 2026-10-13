'use client';

import { FAQS } from '@/data/content';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function Faq() {
  return (
    <section className="faq">
      <h2 className="sec-title">Questions You May Have</h2>
      <p className="sec-sub caps">We&apos;ve tried to answer them all</p>
      <Accordion type="single" collapsible className="faq-list">
        {FAQS.map((f, i) => (
          <AccordionItem key={f.q} value={`q${i}`} className="faq-item">
            <AccordionTrigger className="faq-trigger">
              {f.q}
              <img src="/assets/07bf8.svg" alt="" width={24} height={24} />
            </AccordionTrigger>
            <AccordionContent><p>{f.a}</p></AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
