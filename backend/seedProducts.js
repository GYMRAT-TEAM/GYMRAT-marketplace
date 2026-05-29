const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const dns = require("dns");
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const seedProducts = [
  // ── GYM ──
  {
    name: 'Gold Standard Whey Protein 5lb',
    brand: 'OPTIMUM NUTRITION',
    description: 'The world\'s best-selling whey protein powder. 24g of protein per serving.',
    price: 14800,
    oldPrice: 16500,
    stock: 50,
    inStock: true,
    type: 'Supplements',
    sport: 'Gym',
    badge: 'NEW',
    color: '#4a4a4a',
    size: 'M',
    img: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=500',
    images: ['https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=500'],
    specs: [{ key: 'Protein', value: '24g' }, { key: 'Servings', value: '74' }],
    status: 'approved'
  },
  {
    name: 'C4 Original Explosive Pre-Workout',
    brand: 'C4 SPORT',
    description: 'Explosive energy, creatine nitrate for pumps and beta-alanine for endurance.',
    price: 6800,
    oldPrice: 7500,
    stock: 120,
    inStock: true,
    type: 'Supplements',
    sport: 'Gym',
    badge: 'HOT',
    color: '#f39c12',
    size: 'S',
    img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500',
    images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500'],
    specs: [{ key: 'Caffeine', value: '150mg' }, { key: 'Beta-Alanine', value: '1.6g' }],
    status: 'approved'
  },

  // ── BOXING ──
  {
    name: 'Pro Style Training Gloves',
    brand: 'EVERLAST',
    description: 'Premium synthetic leather gloves with superior construction. Ideal for sparring and heavy bag work.',
    price: 8500,
    oldPrice: 9900,
    stock: 30,
    inStock: true,
    type: 'Equipment',
    sport: 'Boxing',
    badge: 'PRO',
    color: '#c0392b',
    size: '14oz',
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=500',
    images: ['https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=500'],
    specs: [{ key: 'Material', value: 'Synthetic Leather' }, { key: 'Weight', value: '14oz' }],
    status: 'approved'
  },
  {
    name: 'Heavy Punching Bag 100cm',
    brand: 'RDX',
    description: 'Heavy duty punching bag built for intense training sessions.',
    price: 15000,
    oldPrice: null,
    stock: 10,
    inStock: true,
    type: 'Equipment',
    sport: 'Boxing',
    badge: null,
    color: '#000000',
    size: '100cm',
    img: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=500',
    images: ['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=500'],
    specs: [{ key: 'Length', value: '100cm' }, { key: 'Weight', value: '30kg' }],
    status: 'approved'
  },

  // ── SWIMMING ──
  {
    name: 'Vanquisher 2.0 Mirrored Goggles',
    brand: 'SPEEDO',
    description: 'Anti-fog and UV protection for competitive and recreational swimming.',
    price: 4500,
    oldPrice: 5200,
    stock: 80,
    inStock: true,
    type: 'Accessories',
    sport: 'Swimming',
    badge: '-15%',
    color: '#2980b9',
    size: 'One Size',
    img: 'https://images.unsplash.com/photo-1600965962102-9d260a71890d?q=80&w=500',
    images: ['https://images.unsplash.com/photo-1600965962102-9d260a71890d?q=80&w=500'],
    specs: [{ key: 'Lens', value: 'Mirrored' }, { key: 'UV Protection', value: 'Yes' }],
    status: 'approved'
  },

  // ── BASKETBALL ──
  {
    name: 'Evolution Indoor Game Basketball',
    brand: 'WILSON',
    description: 'The #1 indoor basketball in America. Exceptional grip and feel.',
    price: 12000,
    oldPrice: 14500,
    stock: 25,
    inStock: true,
    type: 'Equipment',
    sport: 'Basketball',
    badge: 'BESTSELLER',
    color: '#f39c12',
    size: 'Size 7',
    img: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=500',
    images: ['https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=500'],
    specs: [{ key: 'Size', value: '7' }, { key: 'Use', value: 'Indoor' }],
    status: 'approved'
  },

  // ── FOOTBALL ──
  {
    name: 'Phantom GT Elite Firm Ground Boots',
    brand: 'NIKE',
    description: 'Data-driven design engineered for precise attacks on firm grass pitches.',
    price: 29000,
    oldPrice: 34000,
    stock: 15,
    inStock: true,
    type: 'Shoes',
    sport: 'Football',
    badge: 'PREMIUM',
    color: '#ffffff',
    size: '42',
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=500',
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=500'],
    specs: [{ key: 'Surface', value: 'Firm Ground' }, { key: 'Material', value: 'Flyknit' }],
    status: 'approved'
  },

  // ── PILATES ──
  {
    name: 'Pro Premium Yoga & Pilates Mat',
    brand: 'MANDUKA',
    description: 'Unmatched comfort and cushioning. Built to last a lifetime.',
    price: 18000,
    oldPrice: null,
    stock: 40,
    inStock: true,
    type: 'Equipment',
    sport: 'Pilates',
    badge: null,
    color: '#9b59b6',
    size: '6mm',
    img: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=500',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=500'],
    specs: [{ key: 'Thickness', value: '6mm' }, { key: 'Weight', value: '3.4kg' }],
    status: 'approved'
  },
];

const seedDB = async () => {
  try {
    await Product.deleteMany({});
    console.log('Products collection cleared.');
    
    await Product.insertMany(seedProducts);
    console.log('Database seeded with realistic sports products!');
    
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed products:', err);
    process.exit(1);
  }
};

seedDB();
