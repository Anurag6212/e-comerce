class ApiFeatues {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.query };
    const removeField = ["keyword", "page", "limit"];

    removeField.forEach((key) => delete queryCopy[key]);

    let querystr = JSON.stringify(queryCopy);
    querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryCopy));
    return this;
  }

  pagination(pageLimit) {
    const currentPage = +this.queryStr.page || 1;

    const skip = pageLimit * (currentPage - 1);

    this.query = this.query.limit(pageLimit).skip(skip);

    return this;
  }
}

module.exports = ApiFeatues;
