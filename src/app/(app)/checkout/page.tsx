'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, QrCode, ShieldCheck, Building2, Calendar, Plus, Minus } from 'lucide-react';
import { MOCK_ITEMS } from '../../../mock/mockData';
import { PaymentMethod } from '../../../types/payment';
import VietQRModal from '../../../components/checkout/VietQRModal';
import CardPaymentModal from '../../../components/checkout/CardPaymentModal';
import AtmPaymentModal from '../../../components/checkout/AtmPaymentModal';

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietqr');
  
  // Quản lý trạng thái mở modal cho 3 phương thức
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showAtmModal, setShowAtmModal] = useState(false);

  // Chọn số ngày thuê
  const [durationDays, setDurationDays] = useState<number>(3);
  const [startDate, setStartDate] = useState<string>('2026-10-31');

  useEffect(() => {
    const today = new Date();
    setStartDate(today.toISOString().split('T')[0]);
  }, []);

  const selectedItem = MOCK_ITEMS[0];
  const rentalTotal = selectedItem.rentalPricePerDay * durationDays;
  const depositTotal = selectedItem.depositAmount;
  const grandTotal = rentalTotal + depositTotal;
  const orderCode = 'CR261_948123';

  const handleDecreaseDays = () => {
    if (durationDays > 1) {
      setDurationDays((prev) => prev - 1);
    }
  };

  const handleIncreaseDays = () => {
    if (durationDays < 30) {
      setDurationDays((prev) => prev + 1);
    }
  };

  // Kích hoạt đúng modal theo phương thức được chọn
  const handleProcessPayment = () => {
    if (paymentMethod === 'vietqr') {
      setShowQRModal(true);
    } else if (paymentMethod === 'visa') {
      setShowCardModal(true);
    } else if (paymentMethod === 'atm') {
      setShowAtmModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowQRModal(false);
    setShowCardModal(false);
    setShowAtmModal(false);
    router.push('/checkout/success');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 text-slate-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Xác nhận đơn thuê & Thanh toán</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cột trái: Form thông tin & Chọn phương thức */}
          <div className="md:col-span-2 space-y-5">
            {/* 1. Điểm nhận đồ */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Thông tin nhận thiết bị
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-1 block">Họ và tên</label>
                  <input 
                    type="text" 
                    placeholder="Nhập họ và tên..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 bg-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-1 block">Mã số sinh viên (MSSV)</label>
                  <input 
                    type="text" 
                    placeholder="VD: 2313xxx"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 bg-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-700 mb-1 block">Điểm hẹn giao đồ</label>
                  <input 
                    type="text" 
                    placeholder="VD: Sảnh B6, KTX Khu B, Phòng tự học..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder:text-slate-400 bg-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" 
                  />
                </div>
              </div>
            </div>

            {/* 2. Phương thức thanh toán */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                <label 
                  onClick={() => setPaymentMethod('vietqr')}
                  className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition ${
                    paymentMethod === 'vietqr' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    checked={paymentMethod === 'vietqr'} 
                    readOnly 
                    className="text-blue-600 focus:ring-blue-500" 
                  />
                  <QrCode className="w-5 h-5 ml-3 text-blue-600" />
                  <div className="ml-3">
                    <p className="font-medium text-sm text-slate-900">Chuyển khoản VietQR</p>
                    <p className="text-xs text-slate-500">Quét mã nhanh qua mọi App Ngân hàng</p>
                  </div>
                  <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded font-semibold">
                    Khuyên dùng
                  </span>
                </label>

                <label 
                  onClick={() => setPaymentMethod('visa')}
                  className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition ${
                    paymentMethod === 'visa' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    checked={paymentMethod === 'visa'} 
                    readOnly 
                    className="text-blue-600 focus:ring-blue-500" 
                  />
                  <CreditCard className="w-5 h-5 ml-3 text-slate-700" />
                  <div className="ml-3">
                    <p className="font-medium text-sm text-slate-900">Thẻ Visa / Mastercard</p>
                    <p className="text-xs text-slate-500">Cổng thanh toán thẻ quốc tế bảo mật</p>
                  </div>
                </label>

                <label 
                  onClick={() => setPaymentMethod('atm')}
                  className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition ${
                    paymentMethod === 'atm' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    checked={paymentMethod === 'atm'} 
                    readOnly 
                    className="text-blue-600 focus:ring-blue-500" 
                  />
                  <Building2 className="w-5 h-5 ml-3 text-slate-700" />
                  <div className="ml-3">
                    <p className="font-medium text-sm text-slate-900">Thẻ ATM / Internet Banking</p>
                    <p className="text-xs text-slate-500">Napas cổng ngân hàng nội địa</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Cột phải: Summary & Bộ chọn ngày */}
          <div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Chi tiết thuê đồ</h3>

              <div className="flex gap-3 pb-3 border-b border-slate-100">
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.title} 
                  className="w-16 h-16 rounded-lg object-cover border border-slate-200 flex-shrink-0" 
                />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-slate-900 line-clamp-2">{selectedItem.title}</p>
                  <p className="text-blue-600 font-semibold">{selectedItem.rentalPricePerDay.toLocaleString('vi-VN')} đ/ngày</p>
                </div>
              </div>

              {/* Bộ chỉnh số ngày thuê & ngày nhận */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">Số ngày thuê:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDecreaseDays}
                      disabled={durationDays <= 1}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-slate-900">{durationDays}</span>
                    <button
                      type="button"
                      onClick={handleIncreaseDays}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    Ngày bắt đầu nhận đồ:
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Tóm tắt tiền */}
              <div className="text-sm space-y-2 border-b border-slate-100 pb-3">
                <div className="flex justify-between text-slate-600">
                  <span>Tiền thuê ({durationDays} ngày):</span>
                  <span className="font-medium text-slate-800">{rentalTotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tiền cọc giữ đồ:</span>
                  <span className="font-medium text-slate-800">{depositTotal.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900">Tổng thanh toán:</span>
                <span className="text-xl font-bold text-blue-600">{grandTotal.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>Hoàn 100% cọc sau khi người cho mượn kiểm tra đồ.</span>
              </div>

              <button
                onClick={handleProcessPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition shadow-sm"
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Modal VietQR */}
      <VietQRModal 
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={grandTotal}
        orderCode={orderCode}
      />

      {/* 2. Modal Thẻ Visa/Mastercard */}
      <CardPaymentModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={grandTotal}
      />

      {/* 3. Modal Thẻ ATM Napas */}
      <AtmPaymentModal
        isOpen={showAtmModal}
        onClose={() => setShowAtmModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={grandTotal}
      />
    </div>
  );
}