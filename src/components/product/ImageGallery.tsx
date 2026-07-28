import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.filter(Boolean);
  const [idx, setIdx] = useState(0);

  if (list.length === 0) return null;

  // Single image: clean, no thumbs, no arrows, hover-zoom.
  if (list.length === 1) {
    return (
      <div className="group overflow-hidden rounded-2xl border border-border bg-white">
        <img
          src={list[0]}
          alt={alt}
          className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
    );
  }

  // Multi-image: main + thumb strip + arrows
  const go = (d: number) => setIdx((i) => (i + d + list.length) % list.length);

  return (
    <div>
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-white">
        <img
          src={list[idx]}
          alt={alt}
          className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-primary shadow-md backdrop-blur transition hover:bg-white"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-primary shadow-md backdrop-blur transition hover:bg-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <ul className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {list.map((src, i) => (
          <li key={src + i}>
            <button
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === idx}
              className={`grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border-2 transition ${
                i === idx
                  ? "border-accent"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}