"use client";

import { generateSlug } from "@/lib/functions";
import { Globe, Hash, Image, Plus, Save } from "lucide-react";
import { useState } from "react";
import { MOCK_LANGUAGES } from "../pages/Content/TechnologiesPage";

const INITIAL_FORM_STATE = {
  name: "",
  lang: "english",
  description: "",
  icon_url: "",
  tags: "",
  slug: "",
};

export const NewTechnologyForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const newFormData = { ...formData, [name]: value };

    if (name === "name") {
      newFormData.slug = generateSlug(value);
    }

    setFormData(newFormData);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      alert("Please fill in the Name and Description fields.");
      return;
    }

    const newTech = {
      ...formData,
      id: `tech_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    setFormData(INITIAL_FORM_STATE);
    alert(`Technology '${newTech.name}' added! (Check console for data)`);
    console.log("New Technology Added:", newTech);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center border-b pb-2">
        <Plus className="w-6 h-6 mr-2" /> Add New Technology
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., React, TensorFlow, etc."
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lang"
              className="block text-sm font-medium text-gray-700"
            >
              Primary Language
            </label>
            <div className="relative mt-1">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                name="lang"
                id="lang"
                value={formData.lang}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 pl-10 focus:border-primary focus:ring-primary"
              >
                {MOCK_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug (URL Path)
          </label>
          <div className="flex items-center mt-1">
            <span className="bg-gray-100 p-2.5 rounded-l-lg border border-r-0 border-gray-300 text-gray-600 text-sm">
              /technology/
            </span>
            <input
              type="text"
              name="slug"
              id="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="auto-generated-slug"
              className="block w-full rounded-r-lg border border-gray-300 shadow-sm p-2.5 focus:border-primary focus:ring-primary bg-gray-50 text-gray-700"
              readOnly
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="A concise description of the technology and its purpose."
            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 focus:border-primary focus:ring-primary resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="icon_url"
              className="block text-sm font-medium text-gray-700"
            >
              Icon / Image URL
            </label>
            <div className="relative mt-1">
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                name="icon_url"
                id="icon_url"
                value={formData.icon_url}
                onChange={handleChange}
                placeholder="https://example.com/icon.png"
                className="block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 pl-10 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags (comma separated)
            </label>
            <div className="relative mt-1">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="tags"
                id="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., js, frontend, database"
                className="block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 pl-10 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary transition w-full justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save New Technology
          </button>
        </div>
      </form>
    </div>
  );
};
