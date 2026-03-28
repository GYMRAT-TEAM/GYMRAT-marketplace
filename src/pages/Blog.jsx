import './Blog.css';

const posts = [
  {
    featured: true,
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    tag: 'TRAINING',
    title: 'The Ultimate Guide to Building Muscle Mass in 2026',
    excerpt: 'Everything you need to know about hypertrophy training, progressive overload, and the best supplements to maximize your gains this year.',
    author: 'Coach Marcus',
    date: 'Mar 20, 2026',
    read: '8 min read',
  },
  {
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    tag: 'NUTRITION',
    title: 'Best Pre-Workout Meals for Maximum Performance',
    excerpt: 'Fuel your session with these science-backed pre-workout nutrition strategies.',
    author: 'Dr. Sarah Kim',
    date: 'Mar 15, 2026',
    read: '5 min read',
  },
  {
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    tag: 'GEAR',
    title: 'Top 10 Gym Accessories Worth Every Penny',
    excerpt: 'We tested 50+ products so you don\'t have to. Here are the ones that actually make a difference.',
    author: 'Alex Rivera',
    date: 'Mar 10, 2026',
    read: '6 min read',
  },
];

export default function Blog() {
  return (
    <section id="blog">
      <div className="section-label">Knowledge Base</div>
      <h2 className="section-title">LATEST <em>ARTICLES</em></h2>
      <div className="blog-grid">
        {posts.map((post, i) => (
          <div className={`blog-card${post.featured ? ' featured' : ''}`} key={i}>
            <img src={post.img} alt={post.title} className="blog-img" />
            <div className="blog-body">
              <div className="blog-tag">{post.tag}</div>
              <div className="blog-title">{post.title}</div>
              {post.featured && <div className="blog-excerpt">{post.excerpt}</div>}
              <div className="blog-meta">
                <span>{post.author}</span>
                <span>{post.date}</span>
                <span>{post.read}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}