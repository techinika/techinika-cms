import { ResourceFile } from "@/types/main";
import { FileText, HardDrive, PictureInPicture, Video } from "lucide-react";
import Link from "next/link";

export const ResourceCard = ({ resource }: { resource: ResourceFile }) => {
  const formatSize = (kb: number) => {
    if (kb > 1024) return `${(kb / 1024).toFixed(2)} MB`;
    return `${kb.toFixed(1)} KB`;
  };

  const type = resource?.metadata?.mimetype;

  let Icon, iconColor;
  switch (true) {
    case type?.includes("image"):
      Icon = PictureInPicture;
      iconColor = "text-green-600 bg-green-50";
      break;
    case type?.includes("video"):
      Icon = Video;
      iconColor = "text-red-600 bg-red-50";
      break;
    case type !== "image" && type !== "video":
      Icon = FileText;
      iconColor = "text-blue-600 bg-blue-50";
      break;
    default:
      Icon = HardDrive;
      iconColor = "text-gray-600 bg-gray-50";
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-md p-4 flex flex-col transition-all hover:shadow-lg hover:border-blue-400">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-gray-500">
          {formatSize(resource?.metadata?.size)}
        </span>
      </div>

      <h3
        className="text-base font-semibold text-gray-800 truncate mb-1"
        title={resource.name}
      >
        {resource.name}
      </h3>

      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <span className="capitalize">{resource?.metadata?.mimetype}</span>
        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
        <span className="font-medium text-blue-700">{resource.category}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
        <Link
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
        >
          View
        </Link>
        <button className="text-sm text-red-500 hover:text-red-700 transition">
          Delete
        </button>
      </div>
    </div>
  );
};
