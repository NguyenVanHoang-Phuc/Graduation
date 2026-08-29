"use client";

import { Clock, Camera, GraduationCap, Sparkles, Utensils, Award } from "lucide-react";
import { CeremonyInfo, AgendaItem } from "@/types";

interface CeremonyTimelineProps {
  ceremony: CeremonyInfo;
}

export default function CeremonyTimeline({ ceremony }: CeremonyTimelineProps) {
  let agenda: AgendaItem[] = [];
  try {
    if (ceremony.agendaJson) {
      agenda = JSON.parse(ceremony.agendaJson);
    }
  } catch {
    agenda = [];
  }

  const icons = [Camera, Award, GraduationCap, Utensils];

  return (
    <section id="timeline" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Chương Trình Chi Tiết</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white mb-4">
            Lịch Trình Buổi Lễ Tốt Nghiệp
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Hãy cùng điểm qua các mốc thời gian quan trọng trong ngày vui tốt nghiệp để cùng nhau lưu giữ những khoảnh khắc đẹp nhất!
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative">
          {/* Vertical Center Line */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-500/20 via-amber-400 to-amber-500/20" />

          <div className="space-y-8 md:space-y-12">
            {agenda.map((item, index) => {
              const Icon = icons[index % icons.length] || Sparkles;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-6 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content Card */}
                  <div className="w-full md:w-1/2">
                    <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 group hover:scale-[1.02] shadow-xl">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {item.time}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          Phần {index + 1}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors mb-2">
                        {item.title}
                      </h3>

                      <p className="text-sm text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Icon Badge */}
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-400 text-amber-400 shadow-lg shadow-amber-500/20 z-10 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Spacer for other side */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Dress Code & Tips Banner */}
        {ceremony.dressCode && (
          <div className="mt-16 glass-card-gold rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-amber-300 mb-1">
                Gợi Ý Trang Phục (Dress Code)
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {ceremony.dressCode}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
