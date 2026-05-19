"use client";

import React, { useState, useEffect } from "react";
import { Laptop, Key, Wifi, Shield, DollarSign } from "lucide-react";

const ROTATOR_TEXTS = [
  {
    text: "Mengelola Aset Hardware & Workstation Kamar Tamu",
    icon: Laptop,
    color: "text-[#c9a342]"
  },
  {
    text: "Memantau Lisensi Software & Kepatuhan Keamanan",
    icon: Key,
    color: "text-emerald-500"
  },
  {
    text: "Mengontrol Infrastruktur Jaringan & WiFi Meraki",
    icon: Wifi,
    color: "text-blue-500"
  },
  {
    text: "Mengamankan Server NVR CCTV & Akses Kontrol Pintu",
    icon: Shield,
    color: "text-purple-500"
  },
  {
    text: "Mengoptimalkan Anggaran Belanja CAPEX & OPEX IT",
    icon: DollarSign,
    color: "text-amber-500"
  }
];

export function WelcomeBanner() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = ROTATOR_TEXTS[index].text;

    const handleType = () => {
      if (!isDeleting) {
        // Typing phase
        const nextText = currentFullText.substring(0, displayText.length + 1);
        setDisplayText(nextText);
        setTypingSpeed(50); // fast and natural typing speed

        if (nextText === currentFullText) {
          // Pause when full text is typed, then start deleting
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, 3000); // Wait 3s before starting to delete
          return;
        }
      } else {
        // Deleting phase
        const nextText = currentFullText.substring(0, displayText.length - 1);
        setDisplayText(nextText);
        setTypingSpeed(20); // fast deletion speed

        if (nextText === "") {
          setIsDeleting(false);
          setIndex((prevIndex) => (prevIndex + 1) % ROTATOR_TEXTS.length);
          return;
        }
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, typingSpeed]);

  const ActiveIcon = ROTATOR_TEXTS[index].icon;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f1420] via-[#1a2235] to-[#0a0d14] p-6 md:p-8 text-white shadow-xl border border-[rgba(201,163,66,0.12)]">
      {/* Glow elements in the background */}
      <div className="absolute right-[-10%] top-[-20%] w-[300px] h-[300px] rounded-full bg-[rgba(201,163,66,0.04)] blur-3xl pointer-events-none" />
      <div className="absolute left-[30%] bottom-[-20%] w-[250px] h-[250px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl space-y-4">
        {/* Five Star Emblem */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 bg-[rgba(201,163,66,0.12)] border border-[rgba(201,163,66,0.25)] rounded-full px-2.5 py-0.5 shadow-sm">
            <span className="text-[10px] text-[#c9a342] tracking-wider font-bold">★★★★★</span>
            <span className="text-[8.5px] text-[#e8c05a] font-mono font-extrabold uppercase tracking-widest pl-1">THE SANKARA SUITES & VILLAS</span>
          </div>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[9px] text-muted-foreground/60 tracking-wider font-semibold">Active Session</span>
        </div>

        {/* Dashboard Title */}
        <div className="space-y-1.5">
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3f4f6] to-[#e8c05a] uppercase">
            Hotel IT Inventory Portal
          </h1>
          <p className="text-sm md:text-[15px] text-muted-foreground font-medium leading-relaxed max-w-2xl">
            Sistem tata kelola profesional dan inventarisasi aset digital untuk menjamin kelancaran sistem perhotelan, jaringan operasional, dan efisiensi anggaran belanja IT secara real-time.
          </p>
        </div>

        {/* Animated Rotator Row */}
        <div className="pt-2 border-t border-border/10">
          <div className="flex items-center gap-2.5 h-7">
            <span className="font-mono text-[10px] text-muted-foreground/50 tracking-widest uppercase font-bold">SYSTEM STATS:</span>
            
            <div className="flex items-center gap-2">
              <ActiveIcon className={`h-4 w-4 shrink-0 ${ROTATOR_TEXTS[index].color}`} />
              <span className="text-xs font-semibold text-foreground/90 tracking-wide font-mono min-h-[1.25rem] flex items-center">
                {displayText}
                <span className="text-[#c9a342] font-black animate-[pulse_1s_infinite] ml-0.5">|</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative luxury abstract lines */}
      <div className="absolute right-6 bottom-6 opacity-10 hidden md:block">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#c9a342" strokeWidth="1" strokeDasharray="4 4" className="animate-spin" style={{ animationDuration: "60s" }} />
          <circle cx="50" cy="50" r="30" stroke="#c9a342" strokeWidth="0.5" />
          <path d="M50 20 L50 80 M20 50 L80 50" stroke="#c9a342" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}
