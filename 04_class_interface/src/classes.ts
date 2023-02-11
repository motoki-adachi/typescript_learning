abstract class Department {
	static fiscalYear = 2023;

	protected employees: string[] = [];

	constructor(protected readonly id: string, public name: string) {}

	static createEmployee(name: string) {
		return {
			name: name,
		};
	}

	abstract describe(): void;

	addEmployee(employee: string) {
		this.employees.push(employee);
	}

	printEmployeeInfomation() {
		console.log(this.employees.length);
		console.log(this.employees);
	}
}

class ITDepartment extends Department {
	admins: string[];
	constructor(id: string, admins: string[]) {
		super(id, "IT");
		this.admins = admins;
	}

	describe(): void {
		console.log("IT部門 - id: " + this.id);
	}
}

class AccountingDepartment extends Department {
	private lastReport: string;
	// private static instance: AccountingDepartment;

	get mostRecentReport() {
		if (this.lastReport) {
			return this.lastReport;
		}
		throw new Error("Report does not exists.");
	}

	set mostRecentReport(value: string) {
		if (!value) {
			throw new Error("正しい値の設定を行なってください。");
		}
		this.addReport(value);
	}

	private constructor(id: string, private reports: string[]) {
		super(id, "Accounting");
		this.lastReport = reports[0];
	}

	// static getInstance() {
	// 	if (AccountingDepartment.instance) {
	// 		return this.instance;
	// 	}
	// 	this.instance = new AccountingDepartment("AC-002", []);
	// }

	addReport(text: string) {
		this.reports.push(text);
		this.lastReport = text;
	}

	printReposrts() {
		console.log(this.reports);
	}

	addEmployee(name: string) {
		if (name === "max") {
			return;
		}
		this.employees.push(name);
	}

	describe(): void {
		console.log("会計部門 - id: " + this.id);
	}
}

const employee1 = Department.createEmployee("max");
console.log(employee1, Department.fiscalYear);

const it = new ITDepartment("IT-001", ["kiki"]);

it.addEmployee("kiki");
it.addEmployee("lion");
it.printEmployeeInfomation();

it.describe();

console.log(it);

// const accounting = AccountingDepartment.getInstance();
// const accounting2 = AccountingDepartment.getInstance();
// console.log(accounting, accounting2);

// console.log(accounting.mostRecentReport);
// accounting.addReport("Something");
// accounting.printReposrts();
// accounting.addEmployee("max");
// accounting.addEmployee("mani");
// accounting.printEmployeeInfomation();

// accounting.mostRecentReport = "通期会計レポート";
// console.log(accounting.mostRecentReport);

// accounting.describe();
