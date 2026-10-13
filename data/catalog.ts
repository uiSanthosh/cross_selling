// Local mock data. Swap this module for a Shopify / commerce API client later.
export type ProductId =
  | 'box-winter'
  | 'box-frozen'
  | 'dip'
  | 'bottle'
  | 'hydrapop600'
  | 'hydrafizz'
  | 'bento-ace'
  | 'bento-quad'
  | 'hydrafizz800'
  | 'dip-blue'
  | 'bottle-glacier'
  | 'ace2c-blue';

export interface Product {
  name: string;
  short: string;
  price: number;
  mrp: number;
  img: string;
}

const BOX = '3 Compartment Stainless Steel Lunchbox with Plastic Lid';

export const CATALOG: Record<ProductId, Product> = {
  'box-winter': { name: `${BOX} - Winter Whirl`, short: 'Bento Lite - Winter Whirl', price: 1899, mrp: 3200, img: '/assets/live-box-winter-whirl.jpg' },
  'box-frozen': { name: `${BOX} - Frozen Magic`, short: 'Bento Lite - Frozen Magic', price: 1899, mrp: 3200, img: '/assets/acca8.png' },
  dip: { name: 'Pickle Dip', short: 'Pickle Dip', price: 149, mrp: 249, img: '/assets/c08c1.png' },
  bottle: { name: 'HydraPop 380ml', short: 'HydraPop 380ml', price: 1099, mrp: 2000, img: '/assets/be654.png' },
  hydrapop600: { name: 'HydraPop 600ml', short: 'HydraPop 600ml', price: 1299, mrp: 2400, img: '/assets/327ba.png' },
  hydrafizz: { name: 'HydraFizz 800ml', short: 'HydraFizz 800ml', price: 1399, mrp: 2600, img: '/assets/dbf85.png' },
  'bento-ace': { name: 'Bento Ace', short: 'Bento Ace', price: 1599, mrp: 2500, img: '/assets/5f774.png' },
  'bento-quad': { name: 'Bento Quad', short: 'Bento Quad', price: 1999, mrp: 3500, img: '/assets/c07b7.png' },
  // Live yourbasil.com prices and images (Primary and Two kids bundles)
  hydrafizz800: { name: 'HydraFizz 800ml - Classic Blue', short: 'HydraFizz 800ml', price: 1399, mrp: 2600, img: '/assets/live-hydrafizz-800-blue.jpg' },
  'dip-blue': { name: 'Pickle Dip - Blue', short: 'Pickle Dip - Blue', price: 149, mrp: 249, img: '/assets/live-dip-blue.png' },
  'ace2c-blue': { name: 'Bento Ace 2C Lunch Box - Classic Blue', short: 'Bento Ace 2C - Classic Blue', price: 1299, mrp: 2500, img: '/assets/live-ace-2c-classic-blue.jpg' },
  'bottle-glacier': { name: 'HydraPop 380ml - Glacier', short: 'HydraPop 380ml', price: 999, mrp: 2000, img: '/assets/live-hydrapop-380-glacier.jpg' },
};

// "Pack the morning" cards in the cart drawer: shown there, not as cart lines
export const STRIP: ProductId[] = ['dip', 'bottle', 'hydrapop600'];

export const MAIN_PRODUCT = {
  title: 'Bento Lite - Frozen',
  subtitle: '3 Compartment Stainless Steel Lunchbox with Plastic Lid',
  unit: 1899,
  unitMrp: 3200,
  rating: '4.5',
} as const;

export const VIBES = [
  { name: 'Winter Whirl', id: 'box-winter' as ProductId, swatch: '/assets/73a74.png' },
  { name: 'Frozen Magic', id: 'box-frozen' as ProductId, swatch: '/assets/1788d.png' },
] as const;

export const GALLERY = [
  { main: '/assets/main-raw1.png', thumb: '/assets/thumb-raw1.png', alt: 'Frozen bento lite, open' },
  { main: '/assets/thumb-raw2.png', thumb: '/assets/thumb-raw2.png', alt: 'Product view 2' },
  { main: '/assets/thumb-raw3.png', thumb: '/assets/thumb-raw3.png', alt: 'Product view 3' },
  { main: '/assets/thumb-raw4.png', thumb: '/assets/thumb-raw4.png', alt: 'Product view 4' },
  { main: '/assets/thumb-raw5.png', thumb: '/assets/thumb-raw5.png', alt: 'Product view 5' },
  { main: '/assets/thumb-raw6.png', thumb: '/assets/thumb-raw6.png', alt: 'Product view 6' },
];

// "Pack the morning" bundles, one per tab. `cartId: null` is the page's main lunchbox
// (its variant and quantity come from the buy box above).
export interface BundleItem {
  key: string;
  cartId: ProductId | null;
  name: string;
  img: string;
  imgClass: string;
}

export interface Bundle {
  title: string;
  sub: string;
  items: BundleItem[];
}

const MAIN_BOX: BundleItem = { key: 'box', cartId: null, name: 'Frozen Magic lunchbox', img: '/assets/acca8.png', imgClass: 'cover z1' };

export const BUNDLES: Bundle[] = [
  {
    title: 'Playschool',
    sub: 'Hot food first',
    items: [
      MAIN_BOX,
      { key: 'bottle', cartId: 'bottle', name: 'HydraPop 380ml', img: '/assets/be654.png', imgClass: 'cover z2' },
      { key: 'dip', cartId: 'dip', name: 'Pickle Dip', img: '/assets/c08c1.png', imgClass: 'fill' },
    ],
  },
  {
    title: 'Primary',
    sub: 'Box + bottle',
    items: [
      MAIN_BOX,
      { key: 'hydrafizz', cartId: 'hydrafizz800', name: 'HydraFizz 800ml', img: CATALOG.hydrafizz800.img, imgClass: 'fill' },
      { key: 'dip-blue', cartId: 'dip-blue', name: 'Pickle Dip - Blue', img: CATALOG['dip-blue'].img, imgClass: 'fill' },
    ],
  },
  {
    title: 'Two kids',
    sub: 'A box each',
    items: [
      MAIN_BOX,
      { key: 'box-2', cartId: 'ace2c-blue', name: 'Bento Ace 2C - Classic Blue', img: CATALOG['ace2c-blue'].img, imgClass: 'fill' },
      { key: 'glacier', cartId: 'bottle-glacier', name: 'HydraPop 380ml', img: CATALOG['bottle-glacier'].img, imgClass: 'fill' },
    ],
  },
];

export const EXPLORE: { id: ProductId; rating: string; launch?: boolean; description: string; img: string }[] = [
  { id: 'bento-quad', rating: '4.8', img: '/assets/c07b7.png', description: '4 Compartment Stainless steel Lunchbox with Plastic lid - Mushroom Trail' },
  { id: 'hydrapop600', rating: '4.7', img: '/assets/327ba.png', description: 'Insulated Stainless steel Sipper with Loop Handle- Pixie Dash' },
  { id: 'bento-ace', rating: '4.9', launch: true, img: '/assets/5f774.png', description: '2 Compartment Stainless Steel Lunchbox with Plastic Lid - Wiggly Woof' },
  { id: 'hydrafizz', rating: '4.7', launch: true, img: '/assets/dbf85.png', description: 'Insulated Stainless steel Sipper with Carry Handle - Classic Plum' },
];
