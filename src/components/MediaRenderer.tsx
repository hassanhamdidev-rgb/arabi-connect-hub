import { FileText, Play, Music, Image as ImageIcon } from "lucide-react";
import { assetUrl, DIRECTUS_URL } from "@/lib/directus";

interface MediaRendererProps {
  fileId?: string | number | null;
  alt?: string;
  className?: string;
  /** Optional explicit mime type override */
  type?: string;
}

const guessKindFromUrl = (url: string): "image" | "video" | "audio" | "pdf" | "other" => {
  const lower = url.toLowerCase().split("?")[0];
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(lower)) return "video";
  if (/\.(mp3|wav|ogg|m4a|aac|flac)$/.test(lower)) return "audio";
  if (/\.pdf$/.test(lower)) return "pdf";
  if (/\.(jpe?g|png|gif|webp|avif|svg)$/.test(lower)) return "image";
  return "other";
};

/**
 * Render a Directus file as image, video, audio or PDF preview.
 * Falls back to a download chip for unknown types.
 */
const MediaRenderer = ({ fileId, alt, className, type }: MediaRendererProps) => {
  if (!fileId) return null;
  const id = String(fileId);
  // Use the raw asset URL — Directus serves the original mime type.
  const rawUrl = `${DIRECTUS_URL}/assets/${id}`;
  const imgUrl = assetUrl(id, { width: 1200, fit: "cover" });
  const fileUrl = assetUrl(id);

  const kind = type
    ? type.startsWith("image/")
      ? "image"
      : type.startsWith("video/")
        ? "video"
        : type.startsWith("audio/")
          ? "audio"
          : type === "application/pdf"
            ? "pdf"
            : "other"
    : guessKindFromUrl(rawUrl);

  const wrap = `relative overflow-hidden bg-muted ${className ?? ""}`;

  if (kind === "image") {
    return (
      <div className={wrap}>
        <img
          src={imgUrl}
          alt={alt ?? ""}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  if (kind === "video") {
    return (
      <div className={wrap}>
        <video
          src={fileUrl}
          controls
          playsInline
          className="w-full h-full object-cover bg-foreground"
        >
          <track kind="captions" />
        </video>
        <div className="absolute top-2 right-2 chip bg-foreground/70 text-background border-transparent">
          <Play className="w-3 h-3" /> فيديو
        </div>
      </div>
    );
  }

  if (kind === "audio") {
    return (
      <div className={`${wrap} flex flex-col items-center justify-center gap-3 p-6 gradient-teal`}>
        <div className="w-14 h-14 rounded-full bg-primary-foreground/15 flex items-center justify-center">
          <Music className="w-7 h-7 text-primary-foreground" />
        </div>
        <audio src={fileUrl} controls className="w-full max-w-sm" />
      </div>
    );
  }

  if (kind === "pdf") {
    return (
      <div className={wrap}>
        <object
          data={fileUrl}
          type="application/pdf"
          className="w-full h-full min-h-[260px]"
        >
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center h-full gap-2 p-6 text-foreground"
          >
            <FileText className="w-10 h-10 text-accent" />
            <span className="font-medium">فتح المستند PDF</span>
          </a>
        </object>
        <div className="absolute top-2 right-2 chip bg-foreground/70 text-background border-transparent">
          <FileText className="w-3 h-3" /> PDF
        </div>
      </div>
    );
  }

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${wrap} flex items-center justify-center gap-2 p-6 text-muted-foreground hover:text-foreground`}
    >
      <ImageIcon className="w-6 h-6" /> فتح الملف
    </a>
  );
};

export default MediaRenderer;
