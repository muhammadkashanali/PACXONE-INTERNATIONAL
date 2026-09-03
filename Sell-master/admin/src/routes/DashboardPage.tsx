import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { clearStoredAdminUser, getStoredAdminUser } from '@/lib/auth';
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  fetchAdminProducts,
  fetchAdminQuotes,
  fetchCategories,
  uploadProductImage,
  updateCategory,
  updateProduct,
  updateQuoteStatus,
} from '@/lib/catalog';

const TABS = ['overview', 'products', 'quotes', 'settings'] as const;
type TabKey = (typeof TABS)[number];

export function DashboardPage() {
  const navigate = useNavigate();
  const user = getStoredAdminUser();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [products, setProducts] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryEditingId, setCategoryEditingId] = useState<string | null>(null);
  const [categoryFormType, setCategoryFormType] = useState<'category' | 'subcategory'>('category');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [productParentCategory, setProductParentCategory] = useState('');

  useEffect(() => {
    if (!productImage) {
      setProductImagePreview('');
      return;
    }

    const previewUrl = URL.createObjectURL(productImage);
    setProductImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [productImage]);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    model: '',
    categoryId: 'industrial-automation',
    description: '',
    image: '',
    features: '',
    applications: '',
    availability: 'In Stock',
    featured: false,
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentCategory: '',
    sortOrder: '0',
    isActive: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [productData, quoteData, categoryData] = await Promise.all([
        fetchAdminProducts(),
        fetchAdminQuotes(),
        fetchCategories(),
      ]);
      setProducts(productData || []);
      setQuotes(quoteData || []);
      setCategories(categoryData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const stats = useMemo(
    () => ({
      total: products.length,
      inStock: products.filter((p) => p.availability === 'In Stock').length,
      featured: products.filter((p) => p.featured).length,
      quotes: quotes.length,
      categories: categories.length,
    }),
    [products, quotes, categories],
  );

  const resetForm = () => {
    const firstParent = categories.find((category) => !category.parentCategory);
    setForm({
      name: '',
      brand: '',
      model: '',
      categoryId: firstParent?.slug || categories[0]?.slug || 'industrial-automation',
      description: '',
      image: '',
      features: '',
      applications: '',
      availability: 'In Stock',
      featured: false,
    });
    setProductParentCategory(firstParent?._id || '');
    setProductImage(null);
    setEditingId(null);
  };

  const resetCategoryForm = (parentCategory = '') => {
    setCategoryFormType(parentCategory ? 'subcategory' : 'category');
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      image: '',
      parentCategory,
      sortOrder: '0',
      isActive: true,
    });
    setCategoryEditingId(null);
  };

  useEffect(() => {
    if (!categories.length) return;
    const firstParent = categories.find((category) => !category.parentCategory);
    if (!productParentCategory && firstParent?._id) setProductParentCategory(firstParent._id);
    setForm((prev) => ({
      ...prev,
      categoryId: prev.categoryId || categories[0]?.slug || 'industrial-automation',
    }));
  }, [categories, productParentCategory]);

  const fillForm = (product: any) => {
    setEditingId(product._id || product.id);
    setProductImage(null);
    const selectedCategory = categories.find((category) => category.slug === (product.categoryId || product.category?.slug) || category._id === product.category);
    const selectedParent = selectedCategory?.parentCategory
      ? categories.find((category) => category._id === selectedCategory.parentCategory)
      : selectedCategory;
    setProductParentCategory(selectedParent?._id || '');
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      model: product.model || '',
      categoryId: product.categoryId || product.category?.slug || selectedCategory?.slug || categories[0]?.slug || 'industrial-automation',
      description: product.description || '',
      image: product.image || '',
      features: Array.isArray(product.features) ? product.features.join('\n') : '',
      applications: Array.isArray(product.applications) ? product.applications.join('\n') : '',
      availability: product.availability || 'In Stock',
      featured: Boolean(product.featured),
    });
    setActiveTab('products');
  };

  const fillCategoryForm = (category: any) => {
    setCategoryEditingId(category._id || category.id);
    setCategoryFormType(category.parentCategory ? 'subcategory' : 'category');
    setCategoryForm({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
      parentCategory: category.parentCategory || '',
      sortOrder: String(category.sortOrder ?? 0),
      isActive: category.isActive !== false,
    });
    setActiveTab('settings');
  };

  const startSubcategoryForm = (parentCategory: any) => {
    resetCategoryForm(parentCategory._id || parentCategory.id);
    setActiveTab('settings');
  };

  const generateSlug = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSavingProduct(true);
      const image = productImage ? await uploadProductImage(productImage) : form.image;
      const payload = {
        ...form,
        image,
        features: form.features.split('\n').map((v) => v.trim()).filter(Boolean),
        applications: form.applications.split('\n').map((v) => v.trim()).filter(Boolean),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSavingProduct(false);
    }
  };

  const parentCategories = categories.filter((category) => !category.parentCategory);
  const subcategories = categories.filter((category) => category.parentCategory === productParentCategory);

  const handleCategorySubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (categoryFormType === 'subcategory' && !categoryForm.parentCategory) {
      setError('Select a parent category before saving the subcategory.');
      return;
    }

    try {
      const payload = {
        name: categoryForm.name,
        slug: categoryForm.slug || generateSlug(categoryForm.name),
        description: categoryForm.description,
        image: categoryForm.image,
        parentCategory: categoryForm.parentCategory || null,
        sortOrder: Number(categoryForm.sortOrder || 0),
        isActive: categoryForm.isActive,
      };

      if (categoryEditingId) {
        await updateCategory(categoryEditingId, payload);
      } else {
        await createCategory(payload);
      }

      resetCategoryForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Category save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;

    try {
      await deleteProduct(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;

    try {
      await deleteCategory(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Category delete failed');
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateQuoteStatus(id, status);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  const handleLogout = () => {
    clearStoredAdminUser();
    navigate({ to: '/login' });
  };

  if (!user) {
    navigate({ to: '/login' });
    return null;
  }

  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '32px 20px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: 2, color: '#2563eb', fontSize: 12, fontWeight: 700 }}>Admin Panel</p>
          <h1 style={{ marginTop: 8, fontSize: 36, fontWeight: 800 }}>Pacxone Management</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#4b5563' }}>{user.name}</span>
          <button onClick={handleLogout} style={{ border: '1px solid #d1d5db', borderRadius: 10, background: '#fff', padding: '10px 14px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {error && <div style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 10, padding: 12, marginBottom: 20 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: 10,
              padding: '10px 16px',
              fontWeight: 700,
              background: activeTab === tab ? '#111827' : '#fff',
              color: activeTab === tab ? '#fff' : '#111827',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[{ label: 'Products', value: stats.total }, { label: 'In Stock', value: stats.inStock }, { label: 'Featured', value: stats.featured }, { label: 'Quotes', value: stats.quotes }, { label: 'Categories', value: stats.categories }].map((card) => (
          <div key={card.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: '#6b7280' }}>{card.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{card.value}</div>
          </div>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 20 }}>Sales Snapshot</h3>
            <p style={{ margin: '0 0 10px', color: '#4b5563' }}>Products in catalog: <strong>{stats.total}</strong></p>
            <p style={{ margin: '0 0 10px', color: '#4b5563' }}>Ready to ship: <strong>{stats.inStock}</strong></p>
            <p style={{ margin: 0, color: '#4b5563' }}>Featured products: <strong>{stats.featured}</strong></p>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 20 }}>Lead Pipeline</h3>
            <p style={{ margin: '0 0 10px', color: '#4b5563' }}>New quotes: <strong>{quotes.filter((q) => (q.status || 'new') === 'new').length}</strong></p>
            <p style={{ margin: '0 0 10px', color: '#4b5563' }}>Contacted: <strong>{quotes.filter((q) => q.status === 'contacted').length}</strong></p>
            <p style={{ margin: 0, color: '#4b5563' }}>Quoted: <strong>{quotes.filter((q) => q.status === 'quoted').length}</strong></p>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 20 }}>Catalog Structure</h3>
            <p style={{ margin: '0 0 10px', color: '#4b5563' }}>Top-level categories: <strong>{categories.filter((c) => !c.parentCategory).length}</strong></p>
            <p style={{ margin: '0 0 10px', color: '#4b5563' }}>Subcategories: <strong>{categories.filter((c) => c.parentCategory).length}</strong></p>
            <p style={{ margin: 0, color: '#4b5563' }}>Active groups: <strong>{categories.filter((c) => c.isActive !== false).length}</strong></p>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>{editingId ? 'Edit Product' : 'Add Product'}</h2>
              {editingId && <button type="button" onClick={resetForm} style={{ color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer' }}>Cancel edit</button>}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" style={inputStyle} />
                <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Brand" style={inputStyle} />
                <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Model" style={inputStyle} />
                <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 700, color: '#374151' }}>
                  Parent category
                  <select required value={productParentCategory} onChange={(e) => {
                    const nextParent = e.target.value;
                    const nextSubcategory = categories.find((category) => category.parentCategory === nextParent);
                    setProductParentCategory(nextParent);
                    setForm({ ...form, categoryId: nextSubcategory?.slug || '' });
                  }} style={{ ...inputStyle, fontWeight: 400 }}>
                    <option value="">Choose parent category</option>
                    {parentCategories.map((category) => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                </label>
                <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 700, color: '#374151' }}>
                  Subcategory
                  <select required value={subcategories.some((category) => category.slug === form.categoryId) ? form.categoryId : ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} style={{ ...inputStyle, fontWeight: 400 }} disabled={!productParentCategory}>
                    <option value="">Choose subcategory</option>
                    {subcategories.map((category) => (
                      <option key={category._id} value={category.slug}>{category.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4} style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }} />
              <div style={{ display: 'grid', gap: 10 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#374151' }} htmlFor="product-image">Product image</label>
                <input
                  id="product-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    if (file && file.size > 10 * 1024 * 1024) {
                      setError('Product images must be 10MB or smaller.');
                      event.target.value = '';
                      return;
                    }
                    setError('');
                    setProductImage(file);
                  }}
                  style={{ ...inputStyle, padding: 8 }}
                />
                {(productImage || form.image) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={productImagePreview || form.image}
                      alt="Product preview"
                      style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', border: '1px solid #e5e7eb' }}
                    />
                    <span style={{ color: '#6b7280', fontSize: 13 }}>{productImage ? productImage.name : 'Current image'}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Features (one per line)" rows={6} style={{ ...inputStyle, minHeight: 150, resize: 'vertical' }} />
                <textarea value={form.applications} onChange={(e) => setForm({ ...form, applications: e.target.value })} placeholder="Applications (one per line)" rows={6} style={{ ...inputStyle, minHeight: 150, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} style={inputStyle}>
                  <option value="In Stock">In Stock</option>
                  <option value="On Order">On Order</option>
                  <option value="Limited">Limited</option>
                </select>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #d1d5db', padding: '10px 12px', borderRadius: 10 }}>
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured product
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button type="submit" disabled={savingProduct} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 18px', fontWeight: 700, cursor: savingProduct ? 'wait' : 'pointer', opacity: savingProduct ? 0.7 : 1 }}>
                  {savingProduct ? 'Uploading image...' : editingId ? 'Update Product' : 'Save Product'}
                </button>
                {editingId && <button type="button" onClick={resetForm} style={{ background: '#fff', color: '#111827', border: '1px solid #d1d5db', borderRadius: 10, padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>Clear</button>}
              </div>
            </form>
          </section>

          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Product Catalog</h2>

            {loading ? (
              <p>Loading catalog...</p>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {products.map((product: any) => (
                  <div key={product._id || product.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {product.image && <img src={product.image} alt={product.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <strong style={{ fontSize: 14 }}>{product.name}</strong>
                          <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#4b5563' }}>{product.availability}</span>
                        </div>
                        <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 12 }}>{product.model}</p>
                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                          <button type="button" onClick={() => fillForm(product)} style={{ color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                          <button type="button" onClick={() => handleDelete(product._id || product.id)} style={{ color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'quotes' && (
        <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Quote Requests</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {quotes.map((quote: any) => (
              <div key={quote._id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <strong>{quote.name}</strong>
                    <p style={{ margin: '4px 0 0', color: '#6b7280' }}>{quote.email} • {quote.company || 'No company'}</p>
                    <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 12 }}>{quote.productName || 'General inquiry'}</p>
                  </div>

                  <select value={quote.status || 'new'} onChange={(e) => handleStatus(quote._id, e.target.value)} style={{ ...inputStyle, minWidth: 150, height: 38 }}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="quoted">Quoted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 16 }}>
                  <div><div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.3, color: '#6b7280' }}>Phone</div><div style={{ marginTop: 6 }}>{quote.phone || '—'}</div></div>
                  <div><div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.3, color: '#6b7280' }}>Submitted</div><div style={{ marginTop: 6 }}>{quote.createdAt ? new Date(quote.createdAt).toLocaleString() : '—'}</div></div>
                </div>

                <div style={{ marginTop: 16, background: '#f3f4f6', borderRadius: 10, padding: 12 }}>{quote.message}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 20 }}>
          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>{categoryEditingId ? 'Edit Category' : categoryFormType === 'subcategory' ? 'Add Subcategory' : 'Add Category'}</h2>
              {!categoryEditingId && <button type="button" onClick={() => resetCategoryForm()} style={{ color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Add top-level category</button>}
              {categoryEditingId && <button type="button" onClick={resetCategoryForm} style={{ color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer' }}>Cancel</button>}
            </div>

            <form onSubmit={handleCategorySubmit} style={{ display: 'grid', gap: 16 }}>
              <input
                value={categoryForm.name}
                onChange={(e) => {
                  const nextName = e.target.value;
                  setCategoryForm({
                    ...categoryForm,
                    name: nextName,
                    slug: categoryEditingId ? categoryForm.slug : generateSlug(nextName),
                  });
                }}
                placeholder="Category name"
                style={inputStyle}
              />
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#f9fafb', padding: '10px 12px', fontSize: 13, color: '#374151' }}>
                Slug: <strong>{generateSlug(categoryForm.name) || 'auto-generated'}</strong>
              </div>
              <textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} placeholder="Description" rows={3} style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} />
              <input value={categoryForm.image} onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })} placeholder="Image URL" style={inputStyle} />

              <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 700, color: '#374151' }}>
                Parent category {categoryFormType === 'subcategory' && <span style={{ color: '#dc2626' }}>*</span>}
                <select required={categoryFormType === 'subcategory'} value={categoryForm.parentCategory} onChange={(e) => setCategoryForm({ ...categoryForm, parentCategory: e.target.value })} style={{ ...inputStyle, fontWeight: 400 }}>
                {categoryFormType !== 'subcategory' && <option value="">Top-level category</option>}
                {categories.filter((category) => !category.parentCategory).map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
                </select>
                <span style={{ fontSize: 12, fontWeight: 400, color: '#6b7280' }}>{categoryFormType === 'subcategory' ? 'Required for every subcategory.' : 'Select a parent category to save this as a subcategory.'}</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                <input value={categoryForm.sortOrder} onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: e.target.value })} type="number" placeholder="Sort order" style={inputStyle} />
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 12px' }}>
                  <input type="checkbox" checked={categoryForm.isActive} onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })} />
                  Active
                </label>
              </div>

              <button type="submit" style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
                {categoryEditingId ? 'Update Category' : 'Save Category'}
              </button>
            </form>
          </section>

          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Category Structure</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {categories.map((category) => (
                <div key={category._id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                    <div>
                      <strong>{category.name}</strong>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                        {category.parentCategory ? `Subcategory of ${categories.find((item) => item._id === category.parentCategory)?.name || 'parent'}` : 'Top-level category'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {!category.parentCategory && <button type="button" onClick={() => startSubcategoryForm(category)} style={{ color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Add subcategory</button>}
                      <button type="button" onClick={() => fillCategoryForm(category)} style={{ color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                      <button type="button" onClick={() => handleCategoryDelete(category._id)} style={{ color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #d1d5db',
  borderRadius: 10,
  padding: '10px 12px',
  fontSize: 14,
  background: '#fff',
  boxSizing: 'border-box',
};
