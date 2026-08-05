import React from 'eact';
import { Edit, Trash2, Archive, Star, TrendingUp, Users, Eye } from 'lucide-react';

// Mock Data Types
interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
}

export default function EditExperiencePage({ params }: { params: { id: string } }) {
  const reviews: Review[] = [
    { id: '1', user: 'John Doe', rating: 5, comment: 'Amazing experience!' },
    { id: '2', user: 'Jane Smith', rating: 4, comment: 'Very fun, but a bit tiring.' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Experience</h1>
          <p className="text-gray-500">ID: {params.id}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-red-50 hover:text-red-600 transition">
            <Archive size={18} /> Archive
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition">
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Form Section */}
        <div className="col-span-8 space-y-8">
          <section className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">General Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input className="w-full p-2 border rounded-md" defaultValue="Sunset Kayaking" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select className="w-full p-2 border rounded-md" defaultValue="adventure">
                  <option>adventure</option>
                  <option>culture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input className="w-full p-2 border rounded-md" defaultValue="150" />
              </div>
            </div>
          </section>

          {/* Tabs Section */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="flex border-b">
              <button className="px-6 py-3 font-medium border-b-2 border-indigo-600 text-indigo-600">Reviews</button>
              <button className="px-6 py-3 font-medium text-gray-500 hover:text-gray-700">Statistics</button>
            </div>
            
            <div className="p-6">
              {/* Reviews Tab Content */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold">{review.user}</h4>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-600" /> Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Conversion Rate</span>
                <span className="font-bold text-green-600">4.2%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[42%]" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-xl font-bold">1,240</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Bookings</p>
                  <p className="text-xl font-bold">52</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}