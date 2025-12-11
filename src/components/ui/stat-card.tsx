type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) => (
  <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
    <div
      className={`flex items-center justify-between p-2 rounded-full w-12 h-12 ${color} bg-opacity-10 mb-3`}
    >
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
  </div>
);
