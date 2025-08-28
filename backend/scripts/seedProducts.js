const mongoose = require('mongoose');
const Product = require('../models/Card');
const config = require('../config');

const sampleProducts = [
	{
		slug: 'mechanical-keyboard-blue',
		title: 'Mechanical Keyboard – Blue Switches',
		affiliateUrl: 'https://www.amazon.in/dp/XXXXXX?tag=yourtag',
		vendor: 'amazon',
		images: ['/images/Main_LOGO.webp'],
		originalPrice: 2999,
		discountedPrice: 1999,
		currency: 'INR',
		description: 'Perfect for typing practice with tactile feedback. Features Cherry MX Blue switches for satisfying click sound and tactile feedback.',
		features: [
			'Cherry MX Blue mechanical switches',
			'RGB backlighting with 16.8M colors',
			'Detachable USB-C cable',
			'Aluminum frame for durability',
			'Programmable macro keys',
			'N-key rollover for accuracy'
		],
		category: 'keyboard',
		isActive: true,
		tags: ['mechanical', 'rgb', 'gaming', 'typing'],
		rating: 4.5,
		reviewCount: 2847,
		stockStatus: 'in-stock'
	},
	{
		slug: 'study-table-lamp',
		title: 'Study Table LED Lamp – Eye Protection',
		affiliateUrl: 'https://www.flipkart.com/product/XXXXXX?affid=yourtag',
		vendor: 'flipkart',
		images: ['/images/Main_LOGO.webp'],
		originalPrice: 1499,
		discountedPrice: 899,
		currency: 'INR',
		description: 'Protect your eyes during long typing sessions with adjustable brightness and eye-friendly lighting.',
		features: [
			'Adjustable brightness levels',
			'Eye-friendly warm white light',
			'USB charging capability',
			'Flexible gooseneck design',
			'Memory function for settings',
			'Energy efficient LED technology'
		],
		category: 'lighting',
		isActive: true,
		tags: ['led', 'eye-protection', 'adjustable', 'study'],
		rating: 4.2,
		reviewCount: 1234,
		stockStatus: 'in-stock'
	},
	{
		slug: 'ergonomic-chair',
		title: 'Ergonomic Chair – Long Study Comfort',
		affiliateUrl: 'https://www.amazon.in/dp/YYYYYY?tag=yourtag',
		vendor: 'amazon',
		images: ['/images/Main_LOGO.webp'],
		originalPrice: 5999,
		discountedPrice: 4299,
		currency: 'INR',
		description: 'Maintain proper posture for better typing with adjustable lumbar support and breathable mesh.',
		features: [
			'Adjustable lumbar support',
			'Height adjustable mechanism',
			'Breathable mesh backrest',
			'360-degree swivel',
			'Weight capacity up to 120kg',
			'5-year warranty'
		],
		category: 'furniture',
		isActive: true,
		tags: ['ergonomic', 'office', 'comfort', 'posture'],
		rating: 4.3,
		reviewCount: 892,
		stockStatus: 'in-stock'
	},
	{
		slug: 'noise-cancelling-headphones',
		title: 'Noise Cancelling Headphones – Focus for Study',
		affiliateUrl: 'https://www.flipkart.com/product/ZZZZZZ?affid=yourtag',
		vendor: 'flipkart',
		images: ['/images/Main_LOGO.webp'],
		originalPrice: 3999,
		discountedPrice: 2799,
		currency: 'INR',
		description: 'Block distractions for focused typing practice with active noise cancellation technology.',
		features: [
			'Active noise cancellation',
			'30-hour battery life',
			'Quick charge in 10 minutes',
			'Bluetooth 5.0 connectivity',
			'Foldable design for portability',
			'Built-in microphone'
		],
		category: 'audio',
		isActive: true,
		tags: ['noise-cancelling', 'bluetooth', 'focus', 'study'],
		rating: 4.1,
		reviewCount: 567,
		stockStatus: 'in-stock'
	},
	{
		slug: 'typing-speed-book',
		title: 'Touch Typing Mastery – Speed & Accuracy',
		affiliateUrl: 'https://www.amazon.in/dp/AAAAAA?tag=yourtag',
		vendor: 'amazon',
		images: ['/images/Main_LOGO.webp'],
		originalPrice: 299,
		discountedPrice: 199,
		currency: 'INR',
		description: 'Comprehensive guide to improve typing speed and accuracy with practical exercises and techniques.',
		features: [
			'Step-by-step typing lessons',
			'Practice exercises included',
			'Speed building techniques',
			'Error reduction strategies',
			'Online practice resources',
			'Progress tracking methods'
		],
		category: 'books',
		isActive: true,
		tags: ['typing', 'speed', 'accuracy', 'learning'],
		rating: 4.4,
		reviewCount: 234,
		stockStatus: 'in-stock'
	},
	{
		slug: 'wrist-rest-pad',
		title: 'Ergonomic Wrist Rest Pad – Comfort Support',
		affiliateUrl: 'https://www.flipkart.com/product/BBBBBB?affid=yourtag',
		vendor: 'flipkart',
		images: ['/images/Main_LOGO.webp'],
		originalPrice: 499,
		discountedPrice: 299,
		currency: 'INR',
		description: 'Reduce wrist strain during long typing sessions with memory foam support.',
		features: [
			'Memory foam construction',
			'Anti-slip base',
			'Ergonomic design',
			'Machine washable cover',
			'Multiple color options',
			'Perfect keyboard fit'
		],
		category: 'accessories',
		isActive: true,
		tags: ['wrist-rest', 'ergonomic', 'comfort', 'typing'],
		rating: 4.0,
		reviewCount: 156,
		stockStatus: 'in-stock'
	}
];

async function seedProducts() {
	try {
		// Connect to MongoDB
		await mongoose.connect(config.DB_URL);
		console.log('Connected to MongoDB');

		// Clear existing products
		await Product.deleteMany({});
		console.log('Cleared existing products');

		// Insert sample products
		const insertedProducts = await Product.insertMany(sampleProducts);
		console.log(`Successfully inserted ${insertedProducts.length} products`);

		// Display inserted products
		insertedProducts.forEach(product => {
			console.log(`- ${product.title} (${product.category})`);
		});

		console.log('\nDatabase seeding completed successfully!');
	} catch (error) {
		console.error('Error seeding database:', error);
	} finally {
		// Close connection
		await mongoose.connection.close();
		console.log('Database connection closed');
	}
}

// Run the seeding function
seedProducts();
