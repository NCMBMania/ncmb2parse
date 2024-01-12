import { program } from "commander";
import { ParseResponse, ParseInstallationRequest, Params, ParseUserRequest, ParseDataStoreRequest } from "./type.d";
import fs from "fs";
import path from "path";

export const content = (): Params => {
	program
		.option('-k, --key <REST API Key>', 'Parse ServerのREST APIキー', '')
		.option('-u, --url <URL>', 'Parse ServerのURL')
		.option('-a, --app <Application ID>', 'Parse ServerのApplication ID')
		.option('-n, --name <Name>', 'クラス名、ロール名を指定', '')
		.option('-m, --masterKey <Master Key>', 'Parse ServerのMaster Key', '')
		.option('-j, --javascriptKey <JavaScript Key>', 'Parse ServerのJavaScript Key', '')
		.argument('<filePath>', 'インポートするJSONファイルのパス');
	program.parse();
	const options: Params = program.opts();
	const [filePath] = program.args;
	if (!filePath) {
		console.error('filePathは必須です');
		process.exit(1);
	}
	options.filePath = path.resolve(filePath);
	const file = fs.readFileSync(options.filePath, 'utf-8');
	options.file = JSON.parse(file);
	return options;
}

export const insert = async (
		url: string,
		appId: string,
		key: string,
		body: ParseInstallationRequest | ParseUserRequest | ParseDataStoreRequest
	): Promise<ParseResponse> => {
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'X-Parse-Application-Id': appId,
			'X-Parse-REST-API-Key': key,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	if (res.status !== 201) {
		throw new Error(`データ作成に失敗しました。${res.status} ${await res.text()}`);
	}
	return res.json();
};