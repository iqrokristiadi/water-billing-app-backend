class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query
    this.queryString = queryString; // Express req.query
  }

  // 🔍 1. Filtering (custom search logic)
  filter(searchableFields = []) {
    const search = this.queryString.search || "";

    if (search && searchableFields.length > 0) {
      const searchConditions = searchableFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));

      this.query = this.query.find({ $or: searchConditions });
    }

    return this;
  }

  // ⚙️ 2. Sorting
  sort() {
    const sortBy = this.queryString.sort || "-createdAt";
    this.query = this.query.sort(sortBy);
    return this;
  }

  // 🎯 3. Field limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  // 📄 4. Pagination
  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }
}

export default APIFeatures;
