import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  FolderTree,
  Layers3,
  Plus,
  Search,
  PencilLine,
  Trash2,
  Power,
  Tags,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import adminApi from "../../api/adminApi.js";

const EMPTY_FORM = {
  name: "",
  keywords: "",
  isActive: true,
};

const EMPTY_SUBCATEGORY_FORM = {
  name: "",
  isActive: true,
};

const statusCardMeta = [
  {
    key: "total",
    label: "Total Categories",
    description: "All parent groups configured in admin",
    icon: FolderTree,
    tone: "bg-[#D7F5F1] text-[#0F766E]",
  },
  {
    key: "active",
    label: "Active",
    description: "Visible and ready for ongoing usage",
    icon: BadgeCheck,
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    key: "inactive",
    label: "Inactive",
    description: "Disabled groups kept for later review",
    icon: Power,
    tone: "bg-red-100 text-red-700",
  },
  {
    key: "subcategories",
    label: "Subcategories",
    description: "Nested options managed under categories",
    icon: Layers3,
    tone: "bg-[#E0F2FE] text-[#0369A1]",
  },
];

const statusClasses = (isActive) =>
  isActive
    ? "bg-emerald-100 text-emerald-700"
    : "bg-red-100 text-red-700";

const normalizeCategory = (category) => ({
  ...category,
  isActive: category?.isActive !== false,
  subcategories: (category?.subcategories || []).map((subcategory) => ({
    ...subcategory,
    isActive: subcategory?.isActive !== false,
  })),
});

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [categoryModal, setCategoryModal] = useState({ open: false, category: null });
  const [categoryForm, setCategoryForm] = useState(EMPTY_FORM);
  const [savingCategory, setSavingCategory] = useState(false);
  const [subcategoryModal, setSubcategoryModal] = useState({
    open: false,
    category: null,
    subcategory: null,
  });
  const [subcategoryForm, setSubcategoryForm] = useState(EMPTY_SUBCATEGORY_FORM);
  const [savingSubcategory, setSavingSubcategory] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await adminApi.get("/categories");
      setCategories((res.data?.categories || []).map(normalizeCategory));
    } catch (error) {
      console.error("Failed to load categories:", error);
      Swal.fire("Error", "Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return categories.filter((category) => {
      const activeMatch =
        activeFilter === "all" ||
        (activeFilter === "active" ? category.isActive : !category.isActive);
      const queryMatch =
        !normalized ||
        [category.name, category.slug, ...(category.keywords || [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalized));

      return activeMatch && queryMatch;
    });
  }, [activeFilter, categories, query]);

  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((category) => category.isActive).length;
    const inactive = total - active;
    const subcategories = categories.reduce(
      (sum, category) => sum + (category.subcategories?.length || 0),
      0
    );

    return { total, active, inactive, subcategories };
  }, [categories]);

  const openCreateCategory = () => {
    setCategoryModal({ open: true, category: null });
    setCategoryForm(EMPTY_FORM);
  };

  const openEditCategory = (category) => {
    setCategoryModal({ open: true, category });
    setCategoryForm({
      name: category.name || "",
      keywords: (category.keywords || []).join(", "),
      isActive: Boolean(category.isActive),
    });
  };

  const closeCategoryModal = () => {
    setCategoryModal({ open: false, category: null });
    setCategoryForm(EMPTY_FORM);
  };

  const saveCategory = async () => {
    const payload = {
      name: categoryForm.name.trim(),
      keywords: categoryForm.keywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      isActive: categoryForm.isActive,
    };

    if (!payload.name) {
      Swal.fire("Missing name", "Category name is required.", "warning");
      return;
    }

    setSavingCategory(true);
    try {
      if (categoryModal.category?._id) {
        const res = await adminApi.put(`/categories/${categoryModal.category._id}`, payload);
        const updatedCategory = normalizeCategory(res.data?.category);
        setCategories((prev) =>
          prev.map((item) => (item._id === updatedCategory._id ? updatedCategory : item))
        );
        Swal.fire("Saved", "Category updated successfully.", "success");
      } else {
        const res = await adminApi.post("/categories", payload);
        const newCategory = normalizeCategory(res.data?.category);
        setCategories((prev) => [newCategory, ...prev]);
        Swal.fire("Created", "Category added successfully.", "success");
      }

      closeCategoryModal();
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to save category",
        "error"
      );
    } finally {
      setSavingCategory(false);
    }
  };

  const toggleCategoryStatus = async (category) => {
    const nextStatus = !category.isActive;
    const result = await Swal.fire({
      title: `${nextStatus ? "Activate" : "Deactivate"} category?`,
      text: `${category.name} will be marked as ${nextStatus ? "active" : "inactive"}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: nextStatus ? "Activate" : "Deactivate",
      confirmButtonColor: nextStatus ? "#059669" : "#DC2626",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await adminApi.patch(`/categories/${category._id}/status`, {
        isActive: nextStatus,
      });
      const updatedCategory = normalizeCategory(res.data?.category);
      setCategories((prev) =>
        prev.map((item) => (item._id === updatedCategory._id ? updatedCategory : item))
      );
      Swal.fire(
        "Updated",
        `Category ${nextStatus ? "activated" : "deactivated"} successfully.`,
        "success"
      );
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to update status",
        "error"
      );
    }
  };

  const deleteCategory = async (category) => {
    const result = await Swal.fire({
      title: "Delete category?",
      text: `This will remove ${category.name} and its subcategories permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#DC2626",
    });

    if (!result.isConfirmed) return;

    try {
      await adminApi.delete(`/categories/${category._id}`);
      setCategories((prev) => prev.filter((item) => item._id !== category._id));
      Swal.fire("Deleted", "Category deleted successfully.", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to delete category",
        "error"
      );
    }
  };

  const openAddSubcategory = (category) => {
    setSubcategoryModal({ open: true, category, subcategory: null });
    setSubcategoryForm(EMPTY_SUBCATEGORY_FORM);
  };

  const openEditSubcategory = (category, subcategory) => {
    setSubcategoryModal({ open: true, category, subcategory });
    setSubcategoryForm({
      name: subcategory.name || "",
      isActive: Boolean(subcategory.isActive),
    });
  };

  const closeSubcategoryModal = () => {
    setSubcategoryModal({ open: false, category: null, subcategory: null });
    setSubcategoryForm(EMPTY_SUBCATEGORY_FORM);
  };

  const saveSubcategory = async () => {
    const name = subcategoryForm.name.trim();
    if (!name || !subcategoryModal.category?._id) {
      Swal.fire("Missing name", "Subcategory name is required.", "warning");
      return;
    }

    setSavingSubcategory(true);
    try {
      const categoryId = subcategoryModal.category._id;
      let res;

      if (subcategoryModal.subcategory?._id) {
        res = await adminApi.put(
          `/categories/${categoryId}/subcategories/${subcategoryModal.subcategory._id}`,
          {
            name,
            isActive: subcategoryForm.isActive,
          }
        );
      } else {
        res = await adminApi.post(`/categories/${categoryId}/subcategories`, {
          name,
          isActive: subcategoryForm.isActive,
        });
      }

      const updatedCategory = normalizeCategory(res.data?.category);
      setCategories((prev) =>
        prev.map((item) => (item._id === updatedCategory._id ? updatedCategory : item))
      );

      Swal.fire(
        subcategoryModal.subcategory ? "Saved" : "Created",
        `Subcategory ${subcategoryModal.subcategory ? "updated" : "added"} successfully.`,
        "success"
      );
      closeSubcategoryModal();
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to save subcategory",
        "error"
      );
    } finally {
      setSavingSubcategory(false);
    }
  };

  const toggleSubcategoryStatus = async (category, subcategory) => {
    const nextStatus = !subcategory.isActive;
    const result = await Swal.fire({
      title: `${nextStatus ? "Activate" : "Deactivate"} subcategory?`,
      text: `${subcategory.name} will be marked as ${nextStatus ? "active" : "inactive"}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: nextStatus ? "Activate" : "Deactivate",
      confirmButtonColor: nextStatus ? "#059669" : "#DC2626",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await adminApi.patch(
        `/categories/${category._id}/subcategories/${subcategory._id}/status`,
        { isActive: nextStatus }
      );
      const updatedCategory = normalizeCategory(res.data?.category);
      setCategories((prev) =>
        prev.map((item) => (item._id === updatedCategory._id ? updatedCategory : item))
      );
      Swal.fire(
        "Updated",
        `Subcategory ${nextStatus ? "activated" : "deactivated"} successfully.`,
        "success"
      );
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to update subcategory status",
        "error"
      );
    }
  };

  const deleteSubcategory = async (category, subcategory) => {
    const result = await Swal.fire({
      title: "Delete subcategory?",
      text: `${subcategory.name} will be removed permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#DC2626",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await adminApi.delete(
        `/categories/${category._id}/subcategories/${subcategory._id}`
      );
      const updatedCategory = normalizeCategory(res.data?.category);
      setCategories((prev) =>
        prev.map((item) => (item._id === updatedCategory._id ? updatedCategory : item))
      );
      Swal.fire("Deleted", "Subcategory deleted successfully.", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to delete subcategory",
        "error"
      );
    }
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.14),_transparent_34%),linear-gradient(180deg,#f7fffd_0%,#edfdf9_100%)] p-5 font-[Poppins] md:p-7">
      <div className="mb-8 overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-r from-[#0D9488] via-[#0F8A81] to-[#0F766E] p-8 text-white shadow-[0_30px_80px_rgba(13,148,136,0.22)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
              Taxonomy Control
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Manage categories and subcategories from one unified admin panel.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/78 md:text-base">
              Create new category groups, organize nested options, and control
              active or inactive states without leaving the dashboard workflow.
            </p>
          </div>

          <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur md:min-w-[330px]">
            <div className="flex items-center justify-between text-sm text-white/75">
              <span>Category Library</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                {stats.total} total
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-white/65">Active Structure</p>
                <p className="mt-2 text-2xl font-bold">{stats.active}</p>
                <p className="mt-1 text-xs text-white/65">
                  active categories available now
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateCategory}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#0F766E] transition hover:bg-[#ECFDF8]"
              >
                <Plus size={18} />
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statusCardMeta.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              whileHover={{ y: -4 }}
              className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                  <h2 className="mt-2 text-3xl font-bold text-[#0F766E]">
                    {stats[card.key]}
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {card.description}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.tone}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mb-6 rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-5 xl:grid xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,1fr)_auto] xl:items-center xl:gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D7F5F1] text-[#0F766E]">
                <Search size={19} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0F766E]">
                  Category Filters
                </h2>
                <p className="text-sm text-slate-500">
                  Find category groups fast and review active states.
                </p>
              </div>
            </div>
          </div>

          <div className="relative w-full xl:max-w-none">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search category, slug, keyword..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3 text-sm outline-none focus:border-[#0F766E]/40 focus:ring-4 focus:ring-[#0F766E]/10"
            />
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            {[
              { key: "all", label: `All (${stats.total})` },
              { key: "active", label: `Active (${stats.active})` },
              { key: "inactive", label: `Inactive (${stats.inactive})` },
            ].map((item) => {
              const active = activeFilter === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveFilter(item.key)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-[#0F766E] bg-[#0F766E] text-white shadow-[0_10px_25px_rgba(13,148,136,0.22)]"
                      : "border-slate-200 bg-white text-[#0F766E] hover:bg-[#D7F5F1]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-[28px] border border-white/80 bg-white/90 text-lg font-semibold text-[#0F766E] shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          Loading categories...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-14 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#0F766E]">
            No categories match the current filters.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Try switching the status filter or broadening the search.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[30px] border border-white/80 bg-white/95 shadow-[0_22px_55px_rgba(15,23,42,0.08)]">
          <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_160px_220px] gap-6 border-b border-slate-200 bg-slate-50/90 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid">
            <span>Category</span>
            <span>Keywords</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-slate-200/90">
            {filteredCategories.map((category) => (
              <motion.div
                key={category._id}
                layout
                whileHover={{ backgroundColor: "rgba(242,255,252,0.7)" }}
                className="px-5 py-5 md:px-6"
              >
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_160px_220px] lg:items-start lg:gap-6">
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D7F5F1] text-[#0F766E] sm:flex">
                        <FolderTree size={18} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-xl font-bold text-[#004D40]">
                          {category.name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Slug: {category.slug}
                        </p>
                        <p className="mt-2 text-sm text-slate-500 lg:hidden">
                          {(category.subcategories || []).length} subcategories
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#0F766E] lg:hidden">
                      <Tags size={15} />
                      Keywords
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 lg:mt-0">
                      {(category.keywords || []).length > 0 ? (
                        category.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {keyword}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">No keywords added.</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 lg:flex lg:min-h-[104px] lg:flex-col lg:items-start lg:justify-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                        category.isActive
                      )}`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                    <p className="text-sm text-slate-500">
                      {(category.subcategories || []).length} subcategories
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row lg:min-h-[104px] lg:flex-col lg:items-stretch lg:justify-center">
                    <button
                      type="button"
                      onClick={() => openEditCategory(category)}
                      className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-[#E0F7FA] px-4 py-2.5 text-sm font-semibold text-[#00695C] hover:bg-[#B2DFDB]"
                    >
                      <PencilLine size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCategoryStatus(category)}
                      className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100"
                    >
                      <Power size={16} />
                      {category.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCategory(category)}
                      className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/75 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#004D40]">Subcategories</h3>
                      <p className="text-sm text-slate-500">
                        {(category.subcategories || []).length} configured under this category
                      </p>
                    </div>

                  <div className="sm:self-start">
                    <button
                      type="button"
                      onClick={() => openAddSubcategory(category)}
                      className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-[#009688] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00796B]"
                    >
                      <Plus size={16} />
                      Add Subcategory
                    </button>
                  </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(category.subcategories || []).length > 0 ? (
                      category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory._id}
                          className="grid gap-3 rounded-[20px] border border-slate-200 bg-white px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto]"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-slate-700">
                                {subcategory.name}
                              </p>
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses(
                                  subcategory.isActive
                                )}`}
                              >
                                {subcategory.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-400">
                              Slug: {subcategory.slug}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                            <button
                              type="button"
                              onClick={() => openEditSubcategory(category, subcategory)}
                              className="min-w-[110px] rounded-xl bg-[#E0F7FA] px-3 py-2 text-xs font-semibold text-[#00695C] hover:bg-[#B2DFDB]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleSubcategoryStatus(category, subcategory)}
                              className="min-w-[110px] rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                            >
                              {subcategory.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSubcategory(category, subcategory)}
                              className="min-w-[110px] rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-400">
                        No subcategories added yet.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {categoryModal.open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="w-full max-w-2xl overflow-hidden rounded-[30px] bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b px-6 py-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Category Manager
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[#004D40]">
                    {categoryModal.category ? "Edit Category" : "Add Category"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="flex h-10 w-10 items-center justify-center rounded-full border text-slate-500 hover:bg-slate-50"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6 p-6">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-[#0F766E]">
                    Category Details
                  </h3>
                  <div className="mt-5 space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm text-slate-600">
                        Category Name
                      </span>
                      <input
                        value={categoryForm.name}
                        onChange={(event) =>
                          setCategoryForm((prev) => ({ ...prev, name: event.target.value }))
                        }
                        className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[#0F766E]/40 focus:ring-4 focus:ring-[#0F766E]/10"
                        placeholder="Enter category name"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm text-slate-600">
                        Keywords
                      </span>
                      <input
                        value={categoryForm.keywords}
                        onChange={(event) =>
                          setCategoryForm((prev) => ({
                            ...prev,
                            keywords: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[#0F766E]/40 focus:ring-4 focus:ring-[#0F766E]/10"
                        placeholder="Comma separated keywords"
                      />
                    </label>
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={(event) =>
                      setCategoryForm((prev) => ({
                        ...prev,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  Keep category active
                </label>
              </div>

              <div className="grid gap-3 border-t bg-[#F2FFFC] px-6 py-5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="rounded-2xl border bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveCategory}
                  disabled={savingCategory}
                  className="rounded-2xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B5E59] disabled:opacity-70"
                >
                  {savingCategory ? "Saving..." : "Save Category"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {subcategoryModal.open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="w-full max-w-2xl overflow-hidden rounded-[30px] bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b px-6 py-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    {subcategoryModal.category?.name}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[#004D40]">
                    {subcategoryModal.subcategory ? "Edit Subcategory" : "Add Subcategory"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeSubcategoryModal}
                  className="flex h-10 w-10 items-center justify-center rounded-full border text-slate-500 hover:bg-slate-50"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6 p-6">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-[#0F766E]">
                    Subcategory Details
                  </h3>
                  <div className="mt-5">
                    <label className="block">
                      <span className="mb-2 block text-sm text-slate-600">
                        Subcategory Name
                      </span>
                      <input
                        value={subcategoryForm.name}
                        onChange={(event) =>
                          setSubcategoryForm((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[#0F766E]/40 focus:ring-4 focus:ring-[#0F766E]/10"
                        placeholder="Enter subcategory name"
                      />
                    </label>
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={subcategoryForm.isActive}
                    onChange={(event) =>
                      setSubcategoryForm((prev) => ({
                        ...prev,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  Keep subcategory active
                </label>
              </div>

              <div className="grid gap-3 border-t bg-[#F2FFFC] px-6 py-5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeSubcategoryModal}
                  className="rounded-2xl border bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveSubcategory}
                  disabled={savingSubcategory}
                  className="rounded-2xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B5E59] disabled:opacity-70"
                >
                  {savingSubcategory ? "Saving..." : "Save Subcategory"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Categories;
