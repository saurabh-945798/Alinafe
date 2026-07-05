import Category from "../models/Category.js";

const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeKeywords = (keywords = []) =>
  Array.from(
    new Set(
      keywords
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    )
  );

const findSubcategoryById = (category, subcategoryId) =>
  category.subcategories.id(subcategoryId);

const ensureCategoryShape = (category) => {
  if (!category) return category;

  if (!String(category.slug || "").trim()) {
    category.slug = slugify(category.name);
  }

  if (typeof category.isActive !== "boolean") {
    category.isActive = true;
  }

  category.subcategories = (category.subcategories || []).map((subcategory) => {
    if (!String(subcategory.slug || "").trim()) {
      subcategory.slug = slugify(subcategory.name);
    }

    if (typeof subcategory.isActive !== "boolean") {
      subcategory.isActive = true;
    }

    return subcategory;
  });

  return category;
};

export const getAdminCategories = async (_req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get admin categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

export const getPublicCategories = async (_req, res) => {
  try {
    const categories = await Category.find({ isActive: { $ne: false } })
      .sort({ name: 1 })
      .lean();

    const normalizedCategories = categories.map((category) => ({
      ...category,
      slug: String(category.slug || "").trim() || slugify(category.name),
      isActive: category.isActive !== false,
      subcategories: (category.subcategories || [])
        .map((subcategory) => ({
          ...subcategory,
          slug:
            String(subcategory.slug || "").trim() || slugify(subcategory.name),
          isActive: subcategory.isActive !== false,
        }))
        .filter((subcategory) => subcategory.isActive),
    }));

    res.status(200).json({
      success: true,
      categories: normalizedCategories,
    });
  } catch (error) {
    console.error("Get public categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const keywordInput = Array.isArray(req.body?.keywords) ? req.body.keywords : [];

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existing = await Category.findOne({
      name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      slug: slugify(name),
      isActive: req.body?.isActive !== false,
      keywords: normalizeKeywords(keywordInput),
      subcategories: [],
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    ensureCategoryShape(category);

    const name = String(req.body?.name || "").trim();
    const keywordInput = Array.isArray(req.body?.keywords) ? req.body.keywords : [];

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const duplicate = await Category.findOne({
      _id: { $ne: id },
      name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Another category with this name already exists",
      });
    }

    category.name = name;
    category.slug = slugify(name);
    category.keywords = normalizeKeywords(keywordInput);
    category.isActive = req.body?.isActive !== false;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

export const updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    ensureCategoryShape(category);
    category.isActive = Boolean(isActive);
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? "activated" : "deactivated"} successfully`,
      category,
    });
  } catch (error) {
    console.error("Update category status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category status",
    });
  }
};

export const addSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    ensureCategoryShape(category);
    const name = String(req.body?.name || "").trim();
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Subcategory name is required",
      });
    }

    const exists = category.subcategories.some(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Subcategory already exists in this category",
      });
    }

    category.subcategories.push({
      name,
      slug: slugify(name),
      isActive: req.body?.isActive !== false,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      category,
    });
  } catch (error) {
    console.error("Add subcategory error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add subcategory",
    });
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const { id, subcategoryId } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    ensureCategoryShape(category);
    const subcategory = findSubcategoryById(category, subcategoryId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    const name = String(req.body?.name || "").trim();
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Subcategory name is required",
      });
    }

    const duplicate = category.subcategories.some(
      (item) =>
        String(item._id) !== subcategoryId &&
        item.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Another subcategory with this name already exists",
      });
    }

    subcategory.name = name;
    subcategory.slug = slugify(name);
    if (typeof req.body?.isActive === "boolean") {
      subcategory.isActive = req.body.isActive;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update subcategory error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update subcategory",
    });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const { id, subcategoryId } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    ensureCategoryShape(category);
    const subcategory = findSubcategoryById(category, subcategoryId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    subcategory.deleteOne();
    await category.save();

    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
      category,
    });
  } catch (error) {
    console.error("Delete subcategory error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete subcategory",
    });
  }
};

export const updateSubcategoryStatus = async (req, res) => {
  try {
    const { id, subcategoryId } = req.params;
    const { isActive } = req.body;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    ensureCategoryShape(category);
    const subcategory = findSubcategoryById(category, subcategoryId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    subcategory.isActive = Boolean(isActive);
    await category.save();

    res.status(200).json({
      success: true,
      message: `Subcategory ${subcategory.isActive ? "activated" : "deactivated"} successfully`,
      category,
    });
  } catch (error) {
    console.error("Update subcategory status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update subcategory status",
    });
  }
};
