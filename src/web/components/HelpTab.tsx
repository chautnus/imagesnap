import React from 'react';
import { BookOpen, Camera, Globe, Smartphone, Zap, Save, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HelpTabProps {
  t: (key: string) => string;
}

export const HelpTab: React.FC<HelpTabProps> = ({ t }) => {
  const steps = [
    {
      icon: <Globe className="text-blue-400" />,
      title: "Snap From Browser",
      desc: "Mở một trang web bất kỳ trên Chrome/Edge, nhấn nút Snap để tự động quét và lấy tất cả ảnh sản phẩm cùng thông tin giá, tên."
    },
    {
      icon: <Camera className="text-accent" />,
      title: "Burst Camera",
      desc: "Chế độ chụp liên tục chuyên nghiệp. Hỗ trợ Zoom, Flash, Lưới và Khóa tỉ lệ 1:1. Ảnh sẽ được lưu vào dải xem nhanh bên dưới."
    },
    {
      icon: <Zap className="text-yellow-400" />,
      title: "Auto-Fill Metadata",
      desc: "Hệ thống tự động điền URL, Tên và Giá vào các trường dữ liệu tương ứng khi bạn lấy ảnh từ trình duyệt."
    },
    {
      icon: <Save className="text-green-400" />,
      title: "One-Click Sync",
      desc: "Dữ liệu được lưu trực tiếp vào Google Drive của Admin và cập nhật tức thì vào Google Sheets để quản lý tập trung."
    }
  ];

  return (
    <div className="pb-24 p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
          <BookOpen className="text-accent" size={32} />
          {t('userGuide') || 'USER_GUIDE'}
        </h2>
        <p className="text-muted text-sm font-medium leading-relaxed">
          Chào mừng bạn đến với ImageSnap. Dưới đây là các bước cơ bản để bạn làm chủ công cụ lấy dữ liệu sản phẩm này.
        </p>
      </div>

      <div className="grid gap-4">
        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card/30 border border-white/5 p-5 rounded-2xl flex gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              {step.icon}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-black tracking-tight text-white uppercase text-sm">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed font-medium">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-accent/5 border border-accent/20 p-6 rounded-3xl mt-4">
        <h4 className="font-black text-accent text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
          <CheckCircle2 size={14} /> Mẹo chụp ảnh chuyên nghiệp
        </h4>
        <ul className="space-y-3">
          <li className="flex gap-3 text-xs font-bold text-white/80">
            <span className="text-accent">•</span>
            Dùng App Camera để tận dụng tối đa phần cứng máy ảnh (Focus/Exposure).
          </li>
          <li className="flex gap-3 text-xs font-bold text-white/80">
            <span className="text-accent">•</span>
            Bật Lưới (Grid) để căn giữa sản phẩm chuẩn hơn.
          </li>
          <li className="flex gap-3 text-xs font-bold text-white/80">
            <span className="text-accent">•</span>
            Dùng tính năng Pinch-to-Zoom để chụp các chi tiết nhỏ.
          </li>
        </ul>
      </div>

      <div className="flex justify-center mt-4">
        <span className="text-[10px] font-black text-muted tracking-widest uppercase opacity-30">
          ImageSnap v1.3.1 • Documentation Snapshot
        </span>
      </div>
    </div>
  );
};
