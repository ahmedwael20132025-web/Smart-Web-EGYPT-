<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Web Egypt</title>
    <!-- Tailwind CSS for Styling -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <!-- React and ReactDOM from CDN -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <!-- Babel to compile JSX in browser -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>

    <div id="root"></div>

    <script type="text/babel">
        // 1. STATE MANAGEMENT (CONTEXT)
        const StoreContext = React.createContext();

        const StoreProvider = ({ children }) => {
          const [cart, setCart] = React.useState([]);
          const [orders, setOrders] = React.useState(() => {
            const saved = localStorage.getItem('swe_orders');
            return saved ? JSON.parse(saved) : [];
          });
          const [isBannerVisible, setIsBannerVisible] = React.useState(true);
          const [lang, setLang] = React.useState('ar');

          React.useEffect(() => {
            localStorage.setItem('swe_orders', JSON.stringify(orders));
          }, [orders]);

          const addToCart = (product, size, color, quantity) => {
            const cartId = `${product.id}-${size}-${color}`;
            setCart(prev => {
              const exists = prev.find(item => item.cartId === cartId);
              if (exists) {
                return prev.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item);
              }
              return [...prev, { ...product, cartId, size, color, quantity }];
            });
          };

          const addOrder = (orderDetails) => {
            const newOrder = {
              id: `SWE-${Date.now().toString().slice(-6)}`,
              date: new Date().toLocaleDateString('eg-EG'),
              status: 'قيد الانتظار',
              ...orderDetails
            };
            setOrders(prev => [newOrder, ...prev]);
            setCart([]);
          };

          return (
            <StoreContext.Provider value={{ cart, setCart, orders, setOrders, isBannerVisible, setIsBannerVisible, lang, setLang, addToCart, addOrder }}>
              <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="font-sans bg-gray-50 text-gray-900 min-h-screen">
                {children}
              </div>
            </StoreContext.Provider>
          );
        };

        const useStore = () => React.useContext(StoreContext);

        // 2. DATA
        const LOCAL_PRODUCTS = [
          { id: 1, nameAr: "تيشرت أوفر سايز صيفي", nameEn: "Oversized Summer T-Shirt", price: 350, img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" },
          { id: 2, nameAr: "هودي ثقيل مبطن", nameEn: "Premium Fleece Hoodie", price: 650, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500" },
          { id: 3, nameAr: "بنطلون كارقو عصري", nameEn: "Modern Cargo Pants", price: 450, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500" },
          { id: 4, nameAr: "جاكيت جينز كلاسيك", nameEn: "Classic Denim Jacket", price: 800, img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500" }
        ];

        const GOVERNORATES = [
          { nameAr: "القاهرة", nameEn: "Cairo", fee: 50 },
          { nameAr: "الجيزة", nameEn: "Giza", fee: 50 },
          { nameAr: "الإسكندرية", nameEn: "Alexandria", fee: 60 },
          { nameAr: "القليوبية", nameEn: "Qalyubia", fee: 55 },
          { nameAr: "الشرقية", nameEn: "Sharqia", fee: 65 },
          { nameAr: "الغربية", nameEn: "Gharbia", fee: 65 },
          { nameAr: "الدقهلية", nameEn: "Dakahlia", fee: 65 },
          { nameAr: "المنوفية", nameEn: "Monufia", fee: 65 },
          { nameAr: "البحيرة", nameEn: "Beheira", fee: 70 },
          { nameAr: "دمياط", nameEn: "Damietta", fee: 70 },
          { nameAr: "بورسعيد", nameEn: "Port Said", fee: 70 },
          { nameAr: "الإسماعيلية", nameEn: "Ismailia", fee: 70 },
          { nameAr: "السويس", nameEn: "Suez", fee: 70 },
          { nameAr: "الفيوم", nameEn: "Fayoum", fee: 75 },
          { nameAr: "بني سويف", nameEn: "Beni Suef", fee: 75 },
          { nameAr: "المنيا", nameEn: "Minya", fee: 75 },
          { nameAr: "أسيوط", nameEn: "Asyut", fee: 80 },
          { nameAr: "سوهاج", nameEn: "Sohag", fee: 80 },
          { nameAr: "قنا", nameEn: "Qena", fee: 85 },
          { nameAr: "الأقصر", nameEn: "Luxor", fee: 85 },
          { nameAr: "أسوان", nameEn: "Aswan", fee: 90 }
        ];

        // 3. MAIN APP
        function App() {
          const [currentRoute, setCurrentRoute] = React.useState('store');

          return (
            <StoreProvider>
              <Navigation currentRoute={currentRoute} setRoute={setCurrentRoute} />
              {currentRoute === 'store' && <Storefront setRoute={setCurrentRoute} />}
              {currentRoute === 'checkout' && <Checkout setRoute={setCurrentRoute} />}
              {currentRoute === 'admin' && <AdminDashboard />}
              <Footer />
            </StoreProvider>
          );
        }

        // 4. NAVIGATION
        function Navigation({ currentRoute, setRoute }) {
          const { cart, lang, setLang } = useStore();
          return (
            <nav className="bg-white shadow-sm sticky top-0 z-50 px-4 py-3 flex justify-between items-center">
              <div className="font-bold text-xl text-pink-600 cursor-pointer" onClick={() => setRoute('store')}>
                {lang === 'ar' ? 'براند أوتلت' : 'Brand Outlet'}
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-sm bg-gray-100 px-3 py-1 rounded">
                  {lang === 'ar' ? 'English' : 'العربية'}
                </button>
                <button onClick={() => setRoute('store')} className={`text-sm ${currentRoute === 'store' ? 'text-pink-600 font-semibold' : ''}`}>
                  {lang === 'ar' ? 'المتجر' : 'Shop'}
                </button>
                <button onClick={() => setRoute('checkout')} className="relative text-sm bg-pink-50 p-2 rounded-full text-pink-600">
                  🛒 <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>
                </button>
                <button onClick={() => setRoute('admin')} className={`text-sm ${currentRoute === 'admin' ? 'text-pink-600 font-semibold' : ''}`}>
                  🔑 {lang === 'ar' ? 'الأدمن' : 'Admin'}
                </button>
              </div>
            </nav>
          );
        }

        // 5. STOREFRONT
        function Storefront({ setRoute }) {
          const { isBannerVisible, lang, addToCart } = useStore();
          return (
            <div>
              {isBannerVisible && (
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                  {lang === 'ar' ? '🔥 خصومات الصيف! شحن سريع لجميع المحافظات' : '🔥 Summer Sale! Fast Shipping across Egypt'}
                </div>
              )}
              <div className="bg-pink-100 py-12 px-6 text-center rounded-b-3xl mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{lang === 'ar' ? 'أحدث صيحات الملابس المحلية' : 'Latest Local Fashion Trends'}</h1>
                <p className="text-gray-600 text-sm mb-4">{lang === 'ar' ? 'خامات ممتازة وأسعار تناسب الجميع' : 'Premium quality at affordable prices'}</p>
              </div>
              <div className="px-4 max-w-4xl mx-auto grid grid-cols-2 gap-4 mb-12">
                {LOCAL_PRODUCTS.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                    <img src={product.img} alt={product.nameAr} className="h-40 w-full object-cover" />
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{lang === 'ar' ? product.nameAr : product.nameEn}</h3>
                        <p className="text-pink-600 font-bold text-sm mb-2">{product.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
                      </div>
                      <button 
                        onClick={() => {
                          addToCart(product, 'L', 'أسود', 1);
                          alert(lang === 'ar' ? 'تمت الإضافة للسلة بمقاس L' : 'Added to cart with size L');
                        }}
                        className="w-full bg-pink-600 text-white text-xs py-2 rounded-xl font-medium hover:bg-pink-700 transition"
                      >
                        {lang === 'ar' ? 'إضافة للسلة 🛒' : 'Add to Cart 🛒'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // 6. CHECKOUT
        function Checkout({ setRoute }) {
          const { cart, addOrder, lang } = useStore();
          const [name, setName] = React.useState('');
          const [phone, setPhone] = React.useState('');
          const [gov, setGov] = React.useState(GOVERNORATES[0]);

          const itemsPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const totalPrice = itemsPrice + gov.fee;

          const handlePlaceOrder = (e) => {
            e.preventDefault();
            if (!name || !phone) {
              alert(lang === 'ar' ? 'برجاء ملء البيانات المطلوبة!' : 'Please fill required fields!');
              return;
            }
            addOrder({
              customerName: name,
              customerPhone: phone,
              governorate: lang === 'ar' ? gov.nameAr : gov.nameEn,
              shippingFee: gov.fee,
              itemsPrice,
              totalPrice,
              items: cart.map(i => `${lang === 'ar' ? i.nameAr : i.nameEn} (${i.size}/${i.color}) x${i.quantity}`)
            });
            alert(lang === 'ar' ? '🎉 تم تسجيل طلبك بنجاح! سنتواصل معك هاتفياً لتأكيد الشحن.' : '🎉 Order Placed Successfully!');
            setRoute('store');
          };

          if (cart.length === 0) {
            return (
              <div className="text-center py-20 px-4">
                <p className="text-gray-500 mb-4">{lang === 'ar' ? 'عربة التسوق فارغة حالياً' : 'Your cart is empty'}</p>
                <button onClick={() => setRoute('store')} className="bg-pink-600 text-white px-6 py-2 rounded-xl text-sm">{lang === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}</button>
              </div>
            );
          }

          return (
            <div className="px-4 max-w-md mx-auto py-6">
              <h2 className="text-xl font-bold mb-4">{lang === 'ar' ? 'إتمام الشراء (الدفع عند الاستلام)' : 'Checkout'}</h2>
              <form onSubmit={handlePlaceOrder} className="space-y-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">{lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded-xl text-sm outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">{lang === 'ar' ? 'رقم الموبايل للتواصل *' : 'Mobile Number *'}</label>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full border p-2 rounded-xl text-sm outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">{lang === 'ar' ? 'المحافظة (لتحديد سعر الشحن) *' : 'Governorate *'}</label>
                  <select 
                    value={gov.nameAr} 
                    onChange={e => {
                      const selected = GOVERNORATES.find(g => g.nameAr === e.target.value);
                      if (selected) setGov(selected);
                    }} 
                    className="w-full border p-2 rounded-xl text-sm outline-none focus:border-pink-500 bg-white"
                  >
                    {GOVERNORATES.map(g => (
                      <option key={g.nameAr} value={g.nameAr}>{lang === 'ar' ? g.nameAr : g.nameEn} (+{g.fee} ج.م شحن)</option>
                    ))}
                  </select>
                </div>
                <div className="border-t pt-3 text-xs space-y-1 text-gray-600">
                  <div className="flex justify-between"><span>{lang === 'ar' ? 'إجمالي المنتجات:' : 'Subtotal:'}</span><span>{itemsPrice} {lang === 'ar' ? 'ج.م' : 'EGP'}</span></div>
                  <div className="flex justify-between"><span>{lang === 'ar' ? 'تكلفة الشحن لـ ' : 'Shipping:'}{lang === 'ar' ? gov.nameAr : gov.nameEn}:</span><span>{gov.fee} {lang === 'ar' ? 'ج.م' : 'EGP'}</span></div>
                  <div className="flex justify-between font-bold text-sm text-gray-900 pt-1 border-dashed border-t"><span>{lang === 'ar' ? 'المبلغ الإجمالي عند الاستلام:' : 'Total:'}</span><span className="text-pink-600">{totalPrice} {lang === 'ar' ? 'ج.م' : 'EGP'}</span></div>
                </div>
                <button type="submit" className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-pink-700">
                  {lang === 'ar' ? '🛒 تأكيد الطلب الحقيقي' : '🛒 Confirm Order'}
                </button>
              </form>
            </div>
          );
        }

        // 7. ADMIN DASHBOARD
        function AdminDashboard() {
          const { orders, isBannerVisible, setIsBannerVisible, lang } = useStore();
          const [password, setPassword] = React.useState('');
          const [isAuthenticated, setIsAuthenticated] = React.useState(false);

          const handleLogin = (e) => {
            e.preventDefault();
            if (password === '33272768') {
              setIsAuthenticated(true);
            } else {
              alert(lang === 'ar' ? '❌ كلمة المرور غير صحيحة!' : '❌ Incorrect Password!');
            }
          };

          if (!isAuthenticated) {
            return (
              <div className="px-4 max-w-sm mx-auto py-20 text-center">
                <h2 className="text-xl font-bold mb-2">🔒 {lang === 'ar' ? 'بوابة الأمان للأدمن' : 'Secure Admin Gate'}</h2>
                <form onSubmit={handleLogin} className="flex gap-2">
                  <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="flex-1 border p-2 rounded-xl text-sm outline-none text-center" />
                  <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium">{lang === 'ar' ? 'دخول' : 'Login'}</button>
                </form>
              </div>
            );
          }

          const totalSales = orders.reduce((sum, o) => sum + o.totalPrice, 0);

          return (
            <div className="px-4 max-w-4xl mx-auto py-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">📊 {lang === 'ar' ? 'لوحة تحكم المتجر' : 'Admin Dashboard'}</h2>
                <button onClick={() => setIsBannerVisible(!isBannerVisible)} className={`px-3 py-1 rounded text-white text-xs font-bold ${isBannerVisible ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isBannerVisible ? 'البانر ظاهر' : 'البانر مخفي'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500">إجمالي المبيعات</p>
                  <p className="text-lg font-bold text-pink-600">{totalSales} ج.م</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500">عدد الطلبات</p>
                  <p className="text-lg font-bold text-gray-800">{orders.length}</p>
                </div>
              </div>
              <h3 className="font-bold text-sm mb-3 text-gray-700">📦 طلبات الزبائن الواردة</h3>
              {orders.length === 0 ? (
                <p className="text-xs text-gray-400 bg-white p-6 rounded-2xl text-center border">لا توجد طلبات جديدة.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-xs space-y-2">
                      <div className="flex justify-between items-center border-b pb-1">
                        <span className="font-bold text-pink-600">{order.id}</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium text-[10px]">{order.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-1 text-gray-600">
                        <div>👤 العميل: {order.customerName}</div>
                        <div>📞 الهاتف: <a href={`tel:${order.customerPhone}`} className="text-blue-500 underline">{order.customerPhone}</a></div>
                        <div>📍 المحافظة: {order.governorate}</div>
                        <div>📅 التاريخ: {order.date}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-xl text-gray-700">
                        <strong>المنتجات:</strong>
                        <ul className="list-disc list-inside mt-1">{order.items.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        function Footer() {
          return <div className="text-center py-6 text-xs text-gray-400 border-t mt-12">© 2026 Smart Web Egypt. All Rights Reserved.</div>;
        }

        // Render the application
        const root = tragedies = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>

