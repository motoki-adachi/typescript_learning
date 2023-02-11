// const person: {
// 	name: string;
// 	age: number;
// 	hobbies: string[];
// 	role: [number, string];
// } = {
// 	name: "kiki",
// 	age: 29,
// 	hobbies: ["sports", "cokking"],
// 	role: [2, "author"],
// };

enum Role {
	ADMIN,
	READ_ONLY,
	AUTHOR,
}

const person = {
	name: "kiki",
	age: 29,
	hobbies: ["sports", "cokking"],
	role: Role.ADMIN,
};

// person.role.push("admin");
// person.role[1] = 10;
// person.role = [0, "admin", true];

let favActivities: any[];
favActivities = ["sports", 5, true];

console.log(person);

for (const hobby of person.hobbies) {
	console.log(hobby.toUpperCase());
}

if (person.role === Role.ADMIN) {
	console.log("管理者ユーザー");
}
