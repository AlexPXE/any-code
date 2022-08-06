/**
 * isRect function checks if the given points define a rectangle.
 * The function determines whether the corresponding sides of the quadrilateral are perpendicular.
 * Perpendicularity is determined using the [dot product of two vectors.](https://www.mathsisfun.com/algebra/vectors-dot-product.html)
 * 
 * @param  {...number} coords 8 numbers defining the rectangle. For example: `isRect(x1, y1, x2, y2, x3, y3, x4, y4)`
 * @returns {boolean} true if the points define a rectangle, false otherwise.
 */
function isRect(...coords) {

    const {length} = coords;

    if(length !== 8) {
        throw new Error("WTF!?");
    }

    const dotProduct = ([aX, aY], [bX, bY], [oX = 0, oY = 0]) => {
        return (aX - oX) * (bX - oX) + (aY - oY) * (bY - oY);
    };

    const vertices = [];
    const set = new Set();        

    for(let i = 0, point = []; i < length; i++) {          
        point.push(coords[i]);

        if(point.length % 2 === 0) {
            set.add(point.join(''));
            vertices.push(point);
            point = [];
        }
    }

    if(set.size !== 4) {
        return false;
    }

    return !vertices.reduce((acc, v, i) => {
        return acc + dotProduct(v, vertices[(i + 2) % 4], vertices[(i + 1) % 4]);
    }, 0);    
}
