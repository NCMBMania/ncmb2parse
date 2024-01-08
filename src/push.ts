import {program} from 'commander';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

interface Options {
	key: string;
	url: string;
	app: string;
};

interface Installation {
	objectId: string;
	applicationName: string;
	appVersion: string;
	badge: number;
	channels: string[];
	deviceToken: string;
	deviceType: string;
	sdkVersion: string;
	timeZone: string;
	createDate: string;
	updateDate: string;
	acl: {
		[key: string]: {
			read: boolean;
			write: boolean;
		}
	};
	pushType: string;
};

interface InstallationJson {
	results: Installation[];
};

interface Params extends Options {
	filePath: string;
	file?: InstallationJson;
};

interface ParseInstallationRequest {
	appName: string;
	appVersion: string;
	badge: number;
	channels: string[];
	deviceToken: string;
	deviceType: string;
	sdkVersion: string;
	timeZone: string;
	acl: {
		[key: string]: {
			read: boolean;
			write: boolean;
		}
	};
	pushType: string;
	[key: string]: any;
};

interface ParseInstallationResponse {
	objectId: string;
	createdAt: string;
};

program
    .option('-k, --key <REST API Key>', 'Parse ServerのREST APIキー', '')
		.option('-u, --url <URL>', 'Parse ServerのURL', '')
		.option('-a, --app <Application ID>', 'Parse ServerのApplication ID', '')
		.argument('<filePath>', 'installation.jsonのパス');
program.parse();

const options: Options = program.opts();

const [filePath] = program.args;

if (!filePath) {
	console.error('filePathは必須です');
	process.exit(1);
}

const params: Params = {...options, filePath: path.resolve(filePath)};

(async (params: Params) => {
	if (params.app === '') {
		console.error('アプリIDは必須です -a <App id>');
		process.exit(1);
	}
	if (params.url === '') {
		console.error('Parse ServerのURLは必須です。例） -u https://example.com/parse');
		process.exit(1);
	}
	if (params.key === '') {
		console.error('REST APIキーは必須です。例） -k REST_API_KEY');
		process.exit(1);
	}
	try {
		const file = fs.readFileSync(params.filePath, 'utf-8');
		params.file = JSON.parse(file);
	} catch (e) {
		console.error(`${params.filePath}が見つかりません`);
		process.exit(1);
	}
	for (const data of params.file!.results) {
		const body: ParseInstallationRequest = {
			appName: data.applicationName,
			appVersion: data.appVersion,
			badge: data.badge,
			channels: data.channels,
			deviceToken: data.deviceToken,
			deviceType: data.deviceType,
			sdkVersion: data.sdkVersion,
			timeZone: data.timeZone,
			acl: data.acl,
			pushType: data.pushType
		};
		for (const [key, value] of Object.entries(data)) {
			if (["objectId", "applicationName", "appVersion", "badge", "channels", "deviceToken", "deviceType", "sdkVersion", "timeZone", "createDate", "updateDate", "acl", "pushType"].includes(key)) {
				continue;
			}
			body[key] = value;
		}
		body._object_id = data.objectId;
		body._createdDate = data.createDate;
		body._updatedDate = data.updateDate;
		const res = await fetch(`${params.url}/installations`, {
			method: 'POST',
			headers: {
				'X-Parse-Application-Id': params.app,
				'X-Parse-REST-API-Key': params.key,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		if (res.status !== 201) {
			console.error(`Installationの作成に失敗しました。${res.status} ${res.statusText}`);
			process.exit(1);
		}
		const json = await res.json() as ParseInstallationResponse;
		console.log(`Installationの作成に成功しました。objectId: ${json.objectId}`);
	}
})(params);
