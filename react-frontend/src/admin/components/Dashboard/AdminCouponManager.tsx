import React, { useState, useRef, useEffect } from 'react';

// Coupon and Card types
interface Card {
  id: number;
  title: string;
}

interface Coupon {
  id: number;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  appliesTo: number[]; // card ids
}

// Mock data
const mockCards: Card[] = [
  { id: 1, title: 'Typing Master Course' },
  { id: 2, title: 'Speed Booster' },
  { id: 3, title: 'Accuracy Booster' },
];

const initialCoupons: Coupon[] = [
  {
    id: 1,
    code: 'SAVE20',
    discountType: 'percentage',
    discountValue: 20,
    validFrom: '2024-06-01',
    validTo: '2024-06-30',
    isActive: true,
    appliesTo: [1, 2],
  },
  {
    id: 2,
    code: 'FLAT100',
    discountType: 'flat',
    discountValue: 100,
    validFrom: '2024-06-10',
    validTo: '2024-07-10',
    isActive: false,
    appliesTo: [3],
  },
];

const AdminCouponManager: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState<Partial<Coupon>>({ appliesTo: [] });
  const [courseFilter, setCourseFilter] = useState<number | 'all'>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'appliesTo') {
      // Only checkboxes will trigger this, so safe to cast
      const checked = (e.target as HTMLInputElement).checked;
      const id = Number(value);
      setForm(prev => {
        const arr = prev.appliesTo as number[];
        if (checked) {
          return { ...prev, appliesTo: [...arr, id] };
        } else {
          return { ...prev, appliesTo: arr.filter(cid => cid !== id) };
        }
      });
    } else if (name === 'isActive') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, isActive: checked }));
    } else if (name === 'discountType') {
      setForm(prev => ({ ...prev, discountType: value as 'percentage' | 'flat' }));
    } else if (type === 'number') {
      setForm(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add or update coupon
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoupon) {
      setCoupons(coupons.map(c => c.id === editingCoupon.id ? { ...editingCoupon, ...form, appliesTo: form.appliesTo as number[] } : c));
    } else {
      setCoupons([
        ...coupons,
        {
          id: Date.now(),
          code: form.code || '',
          discountType: form.discountType || 'percentage',
          discountValue: form.discountValue || 0,
          validFrom: form.validFrom || '',
          validTo: form.validTo || '',
          isActive: form.isActive ?? true,
          appliesTo: form.appliesTo as number[] || [],
        },
      ]);
    }
    setShowForm(false);
    setEditingCoupon(null);
    setForm({ appliesTo: [] });
  };

  // Edit coupon
  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({ ...coupon });
    setShowForm(true);
  };

  // Delete coupon
  const handleDelete = (id: number) => {
    if (!window.confirm('Delete this coupon?')) return;
    setCoupons(coupons.filter(c => c.id !== id));
  };

  // Toggle active
  const handleToggleActive = (id: number) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  // Add new coupon
  const handleAddNew = () => {
    setEditingCoupon(null);
    setForm({ appliesTo: [] });
    setShowForm(true);
  };

  // Filtered coupons based on courseFilter
  const filteredCoupons = courseFilter === 'all'
    ? coupons
    : coupons.filter(coupon => coupon.appliesTo.includes(courseFilter as number));

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2 style={{ color: '#1976d2', marginBottom: 18 }}>Coupon Management</h2>
      <button onClick={handleAddNew} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, marginBottom: 24, cursor: 'pointer' }}>Add New Coupon</button>
      {/* Course filter dropdown */}
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ fontWeight: 500 }}>Filter by Course:</label>
        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} style={{ padding: 7, borderRadius: 6, border: '1px solid #bdbdbd' }}>
          <option value="all">All Courses</option>
          {mockCards.map(card => (
            <option key={card.id} value={card.id}>{card.title}</option>
          ))}
        </select>
      </div>
      {showForm && (
        <div style={{ background: '#f8fafc', border: '1.5px solid #90caf9', borderRadius: 14, padding: 20, marginBottom: 32, boxShadow: '0 2px 12px rgba(25,118,210,0.07)', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          <h3 style={{ color: '#1976d2', marginBottom: 18, textAlign: 'center' }}>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h3>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Coupon Code</label>
              <input name="code" value={form.code || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd' }} />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Discount Type</label>
                <select name="discountType" value={form.discountType || 'percentage'} onChange={handleFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd' }}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Discount Value</label>
                <input name="discountValue" type="number" value={form.discountValue || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Valid From</label>
                <input name="validFrom" type="date" value={form.validFrom || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Valid To</label>
                <input name="validTo" type="date" value={form.validTo || ''} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd' }} />
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Applies To (Select Courses)</label>
              <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
                <div
                  style={{
                    border: '1px solid #bdbdbd',
                    borderRadius: 6,
                    padding: '8px',
                    background: '#fff',
                    minHeight: 40,
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => setDropdownOpen(open => !open)}
                >
                  {Array.isArray(form.appliesTo) && form.appliesTo.length > 0
                    ? mockCards.filter(card => (Array.isArray(form.appliesTo) ? form.appliesTo.includes(card.id) : false)).map(card => card.title).join(', ')
                    : <span style={{ color: '#888' }}>Select courses...</span>}
                  <span style={{ float: 'right', fontWeight: 700, color: '#1976d2' }}>{dropdownOpen ? '\u25B2' : '\u25BC'}</span>
                </div>
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#fff',
                      border: '1px solid #bdbdbd',
                      borderRadius: 6,
                      boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
                      zIndex: 10,
                      padding: 8,
                      marginTop: 2,
                      maxHeight: 180,
                      overflowY: 'auto',
                    }}
                  >
                    {mockCards.map(card => (
                      <label key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={Array.isArray(form.appliesTo) && form.appliesTo.includes(card.id)}
                          onChange={e => {
                            const checked = e.target.checked;
                            setForm(prev => {
                              const arr = Array.isArray(prev.appliesTo) ? prev.appliesTo : [];
                              if (checked) {
                                return { ...prev, appliesTo: [...arr, card.id] };
                              } else {
                                return { ...prev, appliesTo: arr.filter(cid => cid !== card.id) };
                              }
                            });
                          }}
                        />
                        {card.title}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" name="isActive" checked={form.isActive ?? true} onChange={handleFormChange} />
                Active
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
              <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 600, cursor: 'pointer' }}>{editingCoupon ? 'Update Coupon' : 'Add Coupon'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingCoupon(null); setForm({ appliesTo: [] }); }} style={{ background: '#bdbdbd', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div style={{ marginBottom: 18, fontWeight: 600, color: '#1976d2', fontSize: 18 }}>All Coupons</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {filteredCoupons.map(coupon => (
          <div key={coupon.id} style={{ background: '#fff', border: '1.5px solid #e3f2fd', borderRadius: 12, boxShadow: '0 1px 8px rgba(25,118,210,0.04)', padding: 18, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 18 }}>
            <div style={{ flex: 2, minWidth: 180 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1976d2' }}>{coupon.code}</div>
              <div style={{ fontSize: 13, color: '#1a2a44', margin: '2px 0 6px 0' }}>
                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}
              </div>
              <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>
                <b>Valid:</b> {coupon.validFrom} to {coupon.validTo}
              </div>
              <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>
                <b>Applies To:</b> {coupon.appliesTo.length === mockCards.length ? 'All Courses' : mockCards.filter(card => coupon.appliesTo.includes(card.id)).map(card => card.title).join(', ') || 'None'}
              </div>
              <div style={{ fontSize: 13, color: coupon.isActive ? '#43a047' : '#d6001c', fontWeight: 600 }}>{coupon.isActive ? 'Active' : 'Inactive'}</div>
            </div>
            <div style={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <button onClick={() => handleToggleActive(coupon.id)} style={{ background: coupon.isActive ? '#43a047' : '#bdbdbd', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, fontSize: 14, marginBottom: 6, cursor: 'pointer', boxShadow: coupon.isActive ? '0 2px 8px #43a04722' : undefined }}>
                {coupon.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleEdit(coupon)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDelete(coupon.id)} style={{ background: '#d6001c', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCouponManager; 