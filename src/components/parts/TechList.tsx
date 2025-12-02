import { ArrowLeft, ArrowRight, Code } from "lucide-react";
import { TagDisplay } from "../ui/tag-display";
import { copyToClipboard } from "@/lib/functions";
import { TrendingTechnology } from "@/types/main";

export const TechnologyList = ({
  technologies,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: {
  technologies: TrendingTechnology[];
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (b: number) => void;
}) => {
  const totalItems = technologies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentTechnologies = technologies.slice(start, end);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (totalItems === 0) {
    return (
      <div className="text-center p-12 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
        <Code className="w-10 h-10 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">
          No technologies found.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Try adjusting your filters or add a new technology using the form
          above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="font-bold text-gray-500 uppercase text-xs p-4 flex border-b border-gray-100 bg-gray-50">
        <div className="w-4/12">Technology</div>
        <div className="w-3/12 hidden md:block">Tags</div>
        <div className="w-2/12 hidden sm:block">Lang / Created</div>
        <div className="w-2/12 hidden lg:block">Slug</div>
        <div className="w-1/12 text-right">Actions</div>
      </div>

      <div>
        {currentTechnologies.map((tech) => (
          <div
            key={tech.id}
            className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <div className="w-4/12 flex items-center space-x-3 pr-4">
              {tech?.icon && (
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="w-8 h-8 rounded-full shadow-md object-cover"
                />
              )}
              <div>
                <h3
                  className="font-semibold text-gray-800 truncate"
                  title={tech.name}
                >
                  {tech.name}
                </h3>
                <p
                  className="text-xs text-gray-500 mt-1 truncate"
                  title={tech.description}
                >
                  {tech.description}
                </p>
              </div>
            </div>

            <div className="w-3/12 hidden md:block">
              <TagDisplay tagsString={tech.tags} />
            </div>

            <div className="w-2/12 hidden sm:block text-sm text-gray-600">
              <p className="text-xs font-medium text-primary">
                {tech.lang.toUpperCase()}
              </p>
              <p className="text-xs">
                {new Date(tech.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="w-2/12 hidden lg:block text-sm text-gray-600">
              <span
                title={tech.slug}
                className="text-xs bg-gray-100 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-200"
                onClick={() => copyToClipboard(tech.slug)}
              >
                {tech.slug}
              </span>
            </div>

            <div className="w-1/12 flex justify-end space-x-2 text-sm">
              <button className="text-primary font-medium text-xs">Edit</button>
              <button className="text-red-600 hover:text-red-800 font-medium text-xs">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Showing {start + 1} to {Math.min(end, totalItems)} of {totalItems}{" "}
            results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
