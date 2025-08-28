import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
	faPlus, 
	faEdit, 
	faTrash, 
	faEye, 
	faSearch, 
	faFilter,
	faSort,
	faImage,
	faLink,
	faTag,
	faDollarSign,
	faStar,
	faCheck,
	faTimes
} from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../../types/Product';
import { productAPI } from '../../../services/api';
import './ProductManager.css';

const ProductManager: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [sortBy, setSortBy] = useState<'name' | 'price' | 'date' | 'rating'>('name');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState<Product | null>(null);
	const [checkingSlug, setCheckingSlug] = useState(false);
	const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
	const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

	// Load products from backend
	useEffect(() => {
		const load = async () => {
			try {
				const resp = await productAPI.getAllProducts();
				const items: Product[] = (resp.products || []).map((p: any) => ({ ...p, id: p._id }));
				setProducts(items);
				setFilteredProducts(items);
			} catch (e) {
				// keep empty state on failure
				setProducts([]);
				setFilteredProducts([]);
			}
		};
		load();
	}, []);

	// Filter and sort products
	useEffect(() => {
		let filtered = products.filter(product => {
			const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
								product.description.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});

		// Sort products
		switch (sortBy) {
			case 'price':
				filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);
				break;
			case 'date':
				filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
				break;
			case 'rating':
				filtered.sort((a, b) => b.rating - a.rating);
				break;
			default: // name
				filtered.sort((a, b) => a.title.localeCompare(b.title));
		}

		setFilteredProducts(filtered);
	}, [products, searchTerm, selectedCategory, sortBy]);

	const handleAddProduct = () => {
		setEditingProduct(null);
		setIsModalOpen(true);
	};

	const handleEditProduct = (product: Product) => {
		setEditingProduct(product);
		setIsModalOpen(true);
	};

	const handleDeleteProduct = (product: Product) => {
		setProductToDelete(product);
		setIsDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (!productToDelete) return;
		try {
			const token = localStorage.getItem('accessToken') || '';
			await productAPI.deleteProduct(productToDelete._id, token);
			setProducts(products.filter(p => p._id !== productToDelete._id));
			setFilteredProducts(filteredProducts.filter(p => p._id !== productToDelete._id));
		} finally {
			setIsDeleteModalOpen(false);
			setProductToDelete(null);
		}
	};

	const handleSaveProduct = async (productData: Partial<Product>) => {
		const token = localStorage.getItem('accessToken') || '';
		const payload: any = { ...productData };
		if (!payload.images || payload.images.length === 0 || !payload.images[0]) {
			payload.images = ['/images/Main_LOGO.webp'];
		}
		try {
		if (editingProduct) {
				const updated = await productAPI.updateProduct(editingProduct._id, payload, token);
				setProducts(products.map(p => p._id === editingProduct._id ? updated : p));
				setFilteredProducts(filteredProducts.map(p => p._id === editingProduct._id ? updated : p));
		} else {
				const created = await productAPI.createProduct(payload, token);
				setProducts([...products, created]);
				setFilteredProducts([...filteredProducts, created]);
			}
		} finally {
		setIsModalOpen(false);
		setEditingProduct(null);
		}
	};

	const categories = [
		{ id: 'all', name: 'All Categories' },
		{ id: 'keyboard', name: 'Keyboards' },
		{ id: 'mouse', name: 'Mouse & Mousepads' },
		{ id: 'furniture', name: 'Furniture' },
		{ id: 'electronics', name: 'Electronics' },
		{ id: 'books', name: 'Books & Study Material' },
		{ id: 'accessories', name: 'Accessories' },
		{ id: 'stationery', name: 'Stationery' },
		{ id: 'cables', name: 'Cables & Connectors' },
		{ id: 'lighting', name: 'Lighting' },
		{ id: 'audio', name: 'Audio Equipment' },
		{ id: 'storage', name: 'Storage Solutions' }
	];

	const getVendorColor = (vendor: string) => {
		switch (vendor) {
			case 'amazon': return '#ff9900';
			case 'flipkart': return '#2874f0';
			default: return '#6b7280';
		}
	};

	const getStatusBadge = (isActive: boolean) => (
		<span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
			<FontAwesomeIcon icon={isActive ? faCheck : faTimes} />
			{isActive ? 'Active' : 'Inactive'}
		</span>
	);

	return (
		<div className="product-manager">
			<div className="product-manager-header">
				<h1>Product Manager</h1>
				<p>Manage your affiliate products, add new ones, and track performance</p>
			</div>

			{/* Controls Section */}
			<div className="controls-section">
				<div className="search-filters">
					<div className="search-box">
						<FontAwesomeIcon icon={faSearch} className="search-icon" />
						<input
							type="text"
							placeholder="Search products..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					
					<div className="filter-controls">
						<select 
							value={selectedCategory} 
							onChange={(e) => setSelectedCategory(e.target.value)}
						>
							{categories.map(cat => (
								<option key={cat.id} value={cat.id}>{cat.name}</option>
							))}
						</select>
						
						<select 
							value={sortBy} 
							onChange={(e) => setSortBy(e.target.value as any)}
						>
							<option value="name">Sort by Name</option>
							<option value="price">Sort by Price</option>
							<option value="date">Sort by Date</option>
							<option value="rating">Sort by Rating</option>
						</select>
					</div>
				</div>

				<button className="add-product-btn" onClick={handleAddProduct}>
					<FontAwesomeIcon icon={faPlus} />
					Add New Product
				</button>
			</div>

			{/* Products Table */}
			<div className="products-table-container">
				<table className="products-table">
					<thead>
						<tr>
							<th>Title</th>
							<th>Vendor</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredProducts.map(product => (
							<tr key={product._id}>
								<td>
									<h4>{product.title}</h4>
								</td>
								<td>
									<span 
										className="vendor-tag" 
										style={{ backgroundColor: getVendorColor(product.vendor) }}
									>
										{product.vendor}
									</span>
								</td>
								<td className="actions">
									<button 
										className="action-btn edit-btn" 
										onClick={() => handleEditProduct(product)}
										title="Edit Product"
									>
										<FontAwesomeIcon icon={faEdit} />
									</button>
									<button 
										className="action-btn delete-btn" 
										onClick={() => handleDeleteProduct(product)}
										title="Delete Product"
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Add/Edit Product Modal */}
			{isModalOpen && (
				<ProductModal
					product={editingProduct}
					onSave={handleSaveProduct}
					onClose={() => setIsModalOpen(false)}
				/>
			)}

			{/* Delete Confirmation Modal */}
			{isDeleteModalOpen && (
				<DeleteModal
					product={productToDelete}
					onConfirm={confirmDelete}
					onCancel={() => setIsDeleteModalOpen(false)}
				/>
			)}
		</div>
	);
};

