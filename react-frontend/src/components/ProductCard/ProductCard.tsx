import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, calculateDiscountPercent } from '../../types/Product';
import './ProductCard.css';

interface ProductCardProps {
	product: Product;
	onBuyNow?: (product: Product) => void; // optional handler; defaults to window.open affiliate link
}

const formatCurrency = (amount: number, currency: string = 'INR'): string => {
	try {
		// Remove decimal places and format as ₹1999 instead of ₹1,999.00
		return `₹${amount.toLocaleString('en-IN')}`;
	} catch {
		return `₹${amount}`;
	}
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow }) => {
	const navigate = useNavigate();
	const { title, slug, images, originalPrice, discountedPrice, currency, affiliateUrl, vendor } = product;
	const discountPercent = calculateDiscountPercent(originalPrice, discountedPrice);
	const mainImage = images && images.length > 0 ? images[0] : '/images/placeholder.webp';

	// Use product rating/reviews when available
	const rating = typeof product.rating === 'number' ? product.rating : 0;
	const reviewCount = typeof product.reviewCount === 'number' ? product.reviewCount : 0;

	const handleViewDetails = () => {
		navigate(`/products/${slug}`);
	};

	const handleBuyNow = () => {
		if (onBuyNow) return onBuyNow(product);
		const url = new URL(affiliateUrl);
		url.searchParams.set('utm_source', 'rdx');
		url.searchParams.set('utm_medium', 'affiliate');
		url.searchParams.set('utm_campaign', 'products');
		url.searchParams.set('utm_content', slug);
		window.open(url.toString(), '_blank', 'noopener,noreferrer');
	};

	const renderStars = (rating: number) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		// Full stars
		for (let i = 0; i < fullStars; i++) {
			stars.push(<span key={`full-${i}`} className="star full">★</span>);
		}

		// Half star
		if (hasHalfStar) {
			stars.push(<span key="half" className="star half">★</span>);
		}

		// Empty stars
		const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
		for (let i = 0; i < emptyStars; i++) {
			stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
		}

		return stars;
	};

	return (
		<div className="product-card">
			<div className="product-image-wrapper">
				<img src={mainImage} alt={title} className="product-image" loading="lazy" />
				<div className={`vendor-badge vendor-${vendor}`}>{vendor}</div>
			</div>
			<div className="product-content">
				<h3 className="product-title" title={title}>{title}</h3>
				
				{/* Rating & Reviews */}
				<div className="rating-reviews">
					<div className="stars">{renderStars(rating)}</div>
					<span className="rating-text">{rating}/5</span>
					<span className="review-count">({reviewCount.toLocaleString()} reviews)</span>
				</div>

				<div className="product-pricing">
					<span className="discounted">{formatCurrency(discountedPrice, currency)}</span>
					{originalPrice > discountedPrice && (
						<>
							<span className="original">{formatCurrency(originalPrice, currency)}</span>
							{discountPercent > 0 && (
								<span className="discount-percent">-{discountPercent}%</span>
							)}
						</>
					)}
				</div>
				<div className="product-actions">
					<button className="btn details-btn" onClick={handleViewDetails}>View Details</button>
					<button className="btn buy-btn" onClick={handleBuyNow}>Buy Now</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
