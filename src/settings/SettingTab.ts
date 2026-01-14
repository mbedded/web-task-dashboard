import { App, PluginSettingTab, SettingGroup } from "obsidian";
import TracksPlugin from "../main";
import { t } from "../localizer/Localizer";

export class SettingTab extends PluginSettingTab {
  plugin: TracksPlugin;

  constructor(app: App, plugin: TracksPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;

    containerEl.empty();
    
    new SettingGroup(containerEl)
      .setHeading(t("settings.header-tracks-endpoint"))
      .addSetting(setting => setting
        .setName(t("settings.tracks-url-header"))
        .setDesc(t("settings.tracks-url-description"))
        .addText(text => text
          .setPlaceholder("http://localhost:3000")
          .setValue(this.plugin.settings.tracksUrl)
          .onChange(async (value) => {
            if (value.endsWith("/")) {
              value = value.slice(0, -1);
            }

            this.plugin.settings.tracksUrl = value;
            await this.plugin.saveSettings();
          })))
      .addSetting(setting => setting
        .setName(t("settings.tracks-username-header"))
        .setDesc(t("settings.tracks-username-description"))
        .addText(text => text
          .setPlaceholder("example")
          .setValue(this.plugin.settings.tracksUsername)
          .onChange(async (value) => {
            this.plugin.settings.tracksUsername = value;
            await this.plugin.saveSettings();
          })))
      .addSetting(setting => setting
        .setName(t("settings.tracks-password-header"))
        .setDesc(t("settings.tracks-password-description"))
        .addText(text => {
            text.setPlaceholder("")
            text.setValue(this.plugin.settings.tracksToken)
            text.onChange(async (value) => {
              this.plugin.settings.tracksToken = value;
              await this.plugin.saveSettings();
            });
            text.inputEl.type = "password";
          }
        ));
  }
}