// Product Modal Component
interface ProductModalProps {
	product: Product | null;
	onSave: (productData: Partial<Product>) => void;
	onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onSave, onClose }) => {
	const [formData, setFormData] = useState<Partial<Product>>({
		title: '',
		slug: '',
		affiliateUrl: '',
		vendor: 'amazon',
		images: [''],
		originalPrice: '' as any,
		discountedPrice: '' as any,
		currency: 'INR',
		description: '',
		features: [''],
		category: 'keyboard',
		isActive: true,
		rating: '' as any,
		reviewCount: '' as any,
		tags: [],
		metaTitle: '',
		metaDescription: '',
		keywords: [],
		priority: 100,
		isFeatured: false
	});

	useEffect(() => {
		document.body.classList.add('modal-open');
		return () => {
			document.body.classList.remove('modal-open');
		};
	}, []);

	useEffect(() => {
		if (product) {
			setFormData(product);
		}
	}, [product]);

	// helpers
	const toSlug = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
	const isAmazonUrl = (url: string) => /^(https?:\/\/)?(www\.)?amazon\.[a-z.]+\//i.test(url || '');
	const isFlipkartUrl = (url: string) => /^(https?:\/\/)?(www\.)?flipkart\.com\//i.test(url || '');

	// auto slug from title if slug empty
	useEffect(() => {
		if (!product && formData.title && !formData.slug) {
			setFormData(prev => ({ ...prev, slug: toSlug(formData.title || '') }));
		}
	}, [formData.title]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	const addFeature = () => {
		setFormData({
			...formData,
			features: [...(formData.features || []), '']
		});
	};

	const removeFeature = (index: number) => {
		setFormData({
			...formData,
			features: formData.features?.filter((_: string, i: number) => i !== index)
		});
	};

	const updateFeature = (index: number, value: string) => {
		const newFeatures = [...(formData.features || [])];
		newFeatures[index] = value;
		setFormData({ ...formData, features: newFeatures });
	};

	return (
		<div className="modal-overlay">
			<div className="product-modal">
				<div className="modal-header">
					<h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
					<button className="close-btn" onClick={onClose}>×</button>
				</div>

				<form onSubmit={handleSubmit} className="product-form compact">
					<div className="form-grid">
						<div className="form-group">
							<label>Product Title *</label>
							<input
								type="text"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								required
								placeholder="Enter product title"
							/>
						</div>

						<div className="form-group">
							<label>Slug *</label>
							<input
								type="text"
								value={formData.slug}
								onChange={(e) => setFormData({ ...formData, slug: toSlug(e.target.value) })}
								required
								placeholder="product-slug"
							/>
							{/* simple availability hint (client-side) */}
							<small className="hint">Slug must be unique; server enforces it.</small>
						</div>

						<div className="form-group">
							<label>Affiliate URL *</label>
							<input
								type="url"
								value={formData.affiliateUrl}
								onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
								required
								placeholder="https://..."
							/>
							{formData.affiliateUrl && !isAmazonUrl(formData.affiliateUrl) && !isFlipkartUrl(formData.affiliateUrl) && (
								<small className="warn">Use an Amazon/Flipkart product link with your affiliate tag.</small>
							)}
						</div>

						<div className="form-group">
							<label>Vendor *</label>
							<select
								value={formData.vendor}
								onChange={(e) => setFormData({ ...formData, vendor: e.target.value as any })}
							>
								<option value="amazon">Amazon</option>
								<option value="flipkart">Flipkart</option>
								<option value="other">Other</option>
							</select>
						</div>

						<div className="form-group full-width">
							<label>Image URLs</label>
							{(formData.images || ['']).map((src, i) => (
								<div key={i} className="image-row">
									<span className="drag-handle">⋮⋮</span>
									<input
										type="url"
										value={src}
										onChange={(e) => {
											const imgs = [...(formData.images || [])];
											imgs[i] = e.target.value;
											setFormData({ ...formData, images: imgs });
										}}
										placeholder="https://..."
									/>
									<button type="button" className="remove-image" onClick={() => setFormData({ ...formData, images: (formData.images || []).filter((_, idx) => idx !== i) })}>×</button>
									{src ? <div className="image-thumb"><img src={src} alt={`img-${i}`} /></div> : null}
								</div>
							))}
							<button type="button" className="add-feature-btn" onClick={() => setFormData({ ...formData, images: [...(formData.images || []), ''] })}>
								Add Image URL
							</button>
						</div>

						<div className="form-group">
							<label>Category *</label>
							<select
								value={formData.category}
								onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
							>
								<option value="keyboard">Keyboards</option>
								<option value="mouse">Mouse & Mousepads</option>
								<option value="furniture">Furniture</option>
								<option value="electronics">Electronics</option>
								<option value="books">Books & Study Material</option>
								<option value="accessories">Accessories</option>
								<option value="stationery">Stationery</option>
								<option value="cables">Cables & Connectors</option>
								<option value="lighting">Lighting</option>
								<option value="audio">Audio Equipment</option>
								<option value="storage">Storage Solutions</option>
							</select>
						</div>

						<div className="form-group">
							<label>Original Price (₹) *</label>
							<input
								type="number"
								value={formData.originalPrice}
								onChange={(e) => setFormData({ ...formData, originalPrice: (e.target.value === '' ? '' as any : Number(e.target.value)) })}
								required
								min="0"
							/>
						</div>

						<div className="form-group">
							<label>Discounted Price (₹) *</label>
							<input
								type="number"
								value={formData.discountedPrice}
								onChange={(e) => setFormData({ ...formData, discountedPrice: (e.target.value === '' ? '' as any : Number(e.target.value)) })}
								required
								min="0"
							/>
						</div>

						<div className="form-group">
							<label>Rating</label>
							<input
								type="number"
								value={formData.rating}
								onChange={(e) => setFormData({ ...formData, rating: (e.target.value === '' ? '' as any : Number(e.target.value)) })}
								min="0"
								max="5"
								step="0.1"
							/>
						</div>

						<div className="form-group">
							<label>Review Count</label>
							<input
								type="number"
								value={formData.reviewCount}
								onChange={(e) => setFormData({ ...formData, reviewCount: (e.target.value === '' ? '' as any : Number(e.target.value)) })}
								min="0"
							/>
						</div>

						<div className="form-group full-width">
							<label>Description</label>
							<textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								rows={3}
								placeholder="Enter product description"
							/>
						</div>

						<div className="form-group full-width">
							<label>Features</label>
							<div className="features-list">
								{(formData.features || []).map((feature, index) => (
									<div key={index} className="feature-item">
										<input
											type="text"
											value={feature}
											onChange={(e) => updateFeature(index, e.target.value)}
											placeholder="Enter feature"
										/>
										<button
											type="button"
											className="remove-feature-btn"
											onClick={() => removeFeature(index)}
										>
											×
										</button>
									</div>
								))}
								<button type="button" className="add-feature-btn" onClick={addFeature}>
									<FontAwesomeIcon icon={faPlus} /> Add Feature
								</button>
							</div>
						</div>

						<div className="form-group">
							<label className="checkbox-label">
								<input
									type="checkbox"
									checked={formData.isActive}
									onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
								/>
								Active Product
							</label>
						</div>

						<div className="form-group">
							<label>Priority (1-1000)</label>
							<input
								type="number"
								value={formData.priority || 100}
								onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
								min="1"
								max="1000"
								placeholder="100"
							/>
							<small className="hint">Lower numbers = higher priority (1 = highest, 1000 = lowest)</small>
						</div>

						<div className="form-group">
							<label className="checkbox-label">
								<input
									type="checkbox"
									checked={formData.isFeatured || false}
									onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
								/>
								Featured Product
							</label>
							<small className="hint">Featured products appear first in listings</small>
						</div>

						{/* SEO Fields Section */}
						<div className="form-group full-width">
							<label className="section-label">SEO Settings</label>
						</div>

						<div className="form-group">
							<label>Meta Title</label>
							<input
								type="text"
								value={formData.metaTitle || ''}
								onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
								placeholder="SEO title for search engines"
								maxLength={60}
							/>
							<small className="hint">Max 60 characters. Leave empty to use product title.</small>
						</div>

						<div className="form-group">
							<label>Meta Description</label>
							<textarea
								value={formData.metaDescription || ''}
								onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
								placeholder="SEO description for search engines"
								rows={2}
								maxLength={160}
							/>
							<small className="hint">Max 160 characters. Leave empty to use product description.</small>
						</div>

						<div className="form-group full-width">
							<label>Keywords</label>
							<div className="keywords-input">
								{(formData.keywords || []).map((keyword, index) => (
									<div key={index} className="keyword-item">
										<input
											type="text"
											value={keyword}
											onChange={(e) => {
												const newKeywords = [...(formData.keywords || [])];
												newKeywords[index] = e.target.value;
												setFormData({ ...formData, keywords: newKeywords });
											}}
											placeholder="Enter keyword"
										/>
										<button
											type="button"
											className="remove-keyword-btn"
											onClick={() => {
												const newKeywords = (formData.keywords || []).filter((_, idx) => idx !== index);
												setFormData({ ...formData, keywords: newKeywords });
											}}
										>
											×
										</button>
									</div>
								))}
								<button 
									type="button" 
									className="add-keyword-btn" 
									onClick={() => setFormData({ 
										...formData, 
										keywords: [...(formData.keywords || []), ''] 
									})}
								>
									<FontAwesomeIcon icon={faPlus} /> Add Keyword
								</button>
							</div>
							<small className="hint">Add relevant keywords for better search engine visibility.</small>
						</div>
					</div>

					<div className="modal-actions">
						<button type="button" className="btn-secondary" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className="btn-primary">
							{product ? 'Update Product' : 'Add Product'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

// Delete Confirmation Modal
interface DeleteModalProps {
	product: Product | null;
	onConfirm: () => void;
	onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ product, onConfirm, onCancel }) => {
	return (
		<div className="modal-overlay">
			<div className="delete-modal">
				<div className="modal-header">
					<h2>Delete Product</h2>
					<button className="close-btn" onClick={onCancel}>×</button>
				</div>
				<div className="modal-content">
					<p>Are you sure you want to delete <strong>"{product?.title}"</strong>?</p>
					<p>This action cannot be undone.</p>
				</div>
				<div className="modal-actions">
					<button className="btn-secondary" onClick={onCancel}>
						Cancel
					</button>
					<button className="btn-danger" onClick={onConfirm}>
						Delete Product
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductManager;
