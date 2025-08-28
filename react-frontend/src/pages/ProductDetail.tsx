import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faSearchPlus, 
  faTimes, 
  faChevronLeft, 
  faChevronRight, 
  faExternalLinkAlt, 
  faShieldAlt, 
  faTruck, 
  faUndo, 
  faCheckCircle, 
  faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';
import { Product } from '../types/Product';
import { productAPI } from '../services/api';
import './ProductDetail.css';

const ProductCard = lazy(() => import('../components/ProductCard/ProductCard'));

// Analytics tracking function
const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  try {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
    
    // Custom analytics
    console.log('Analytics Event:', eventName, properties);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageZoom, setShowImageZoom] = useState(false);

  // Memoized calculations
  const { discountPercentage, savings } = useMemo(() => {
    if (!product) return { discountPercentage: 0, savings: 0 };
    
    const discount = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);
    const save = product.originalPrice - product.discountedPrice;
    
    return { discountPercentage: discount, savings: save };
  }, [product]);

  // Memoized affiliate URL
  const affiliateUrl = useMemo(() => {
    if (!product) return '';
    
    try {
      const url = new URL(product.affiliateUrl);
      url.searchParams.set('utm_source', 'rdx');
      url.searchParams.set('utm_medium', 'affiliate');
      url.searchParams.set('utm_campaign', 'product_detail');
      url.searchParams.set('utm_content', product.slug);
      return url.toString();
    } catch (error) {
      console.error('Invalid affiliate URL:', error);
      return product.affiliateUrl;
    }
  }, [product]);

  // Sample products for fallback
  const sampleProducts: Product[] = [
    {
      _id: 'sample-1',
      title: 'Mechanical Gaming Keyboard',
      slug: 'mechanical-gaming-keyboard',
      description: 'High-quality mechanical gaming keyboard with RGB backlighting and customizable switches.',
      category: 'keyboard',
      vendor: 'amazon',
      originalPrice: 2999,
      discountedPrice: 1999,
      currency: 'INR',
      rating: 4.5,
      reviewCount: 1250,
      images: ['/images/Main_LOGO.webp'],
      features: ['RGB Backlighting', 'Mechanical Switches', 'Gaming Grade', 'Customizable'],
      specs: { 'Switch Type': 'Blue', 'Layout': 'Full Size', 'Connection': 'USB-C' },
      affiliateUrl: 'https://amazon.in',
      isActive: true,
      tags: ['gaming', 'mechanical', 'rgb', 'keyboard'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'sample-2',
      title: 'Wireless Ergonomic Mouse',
      slug: 'wireless-ergonomic-mouse',
      description: 'Comfortable wireless mouse designed for long hours of work and gaming.',
      category: 'mouse',
      vendor: 'flipkart',
      originalPrice: 1499,
      discountedPrice: 999,
      currency: 'INR',
      rating: 4.3,
      reviewCount: 890,
      images: ['/images/Main_LOGO.webp'],
      features: ['Wireless', 'Ergonomic Design', 'Long Battery Life', 'Precision Tracking'],
      specs: { 'DPI': '2400', 'Battery': '6 Months', 'Connection': '2.4GHz' },
      affiliateUrl: 'https://flipkart.com',
      isActive: true,
      tags: ['wireless', 'ergonomic', 'gaming', 'mouse'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'sample-3',
      title: 'Gaming Headset with Mic',
      slug: 'gaming-headset-mic',
      description: 'Immersive gaming headset with noise-canceling microphone and surround sound.',
      category: 'headset',
      vendor: 'amazon',
      originalPrice: 2499,
      discountedPrice: 1799,
      currency: 'INR',
      rating: 4.4,
      reviewCount: 756,
      images: ['/images/Main_LOGO.webp'],
      features: ['7.1 Surround Sound', 'Noise Canceling Mic', 'Comfortable Padding', 'RGB Lighting'],
      specs: { 'Driver Size': '50mm', 'Frequency': '20Hz-20kHz', 'Connection': 'USB/3.5mm' },
      affiliateUrl: 'https://amazon.in',
      isActive: true,
      tags: ['gaming', 'headset', 'microphone', 'surround-sound'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'sample-4',
      title: 'USB-C Hub Adapter',
      slug: 'usb-c-hub-adapter',
      description: 'Multi-port USB-C hub for expanding connectivity options on modern devices.',
      category: 'accessories',
      vendor: 'flipkart',
      originalPrice: 899,
      discountedPrice: 599,
      currency: 'INR',
      rating: 4.2,
      reviewCount: 432,
      images: ['/images/Main_LOGO.webp'],
      features: ['Multiple Ports', '4K HDMI', 'SD Card Reader', 'Fast Charging'],
      specs: { 'Ports': '7-in-1', 'HDMI': '4K@30Hz', 'USB': '3.0' },
      affiliateUrl: 'https://flipkart.com',
      isActive: true,
      tags: ['usb-c', 'hub', 'adapter', 'connectivity'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Fetch product data
  const fetchProduct = useCallback(async (productSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await productAPI.getProductBySlug(productSlug);
      setProduct(data);
      
      // Track product view
      trackEvent('product_view', {
        product_id: data._id,
        product_name: data.title,
        product_category: data.category,
        product_vendor: data.vendor,
        product_price: data.discountedPrice
      });
      
      // Fetch related products
      if (data.category) {
        try {
          const relatedResponse = await productAPI.getProductsByCategory(data.category, 1, 8);
          const filteredRelated = relatedResponse.products
            .filter((p: Product) => p._id !== data._id && p.isActive)
            .slice(0, 4);
          setRelatedProducts(filteredRelated);
          console.log('Related products loaded:', filteredRelated.length);
        } catch (err) {
          console.log('Could not load related products:', err);
          // Try to get any products as fallback
          try {
            const allProductsResponse = await productAPI.getAllProducts({ limit: 8 });
            const fallbackRelated = allProductsResponse.products
              .filter((p: Product) => p._id !== data._id && p.isActive)
              .slice(0, 4);
            setRelatedProducts(fallbackRelated);
            console.log('Fallback related products loaded:', fallbackRelated.length);
          } catch (fallbackErr) {
            console.log('Could not load fallback products:', fallbackErr);
            // Use sample products as final fallback
            setRelatedProducts(sampleProducts);
            console.log('Sample products loaded as fallback');
          }
        }
      } else {
        // If no category, use sample products
        setRelatedProducts(sampleProducts);
        console.log('Sample products loaded (no category)');
      }
    } catch (e) {
      console.error('Error fetching product:', e);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch product on mount
  useEffect(() => {
    if (slug) {
      fetchProduct(slug);
    }
  }, [slug, fetchProduct]);

  // Image navigation handlers
  const nextImage = useCallback(() => {
    if (!product) return;
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  }, [product]);

  const prevImage = useCallback(() => {
    if (!product) return;
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  }, [product]);

  // Image zoom handlers
  const openImageZoom = useCallback(() => {
    setShowImageZoom(true);
    trackEvent('image_zoom_open', {
      product_id: product?._id,
      image_index: selectedImageIndex
    });
  }, [product?._id, selectedImageIndex]);

  const closeImageZoom = useCallback(() => {
    setShowImageZoom(false);
  }, []);

  // Buy button click handler
  const handleBuyClick = useCallback(() => {
    trackEvent('buy_button_click', {
      product_id: product?._id,
      product_name: product?.title,
      product_vendor: product?.vendor,
      product_price: product?.discountedPrice
    });
  }, [product]);

  // Loading state
  if (loading) {
    return (
      <div className="product-detail-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="product-detail-page error">
        <Helmet>
          <title>Product Not Found - RDX</title>
          <meta name="description" content="The product you are looking for does not exist." />
        </Helmet>
        <div className="error-message">
          <h2>Product Not Found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/products" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Image Zoom Modal Component
  const ImageZoomModal = () => (
    <div className="image-zoom-modal" onClick={closeImageZoom}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeImageZoom}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <img 
          src={product.images[selectedImageIndex]} 
          alt={product.title}
          loading="lazy"
        />
        <div className="modal-thumbnails">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.title} ${index + 1}`}
              className={index === selectedImageIndex ? 'active' : ''}
              onClick={() => setSelectedImageIndex(index)}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{`${product.title} - ${product.vendor} | RDX`}</title>
        <meta name="description" content={product.description} />
        <meta name="keywords" content={`${product.title}, ${product.category}, ${product.vendor}, keyboard, typing`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:type" content="product" />
        <meta property="og:price:amount" content={product.discountedPrice.toString()} />
        <meta property="og:price:currency" content="INR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.title} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={product.images[0]} />
        
        {/* Product Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "description": product.description,
            "image": product.images,
            "brand": {
              "@type": "Brand",
              "name": product.vendor
            },
            "offers": {
              "@type": "Offer",
              "price": product.discountedPrice,
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": product.vendor
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating,
              "reviewCount": product.reviewCount
            }
          })}
        </script>
      </Helmet>

    <div className="product-detail-page">
        <div className="product-detail-container">
      {/* Product Images Section */}
          <section className="product-images-section">
        <div className="main-image-container">
          <img
            src={product.images[selectedImageIndex]}
            alt={product.title}
            className="main-image"
                onClick={openImageZoom}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/Main_LOGO.webp';
                }}
                loading="lazy"
              />
              <button 
                className="zoom-button" 
                onClick={openImageZoom}
                aria-label="Zoom image"
              >
            <FontAwesomeIcon icon={faSearchPlus} />
          </button>
              {product.images.length > 1 && (
                <>
                  <button 
                    className="nav-button prev" 
                    onClick={prevImage}
                    aria-label="Previous image"
                  >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
                  <button 
                    className="nav-button next" 
                    onClick={nextImage}
                    aria-label="Next image"
                  >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
                </>
              )}
        </div>
            {product.images.length > 1 && (
        <div className="image-thumbnails">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.title} ${index + 1}`}
              className={index === selectedImageIndex ? 'active' : ''}
              onClick={() => setSelectedImageIndex(index)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/Main_LOGO.webp';
                    }}
                    loading="lazy"
            />
          ))}
        </div>
            )}
          </section>

      {/* Product Info Section */}
          <section className="product-info-section">
            <header className="product-header">
          <h1 className="product-title">{product.title}</h1>
              <div className="pd-vendor-badge">
                <span className={`pd-vendor pd-${product.vendor}`}>
                  {product.vendor.toUpperCase()}
            </span>
          </div>
            </header>

        <div className="rating-section">
              <div className="stars" role="img" aria-label={`${product.rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className={i < Math.floor(product.rating) ? 'filled' : 'empty'}
              />
            ))}
          </div>
          <span className="rating-text">{product.rating} out of 5</span>
              <span className="review-count">({product.reviewCount.toLocaleString()} reviews)</span>
        </div>

        <div className="pricing-section">
          <div className="price-container">
            <span className="discounted-price">₹{product.discountedPrice.toLocaleString()}</span>
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
            <span className="discount-badge">-{discountPercentage}%</span>
          </div>
          <div className="savings">
            You save ₹{savings.toLocaleString()} ({discountPercentage}% off)
          </div>
        </div>

        <div className="action-buttons">
          <a
                href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="buy-now-button"
                onClick={handleBuyClick}
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} />
                Buy Now on {product.vendor}
          </a>
        </div>

        <div className="trust-security-section">
          <h3>Trust & Security</h3>
          <div className="trust-features">
            <div className="trust-feature">
              <FontAwesomeIcon icon={faShieldAlt} />
              <span>Secure Affiliate Links</span>
            </div>
            <div className="trust-feature">
              <FontAwesomeIcon icon={faTruck} />
              <span>Fast Delivery</span>
            </div>
            <div className="trust-feature">
              <FontAwesomeIcon icon={faUndo} />
              <span>Easy Returns</span>
            </div>
            <div className="trust-feature">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>Genuine Products</span>
            </div>
          </div>
        </div>

            <div className="product-description">
              <h3>Product Description</h3>
              <p>{product.description}</p>
            </div>

        <div className="product-highlights">
          <h3>Product Highlights</h3>
          <ul>
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

            {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="product-information">
          <h3>Product Information</h3>
          <div className="info-grid">
                  {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="info-item">
                <span className="info-label">{key}:</span>
                <span className="info-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
            )}
          </section>
      </div>

      {/* Related Products */}
        <section className="related-products">
        <h3>You might also like</h3>
          {relatedProducts.length > 0 ? (
        <div className="related-products-grid">
          <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.slug}
                product={relatedProduct}
              />
            ))}
          </Suspense>
        </div>
          ) : (
            <div className="no-related-products">
              <p>No related products found. Check out our other products!</p>
              <Link to="/products" className="browse-all-button">
                Browse All Products
              </Link>
      </div>
          )}
        </section>

      {showImageZoom && <ImageZoomModal />}
    </div>
    </>
  );
};

export default ProductDetail;
