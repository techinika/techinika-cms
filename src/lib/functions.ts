import { Tile } from "@/types/main";

export const handleTileClick = (tile: Tile) => {
  const url = `/${tile.id.split("_").join("/")}`;
  if (tile.children) {
    window.location.href = `${url}`;
  } else {
    alert(`Navigating to list view for: ${tile.title}.`);
  }
};

export const copyToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    alert("Copied to clipboard!");
  } catch (err) {
    console.error("Could not copy text: ", err);
  }
  document.body.removeChild(textArea);
};

export const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 60);
};

export const getStatusStyles = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700 border-green-400";
    case "Active":
      return "bg-blue-100 text-blue-700 border-blue-400";
    case "Scheduled":
      return "bg-yellow-100 text-yellow-700 border-yellow-400";
    case "Draft":
      return "bg-gray-100 text-gray-700 border-gray-400";
    default:
      return "bg-gray-100 text-gray-700 border-gray-400";
  }
};
