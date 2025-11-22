import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: 'linear-gradient(to bottom right, #007f73, #00c2a8)' }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{backgroundColor: '#00c2a8'}}></div>
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" style={{backgroundColor: '#007f73'}}></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" style={{backgroundColor: '#00c2a8'}}></div>

      <div className="relative max-w-7xl mx-auto py-12 px-6 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-block mb-4">
              <span style={{backgroundColor: '#00c2a8'}} className="text-white text-sm font-semibold px-4 py-2 rounded-full">
                🎉 Bangladesh's #1 Electronics Marketplace
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
              Buy & Sell
              <span className="block text-yellow-300 mt-1">
                Electronic Components
              </span>
              <span className="block text-white mt-1">
                Easily & Safely
              </span>
            </h1>
            
            <p className="text-white/90 text-base md:text-lg mb-6 max-w-xl mx-auto lg:mx-0">
              Join thousands of electronics enthusiasts buying and selling Arduino, Raspberry Pi, sensors, motors, and more. Find the best deals from trusted sellers near you.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button 
                onClick={() => navigate('/all-products')}
                className="bg-white hover:bg-gray-100 px-6 py-3 rounded-lg text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200 flex items-center justify-center gap-2"
                style={{color: '#007f73'}}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explore Products
              </button>
              
              <button 
                onClick={() => navigate('/add-product')}
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-6 py-3 rounded-lg text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Sell Now
              </button>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-white">1000+</p>
                <p className="text-white/80 text-xs">Products</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-white/80 text-xs">Active Users</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-white">30+</p>
                <p className="text-white/80 text-xs">Categories</p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex-1 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl opacity-30 scale-110" style={{background: 'linear-gradient(to right, #007f73, #00c2a8)'}}></div>
              
              <div className="relative">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2103/2103633.png"
                    alt="Electronics"
                    className="w-full max-w-sm mx-auto drop-shadow-2xl animate-float"
                  />
                </div>

                {/* Floating Electronics Icons */}
                <div className="absolute -top-8 -left-8 bg-white rounded-2xl p-4 shadow-2xl animate-float animation-delay-1000">
                  <img src="https://cdn-icons-png.flaticon.com/512/4233/4233678.png" alt="Arduino" className="w-16 h-16" />
                </div>
                
                <div className="absolute top-1/4 -right-8 bg-white rounded-2xl p-4 shadow-2xl animate-float animation-delay-2000">
                  <img src="https://cdn-icons-png.flaticon.com/512/2103/2103658.png" alt="Chip" className="w-16 h-16" />
                </div>
                
                <div className="absolute -bottom-8 left-1/4 bg-white rounded-2xl p-4 shadow-2xl animate-float animation-delay-3000">
                  <img src="https://cdn-icons-png.flaticon.com/512/2103/2103645.png" alt="Circuit" className="w-16 h-16" />
                </div>

                <div className="absolute top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-4 border-2 border-white/10 rounded-full animate-spin-reverse"></div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-3 -left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold shadow-lg animate-bounce text-sm">
                💡 Best Deals
              </div>
              <div className="absolute -bottom-3 -right-3 bg-green-400 text-gray-900 px-3 py-1 rounded-full font-bold shadow-lg animate-bounce animation-delay-1000 text-sm">
                ✅ Verified Sellers
              </div>
              <div className="absolute top-1/2 -left-6 bg-purple-400 text-white px-3 py-1 rounded-full font-bold shadow-lg animate-pulse text-sm">
                🔥 Trending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
