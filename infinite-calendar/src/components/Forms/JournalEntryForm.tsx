import React, { useState, useEffect } from "react";
import { X, Upload, Star } from "lucide-react";
import { JournalEntry } from "../../types";
import { format } from "date-fns";

interface JournalEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<JournalEntry, "id">) => void;
  editingEntry?: JournalEntry | null;
  selectedDate?: Date;
}

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEntry,
  selectedDate,
}) => {
  const [formData, setFormData] = useState({
    imgUrl: "",
    rating: 5,
    categories: [""],
    date: format(selectedDate || new Date(), "dd/MM/yyyy"),
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        imgUrl: editingEntry.imgUrl,
        rating: editingEntry.rating,
        categories: [...editingEntry.categories],
        date: editingEntry.date,
        description: editingEntry.description,
      });
    } else if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        date: format(selectedDate, "dd/MM/yyyy"),
      }));
    }
  }, [editingEntry, selectedDate]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.imgUrl.trim()) {
      newErrors.imgUrl = "Image URL is required";
    } else if (!isValidUrl(formData.imgUrl)) {
      newErrors.imgUrl = "Please enter a valid URL";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.date.trim()) {
      newErrors.date = "Date is required";
    } else if (!isValidDate(formData.date)) {
      newErrors.date = "Please enter a valid date (DD/MM/YYYY)";
    }

    if (
      formData.categories.length === 0 ||
      formData.categories.every((cat) => !cat.trim())
    ) {
      newErrors.categories = "At least one category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) return false;

    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanCategories = formData.categories
      .filter((cat) => cat.trim())
      .map((cat) => cat.trim());

    onSave({
      imgUrl: formData.imgUrl.trim(),
      rating: formData.rating,
      categories: cleanCategories,
      date: formData.date,
      description: formData.description.trim(),
    });

    setFormData({
      imgUrl: "",
      rating: 5,
      categories: [""],
      date: format(new Date(), "dd/MM/yyyy"),
      description: "",
    });
    setErrors({});
    onClose();
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, ""],
    }));
  };

  const removeCategory = (index: number) => {
    if (formData.categories.length > 1) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((_, i) => i !== index),
      }));
    }
  };

  const updateCategory = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat, i) => (i === index ? value : cat)),
    }));
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setFormData((prev) => ({ ...prev, rating: index + 1 }))}
        className={`p-1 transition-colors ${
          index < formData.rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        <Star className="w-6 h-6 fill-current" />
      </button>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingEntry ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-80px)]"
        >
          <div className="p-6 space-y-6">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.imgUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, imgUrl: e.target.value }))
                  }
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.imgUrl ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {errors.imgUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.imgUrl}</p>
              )}
              {formData.imgUrl && isValidUrl(formData.imgUrl) && (
                <div className="mt-3">
                  <img
                    src={formData.imgUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={() =>
                      setErrors((prev) => ({
                        ...prev,
                        imgUrl: "Failed to load image",
                      }))
                    }
                  />
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="DD/MM/YYYY"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating ({formData.rating}/5)
              </label>
              <div className="flex items-center space-x-1">{renderStars()}</div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories *
              </label>
              {formData.categories.map((category, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => updateCategory(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter category"
                  />
                  {formData.categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addCategory}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Category
              </button>
              {errors.categories && (
                <p className="mt-1 text-sm text-red-600">{errors.categories}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe your hair care experience..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingEntry ? "Update Entry" : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
