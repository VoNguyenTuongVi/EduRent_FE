import Link from 'next/link';
import { MOCK_ITEMS } from '@/mock/mockData';
import { vnd } from '@/lib/format';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Chọn đồ cần mượn</h1>
        <p className="text-sm text-neutral-500 mt-1">Nhận đồ tại KTX hoặc phòng tự học, cọc được hoàn sau khi trả.</p>
      </div>

      <ul className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl bg-white">
        {MOCK_ITEMS.map((item) => (
          <li key={item.id}>
            <Link href={`/checkout?id=${item.id}`} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition">
              <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-neutral-100 text-[0px] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{item.category} · {item.owner}</p>
                <p className="text-xs text-neutral-500 mt-0.5">Cọc {vnd(item.depositAmount)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">{vnd(item.rentalPricePerDay)}</p>
                <p className="text-xs text-neutral-500">/ngày</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
