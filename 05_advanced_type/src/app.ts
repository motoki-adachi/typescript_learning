type Admin = {
	name: string;
	privileges: string[];
};

type Employee = {
	name: string;
	startDate: Date;
};

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
	name: "kiki",
	privileges: ["create-server"],
	startDate: new Date(),
};

type Combinable = string | number;
type Numeric = number | boolean;
type Universal = Combinable & Numeric;

function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number, b: string): string;
function add(a: string, b: number): string;
function add(a: Combinable, b: Combinable) {
	if (typeof a === "string" || typeof b === "string") {
		return a.toString() + b.toString();
	}
	return a + b;
}

const result = add("Hello", "TypeScript");
result.split(" ");

const fetchedUserData = {
	id: "uid01",
	name: "user01",
	job: {
		title: "Developer",
		description: "TypeScript",
	},
};

console.log(fetchedUserData.job && fetchedUserData.job.title);

const userInput = "";

const storedData = userInput ?? "default";

// type UnknownEmployee = Employee | Admin;

// function printEmployeeInfomation(emp: UnknownEmployee) {
// 	console.log(emp.name);

// 	if ("privileges" in emp) {
// 		console.log("Privileges: " + emp.privileges);
// 	}

// 	if ("startDate" in emp) {
// 		console.log("StartDate: " + emp.startDate);
// 	}
// }

// printEmployeeInfomation(e1);
// printEmployeeInfomation({ name: "lion", startDate: new Date() });

// class Car {
// 	drive() {
// 		console.log("運転中");
// 	}
// }

// class Track {
// 	drive() {
// 		console.log("トラックを運転中です");
// 	}

// 	loadCargo(amount: number) {
// 		console.log("荷物を載せています ... " + amount);
// 	}
// }

// type Vehicle = Car | Track;

// const v1 = new Car();
// const v2 = new Track();

// function useVehicle(vehicle: Vehicle) {
// 	vehicle.drive();
// 	if (vehicle instanceof Track) {
// 		vehicle.loadCargo(1000);
// 	}
// }
// useVehicle(v1);
// useVehicle(v2);

// interface Bird {
// 	type: "bird";
// 	flyingSpeed: number;
// }

// interface Horse {
// 	type: "horse";
// 	runningSpeed: number;
// }

// type Animal = Bird | Horse;

// function moveAnimal(animal: Animal) {
// 	let speed;
// 	switch (animal.type) {
// 		case "bird":
// 			speed = animal.flyingSpeed;
// 			break;
// 		case "horse":
// 			speed = animal.runningSpeed;
// 	}
// 	console.log("Speed: " + speed);
// }

// moveAnimal({
// 	type: "bird",
// 	flyingSpeed: 10,
// });

// const userInputElement = document.getElementById("user-input");

// if (userInputElement) {
// 	(userInputElement as HTMLInputElement).value = "Hello.";
// }

// interface ErrorContainer {
// 	[prop: string]: string;
// }

// const errorBag: ErrorContainer = {
// 	email: "not email.",
// 	username: "username is string only.",
// };
