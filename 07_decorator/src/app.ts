function Logger(logString: string) {
	return function (constructor: Function) {
		console.log(logString);
		console.log(constructor);
	};
}

function withTemplate(template: string, hookId: string) {
	return function <T extends { new (...args: any[]): { name: string } }>(
		originalConstructor: T
	) {
		return class extends originalConstructor {
			constructor(..._args: any[]) {
				super();
				console.log("template ...");
				const hookElement = document.getElementById(hookId);
				if (hookElement) {
					hookElement.innerHTML = template;
					hookElement.querySelector("h1")!.textContent = this.name;
				}
			}
		};
	};
}

// ファクトリー生成は上から順に、実行は下から上に
@Logger("call to Person")
@withTemplate("<h1>Hello World.</h1>", "app")
class Person {
	name = "kiki";

	constructor() {
		console.log("person object building ...");
	}
}
const person = new Person();
console.log(person);

// ----------------------------
console.log(
	"------------------------------------------------------------------------------------"
);
// ----------------------------

function Log(target: any, propertyName: string | Symbol) {
	console.log("property decorator");
	console.log(target, propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
	console.log("Accessor decorator");
	console.log(target);
	console.log(name);
	console.log(descriptor);
}

function Log3(
	target: any,
	name: string | Symbol,
	descriptor: PropertyDescriptor
) {
	console.log("Method decorator");
	console.log(target);
	console.log(name);
	console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number) {
	console.log("Parameter decorator");
	console.log(target);
	console.log(name);
	console.log(position);
}

class Product {
	@Log
	ttile: string;
	private _price: number;

	@Log2
	set price(val: number) {
		if (val > 0) {
			this._price = val;
		} else {
			throw new Error("不正な値。0以下は設定不可。");
		}
	}

	constructor(t: string, p: number) {
		this.ttile = t;
		this._price = p;
	}

	@Log3
	getPriceWithTax(@Log4 tax: number) {
		return this._price * (1 + tax);
	}
}

const p1 = new Product("Book", 100);
const p2 = new Product("Book2", 200);

// ----------------------------
console.log(
	"------------------------------------------------------------------------------------"
);
// ----------------------------

function Autobind(
	_target: any,
	_methodName: string,
	descriptor: PropertyDescriptor
) {
	const orignalMethod = descriptor.value;
	const adjDescroptor: PropertyDescriptor = {
		configurable: true,
		enumerable: false,
		get() {
			const boundFn = orignalMethod.bind(this);
			return boundFn;
		},
	};
	return adjDescroptor;
}

class Printer {
	message = "クリックしました";

	@Autobind
	showMessage() {
		console.log(this.message);
	}
}

const p = new Printer();

const button = document.querySelector("button")!;
button.addEventListener("click", p.showMessage);

// ----------------------------

interface ValidatorConfig {
	[prop: string]: {
		[validatebleProp: string]: string[];
	};
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
	registeredValidators[target.constructor.name] = {
		...registeredValidators[target.constructor.name],
		[propName]: [
			...(registeredValidators[target.constructor.name]?.[propName] ??
				[]),
			"required",
		],
	};
}

function PositiveNumber(target: any, propName: string) {
	registeredValidators[target.constructor.name] = {
		...registeredValidators[target.constructor.name],
		[propName]: [
			...(registeredValidators[target.constructor.name]?.[propName] ??
				[]),
			"positive",
		],
	};
}

function validate(obj: any) {
	const objValidatorConfig = registeredValidators[obj.constructor.name];

	if (!objValidatorConfig) {
		return true;
	}

	let isValid = true;

	for (const prop in objValidatorConfig) {
		for (const validator of objValidatorConfig[prop]) {
			switch (validator) {
				case "required":
					isValid = isValid && !!obj[prop];
					break;
				case "positive":
					isValid = isValid && obj[prop] > 0;
					break;
			}
		}
	}
	return isValid;
}

class Course {
	@Required
	title: string;
	@PositiveNumber
	price: number;

	constructor(t: string, p: number) {
		this.title = t;
		this.price = p;
	}
}

const courseForm = document.querySelector("form")!;
courseForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const titleEl = document.getElementById("title") as HTMLInputElement;
	const priceEl = document.getElementById("price") as HTMLInputElement;

	const title = titleEl.value;
	const price = +priceEl.value;

	const createdCourse = new Course(title, price);

	if (!validate(createdCourse)) {
		alert("入力値が不正な値です");
		return;
	}

	console.log(createdCourse);
});
