import { gender } from "@/lib/courses";

export default function GenderTag({ fr }: { fr: string }) {
  const g = gender(fr);
  if (!g) return null;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-bold text-white ${g.g === "m" ? "bg-masc" : "bg-fem"}`}
    >
      {g.g === "m" ? "阳性" : "阴性"}
      {g.plural ? " · 复数" : ""}
    </span>
  );
}
