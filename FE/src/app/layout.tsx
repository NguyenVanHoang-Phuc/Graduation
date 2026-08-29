import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lễ Tốt Nghiệp Đại Học - Thư Mời Tham Dự",
  description:
    "Trân trọng kính mời quý thầy cô, gia đình, bạn bè và đồng nghiệp đến tham dự Lễ tốt nghiệp đại học.",
  openGraph: {
    title: "Lễ Tốt Nghiệp Đại Học - Thư Mời Tham Dự",
    description:
      "Trân trọng kính mời quý thầy cô, gia đình, bạn bè và đồng nghiệp đến tham dự Lễ tốt nghiệp đại học.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="bg-[#060913] text-slate-100 min-h-screen relative antialiased selection:bg-amber-500/30 selection:text-amber-300">
        {/* Background ambient lighting glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
