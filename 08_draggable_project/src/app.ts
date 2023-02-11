// Validation
interface Validatable {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

function validate(validatableInput: Validatable) {
	let isValid = true;

	// 必須項目
	if (validatableInput.required) {
		isValid =
			isValid && validatableInput.value.toString().trim().length !== 0;
	}

	// 文字数の最小値
	if (
		validatableInput.minLength != null &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid &&
			validatableInput.value.length >= validatableInput.minLength;
	}

	// 文字数の最大値
	if (
		validatableInput.maxLength != null &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid &&
			validatableInput.value.length >= validatableInput.maxLength;
	}

	// 数値の最小
	if (
		validatableInput.min != null &&
		typeof validatableInput.value === "number"
	) {
		isValid = isValid && validatableInput.value >= validatableInput.min;
	}

	// 数値の最大
	if (
		validatableInput.max != null &&
		typeof validatableInput.value === "number"
	) {
		isValid = isValid && validatableInput.value >= validatableInput.max;
	}

	return isValid;
}

// Autobind decorator
function autobind(
	_target: any,
	_methodName: string,
	descriptor: PropertyDescriptor
) {
	const originalMethod = descriptor.value;
	const adjDescriptor: PropertyDescriptor = {
		configurable: true,
		get() {
			const boundFn = originalMethod.bind(this);
			return boundFn;
		},
	};
	return adjDescriptor;
}

// ProjectInput Class
class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	mandayInputElement: HTMLInputElement;

	// コンストラクターでは要素の参照
	constructor() {
		this.templateElement = document.getElementById(
			"project-input"
		)! as HTMLTemplateElement;
		this.hostElement = document.getElementById("app")! as HTMLDivElement;

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);

		this.element = importedNode.firstElementChild as HTMLFormElement;
		this.element.id = "user-input";

		this.titleInputElement = this.element.querySelector(
			"#title"
		) as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector(
			"#description"
		) as HTMLInputElement;
		this.mandayInputElement = this.element.querySelector(
			"#manday"
		) as HTMLInputElement;

		this.configure();
		this.attach();
	}

	private gatherUserInput(): [string, string, number] | void {
		const enteredTitle = this.titleInputElement.value;
		const enteredDescription = this.descriptionInputElement.value;
		const enteredManday = this.mandayInputElement.value;

		// バリデーション用オブジェクト
		const titleValidateble: Validatable = {
			value: enteredTitle,
			required: true,
		};
		const descriptionValidateble: Validatable = {
			value: enteredDescription,
			required: true,
			minLength: 5,
		};
		const mandayValidateble: Validatable = {
			value: enteredManday,
			required: true,
			min: 1,
			max: 1000,
		};

		// バリデーション実施
		if (
			!validate(titleValidateble) ||
			!validate(descriptionValidateble) ||
			!validate(mandayValidateble)
		) {
			alert("Parameter Error ...");
			return;
		} else {
			return [enteredTitle, enteredDescription, +enteredManday];
		}
	}

	private clearInputs() {
		this.titleInputElement.value = "";
		this.descriptionInputElement.value = "";
		this.mandayInputElement.value = "";
	}

	// submitされた情報の処理
	@autobind
	private submitHandler(event: Event) {
		event.preventDefault();

		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, desc, manday] = userInput;
			console.log(title, desc, manday);
			this.clearInputs();
		}
	}

	// イベントリスナーの設定
	private configure() {
		this.element.addEventListener("submit", this.submitHandler);
	}

	// 要素の追加
	private attach() {
		this.hostElement.insertAdjacentElement("afterbegin", this.element);
	}
}

const prjInput = new ProjectInput();
