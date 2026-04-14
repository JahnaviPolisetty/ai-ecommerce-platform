export const getProducts = async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=200');
    if (!response.ok) throw new Error('Failed to fetch from DummyJSON');
    const data = await response.json();
    
    let products = data.products.map(p => ({
        _id: p.id.toString(),
        id: p.id.toString(),
        name: p.title,
        price: p.price,
        originalPrice: Number((p.price / (1 - p.discountPercentage / 100)).toFixed(2)),
        image: p.thumbnail,
        rating: p.rating,
        reviews: Math.floor(Math.random() * 500) + 10,
        prime: p.rating > 4.5,
        badge: p.discountPercentage > 15 ? 'Top Deal' : '',
        stock: p.stock,
        category: p.category,
        description: p.description
    }));

    if (req.query.category) {
        const c = req.query.category.toLowerCase().replace(/ & /g, ' and ');
        
        const categoryMap = {
            'electronics': ['smartphones', 'laptops', 'tablets', 'mobile-accessories'],
            'clothing': ['mens-shirts', 'womens-dresses', 'womens-shoes', 'mens-shoes', 'tops'],
            'home and kitchen': ['home-decoration', 'furniture', 'kitchen-accessories'],
            'beauty': ['beauty', 'fragrances', 'skincare'],
            'accessories': ['sunglasses', 'womens-jewellery', 'mens-watches', 'womens-bags', 'womens-watches'],
            'sports': ['sports-accessories'],
            'books': ['books'], 
            'toys': ['toys'],
            'automotive': ['automotive', 'motorcycle']
        };

        const targetCategories = categoryMap[c] || [c.replace(' ', '-')];

        // Filter standard DummyJSON products with exact match to prevent 'laptops' showing in 'tops'
        products = products.filter(p => 
            targetCategories.some(cat => p.category.toLowerCase() === cat.toLowerCase())
        );

        // INJECT CUSTOM MOCK DATA for sparse/missing categories so the UI looks beautiful
        const MOCKS = [
            { id: 'b1', name: 'The Great Gatsby - Hardcover', category: 'Books', price: 15.99, originalPrice: 20.99, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 2100, prime: true, badge: 'Bestseller', stock: 150, description: 'A classic novel of the Jazz Age.' },
            { id: 'b2', name: 'Clean Code: Agile Software Craftsmanship', category: 'Books', price: 42.50, originalPrice: 49.99, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80', rating: 4.9, reviews: 5400, prime: true, badge: '', stock: 80, description: 'Even bad code can function.' },
            { id: 'b3', name: 'Atomic Habits', category: 'Books', price: 11.98, originalPrice: 19.99, image: 'https://images.unsplash.com/photo-1589998059171-989d887dda3e?auto=format&fit=crop&w=400&q=80', rating: 5.0, reviews: 12000, prime: true, badge: 'Must Read', stock: 500, description: 'Tiny changes, remarkable results.' },
            { id: 'b4', name: 'Dune - Science Fiction Classic', category: 'Books', price: 8.99, originalPrice: 10.99, image: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=crop&w=400&q=80', rating: 4.7, reviews: 830, prime: true, badge: '', stock: 20, description: 'The grandest epic in science fiction.' },
            
            { id: 't1', name: 'LEGO Star Wars Millennium Falcon', category: 'Toys', price: 159.99, originalPrice: 169.99, image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80', rating: 4.9, reviews: 1024, prime: true, badge: 'Popular', stock: 12, description: 'Build the legendary starship.' },
            { id: 't2', name: 'Remote Control R/C Car 4x4', category: 'Toys', price: 45.00, originalPrice: 60.00, image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=400&q=80', rating: 4.5, reviews: 300, prime: true, badge: 'Sale', stock: 45, description: 'Off-road monster truck for kids.' },
            { id: 't3', name: 'Educational Building Blocks', category: 'Toys', price: 25.50, originalPrice: 30.00, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 890, prime: true, badge: '', stock: 120, description: 'Creative building set.' },
            { id: 't4', name: 'Plush Teddy Bear - 24 inch', category: 'Toys', price: 19.99, originalPrice: 25.00, image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80', rating: 4.6, reviews: 400, prime: true, badge: '', stock: 3, description: 'Super soft and cuddly.' },

            { id: 's1', name: 'Premium Yoga Mat with Alignment Lines', category: 'Sports', price: 35.99, originalPrice: 45.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 2000, prime: true, badge: 'Best Rated', stock: 90, description: 'Eco-friendly TPE material.' },
            { id: 's2', name: 'Adjustable Dumbbell Set (up to 52.5 lbs)', category: 'Sports', price: 199.99, originalPrice: 249.99, image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?auto=format&fit=crop&w=400&q=80', rating: 4.9, reviews: 3500, prime: true, badge: 'Top Deal', stock: 8, description: 'Space-saving adjustable weights.' },
            { id: 's3', name: 'Professional Basketball', category: 'Sports', price: 29.99, originalPrice: 39.99, image: 'https://images.unsplash.com/photo-1519861531473-920026e42e1d?auto=format&fit=crop&w=400&q=80', rating: 4.7, reviews: 600, prime: true, badge: '', stock: 40, description: 'Official size and weight.' },
            { id: 's4', name: 'Tennis Racket Pro 97', category: 'Sports', price: 189.50, originalPrice: 220.00, image: 'https://images.unsplash.com/photo-1622279457486-640c4cb71652?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 150, prime: true, badge: '', stock: 15, description: 'Maximum control and feel.' },

            { id: 'a1', name: 'Premium Leather Seat Covers', category: 'Automotive', price: 149.99, originalPrice: 199.99, image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=400&q=80', rating: 4.6, reviews: 450, prime: true, badge: 'Sale', stock: 22, description: 'Universal fit luxury covers.' },
            { id: 'a2', name: 'Digital Tire Inflator Portable Air Compressor', category: 'Automotive', price: 39.99, originalPrice: 49.99, image: 'https://images.unsplash.com/photo-1611077543781-a7a5ea558117?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 8900, prime: true, badge: 'Essential', stock: 300, description: 'Fast inflation with auto shut-off.' },

            { id: 'h1', name: 'Robot Vacuum Cleaner with Mop Combo', category: 'Home & Kitchen', price: 249.99, originalPrice: 399.99, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80', rating: 4.7, reviews: 1200, prime: true, badge: 'Top Deal', stock: 50, description: 'Smart mapping and strong suction.' },
            { id: 'h2', name: 'Non-Stick Cookware Set (12 Pieces)', category: 'Home & Kitchen', price: 129.50, originalPrice: 159.00, image: 'https://images.unsplash.com/photo-1584285421526-17b5fefadd80?auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 3400, prime: true, badge: '', stock: 85, description: 'Even heat distribution for perfect cooking.' }
        ];

        // Format custom products so they seamlessly integrate with the UI
        const customInjects = MOCKS
            .filter(m => m.category.toLowerCase() === c)
            .map(m => ({ ...m, _id: m.id }));
        
        products = [...products, ...customInjects];
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${req.params.id}`);
    if (!response.ok) throw new Error('Product not found');
    const p = await response.json();
    
    res.json({
        _id: p.id.toString(),
        id: p.id.toString(),
        name: p.title,
        price: p.price,
        originalPrice: Number((p.price / (1 - p.discountPercentage / 100)).toFixed(2)),
        image: p.thumbnail,
        rating: p.rating,
        reviews: Math.floor(Math.random() * 500) + 10,
        prime: p.rating > 4.5,
        badge: p.discountPercentage > 15 ? 'Top Deal' : '',
        stock: p.stock,
        category: p.category,
        description: p.description
    });
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

