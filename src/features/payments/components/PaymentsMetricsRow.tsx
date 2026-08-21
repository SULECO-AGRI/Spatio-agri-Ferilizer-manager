import { MetricCard } from "@/components/ui";
import type { MetricItem } from "@/types";

interface PaymentsMetricsRowProps {
  metrics: MetricItem[];
}

export function PaymentsMetricsRow({ metrics }: PaymentsMetricsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
      {metrics.map((item) => (
        <MetricCard key={item.title} title={item.title} value={item.value} footer={item.footer} />
      ))}
    </div>
  );
}
