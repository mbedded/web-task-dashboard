import { Plugin, requestUrl, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, type TracksPluginSettings } from "./settings/Settings";
import { MainViewModel, VIEW_TYPE_MAIN } from "./views/MainViewModel";
import { initializeLocalization } from "./main.localization";
import { TracksAdapter } from "./adapters/TracksAdapter";
import { SettingTab } from "./settings/SettingTab";

export default class TracksPlugin extends Plugin {
  settings: TracksPluginSettings;

  async onload() {
    this.registerView(
      VIEW_TYPE_MAIN,
      (leaf) => {
        const adapter = new TracksAdapter(this.settings.tracksUrl, this.settings.getBasicToken(), requestUrl);
        return new MainViewModel(leaf, adapter);
      }
    );

    // todo: localize tooltip
    this.addRibbonIcon("square-check-big", "Open Tracks-Plugin", () => {
      this.activateView();
    });

    await this.loadSettings();
    initializeLocalization();

    this.registerCommands();

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SettingTab(this.app, this));

    // todo: add background checks for new todos in the background? Maybe only if window is open?
    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    // this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
  }

  private registerCommands() {
    this.addCommand({
      // todo: change name/localize
      id: "open-plugin-tab",
      name: "Open todo frontend",
      callback: () => {
        this.activateView();
      }
    });
  }

  onunload() {
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async activateView() {
    const {workspace} = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_MAIN);

    if (leaves.length > 0) {
      // A leaf (tab) with our views exists already. We use this.
      leaf = leaves[0];
    } else {
      // Our views could not be found in the workspace, create a new tab.
      leaf = workspace.getLeaf("tab");
      await leaf.setViewState({type: VIEW_TYPE_MAIN, active: true});
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    await workspace.revealLeaf(leaf!);
  }
}
