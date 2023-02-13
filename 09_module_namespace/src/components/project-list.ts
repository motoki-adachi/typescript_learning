/// <reference path="base-component.ts" />
/// <reference path="../models/drag-drop.ts" />
/// <reference path="../models/project.ts" />
/// <reference path="../state/project-state.ts" />
/// <reference path="../decorator/autobind.ts" />

namespace App {
	// ProjectList Class
	export class ProjectList
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
				this.type === "active"
					? "実行中プロジェクト"
					: "完了プロジェクト";
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
}
