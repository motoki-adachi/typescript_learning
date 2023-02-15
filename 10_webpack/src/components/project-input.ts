import { Component } from "./base-component";
import { Validatable, validate } from "../util/validation";
import { autobind } from "../decorator/autobind";
import { projectState } from "../state/project-state";

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	mandayInputElement: HTMLInputElement;

	// コンストラクターで要素の参照
	constructor() {
		super("project-input", "app", true, "user-input");

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

	// イベントリスナーの設定
	configure() {
		this.element.addEventListener("submit", this.submitHandler);
	}

	renderContent(): void {}

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
			projectState.addProject(title, desc, manday);
			this.clearInputs();
		}
	}
}
