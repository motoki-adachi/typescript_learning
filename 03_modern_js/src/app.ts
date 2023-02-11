// const add = (a: number, b: number = 1) => a + b;

// const printOutPut: (output: string | number) => void = (output) => {
// 	console.log(output);
// };

// printOutPut(add(1, 2));
// printOutPut(add(0));

const button = document.querySelector("button");

if (button) {
	button.addEventListener("click", (event) => {
		console.log(event);
	});
}

const hobbies = ["sports", "cooking"];
console.log(hobbies[0]);

const activeHobbies = ["hiking"];
activeHobbies.push(...hobbies);
console.log(activeHobbies);

const person = {
	nickName: "kiki",
	age: 30,
};

const copyPerson = {
	...person,
};

console.log(person == copyPerson);

const add = (...numbers: number[]) => {
	return numbers.reduce((curResult, curValue) => {
		return curResult + curValue;
	}, 0);
};

const addedNumbers = add(5, 10, 2, 3.7, 2.1);
console.log(addedNumbers);

const [hobby1, hobby2, ...anotherHobbies] = hobbies;
console.log(hobbies, hobby1, hobby2);

const { nickName, age } = person;
console.log(person, nickName, age);
