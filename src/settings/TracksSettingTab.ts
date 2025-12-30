import { App, PluginSettingTab, Setting } from "obsidian";
import TracksPlugin from "../main";
import { t } from "localizify"

export class TracksSettingTab extends PluginSettingTab {
  plugin: TracksPlugin;

  constructor(app: App, plugin: TracksPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;


    containerEl.empty();

    new Setting(containerEl)
      .setName(t("settings.tracks-url-header"))
      .setDesc(t("settings.tracks-url-description"))
      // .setName('Tracks URL')
      // .setDesc('Base URL of your instance of Tracks.')
      .addText(text => text
        .setPlaceholder('http://localhost:3000/')
        .setValue(this.plugin.settings.tracksUrl)
        .onChange(async (value) => {
          this.plugin.settings.tracksUrl = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName(t("settings.tracks-username-header"))
      .setDesc(t("settings.tracks-username-description"))
      .addText(text => text
        .setPlaceholder('example')
        .setValue(this.plugin.settings.tracksUsername)
        .onChange(async (value) => {
          this.plugin.settings.tracksUsername = value;
          await this.plugin.saveSettings();
        }));
    
    new Setting(containerEl)
      .setName(t("settings.tracks-token-header"))
      .setDesc(t("settings.tracks-token-description"))
      .addText(text => {
          text.setPlaceholder('')
          text.setValue(this.plugin.settings.tracksToken)
          text.onChange(async (value) => {
            this.plugin.settings.tracksToken = value;
            await this.plugin.saveSettings();
          });
          text.inputEl.type = "password";
        }
      );
  }
}
