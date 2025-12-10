import { APPLICATION_STATUSES } from "@/types/opportunity";

export const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig =
    APPLICATION_STATUSES.find((s) => s.value === status) ||
    APPLICATION_STATUSES[0];
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusConfig.color}`}
    >
      {statusConfig.label}
    </span>
  );
};
