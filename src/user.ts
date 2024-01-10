import { Params, ParseUserRequest, UserJson } from './type.d';
import { insert, content } from './utils';

const options = content() as Params;

if (options.key === '') {
	console.error('REST APIキーは必須です');
	process.exit(1);
}

(async (params: Params) => {
	const results = (params.file! as UserJson).results;
	for (const data of results) {
		const body: ParseUserRequest = {
			username: data.userName,
			mailAddress: data.mailAddress,
			password: data.userName,
			acl: data.acl
		};
		if (data.authData) {
			body.authData = data.authData;
		}
		for (const [key, value] of Object.entries(data)) {
			if (["objectId", "authData"].includes(key)) {
				continue;
			}
			body[key] = value;
		}
		body.ncmbObjectId = data.objectId;
		body.createdDate = data.createDate;
		body.updatedDate = data.updateDate;
		try {
			const json = await insert(`${params.url}/users`, params.app, params.key!, body);
			console.log(`Userの作成に成功しました。objectId: ${json.objectId}`);
		} catch (e) {
			console.error((e as Error).message);
			console.log(`Userの作成に失敗しました。元objectId: ${data.objectId}`)
		}
	}
})(options);
