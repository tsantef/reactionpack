import _ from 'lodash';

export function fakeApi(obj) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(obj);
		}, _.random(200, 400));
	});
}
