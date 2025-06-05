import React, { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAll, setSearchAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://telegram-catalog-api.onrender.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        const uniqueCategories = [...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
        setSelectedCategory(uniqueCategories[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка загрузки:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = products.filter(p => {
      const matchCategory = searchAll || p.category === selectedCategory;
      const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, searchAll]);

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial',
        minHeight: '100vh',
        backgroundImage: 'url("bg.png")', // Путь к картинке в public/bg.png
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>📦 Каталог товаров</h1>

        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <>
            <div style={{ marginBottom: '10px' }}>
              <label>Категория: </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={searchAll}
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>

              <label style={{ marginLeft: '20px' }}>
                <input
                  type="checkbox"
                  checked={searchAll}
                  onChange={(e) => setSearchAll(e.target.checked)}
                />
                {' '}Искать по всем категориям
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="🔍 Поиск товара..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px',
                  width: '300px',
                  borderRadius: '5px',
                  border: '1px solid #ccc'
                }}
              />
            </div>

            {filteredProducts.length === 0 ? (
              <p>Нет товаров по выбранным критериям.</p>
            ) : (
              filteredProducts.map((p, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    padding: '10px',
                    marginBottom: '10px',
                    boxShadow: '2px 2px 8px rgba(0,0,0,0.05)',
                    backgroundColor: '#fff'
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{p.name}</div>
                  <div>💰 Цена: <b>{p.price ? `${p.price} ₽` : '—'}</b></div>
                  <div>📁 Категория: {p.category}</div>
                  <div>🔖 Артикул товара: {p.article || '—'}</div>
                  <div style={{ marginTop: '5px', color: p.stock > 0 ? 'green' : 'red' }}>
                    📦 {p.in_stock}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
