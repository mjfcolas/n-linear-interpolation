import {D1Element, D2Element, D3Element} from "./element";
import {interpolate} from "./interpolate";

describe("Interpolation", () => {

    describe("1D", () => {

        const arrayWithOnlyOneElement: D1Element[] = [
            [5, 2]
        ];

        const arrayWithTwoElements: D1Element[] = [
            [5, 2],
            [10, 4]
        ];

        const arrayWithThreeUnsortedElements: D1Element[] = [
            [10, 4],
            [5, 2],
            [15, 20]
        ];

        test("interpolation without enough elements", () => {
            expect(() => interpolate.d1(arrayWithOnlyOneElement, 3)).toThrow("OUT_OF_BOUND_ERROR");
        });
        test("interpolation with one element when getting element", () => {
            expect(() => interpolate.d1(arrayWithOnlyOneElement, 5)).toThrow("OUT_OF_BOUND_ERROR");
        });

        test("interpolation when inside segment", () => {
            expect(interpolate.d1(arrayWithTwoElements, 7.5)).toEqual(3);
        });

        test("interpolation when outside segment", () => {
            expect(() => interpolate.d1(arrayWithTwoElements, 12)).toThrow("OUT_OF_BOUND_ERROR");
        });

        test("interpolation when inside one of the two segments", () => {
            expect(interpolate.d1(arrayWithThreeUnsortedElements, 7.5)).toEqual(3);
        });

    });

    describe("2D", () => {

        const arrayWithNotEnoughElements: D2Element[] = [
            [0, 0, 0],
            [10, 0, 1],
            [0, 10, 2]
        ];

        const arrayWithOneSquare: D2Element[] = [
            [0, 0, 0],
            [10, 0, 1],
            [0, 10, 2],
            [10, 10, 3]
        ];

        const arrayWithTwoUnsortedSquares: D2Element[] = [
            [0, 0, 0],
            [0, 10, 2],
            [10, 10, 3],
            [0, 20, 5],
            [10, 0, 1],
            [20, 20, 8]
        ];

        test("interpolation without enough elements", () => {
            expect(() => interpolate.d2(arrayWithNotEnoughElements, [5, 5])).toThrow("OUT_OF_BOUND_ERROR");
        });


        test("interpolation out of bounds", () => {
            expect(() => interpolate.d2(arrayWithOneSquare, [15, 15])).toThrow("OUT_OF_BOUND_ERROR");
        });

        test("x dimension interpolation in one square", () => {
            expect(interpolate.d2(arrayWithOneSquare, [5, 0])).toEqual(0.5);
        });

        test("y dimension interpolation in one square", () => {
            expect(interpolate.d2(arrayWithOneSquare, [0, 5])).toEqual(1);
        });

        test("x and y dimension interpolation in one square", () => {
            expect(interpolate.d2(arrayWithOneSquare, [5, 5])).toEqual(1.5);
        });

        test("x and y interpolation in two unsorded squares", () => {
            expect(interpolate.d2(arrayWithTwoUnsortedSquares, [5, 5])).toEqual(1.5);
        });
    });

    describe("3D", () => {

        const arrayWithNotEnoughElements: D3Element[] = [
            [0, 0, 0, 0],
            [10, 0, 0, 1],
            [0, 10, 0, 2],
            [10, 10, 0, 3],
            [20, 20, 10, 4],
        ];

        const arrayWithTwoUnsortedCubes: D3Element[] = [
            [4000, 20, 700, 460],
            [0, -20, 700, 285],
            [0, -20, 900, 480],
            [0, 0, 700, 315],
            [4000, -20, 700, 375],
            [4000, -20, 900, 645],
            [0, 0, 900, 535],
            [0, 20, 700, 345],
            [0, 20, 900, 590],
            [4000, 0, 700, 415],
            [4000, 0, 900, 720],
            [4000, 20, 900, 800]
        ];

        const arrayWithOneCube: D3Element[] = [
            [0, 0, 700, 315],
            [0, 0, 900, 535],
            [0, 20, 700, 345],
            [0, 20, 900, 590],
            [4000, 0, 700, 415],
            [4000, 0, 900, 720],
            [4000, 20, 700, 460],
            [4000, 20, 900, 800]
        ];

        test("interpolation without enough elements", () => {
            expect(() => interpolate.d3(arrayWithNotEnoughElements, [5, 5, 800])).toThrow("OUT_OF_BOUND_ERROR");
        });

        test("z dimension interpolation in one cube", () => {
            expect(interpolate.d3(arrayWithOneCube, [0, 0, 800])).toEqual(425);
        });

        test("x and z dimension interpolation in one cube", () => {
            expect(interpolate.d3(arrayWithOneCube, [4000, 0, 800])).toEqual(567.5);
        });

        test("x, y and z dimension interpolation in one cube", () => {
            expect(interpolate.d3(arrayWithOneCube, [2000, 10, 800])).toEqual(522.5);
        });

        test("z dimension interpolation in two cubes", () => {
            expect(interpolate.d3(arrayWithTwoUnsortedCubes, [0, 0, 800])).toEqual(425);
        });

        test("x and z dimension interpolation in two cube", () => {
            expect(interpolate.d3(arrayWithTwoUnsortedCubes, [4000, 0, 800])).toEqual(567.5);
        });

        test("x, y and z dimension interpolation in two cube", () => {
            expect(interpolate.d3(arrayWithTwoUnsortedCubes, [2000, 10, 800])).toEqual(522.5);
        });
    })
});
