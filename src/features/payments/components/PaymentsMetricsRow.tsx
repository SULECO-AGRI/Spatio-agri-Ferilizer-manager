import { MetricCard } from "@/components/common";
import { useLanguage } from "@/context/LanguageContext";
import type { MetricItem } from "@/types";

interface PaymentsMetricsRowProps {
  metrics: MetricItem[];
}

function translateTitle(title: string, isSinhala: boolean): string {
  if (!isSinhala) return title;
  switch (title) {
    case "Total Invoiced":
      return "මුළු ඉන්වොයිස් කළ මුදල";
    case "Paid Out":
      return "ගෙවා නිමකළ මුදල";
    case "Pending Invoices":
      return "පොරොත්තු ඉන්වොයිස්";
    default:
      return title;
  }
}

function translateFooter(footer: string | undefined, isSinhala: boolean): string | undefined {
  if (!footer || !isSinhala) return footer;
  // Match patterns like "X Total Invoices Generated", "X Disbursements Completed", "X Awaiting Settlement"
  if (footer.includes("Invoices Generated") || footer.includes("Invoices")) {
    const num = footer.match(/\d+/)?.[0] || "0";
    return `මුළු ඉන්වොයිස් ${num} ක් නිකුත් කෙරිණි`;
  }
  if (footer.includes("Disbursements")) {
    const num = footer.match(/\d+/)?.[0] || "0";
    return `ගෙවීම් ${num} ක් සම්පූර්ණයි`;
  }
  if (footer.includes("Awaiting Settlement") || footer.includes("Overdue")) {
    const num = footer.match(/\d+/)?.[0] || "0";
    return `බේරුම් කිරීමට ඇති ${num} කි`;
  }
  return footer;
}

export function PaymentsMetricsRow({ metrics }: PaymentsMetricsRowProps) {
  const { isSinhala } = useLanguage();

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans ${isSinhala ? "font-sinhala" : ""}`}>
      {metrics.map((item) => (
        <MetricCard
          key={item.title}
          title={translateTitle(item.title, isSinhala)}
          value={item.value}
          footer={translateFooter(item.footer, isSinhala)}
        />
      ))}
    </div>
  );
}
