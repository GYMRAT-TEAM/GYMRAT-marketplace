import './Blog.css';

const posts = [
  {
    featured: true,
    img: 'https://i.pinimg.com/1200x/dd/1d/ee/dd1deed705aceb5ceed1c26d76b6dc3d.jpg',
    tag: 'TRAINING',
    title: 'The Ultimate Guide to Building Muscle Mass in 2026',
    excerpt: '',
    author: '',
    date: '',
    read: '',
  },
  {
    img: 'https://i.pinimg.com/1200x/65/2b/33/652b337bc5eb744301e34b60a7f3cef6.jpg',
    tag: 'NUTRITION',
    title: 'Best Pre-Workout Meals for Maximum Performance',
    excerpt: '',
    author: '',
    date: '',
    read: '',
  },
  {
    img: 'https://i.pinimg.com/736x/cb/86/93/cb8693d019ffb58e9be9b09c9173b013.jpg',
    tag: 'GEAR',
    title: 'Top 10 Gym Accessories Worth Every Penny',
    excerpt: '',
    author: '',
    date: '',
    read: '',
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