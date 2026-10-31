import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <div>
          <h1 className="text-xl font-bold text-slate-900">Đặt cọc & Thuê thành công!</h1>
          <p className="text-xs text-slate-500 mt-1">Đơn hàng đã được gửi đến chủ thiết bị để bàn giao đồ.</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 border">
          <div className="flex justify-between">
            <span className="text-slate-400">Trạng thái:</span>
            <span className="font-semibold text-emerald-600">Đã thanh toán (Napas 247)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Mã đơn:</span>
            <span className="font-mono font-medium">#CR261-OCT31</span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-medium transition"
        >
          Về trang chủ / Mainboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}