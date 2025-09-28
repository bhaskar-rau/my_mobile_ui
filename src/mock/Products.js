import { faker } from "@faker-js/faker";

const sampleBase64Image =
  "/9j/4AAQSkZJRgABAQEASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAPKADAAQAAAABAAAAPAAAAP/bAEMABQUFBQUFBQYGBQgIBwgICwoJCQoLEQwNDA0MERoQExAQExAaFxsWFRYbFykgHBwgKS8nJSctNzU2NVFRdX6Fer7/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/2gAMAwEAAhEDEQA/APOiSTk9TRRRXOSFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/9k=";

export const dummyProducts = Array.from({ length: 50 }, (_, index) => ({
  productId: `PRD${String(index + 1).padStart(4, "0")}`,
  model: faker.commerce.productName(),
  brand: faker.company.name(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 1000, max: 100000 }),
  quantity: faker.number.int({ min: 0, max: 100 }),
  color: faker.color.human(),
  productFeatures: Array.from(
    { length: faker.number.int({ min: 3, max: 7 }) },
    () => faker.commerce.productAdjective()
  ).join(", "),
  imageOfProduct: sampleBase64Image,
}));
