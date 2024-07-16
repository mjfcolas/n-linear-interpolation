import {D1Element, D2Element, D3Element} from "./element";
import {D1Coordinate, D2Coordinate, D3Coordinate, X, Y, Z} from "./coordinate";
import {Hexahedron, Quadrilateral, Segment} from "./geometrical-wrapper";


export const interpolate = {
    d1: d1Interpolation,
    d2: d2Interpolation,
    d3: d3Interpolation
}

function d3Interpolation(sourceArray: D3Element[], coordinateToInterpolate: D3Coordinate) {
    const boundingHexahedron = getBoundingHexahedron(sourceArray, coordinateToInterpolate);

    const [c000,
        c001,
        c010,
        c011,
        c100,
        c101,
        c110,
        c111
    ] = boundingHexahedron;

    if (!c000 || !c001 || !c010 || !c011 || !c100 || !c101 || !c110 || !c111) {
        throw new Error('OUT_OF_BOUND_ERROR');
    }

    return interpolateInHexahedron([c000, c001, c010, c011, c100, c101, c110, c111], coordinateToInterpolate);
}

function d2Interpolation(sourceArray: D2Element[], coordinateToInterpolate: D2Coordinate) {
    const boundingQuadrilateral = getBoundingQuadrilateral(sourceArray, coordinateToInterpolate);
    const [c00, c01, c10, c11] = boundingQuadrilateral;
    if (!c00 || !c01 || !c10 || !c11) {
        throw new Error('OUT_OF_BOUND_ERROR');
    }
    return interpolateInQuadrilateral(boundingQuadrilateral, coordinateToInterpolate);
}

function d1Interpolation(sourceArray: D1Element[], coordinateToInterpolate: D1Coordinate): number {
    const boundingSegment = getBoundingSegment(sourceArray, coordinateToInterpolate);
    if (!boundingSegment[0] || !boundingSegment[1]) {
        throw new Error('OUT_OF_BOUND_ERROR');
    }
    return interpolateInSegment(boundingSegment, coordinateToInterpolate);
}

function interpolateInHexahedron(hexahedron: Hexahedron, coordinateToInterpolate: D3Coordinate): number {

    const [c000, c001, c010, c011, c100, c101, c110, c111] = hexahedron;

    const c00Factor = (coordinateToInterpolate[0] - c000[0]) / (c100[0] - c000[0])
    const c00: D2Element = [(c100[1] + c000[1]) / 2, (c100[2] + c000[2]) / 2, c000[3] + c00Factor * (c100[3] - c000[3])];
    const c01Factor = (coordinateToInterpolate[0] - c001[0]) / (c101[0] - c001[0])
    const c01: D2Element = [(c101[1] + c001[1]) / 2, (c101[2] + c001[2]) / 2, c001[3] + c01Factor * (c101[3] - c001[3])];
    const c10Factor = (coordinateToInterpolate[0] - c010[0]) / (c110[0] - c010[0])
    const c10: D2Element = [(c110[1] + c010[1]) / 2, (c110[2] + c010[2]) / 2, c010[3] + c10Factor * (c110[3] - c010[3])];
    const c11Factor = (coordinateToInterpolate[0] - c011[0]) / (c111[0] - c011[0])
    const c11: D2Element = [(c111[1] + c011[1]) / 2, (c111[2] + c011[2]) / 2, c011[3] + c11Factor * (c111[3] - c011[3])];

    return interpolateInQuadrilateral([c00, c01, c10, c11], [coordinateToInterpolate[1], coordinateToInterpolate[2]]);
}

function interpolateInQuadrilateral(quadrilateral: Quadrilateral, coordinateToInterpolate: D2Coordinate) {
    const [c00, c01, c10, c11] = quadrilateral;

    const c0Factor = (coordinateToInterpolate[0] - c00[0]) / (c10[0] - c00[0]);
    const c0: D1Element = [(c10[1] + c00[1]) / 2, c00[2] + c0Factor * (c10[2] - c00[2])];
    const c1Factor = (coordinateToInterpolate[0] - c01[0]) / (c11[0] - c01[0]);
    const c1: D1Element = [(c11[1] + c01[1]) / 2, c01[2] + c1Factor * (c11[2] - c01[2])];

    return interpolateInSegment([c0, c1], coordinateToInterpolate[1]);

}

function interpolateInSegment(segment: Segment, coordinateToInterpolate: D1Coordinate) {
    const [c0, c1] = segment;
    const cFactor = (coordinateToInterpolate - c0[0]) / (c1[0] - c0[0]);
    return c0[1] + cFactor * (c1[1] - c0[1]);
}

function getBoundingSegment(sourceArray: D1Element[], boundedCoordinate: D1Coordinate): Segment {
    const x = boundedCoordinate;

    const sortedArray = [...sourceArray].sort(([x1], [x2]) => x1 - x2);

    const c0 = sortedArray.filter(([x1]) => x1 <= x).pop();
    const c1 = sortedArray.filter(([x1]) => x1 >= x && (!c0 || x1 != c0[0])).shift();

    return [c0, c1];

}

