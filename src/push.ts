import { ParseInstallationRequest, InstallationJson, Params } from './type.d';
import { insert, content } from './utils';

const options = content() as Params;
if (options.key === '') {
	console.error('REST APIキーは必須です');
	process.exit(1);
}

(async (params: Params) => {
	const results = (params.file! as InstallationJson).results;
	for (const data of results) {
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
		body.ncmbObjectId = data.objectId;
		body.createdDate = data.createDate;
		body.updatedDate = data.updateDate;
		const json = await insert(`${params.url}/installations`, params.app, params.key!, body);
		console.log(`Installationの作成に成功しました。objectId: ${json.objectId}`);
	}
})(options);
