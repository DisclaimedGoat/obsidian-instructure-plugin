import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginManifest, PluginSettingTab, Setting, addIcon } from 'obsidian';

//Settings
import { Settings, DEFAULT_SETTINGS, SettingsTab } from 'data/settings';

import fetch from 'node-fetch';
import { RequestOptions, request } from 'https';

// Remember to rename these classes and interfaces!
export default class InstructurePlugin extends Plugin {
	settings: Settings;
	decoder: TextDecoder;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);

		this.decoder = new TextDecoder();
	}

	// Configure resources needed by the plugin.
	async onload() {
	  	await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this))

	  	this.addRibbonIcon("install", "Capture Assignments", () => {
			new Notice("Capturing...");

			console.log("capturing assignments")
		});
	}

	// Release any resources configured by the plugin.
	async onunload() {
		
	}



	//Settings functions
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


	//http calls
	GET(path: string, parameters: {} | undefined) {
		return new Promise((resolve, reject) => {

			if (parameters) {
				path += "?" + parameters;
			}

			const options: RequestOptions = {
				hostname: this.settings.school_url,
				path: '/api/v1/' + path,
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + this.settings.api_token
				},
			}

			const req = request(options, (res) => {
				console.log(res.statusCode)
			  res.setEncoding('utf8');
			  let responseBody = '';
		
			  res.on('data', (chunk) => {
				responseBody += chunk;
			  });
		
			  res.on('end', () => {
				try {
					resolve(JSON.parse(responseBody));
				} catch (error) {
					reject(error);
				}
				
			  });
			});
		
			req.on('error', (err) => {
			  reject(err);
			});
		
			req.end();
		  });
	}
  }
