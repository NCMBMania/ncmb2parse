export interface Options {
	key: string;
	url: string;
	app: string;
};

export interface ParseResponse {
	objectId: string;
	createdAt: string;
};

export interface ParseInstallationRequest {
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

export interface ParseUserRequest {
	authData?: any;
	username: string;
	mailAddress: string;
	password: string;
	acl: {
		[key: string]: {
			read: boolean;
			write: boolean;
		}
	};
	[key: string]: any;
}

export interface Installation {
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

export interface User {
	objectId: string;
	authData: any;
	userName: string;
	mailAddress: string;
	mailAddressConfirm: boolean;
	createDate: string;
	updateDate: string;
	acl: {
		[key: string]: {
			read: boolean;
			write: boolean;
		}
	};
};

export interface InstallationJson {
	results: Installation[];
};

export interface UserJson {
	results: User[];
};

export interface Params extends Options {
	file?: InstallationJson | UserJson;
};