function getBoundingQuadrilateral(sourceArray: D2Element[], boundedCoordinate: D2Coordinate): Quadrilateral {
    const [x, y] = boundedCoordinate;

    const maxX = Math.max(...sourceArray.map(([x]) => x));
    const maxY = Math.max(...sourceArray.map(([, y]) => y));

    const belowCriteria =
        ([x1, y1,]: [X, Y, any], direction: 'X' | 'Y') => {
            switch (direction) {
                case 'X':
                    return x === maxX ? x1 < x : x1 <= x;
                case 'Y':
                    return y === maxY ? y1 < y : y1 <= y;
            }
        }

    const aboveCriteria =
        ([x1, y1,]: [X, Y, any], direction: 'X' | 'Y') => {
            switch (direction) {
                case 'X':
                    return x === maxX ? x1 >= x : x1 > x;
                case 'Y':
                    return y == maxY ? y1 >= y : y1 > y;
            }
        }

    const sortedArray = [...sourceArray]
        .sort(([x1, y1], [x2, y2]) => twoDimensionSquaredDistance([x1, y1], [x, y])
            - twoDimensionSquaredDistance([x2, y2], [x, y]));

    const alreadyChosenPoints = []

    const c00 = sortedArray
        .filter((potentialCorner) =>
            belowCriteria(potentialCorner, 'X')
            && belowCriteria(potentialCorner, 'Y'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c00);

    const c01 = sortedArray
        .filter((potentialCorner) =>
            belowCriteria(potentialCorner, 'X')
            && aboveCriteria(potentialCorner, 'Y'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c01);

    const c10 = sortedArray
        .filter((potentialCorner) =>
            aboveCriteria(potentialCorner, 'X')
            && belowCriteria(potentialCorner, 'Y'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c10);

    const c11 = sortedArray
        .filter((potentialCorner) =>
            aboveCriteria(potentialCorner, 'X')
            && aboveCriteria(potentialCorner, 'Y'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c11);

    return [c00, c01, c10, c11];
}

function getBoundingHexahedron(sourceArray: D3Element[], boundedCoordinate: D3Coordinate): Hexahedron {

    const [x, y, z] = boundedCoordinate;

    const maxX = Math.max(...sourceArray.map(([x]) => x));
    const maxY = Math.max(...sourceArray.map(([, y]) => y));
    const maxZ = Math.max(...sourceArray.map(([, , z]) => z));

    const belowCriteria =
        ([x1, y1, z1,]: [X, Y, Z, any], direction: 'X' | 'Y' | 'Z') => {
            switch (direction) {
                case 'X':
                    return x === maxX ? x1 < x : x1 <= x;
                case 'Y':
                    return y === maxY ? y1 < y : y1 <= y;
                case 'Z':
                    return z === maxZ ? z1 < z : z1 <= z;
            }
        }

    const aboveCriteria =
        ([x1, y1, z1,]: [X, Y, Z, any], direction: 'X' | 'Y' | 'Z') => {
            switch (direction) {
                case 'X':
                    return x === maxX ? x1 >= x : x1 > x;
                case 'Y':
                    return y == maxY ? y1 >= y : y1 > y;
                case 'Z':
                    return z == maxZ ? z1 >= z : z1 > z;
            }
        }


    const sortedArray = [...sourceArray]
        .sort(([x1, y1, z1], [x2, y2, z2]) =>
            threeDimensionSquaredDistance([x1, y1, z1], [x, y, z])
            - threeDimensionSquaredDistance([x2, y2, z2], [x, y, z]));

    const alreadyChosenPoints = []

    const c000 = sortedArray
        .filter((potentialCorner) =>
            belowCriteria(potentialCorner, 'X')
            && belowCriteria(potentialCorner, 'Y')
            && belowCriteria(potentialCorner, 'Z'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c000);

    const c001 = sortedArray
        .filter((potentialCorner) =>
            belowCriteria(potentialCorner, 'X')
            && belowCriteria(potentialCorner, 'Y')
            && aboveCriteria(potentialCorner, 'Z'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c001);

    const c010 = sortedArray
        .filter((potentialCorner) =>
            belowCriteria(potentialCorner, 'X')
            && aboveCriteria(potentialCorner, 'Y')
            && belowCriteria(potentialCorner, 'Z'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c010);

    const c011 = sortedArray
        .filter((potentialCorner) =>
            belowCriteria(potentialCorner, 'X')
            && aboveCriteria(potentialCorner, 'Y')
            && aboveCriteria(potentialCorner, 'Z'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c011);

    const c100 = sortedArray
        .filter((potentialCorner) =>
            aboveCriteria(potentialCorner, 'X')
            && belowCriteria(potentialCorner, 'Y')
            && belowCriteria(potentialCorner, 'Z'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c100);

    const c101 = sortedArray
        .filter((potentialCorner) =>
            aboveCriteria(potentialCorner, 'X')
            && belowCriteria(potentialCorner, 'Y')
            && aboveCriteria(potentialCorner, 'Z'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c101);

    const c110 = sortedArray
        .filter((potentialCorner) =>
            aboveCriteria(potentialCorner, 'X')
            && aboveCriteria(potentialCorner, 'Y')
            && belowCriteria(potentialCorner, 'Z'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c110);

    const c111 = sortedArray
        .filter((potentialCorner) =>
            aboveCriteria(potentialCorner, 'X')
            && aboveCriteria(potentialCorner, 'Y')
            && aboveCriteria(potentialCorner, 'Z'))
        .filter(current => !alreadyChosenPoints.includes(current))[0];
    alreadyChosenPoints.push(c111);

    return [c000, c001, c010, c011, c100, c101, c110, c111];
}

function threeDimensionSquaredDistance([x1, y1, z1], [x2, y2, z2]) {
    return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2);
}

function twoDimensionSquaredDistance([x1, y1], [x2, y2]) {
    return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}
