import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Clock, ExternalLink, Bookmark, Share2, ThumbsUp } from 'lucide-react';

interface NewsProps {
  isDarkMode?: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  image: string;
  category: string;
  url: string;
  likes: number;
  isBookmarked: boolean;
}

const News: React.FC<NewsProps> = ({ isDarkMode = false }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Global Markets Rally as Central Banks Signal Rate Cuts',
      summary: 'Stock markets worldwide surged today as major central banks hinted at potential interest rate cuts in the coming months, citing improving inflation data.',
      source: 'Financial Times',
      date: '2 hours ago',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      category: 'Markets',
      url: '#',
      likes: 245,
      isBookmarked: false
    },
    {
      id: '2',
      title: 'Tech Sector Leads Market Gains Amid AI Advancements',
      summary: 'Technology stocks are outperforming the broader market as companies continue to announce breakthroughs in artificial intelligence capabilities.',
      source: 'Bloomberg',
      date: '5 hours ago',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      category: 'Technology',
      url: '#',
      likes: 189,
      isBookmarked: true
    },
    {
      id: '3',
      title: 'Renewable Energy Investments Reach Record High in Q2',
      summary: 'Global investments in renewable energy projects hit an all-time quarterly high, with solar and wind power attracting the majority of capital.',
      source: 'Reuters',
      date: '1 day ago',
      image: 'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg',
      category: 'Energy',
      url: '#',
      likes: 132,
      isBookmarked: false
    },
    {
      id: '4',
      title: 'Housing Market Shows Signs of Stabilization After Months of Decline',
      summary: 'The housing market appears to be finding its footing after a prolonged period of declining sales, with mortgage applications increasing for the third consecutive week.',
      source: 'Wall Street Journal',
      date: '1 day ago',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      category: 'Real Estate',
      url: '#',
      likes: 98,
      isBookmarked: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateRange, setDateRange] = useState('Last 7 days');

  const categories = ['All', 'Markets', 'Technology', 'Energy', 'Real Estate', 'Cryptocurrency', 'Commodities'];

  const toggleBookmark = (id: string) => {
    setNewsItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
  };

  const handleLike = (id: string) => {
    setNewsItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-fluid mt-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full sm:flex-1">
            <nav aria-label="breadcrumb" className="mb-2">
              <ol className="breadcrumb mb-0 flex items-center text-sm text-gray-500">
                <li className="breadcrumb-item"><a href="/dashboard" className="hover:text-blue-600">Home</a></li>
                <li className="mx-2">/</li>
                <li className="breadcrumb-item active text-gray-700 font-medium" aria-current="page">News</li>
              </ol>
            </nav>
            <h5 className="text-xl font-bold">Financial News</h5>
          </div>
          <div className="w-full sm:w-auto mt-3 sm:mt-0">
            <div className="inline-flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
              <input 
                type="text" 
                className="px-3 py-2 border-none focus:outline-none rounded-l-lg w-40" 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              />
              <button className="p-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mt-4">
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Category:</span>
              <select
                className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredNews.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {item.category}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.date}
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.summary}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Source: {item.source}</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      onClick={() => handleLike(item.id)}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="sr-only">Like</span>
                    </button>
                    <span className="text-xs text-gray-500">{item.likes}</span>
                    <button 
                      className={`p-1 ${item.isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}
                      onClick={() => toggleBookmark(item.id)}
                    >
                      <Bookmark className="w-4 h-4" />
                      <span className="sr-only">Bookmark</span>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="sr-only">Share</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-gray-100">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  Read Full Article
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-md p-6 mb-6 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-4 md:mb-0 md:pr-6">
              <h3 className="text-xl font-bold mb-2">Stay Updated with Market Insights</h3>
              <p className="text-blue-100 mb-4">Subscribe to our newsletter and receive daily market updates, investment tips, and financial news directly to your inbox.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none text-gray-800"
                />
                <button className="bg-blue-900 hover:bg-blue-950 px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;