"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { RESOURCE_CATEGORIES } from "@/lib/Resources";

export const AddResourceModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "image" as keyof typeof RESOURCE_CATEGORIES,
    category: RESOURCE_CATEGORIES["image"][0],
    sizeKB: "",
    url: "https://placehold.co/100x100/1D4ED8/fff?text=R",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as keyof typeof RESOURCE_CATEGORIES;
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: RESOURCE_CATEGORIES[newType][0],
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        sizeKB: parseFloat(formData.sizeKB || "0"),
        createdAt: new Date(),
      };

      console.log("Resource successfully added.");
      setFormData({
        name: "",
        type: "image",
        category: RESOURCE_CATEGORIES["image"][0],
        sizeKB: "",
        url: "https://placehold.co/100x100/1D4ED8/fff?text=R",
      });
      onClose();
    } catch (error) {
      console.error("Error adding resource to Firestore:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-primary" /> Add New Resource
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-semibold text-gray-600">
              Mock File Upload Area
            </p>
            <p className="text-xs text-gray-500">
              Metadata will be saved, no actual file is uploaded.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Q3 Earnings Report"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Size (KB)
              </span>
              <input
                type="number"
                name="sizeKB"
                value={formData.sizeKB}
                onChange={handleInputChange}
                required
                min="0.1"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  p-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Resource Type
              </span>
              <select
                name="type"
                value={formData.type}
                onChange={handleTypeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Usage Category
              </span>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500"
              >
                {RESOURCE_CATEGORIES[formData.type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-800 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Add Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
