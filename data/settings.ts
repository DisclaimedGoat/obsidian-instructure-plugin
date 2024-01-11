
import InstructurePlugin from "../main"
import { App, ButtonComponent, PluginSettingTab, Setting, Notice } from "obsidian";

export interface Settings {
    api_token: string,
    school_url: string,
    user_id: number,
};

export const DEFAULT_SETTINGS: Partial<Settings> = {
    
};

export class SettingsTab extends PluginSettingTab {

    plugin: InstructurePlugin;

    constructor(app: App, plugin: InstructurePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    async display() {
        let { containerEl } = this; 

        //reset the container
        containerEl.empty();

        await this.retrieveUserCreds();
        new ButtonComponent(containerEl).setButtonText("Refresh").onClick(async () => {
            new Notice("Manual retrieval of user credentials initiated.")

            await this.retrieveUserCreds()
                .then(() => new Notice("Manual retrieval was successful."));
        })


        containerEl.createEl("h1").setText("Canvas Instructure API")

        new Setting(containerEl)
        .setName("Canvas API Token")
        .setDesc("Generate and enter the exact API Token")
        .addText((text) =>
            text
            .setPlaceholder("1009~Iu53V7AoivggqAddWRkh8j4ZYdkJbW1uoAWrnsBGol4gB1HZYM18O8aFTIwF1z6C")
            .setValue(this.plugin.settings.api_token)
            .onChange(async (value) => {
                this.plugin.settings.api_token = value;
                await this.plugin.saveSettings();
            })
        );

        new Setting(containerEl)
        .setName("School URL")
        .setDesc("Enter your school's Canvas url. Example: school.instructure.com")
        .addText((text) =>
            text
            .setPlaceholder("school.instructure.com")
            .setValue(this.plugin.settings.school_url)
            .onChange(async (value) => {
                this.plugin.settings.school_url = value;
                await this.plugin.saveSettings();
            })
        );

        

        new Setting(containerEl)
        .addButton(button => {
            button.setIcon("dice");

            button.onClick(async () => {
                new Notice("Fetching Active Canvas Courses");

                console.log(await this.plugin.GET("courses"))
            });
        })
        .setName("Fetch Canvas Courses")
        .setDesc("Refresh or collect all active courses from Canvas.")
    }

    async retrieveUserCreds() {
        return this.plugin.GET("users/self")
            .then((data: any) => this.plugin.settings.user_id = data.id)
            .catch(error => new Notice("Could not retrieve user credentials. Ensure correct token and URL"))
    }
} 