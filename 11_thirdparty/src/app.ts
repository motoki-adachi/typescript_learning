import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { Product } from "./product.model";

const products = [
	{ title: "item01", price: 100 },
	{ title: "item02", price: 200 },
];

// const loadedProducts = products.map((prod) => {
// 	return new Product(prod.title, prod.price);
// });

const loadedProducts = plainToInstance(Product, products);

for (const prod of loadedProducts) {
	console.log(prod.getInfomation());
}
