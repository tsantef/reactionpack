import _ from 'lodash';

function getSelectorValues(state, selectors) {
	return _.map(selectors, (selector) => selector(state));
}

export function createComputed(args) {
	if (_.size(args) < 2) {
		throw new Error('Missing both a selector and compute function');
	}
	const selectors = _.initial(args);
	const compute = _.last(args);
	let resultCache;
	let valueCache;
	return function(state) {
		const selectorValues = getSelectorValues(state, selectors);
		if (valueCache && _.every(selectorValues, (value, index) => (value === valueCache[index]))) {
			return resultCache;
		}
		valueCache = selectorValues;
		resultCache = compute.apply(null, selectorValues);
		return resultCache;
	};
}

export function buildComputeds(computeds) {
	return _.mapValues(computeds, (value, key) => {
		if (_.isArray(value)) {
			return createComputed(value);
		} else {
			return buildComputeds(value);
		}
	});
}

export function generateComputeds(computeds, props, nameSpace) {
	const _props = nameSpace ? _.get(props, nameSpace, {}) : props;
	return _.mapValues(computeds, (computed, key) => {
		if (_.isFunction(computed)) {
			return computed(_props);
		} else {
			return generateComputeds(computed, _props, key);
		}
	});
}
