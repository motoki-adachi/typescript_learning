function merge<T extends object, U extends object>(objA: T, objB: U) {
	return Object.assign(objA, objB);
}

const mergedObject = merge<
	{ name: string; hobbies: string[] },
	{ age: number }
>(
	{
		name: "kiki",
		hobbies: ["sports"],
	},
	{
		age: 30,
	}
);
console.log(mergedObject);

interface Lengthy {
	length: number;
}

function countAndDiscribe<T extends Lengthy>(element: T): [T, string] {
	let descriptionText = "none";
	if (element.length > 0) {
		descriptionText = "param length: " + element.length;
	}
	return [element, descriptionText];
}

console.log(countAndDiscribe("Hello"));

function extractAndConvert<T extends object, U extends keyof T>(
	obj: T,
	key: U
) {
	return "Value: " + obj[key];
}

extractAndConvert({ name: "kiki" }, "name");

class DataStorage<T> {
	private data: T[] = [];

	addItem(item: T) {
		this.data.push(item);
	}

	removeItem(item: T) {
		if (this.data.indexOf(item) === -1) {
			return;
		}
		this.data.splice(this.data.indexOf(item), 1);
	}

	getItems() {
		return [...this.data];
	}
}

const textStorage = new DataStorage<string>();
textStorage.addItem("str001");
textStorage.addItem("str002");
textStorage.removeItem("str002");
console.log(textStorage.getItems());

const objStorage = new DataStorage<object>();
const obj = { name: "kiki" };
objStorage.addItem(obj);
objStorage.addItem({ name: "max" });
objStorage.removeItem(obj);
console.log(objStorage.getItems());
