export const TagDisplay = ({ tagsString }: { tagsString: string }) => {
  const tags = tagsString
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};
