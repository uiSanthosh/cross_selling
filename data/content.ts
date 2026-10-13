export const ANNOUNCEMENTS = ['Free Shipping | 10 Day Return*', '🔥 Buy 2 get 5% OFF 🔥', 'Frozen Drop 🩵', 'Free Shipping | 10 Day Return*', 'Frozen Drop 🩵'];

export const FEATURES = [
  { img: '/assets/bccc9.png', title: 'For Every Princess', text: "From Elsa to Olaf, there's a bestie print for every bag." },
  { img: '/assets/fde7b.png', title: 'Sealed Frozen-Tight', text: 'Slides around their bag all day and books stay dry.' },
  { img: '/assets/86e28.png', title: 'Detachable Silicone', text: 'The silicone pops right out for a spotless wash.' },
  { img: '/assets/c046d.png', title: 'Frozen Tough', text: 'Pure food-grade 304 stainless steel, no nasties!' },
];

export const CERTS: { img: string; caption: string[] }[] = [
  { img: '/assets/bc014.png', caption: ['CPC Certified'] },
  { img: '/assets/35b66.png', caption: ['IP Patented'] },
  { img: '/assets/98dae.png', caption: ['FDA Approved'] },
  { img: '/assets/5d78a.png', caption: ['100% Leak Proof'] },
  { img: '/assets/e7971.png', caption: ['Frozen Edition'] },
  { img: '/assets/ba8ec.png', caption: ['304-RustFree', 'Stainless Steel'] },
];

export const HAPPY_REVIEWS = [
  { img: '/assets/2af9f.png', name: 'Mitali', text: 'Absolutely love the Frozen Bento! The designs are so beautiful and my daughter feels like a little princess every time she carries it to school.' },
  { img: '/assets/5c9fc.png', name: 'Rahul', text: 'The colours and detailing are so beautifully done! What I love most is how practical it is - the lunchbox is completely leakproof, so there are no messy spills in her school bag.' },
  { img: '/assets/2af9f.png', name: 'Mitali', text: 'Absolutely love the Frozen Bento! The designs are so beautiful and my daughter feels like a little princess every time she carries it to school.' },
];

export const SPEC_TABS = [
  { id: 'dim', label: 'Dimensions' },
  { id: 'mat', label: 'Materials' },
  { id: 'care', label: 'Care Instructions' },
  { id: 'more', label: 'More Information' },
];

export const SPEC_DIMENSIONS = [
  ['Product Dimensions', '23.5cm x 17.5cm x 4cm'],
  ['Weight', '460 Grams'],
  ['Capacity', '780 ml'],
  ['Net Quantity', '1 N'],
];

export const SPEC_SOLO: Record<string, { title: string; rows: string[][] }> = {
  mat: { title: 'Materials', rows: [['Box', '304 food-grade stainless steel'], ['Lid', 'Food-safe plastic with detachable silicone seal']] },
  care: { title: 'Care Instructions', rows: [['Washing', 'Pop out the silicone seal and hand wash with mild soap'], ['Avoid', 'Microwave and open flame']] },
  more: { title: 'More Information', rows: [['Warranty', '6 months'], ['Returns', 'Easy 10 day return']] },
};

// [stars, count]
export const RATING_DIST: [number, number][] = [[5, 1], [4, 1], [3, 0], [2, 0], [1, 0]];

export const REVIEWS = [
  { when: '6 days ago', user: 'Sahana Uday Shankar', text: 'Product is good.. but it’s a bit overpriced.', reply: "Thank you for your feedback, Sahana. We're glad you find the product good and appreciate your input on pricing. We'll consider this for future improvements." },
  { when: '6 days ago', user: 'Sahana Uday Shankar', text: 'Product is good.. but it’s a bit overpriced.', reply: "Thank you for your feedback, Sahana. We're glad you find the product good and appreciate your input on pricing. We'll consider this for future improvements." },
];

export const CUSTOMER_PHOTOS = ['fe426', 'f8c23', '95ff2', '92a6f', '15e21'];

export const FAQS = [
  { q: 'Is the Frozen print officially licensed?', a: 'Yes. This lunchbox is official Disney Frozen merchandise, made under licence.' },
  { q: 'Is it easy for a child to open and close?', a: 'The latches are designed and tested for little hands, so most kids can open the box without help.' },
  { q: 'Will the food mix together inside the compartments?', a: 'No. The three compartments keep dry and wet foods separate.' },
  { q: 'Can I pack hot Indian food in it?', a: 'Yes. The 304 stainless steel tray handles warm food well. Let very hot food cool a minute before sealing the lid.' },
  { q: 'Is it actually leakproof enough to put in a school bag?', a: 'Yes. The silicone seal locks the lid tight, so the box stays sealed inside a school bag.' },
];

export const FOOTER_LISTS = [
  { title: 'More', links: ['Shop All', 'Stainless Steel Bento', 'Insulated Food Jar', 'School Backpack', 'Water Bottle'] },
  { title: 'Help', links: ['Contact Us', 'Shipping Policy', 'Returns Policy', 'Warranty Policy'] },
];

export const RETAILERS = [
  { img: '6448d', name: 'Amazon' },
  { img: '9ae19', name: 'Blinkit' },
  { img: '735e3', name: 'Flipkart' },
  { img: '6af6a', name: 'FirstCry' },
  { img: 'cc508', name: 'Myntra' },
  { img: 'adb7d', name: 'Ozi' },
];

export const TRUST = [
  { img: '/assets/c9111.svg', w: 33, h: 13, cls: 'fda', text: 'FDA approved' },
  { img: '/assets/59584.png', w: 24, h: 24, text: 'Free shipping' },
  { img: '/assets/550e4.png', w: 24, h: 24, text: '6 month warranty' },
  { img: '/assets/c8f1e.png', w: 24, h: 24, text: 'Easy 10 Day Return' },
];
