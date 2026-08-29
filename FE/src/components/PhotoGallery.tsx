"use client";

import { useState } from "react";
import { Camera, Sparkles, X, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { CeremonyInfo, MemoryItem } from "@/types";

interface PhotoGalleryProps {
  ceremony: CeremonyInfo;
}

export default function PhotoGallery({ ceremony }: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  let memories: MemoryItem[] = [];
  try {
    if (ceremony.memoriesJson) {
      memories = JSON.parse(ceremony.memoriesJson);
    }
  } catch {
    memories = [];
  }

  // Pre-curated high quality graduation & university milestone pictures
  const galleryItems = [
    {
      url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop",
      title: "Khoảnh Khắc Tốt Nghiệp & Tung Mũ",
      caption: "Cột mốc tự hào sau 4 năm giảng đường đại học",
      tag: "Graduation Day",
    },
    {
      url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop",
      title: "Giảng Đường & Giờ Học Đồ Án",
      caption: "Những buổi thảo luận đồ án cùng thầy cô và bạn bè",
      tag: "Campus Life",
    },
    {
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
      title: "Đồng Đội & Nhóm Bạn Thân",
      caption: "Cùng nhau vượt qua các kỳ thi và những đêm thức trắng",
      tag: "Best Friends",
    },
    {
      url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop",
      title: "Bảo Vệ Luận Văn Tốt Nghiệp",
      caption: "Tự tin báo cáo đề tài nghiên cứu xuất sắc trước hội đồng",
      tag: "Thesis Defense",
    },
    {
      url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop",
      title: "Khuôn Viên Đại Học Thân Thương",
      caption: "Nơi lưu dấu muôn vàn kỷ niệm của một thời thanh xuân",
      tag: "University",
    },
    {
      url: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?q=80&w=1000&auto=format&fit=crop",
      title: "Sẵn Sàng Cho Chặng Đường Mới",
      caption: "Tự tin bước ra thế giới với tri thức và nhiệt huyết",
      tag: "New Beginning",
    },
  ];

  const handlePrev = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(
        (selectedPhotoIndex - 1 + galleryItems.length) % galleryItems.length
      );
    }
  };

  const handleNext = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % galleryItems.length);
    }
  };

  return (
    <section id="gallery" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Kỷ Niệm Thanh Xuân</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white mb-4">
            Hành Trình 4 Năm Đại Học
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Một chặng đường đáng nhớ với biết bao kỷ niệm cùng bạn bè, thầy cô và mái trường đại học thân yêu.
          </p>
        </div>

        {/* Milestone Cards (if any) */}
        {memories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {memories.map((m, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-amber-500/30 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black font-mono px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300">
                    {m.year}
                  </span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{m.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group relative rounded-2xl overflow-hidden glass-card border border-slate-800 cursor-pointer aspect-[4/3] shadow-lg hover:shadow-amber-500/10 hover:border-amber-500/40 transition-all duration-500"
            >
              {/* Image */}
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Tag Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  {item.tag}
                </span>
              </div>

              {/* Caption Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1 group-hover:line-clamp-none transition-all">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 z-50"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={galleryItems[selectedPhotoIndex].url}
              alt={galleryItems[selectedPhotoIndex].title}
              className="max-h-[70vh] w-auto rounded-2xl object-contain shadow-2xl border border-slate-800"
            />
            <div className="text-center mt-4">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {galleryItems[selectedPhotoIndex].tag}
              </span>
              <h4 className="text-lg font-bold text-white mt-1">
                {galleryItems[selectedPhotoIndex].title}
              </h4>
              <p className="text-sm text-slate-300 mt-1">
                {galleryItems[selectedPhotoIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
