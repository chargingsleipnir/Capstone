/**
 * Created by Devin on 2014-12-26.
 */

/********** Build text for rendering **********/

function StaticCharBlock(strBlock, charW, charH, lineSpace, alignW) {
    var w = charW || 0.05,
        h = charH || 0.05;

    var x = 0.0;
    var y = 0.0;

    console.log(alignW);

    var posCoords = [];
    var texCoords = [];

    var count = 0;
    for (var i = 0; i < strBlock.length; i++) { // array of strings
        for (var j = 0; j < strBlock[i].length; j++) { // char array
            posCoords = posCoords.concat(this.ShiftedPosCoords(x+(j*w), y-(i*h), w, h));
            texCoords = texCoords.concat(this.GetTexCoords(strBlock[i][j]));
            count+= 6;
        }
        y -= lineSpace;
    }

    return {
        count: count,
        posCoords: posCoords,
        colElems: [],
        texCoords: texCoords,
        normAxes: []
    };
}
StaticCharBlock.prototype = {
    ShiftedPosCoords: function(x, y, w, h) {
        // Defines quad shape
        return [
            x,     y,
            x,     y -h,
            x + w, y -h,
            x,     y,
            x + w, y -h,
            x + w, y
        ];
    },
    GetCoordsByIndex: function(row, col) {
        // For textures, specify row and col from bottom-left to top-right
        var eigth = 0.125;
        return [
            row * eigth, (col+1) * eigth,
            row * eigth, col * eigth,
            (row+1) * eigth, col * eigth,

            row * eigth, (col+1) * eigth,
            (row+1) * eigth, col * eigth,
            (row+1) * eigth, (col+1) * eigth
        ];
    },
    GetTexCoords: function(char) {
        switch (char) {
            case 'A': return this.GetCoordsByIndex(0, 7) ;
            case 'B': return this.GetCoordsByIndex(1, 7) ;
            case 'C': return this.GetCoordsByIndex(2, 7) ;
            case 'D': return this.GetCoordsByIndex(3, 7) ;
            case 'E': return this.GetCoordsByIndex(4, 7) ;
            case 'F': return this.GetCoordsByIndex(5, 7) ;
            case 'G': return this.GetCoordsByIndex(6, 7) ;
            case 'H': return this.GetCoordsByIndex(7, 7) ;
            case 'I': return this.GetCoordsByIndex(0, 6) ;
            case 'J': return this.GetCoordsByIndex(1, 6) ;
            case 'K': return this.GetCoordsByIndex(2, 6) ;
            case 'L': return this.GetCoordsByIndex(3, 6) ;
            case 'M': return this.GetCoordsByIndex(4, 6) ;
            case 'N': return this.GetCoordsByIndex(5, 6) ;
            case 'O': return this.GetCoordsByIndex(6, 6) ;
            case 'P': return this.GetCoordsByIndex(7, 6) ;
            case 'Q': return this.GetCoordsByIndex(0, 5) ;
            case 'R': return this.GetCoordsByIndex(1, 5) ;
            case 'S': return this.GetCoordsByIndex(2, 5) ;
            case 'T': return this.GetCoordsByIndex(3, 5) ;
            case 'U': return this.GetCoordsByIndex(4, 5) ;
            case 'V': return this.GetCoordsByIndex(5, 5) ;
            case 'W': return this.GetCoordsByIndex(6, 5) ;
            case 'X': return this.GetCoordsByIndex(7, 5) ;
            case 'Y': return this.GetCoordsByIndex(0, 4) ;
            case 'Z': return this.GetCoordsByIndex(1, 4) ;
            case '0': return this.GetCoordsByIndex(2, 4) ;
            case '1': return this.GetCoordsByIndex(3, 4) ;
            case '2': return this.GetCoordsByIndex(4, 4) ;
            case '3': return this.GetCoordsByIndex(5, 4) ;
            case '4': return this.GetCoordsByIndex(6, 4) ;
            case '5': return this.GetCoordsByIndex(7, 4) ;
            case '6': return this.GetCoordsByIndex(0, 3) ;
            case '7': return this.GetCoordsByIndex(1, 3) ;
            case '8': return this.GetCoordsByIndex(2, 3) ;
            case '9': return this.GetCoordsByIndex(3, 3) ;
            case '.': return this.GetCoordsByIndex(4, 3) ;
            case ' ': return this.GetCoordsByIndex(5, 3) ;
            case 'a': return this.GetCoordsByIndex(6, 3) ;
            case 'b': return this.GetCoordsByIndex(7, 3) ;
            case 'c': return this.GetCoordsByIndex(0, 2) ;
            case 'd': return this.GetCoordsByIndex(1, 2) ;
            case 'e': return this.GetCoordsByIndex(2, 2) ;
            case 'f': return this.GetCoordsByIndex(3, 2) ;
            case 'g': return this.GetCoordsByIndex(4, 2) ;
            case 'h': return this.GetCoordsByIndex(5, 2) ;
            case 'i': return this.GetCoordsByIndex(6, 2) ;
            case 'j': return this.GetCoordsByIndex(7, 2) ;
            case 'k': return this.GetCoordsByIndex(0, 1) ;
            case 'l': return this.GetCoordsByIndex(1, 1) ;
            case 'm': return this.GetCoordsByIndex(2, 1) ;
            case 'n': return this.GetCoordsByIndex(3, 1) ;
            case 'o': return this.GetCoordsByIndex(4, 1) ;
            case 'p': return this.GetCoordsByIndex(5, 1) ;
            case 'q': return this.GetCoordsByIndex(6, 1) ;
            case 'r': return this.GetCoordsByIndex(7, 1) ;
            case 's': return this.GetCoordsByIndex(0, 0) ;
            case 't': return this.GetCoordsByIndex(1, 0) ;
            case 'u': return this.GetCoordsByIndex(2, 0) ;
            case 'v': return this.GetCoordsByIndex(3, 0) ;
            case 'w': return this.GetCoordsByIndex(4, 0) ;
            case 'x': return this.GetCoordsByIndex(5, 0) ;
            case 'y': return this.GetCoordsByIndex(6, 0) ;
            case 'z': return this.GetCoordsByIndex(7, 0) ;
        }
    }
};