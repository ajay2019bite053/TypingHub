import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faKeyboard, faLightbulb, faChair, faHeadphones, faBook, faLaptop } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../components/ProductCard/ProductCard';
import { Product } from '../types/Product';
import { productAPI } from '../services/api';
import './TypingEssential.css';

const TypingEssential: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [sortBy, setSortBy] = useState<'featured' | 'name' | 'price-low' | 'price-high' | 'discount'>('featured');
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSearching, setIsSearching] = useState(false);

	// Debounce search term - wait 500ms after user stops typing
	useEffect(() => {
		if (searchTerm !== debouncedSearchTerm) {
			setIsSearching(true);
		}
		
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
			setIsSearching(false);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchTerm, debouncedSearchTerm]);

	// Fetch products from API (only once on load)
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				setError(null);
				
				const params: any = {};
				if (selectedCategory !== 'all') params.category = selectedCategory;
				if (sortBy !== 'name') params.sortBy = sortBy;
				
				const response = await productAPI.getAllProducts(params);
				setProducts(response.products || []);
			} catch (err) {
				console.error('Error fetching products:', err);
				setError('Failed to load products. Please try again.');
				setProducts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [selectedCategory, sortBy]);

	// Client-side filtering like ExamWiseTest
	const filteredProducts = useMemo(() => {
		let filtered = products.filter(product => {
			const searchLower = searchTerm.toLowerCase();
			
			// Search in multiple fields
			const matchesTitle = product.title.toLowerCase().includes(searchLower);
			const matchesDescription = product.description?.toLowerCase().includes(searchLower);
			const matchesCategory = product.category.toLowerCase().includes(searchLower);
			const matchesVendor = product.vendor.toLowerCase().includes(searchLower);
			const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(searchLower));
			const matchesFeatures = product.features?.some(feature => feature.toLowerCase().includes(searchLower));
			
			return matchesTitle || matchesDescription || matchesCategory || matchesVendor || matchesTags || matchesFeatures;
		});

		// Sort products
		switch (sortBy) {
			case 'featured':
				// Featured products first with priority system
				filtered.sort((a, b) => {
					// Priority 1: Featured products
					if (a.isFeatured && !b.isFeatured) return -1;
					if (!a.isFeatured && b.isFeatured) return 1;
					
					// Priority 2: Priority number (lower = higher priority)
					if (a.priority !== b.priority) {
						return (a.priority || 100) - (b.priority || 100);
					}
					
					// Priority 3: Best discounts
					const discountA = ((a.originalPrice - a.discountedPrice) / a.originalPrice) * 100;
					const discountB = ((b.originalPrice - b.discountedPrice) / b.originalPrice) * 100;
					
					if (Math.abs(discountA - discountB) > 5) {
						return discountB - discountA; // Best discounts first
					}
					
					// Priority 4: Alphabetical
					return a.title.localeCompare(b.title);
				});
				break;
			case 'price-low':
				filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);
				break;
			case 'price-high':
				filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);
				break;
			case 'discount':
				filtered.sort((a, b) => {
					const discountA = ((a.originalPrice - a.discountedPrice) / a.originalPrice) * 100;
					const discountB = ((b.originalPrice - b.discountedPrice) / b.originalPrice) * 100;
					return discountB - discountA;
				});
				break;
			default: // name
				filtered.sort((a, b) => a.title.localeCompare(b.title));
		}

		return filtered;
	}, [products, searchTerm, sortBy]);

	const categories = [
		{ id: 'all', name: 'All Categories', icon: faSearch },
		{ id: 'keyboard', name: 'Keyboards', icon: faKeyboard },
		{ id: 'lighting', name: 'Lighting', icon: faLightbulb },
		{ id: 'furniture', name: 'Furniture', icon: faChair },
		{ id: 'audio', name: 'Audio', icon: faHeadphones },
		{ id: 'books', name: 'Books', icon: faBook },
		{ id: 'accessories', name: 'Accessories', icon: faLaptop }
	];

	if (loading) {
		return (
			<div id="typing-essential-page">
				<div className="loading-container">
					<div className="loading-spinner"></div>
					<p>Loading products...</p>
				</div>
			</div>
		);
	}

	return (
		<div id="typing-essential-page">
			<Helmet>
				<title>Typing Essential - Premium Tools for Typing Practice | TypingHub.in</title>
				<meta name="description" content="Discover premium typing tools and study essentials. Find the best keyboards, ergonomic chairs, LED lamps, and accessories for typing practice. Curated products from Amazon and Flipkart with exclusive discounts." />
				<meta name="keywords" content="typing tools, keyboard, ergonomic chair, LED lamp, study accessories, typing practice, Amazon, Flipkart, typing speed, typing test, government exam typing" />
				<meta name="author" content="TypingHub.in" />
				<meta name="robots" content="index, follow" />
				
				{/* Open Graph Meta Tags */}
				<meta property="og:title" content="Typing Essential - Premium Tools for Typing Practice" />
				<meta property="og:description" content="Discover premium typing tools and study essentials. Find the best keyboards, ergonomic chairs, LED lamps, and accessories for typing practice." />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://typinghub.in/typing-essential" />
				<meta property="og:site_name" content="TypingHub.in" />
				<meta property="og:image" content="https://typinghub.in/images/Main_LOGO.webp" />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				
				{/* Twitter Card Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Typing Essential - Premium Tools for Typing Practice" />
				<meta name="twitter:description" content="Discover premium typing tools and study essentials. Find the best keyboards, ergonomic chairs, LED lamps, and accessories for typing practice." />
				<meta name="twitter:image" content="https://typinghub.in/images/Main_LOGO.webp" />
				
				{/* Additional SEO Meta Tags */}
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="language" content="English" />
				<meta name="revisit-after" content="7 days" />
				<meta name="distribution" content="global" />
				
				{/* Canonical URL */}
				<link rel="canonical" href="https://typinghub.in/typing-essential" />
				
				{/* Structured Data for Product Listing */}
				<script type="application/ld+json">
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebPage",
						"name": "Typing Essential - Premium Tools for Typing Practice",
						"description": "Discover premium typing tools and study essentials. Find the best keyboards, ergonomic chairs, LED lamps, and accessories for typing practice.",
						"url": "https://typinghub.in/typing-essential",
						"mainEntity": {
							"@type": "ItemList",
							"name": "Typing Tools and Study Essentials",
							"description": "Curated collection of premium typing tools and study accessories",
							"numberOfItems": filteredProducts.length,
							"itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
								"@type": "ListItem",
								"position": index + 1,
								"item": {
									"@type": "Product",
									"name": product.title,
									"description": product.description,
									"image": product.images[0],
									"offers": {
										"@type": "Offer",
										"price": product.discountedPrice,
										"priceCurrency": "INR",
										"availability": "https://schema.org/InStock"
									}
								}
							}))
						}
					})}
				</script>
			</Helmet>
			
			{/* Minimal Header */}
			<div className="typing-essential-header">
				<div className="header-content">
					<div className="vendor-logos">
						<div className="vendor-logo amazon-logo">
							<img src="/images/amazon-logo.png" alt="Amazon" />
						</div>
						<div className="vendor-logo flipkart-logo">
							<img src="/images/flipkart-logo.png" alt="Flipkart" />
						</div>
					</div>
				<h1>Boost Your Typing Speed with Premium Tools</h1>
				</div>
			</div>

			{/* Large Search Section */}
			<div className="search-section">
				<div className="search-container">
					<div className="search-input-wrapper">
						{/* Search Input Container */}
						<div className="search-input-container">
							<FontAwesomeIcon icon={faSearch} className="search-icon-large" />
							<input
								type="text"
								placeholder="Search for anything - keyboards, chairs, books, amazon, flipkart..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="search-input-large"
							/>
							{isSearching && (
								<div className="search-processing">
									<div className="search-spinner"></div>
								</div>
							)}
						</div>
						
						{/* All filters on the right side */}
						<div className="filters-right">
							{/* Category Dropdown */}
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="category-dropdown"
							>
								{categories.map(category => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
							
							{/* Sort Filter */}
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as any)}
							className="sort-filter-right"
						>
								<option value="featured">Featured First</option>
							<option value="name">Sort by Name</option>
							<option value="price-low">Price: Low to High</option>
							<option value="price-high">Price: High to Low</option>
							<option value="discount">Best Discount</option>
						</select>
						</div>
					</div>
					{searchTerm && (
						<div className="search-results">
							<span>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</span>
						</div>
					)}
				</div>
			</div>

			{/* Products Container */}
			<div className="products-container">
				{error && (
					<div className="error-message">
						<p>{error}</p>
					</div>
				)}
				
				{filteredProducts.length > 0 ? (
					<div className="products-grid">
						{filteredProducts.map(product => (
							<ProductCard key={product.slug} product={product} />
						))}
					</div>
				) : (
					<div className="no-products">
						<FontAwesomeIcon icon={faSearch} className="no-products-icon" />
						<h3>No products found</h3>
						<p>Try adjusting your search or filters</p>
					</div>
				)}
			</div>

			{/* Affiliate Disclosure */}
			<div className="affiliate-disclosure">
				<p>
					<strong>Affiliate Disclosure:</strong> This page contains affiliate links. 
					We may earn a commission when you purchase through these links at no extra cost to you.
				</p>
			</div>
		</div>
	);
};

export default TypingEssential;
