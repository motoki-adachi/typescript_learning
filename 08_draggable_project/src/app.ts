// Drag & Drop
interface Draggable {
	dragStartHandler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
	dragOverHandler(event: DragEvent): void;
	dropHandler(event: DragEvent): void;
	dragLeaveHandler(event: DragEvent): void;
}

// Project type class
enum ProjectStatus {
	Active,
	Finished,
}

class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public manday: number,
		public status: ProjectStatus
	) {}
}

// Listener type
type Listener<T> = (items: T[]) => void;

class State<T> {
	protected listeners: Listener<T>[] = [];

	addListener(listenerFn: Listener<T>) {
		this.listeners.push(listenerFn);
	}
}

// Project state management class
class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addProject(title: string, description: string, manday: number) {
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			manday,
			ProjectStatus.Active
		);
		this.projects.push(newProject);
		this.updateListeners();
	}

	moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find((prj) => prj.id === projectId);

		if (project && project.status !== newStatus) {
			project.status = newStatus;
			this.updateListeners();
		}
	}

	private updateListeners() {
		for (const listenerFn of this.listeners) {
			listenerFn(this.projects.slice());
		}
	}
}

const projectState = ProjectState.getInstance();

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

// Component class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateElement: HTMLTemplateElement;
	hostElement: T;
	element: U;

	constructor(
		templateId: string,
		hostElementId: string,
		insertAtStart: boolean,
		newElementId?: string
	) {
		this.templateElement = document.getElementById(
			templateId
		)! as HTMLTemplateElement;
		this.hostElement = document.getElementById(hostElementId)! as T;

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);

		this.element = importedNode.firstElementChild as U;
		if (newElementId) {
			this.element.id = newElementId;
		}

		this.attach(insertAtStart);
	}

	abstract configure(): void;

	abstract renderContent(): void;

	// 要素の追加
	private attach(insertAtBeginning: boolean) {
		this.hostElement.insertAdjacentElement(
			insertAtBeginning ? "afterbegin" : "beforeend",
			this.element
		);
	}
}

//Project Item
class ProjectItem
	extends Component<HTMLUListElement, HTMLLIElement>
	implements Draggable
{
	private project: Project;

	get manday() {
		if (this.project.manday < 20) {
			return this.project.manday.toString() + "人日";
		} else {
			return (this.project.manday / 20).toString() + "人月";
		}
	}

	constructor(hostId: string, project: Project) {
		super("single-project", hostId, false, project.id);
		this.project = project;

		this.configure();
		this.renderContent();
	}

	@autobind
	dragStartHandler(event: DragEvent): void {
		event.dataTransfer!.setData("text/plain", this.project.id);
		event.dataTransfer!.effectAllowed = "move";
	}

	dragEndHandler(_event: DragEvent): void {
		console.log("ドラッグ終了");
	}

	configure() {
		this.element.addEventListener("dragstart", this.dragStartHandler);
		this.element.addEventListener("dragend", this.dragEndHandler);
	}

	renderContent() {
		this.element.querySelector("h2")!.textContent = this.project.title;
		this.element.querySelector("h3")!.textContent = this.manday;
		this.element.querySelector("p")!.textContent = this.project.description;
	}
}

// ProjectList Class
class ProjectList
	extends Component<HTMLDivElement, HTMLElement>
	implements DragTarget
{
	assingnedProjects: Project[];

	// コンストラクターで要素の参照
	constructor(private type: "active" | "finished") {
		super("project-list", "app", false, `${type}-projects`);
		this.assingnedProjects = [];
		this.configure();
		this.renderContent();
	}

	@autobind
	dragOverHandler(event: DragEvent): void {
		if (
			event.dataTransfer &&
			event.dataTransfer.types[0] === "text/plain"
		) {
			event.preventDefault();
			//ドラッグ時の背景色の変更
			const listEl = this.element.querySelector("ul")!;
			listEl.classList.add("droppable");
		}
	}

	@autobind
	dropHandler(event: DragEvent): void {
		const prjId = event.dataTransfer!.getData("text/plain");
		projectState.moveProject(
			prjId,
			this.type === "active"
				? ProjectStatus.Active
				: ProjectStatus.Finished
		);
	}

	@autobind
	dragLeaveHandler(_event: DragEvent): void {
		//ドラッグ時の背景色の変更
		const listEl = this.element.querySelector("ul")!;
		listEl.classList.remove("droppable");
	}

	configure() {
		this.element.addEventListener("dragover", this.dragOverHandler);
		this.element.addEventListener("drop", this.dropHandler);
		this.element.addEventListener("dragleave", this.dragLeaveHandler);

		projectState.addListener((projects: Project[]) => {
			const relevantProjects = projects.filter((prj) => {
				if (this.type === "active") {
					return prj.status === ProjectStatus.Active;
				}
				return prj.status === ProjectStatus.Finished;
			});
			this.assingnedProjects = relevantProjects;
			this.renderProjects();
		});
	}

	renderContent() {
		const listId = `${this.type}-project-list`;
		this.element.querySelector("ul")!.id = listId;
		this.element.querySelector("h2")!.textContent =
			this.type === "active" ? "実行中プロジェクト" : "完了プロジェクト";
	}

	private renderProjects() {
		const listEl = document.getElementById(
			`${this.type}-project-list`
		)! as HTMLUListElement;

		listEl.innerHTML = "";

		for (const prjItem of this.assingnedProjects) {
			new ProjectItem(listEl.id, prjItem);
		}
	}
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
