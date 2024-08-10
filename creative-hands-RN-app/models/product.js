class Product {
    constructor(
      id,
      name,
      description,
      price,
      salePrice,
      barcode,
      categoryId,
      subCategoryId,
      categories,
      productVariations,
      images,
      stockQuantity,
      availableColours
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.price = price;
      this.salePrice = salePrice;
      this.barcode = barcode;
      this.categoryId = categoryId;
      this.subCategoryId = subCategoryId;
      this.categories = categories;
      this.productVariations = productVariations;
      this.images = images;
      this.stockQuantity = stockQuantity;
      this.availableColours = availableColours;
    }
  }

export default Product;
