import { ItemView, WorkspaceLeaf } from "obsidian";
import { mount, unmount } from "svelte";
import MainView from "./MainView.svelte";
import type { ITodoAdapter } from "../adapters/ITodoAdapter";

export const VIEW_TYPE_MAIN = "main-view";

/**
 * This class represents the main view of the plugin.
 * It shows the todos and allows interacting with them.
 */
export class MainViewModel extends ItemView {
  private readonly todoAdapter: ITodoAdapter;

	mainView: ReturnType<typeof MainView> | undefined;

	constructor(leaf: WorkspaceLeaf, todoAdapter: ITodoAdapter) {
		super(leaf);
    this.todoAdapter = todoAdapter;
  }

	getViewType() {
		return VIEW_TYPE_MAIN;
	}

	getDisplayText() {
    // todo: verify name. Localization? Read name from manifest?
		return "Tracks Plugin";
	}

	async onOpen() {
		// Attach the Svelte component to the ItemViews content element and provide the needed props.
		this.mainView = mount(MainView, {
			target: this.contentEl,
			props: {
        adapter: this.todoAdapter,
			}
		});

    await this.mainView.initializeView();
	}

	async onClose() {
		if (this.mainView) {
			await unmount(this.mainView);
		}
	}
}
