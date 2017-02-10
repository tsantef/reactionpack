import { createComputed } from './computed';

describe('Computed', () => {

	describe('#createComputed', () => {

		it('should compute new value', () => {
			let callCount = 0;

			const testComputed = createComputed([
				(state) => state.value,
				(inputText) => {
					callCount = callCount + 1;
					return callCount;
				},
			]);

			expect(testComputed({ value: 'test1' })).toEqual(1);
			expect(testComputed({ value: 'test2' })).toEqual(2);
		});

		it('should not recompute same value', () => {
			let callCount = 0;

			const testComputed = createComputed([
				(state) => state.value,
				(inputText) => {
					callCount = callCount + 1;
					return callCount;
				},
			]);

			expect(testComputed({ value: 'test' })).toEqual(1);
			expect(testComputed({ value: 'test' })).toEqual(1);
		});

		it('should throw error if missing a selector or computed function', () => {
			expect(() => {
				createComputed();
			}).toThrowErrorMatchingSnapshot();
			expect(() => {
				createComputed([]);
			}).toThrowErrorMatchingSnapshot();
			expect(() => {
				createComputed([
					(state) => {},
				]);
			}).toThrowErrorMatchingSnapshot();
		});

		it('should work with multiple selectors', () => {
			const testComputed = createComputed([
				(state) => state.value1,
				(state) => state.value2,
				(value1, value2) => {
					return value1 + value2;
				},
			]);

			expect(testComputed({ value1: 1, value2: 2 })).toEqual(3);
		});

		it('should compute after not recomputing', () => {

			let counter = 2;

			const state1 = {
				value: 2,
			};

			const state1dup = {
				value: 2,
			};

			const state2 = {
				value: 5,
			};

			const computed = [
				(state) => state.value,
				(value) => {
					return value * counter++;
				},
			];

			const testComputed = createComputed(computed);

			expect(testComputed(state1)).toEqual(4);
			expect(testComputed(state1dup)).toEqual(4);
			expect(testComputed(state2)).toEqual(15);

		});

	});

});
