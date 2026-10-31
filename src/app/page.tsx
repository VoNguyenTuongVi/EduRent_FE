'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  Star, 
  Sparkles,
  Layers,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { MOCK_ITEMS } from '@/mock/mockData';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Máy ảnh & Quay phim', 'Học tập', 'Phụ kiện PC', 'Âm thanh & Media'];

  const filteredItems = MOCK_ITEMS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              CR
            </div>
            <div>
              <span className="font-bold text-slate-900 leading-none block">CampusRent</span>
              <span className="text-[11px] text-slate-400">Nền tảng mượn & thuê đồ sinh viên</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/checkout"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Trang Thanh toán</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Banner Hero */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Dự án TMĐT - Nhóm G3</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Thuê đồ công nghệ & thiết bị học tập ngay trong khuôn viên trường
            </h1>
            <p className="text-sm text-blue-100">
              Tiết kiệm chi phí, giao nhận đồ trực tiếp tại KTX & phòng tự học, hỗ trợ thanh toán cọc bảo lãnh qua VietQR tức thì.
            </p>
          </div>
          <div className="absolute right-[-20px] bottom-[-30px] opacity-10 text-white pointer-events-none">
            <Layers className="w-72 h-72" />
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="text-xs text-slate-400 font-medium">Thiết bị sẵn sàng</div>
            <div className="text-xl font-bold text-slate-800 mt-1">28 món</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Sẵn sàng nhận ngay</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="text-xs text-slate-400 font-medium">Đang mượn trong tuần</div>
            <div className="text-xl font-bold text-slate-800 mt-1">14 lượt</div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">Giao dịch an toàn</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="text-xs text-slate-400 font-medium">Cọc hoàn tất</div>
            <div className="text-xl font-bold text-slate-800 mt-1">100%</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Bảo đảm tự động</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="text-xs text-slate-400 font-medium">Khu vực hỗ trợ</div>
            <div className="text-xl font-bold text-slate-800 mt-1">KTX A & B</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">ĐHQG TP.HCM</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input 
              type="text"
              placeholder="Tìm máy ảnh, máy tính, mic, bàn phím..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'Tất cả danh mục' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition group"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{item.owner}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {item.rating}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 group-hover:text-blue-600 transition">
                    {item.title}
                  </h3>
                </div>

                <div className="space-y-2 border-t pt-2.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500">Giá thuê:</span>
                    <span className="text-sm font-bold text-blue-600">
                      {item.rentalPricePerDay.toLocaleString('vi-VN')} đ<span className="text-[11px] font-normal text-slate-400">/ngày</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Tiền cọc thiết bị:</span>
                    <span className="font-medium text-slate-600">{item.depositAmount.toLocaleString('vi-VN')} đ</span>
                  </div>

                  <Link 
                    href="/checkout"
                    className="w-full mt-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Thuê & Đặt cọc ngay</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}