import React, { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAll, setSearchAll] = useState(true);
  const [loading, setLoading] = useState(true);
  const [delayedMessageVisible, setDelayedMessageVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedMessageVisible(true);
    }, 4000);

    fetch("https://telegram-catalog-api.onrender.com/products")
      .then((response) => response.json())
      .then((data) => {
        clearTimeout(timer);
        setProducts(data);
        const uniqueCategories = [...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка загрузки:', error);
        clearTimeout(timer);
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
        backgroundImage: 'url("bg.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="Logo.png" alt="Логотип" style={{ height: '100px' }} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '40px', fontWeight: 'bold' }}>УДАРНИК. Все для дома и ремонта.</div>
          <div style={{ fontSize: '18px' }}>г. Владивосток, ул. Полковника Фесюна, 12</div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>📦 Наш Каталог</h1>

        {loading ? (
          delayedMessageVisible ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px' }}>⏳ Сервер просыпается, подождите до 30 секунд...</p>
              <img src="logo.png" alt="Загрузка" style={{ width: '100px', marginTop: '10px' }} />
            </div>
          ) : (
            <p>Загрузка...</p>
          )
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              {categories.map((cat, index) => (
                <details key={index} style={{ marginBottom: '10px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px' }}>
                  <summary style={{ fontWeight: 'bold' }}>{cat}</summary>
                  {filteredProducts.filter(p => p.category === cat || searchAll).map((p, i) => (
                    <div
                      key={i}
                      style={{
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        padding: '10px',
                        marginTop: '10px',
                        boxShadow: '2px 2px 8px rgba(0,0,0,0.05)',
                        backgroundColor: '#f9f9f9'
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{p.name}</div>
                      <div>💰 Цена: <b>{p.price ? `${p.price} ₽` : '—'}</b></div>
                      <div>🔖 Артикул товара: {p.article || '—'}</div>
                      <div style={{ marginTop: '5px', color: p.stock > 0 ? 'green' : 'red' }}>
                        📦 {p.in_stock}
                      </div>
                    </div>
                  ))}
                </details>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
