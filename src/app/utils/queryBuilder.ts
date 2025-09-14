/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
// import { Query } from "mongoose";
// import { excludeField } from "../constant";

// export class QueryBuilder<T> {
//     public modelQuery: Query<T[], T>;
//     public readonly query: Record<string, string>

//     constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
//         this.modelQuery = modelQuery;
//         this.query = query;
//     }


//     filter(): this {
//         const filter = { ...this.query }

//         for (const field of excludeField) {
//             // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//             delete filter[field]
//         }

//         this.modelQuery = this.modelQuery.find(filter) // Tour.find().find(filter)

//         return this;
//     }

//     search(searchableField: string[]): this {
//         const searchTerm = this.query.searchTerm || ""
//         const searchQuery = {
//             $or: searchableField.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
//         }
//         this.modelQuery = this.modelQuery.find(searchQuery)
//         return this
//     }

//     sort(): this {

//         const sort = this.query.sort || "-createdAt";

//         this.modelQuery = this.modelQuery.sort(sort)

//         return this;
//     }
//     fields(): this {

//         const fields = this.query.fields?.split(",").join(" ") || ""

//         this.modelQuery = this.modelQuery.select(fields)

//         return this;
//     }
//     paginate(): this {

//         const page = Number(this.query.page) || 1
//         const limit = Number(this.query.limit) || 10
//         const skip = (page - 1) * limit

//         this.modelQuery = this.modelQuery.skip(skip).limit(limit)

//         return this;
//     }

//     build() {
//         return this.modelQuery
//     }

//     async getMeta() {
//         const totalDocuments = await this.modelQuery.model.countDocuments()

//         const page = Number(this.query.page) || 1
//         const limit = Number(this.query.limit) || 10

//         const totalPage = Math.ceil(totalDocuments / limit)

//         return { page, limit, total: totalDocuments, totalPage }
//     }
// }



import { Query } from "mongoose";
import { excludeField } from "../constant";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };

    for (const field of excludeField) {
      delete filter[field];
    }

    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  search(stringFields: string[], numericFields: string[] = []): this {
    const searchTerm = this.query.searchTerm || "";
    const orConditions: any[] = [];

    if (searchTerm) {
      // string regex search
      stringFields.forEach((field) => {
        orConditions.push({ [field]: { $regex: searchTerm, $options: "i" } });
      });

      // numeric exact search
      if (!isNaN(Number(searchTerm))) {
        const numVal = Number(searchTerm);
        numericFields.forEach((field) => {
          orConditions.push({ [field]: numVal });
        });
      }
    }

    if (orConditions.length > 0) {
      this.modelQuery = this.modelQuery.find({ $or: orConditions });
    }

    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    // count with current filter
    const totalDocuments = await this.modelQuery.model.countDocuments(
      this.modelQuery.getFilter()
    );

    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}
