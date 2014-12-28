/**
 * Created by Devin on 2014-12-26.
 */

/********** Build text for rendering **********/

function StaticCharBlock(strBlock, charW, charH, marginW, marginH, maxW, maxH, lineSpace, alignW, alignH) {
    var w = charW || 0.05,
        h = charH || 0.05;

    var x = 0.0;
    var y = 0.0;

    var posCoords = [];
    var texCoords = [];

    var greatestWidth = 0.0;
    var blockHeight = strBlock.length * (charH + lineSpace);

    var count = 0;
    for (var i = 0; i < strBlock.length; i++) { // array of strings

        var lineW = strBlock[i].length * charW;
        if (greatestWidth < lineW) greatestWidth = lineW;

        for (var j = 0; j < strBlock[i].length; j++) { // char array
            x = (j*w) - (lineW*alignW) + marginW;
            y = (i*h) + (i * lineSpace) + marginH;
            posCoords = posCoords.concat(this.ShiftedPosCoords(x, -y, w, h));
            texCoords = texCoords.concat(FontMap.texCoords[strBlock[i][j]]);
            count+= 6;
        }
    }

    // After alignment, put all verts back into their proper rect space
    // Make changes to affect extra style attributes, like killing off the last line space
    for (var i = 0; i < posCoords.length; i+=2) {
        posCoords[i] += (maxW * alignW);
        posCoords[i+1] -= (maxH * alignH) - (blockHeight * alignH) + (lineSpace * alignH);
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
    }
};

var FontMap = {
    texCoords: {},
    Initialize: function() {

        function GetCoordsByIndex(row, col) {
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
        }

        this.texCoords['A'] = GetCoordsByIndex(0, 7);
        this.texCoords['B'] = GetCoordsByIndex(1, 7);
        this.texCoords['C'] = GetCoordsByIndex(2, 7);
        this.texCoords['D'] = GetCoordsByIndex(3, 7);
        this.texCoords['E'] = GetCoordsByIndex(4, 7);
        this.texCoords['F'] = GetCoordsByIndex(5, 7);
        this.texCoords['G'] = GetCoordsByIndex(6, 7);
        this.texCoords['H'] = GetCoordsByIndex(7, 7);
        this.texCoords['I'] = GetCoordsByIndex(0, 6);
        this.texCoords['J'] = GetCoordsByIndex(1, 6);
        this.texCoords['K'] = GetCoordsByIndex(2, 6);
        this.texCoords['L'] = GetCoordsByIndex(3, 6);
        this.texCoords['M'] = GetCoordsByIndex(4, 6);
        this.texCoords['N'] = GetCoordsByIndex(5, 6);
        this.texCoords['O'] = GetCoordsByIndex(6, 6);
        this.texCoords['P'] = GetCoordsByIndex(7, 6);
        this.texCoords['Q'] = GetCoordsByIndex(0, 5);
        this.texCoords['R'] = GetCoordsByIndex(1, 5);
        this.texCoords['S'] = GetCoordsByIndex(2, 5);
        this.texCoords['T'] = GetCoordsByIndex(3, 5);
        this.texCoords['U'] = GetCoordsByIndex(4, 5);
        this.texCoords['V'] = GetCoordsByIndex(5, 5);
        this.texCoords['W'] = GetCoordsByIndex(6, 5);
        this.texCoords['X'] = GetCoordsByIndex(7, 5);
        this.texCoords['Y'] = GetCoordsByIndex(0, 4);
        this.texCoords['Z'] = GetCoordsByIndex(1, 4);
        this.texCoords['0'] = GetCoordsByIndex(2, 4);
        this.texCoords['1'] = GetCoordsByIndex(3, 4);
        this.texCoords['2'] = GetCoordsByIndex(4, 4);
        this.texCoords['3'] = GetCoordsByIndex(5, 4);
        this.texCoords['4'] = GetCoordsByIndex(6, 4);
        this.texCoords['5'] = GetCoordsByIndex(7, 4);
        this.texCoords['6'] = GetCoordsByIndex(0, 3);
        this.texCoords['7'] = GetCoordsByIndex(1, 3);
        this.texCoords['8'] = GetCoordsByIndex(2, 3);
        this.texCoords['9'] = GetCoordsByIndex(3, 3);
        this.texCoords['.'] = GetCoordsByIndex(4, 3);
        this.texCoords[' '] = GetCoordsByIndex(5, 3);
        this.texCoords['a'] = GetCoordsByIndex(6, 3);
        this.texCoords['b'] = GetCoordsByIndex(7, 3);
        this.texCoords['c'] = GetCoordsByIndex(0, 2);
        this.texCoords['d'] = GetCoordsByIndex(1, 2);
        this.texCoords['e'] = GetCoordsByIndex(2, 2);
        this.texCoords['f'] = GetCoordsByIndex(3, 2);
        this.texCoords['g'] = GetCoordsByIndex(4, 2);
        this.texCoords['h'] = GetCoordsByIndex(5, 2);
        this.texCoords['i'] = GetCoordsByIndex(6, 2);
        this.texCoords['j'] = GetCoordsByIndex(7, 2);
        this.texCoords['k'] = GetCoordsByIndex(0, 1);
        this.texCoords['l'] = GetCoordsByIndex(1, 1);
        this.texCoords['m'] = GetCoordsByIndex(2, 1);
        this.texCoords['n'] = GetCoordsByIndex(3, 1);
        this.texCoords['o'] = GetCoordsByIndex(4, 1);
        this.texCoords['p'] = GetCoordsByIndex(5, 1);
        this.texCoords['q'] = GetCoordsByIndex(6, 1);
        this.texCoords['r'] = GetCoordsByIndex(7, 1);
        this.texCoords['s'] = GetCoordsByIndex(0, 0);
        this.texCoords['t'] = GetCoordsByIndex(1, 0);
        this.texCoords['u'] = GetCoordsByIndex(2, 0);
        this.texCoords['v'] = GetCoordsByIndex(3, 0);
        this.texCoords['w'] = GetCoordsByIndex(4, 0);
        this.texCoords['x'] = GetCoordsByIndex(5, 0);
        this.texCoords['y'] = GetCoordsByIndex(6, 0);
        this.texCoords['z'] = GetCoordsByIndex(7, 0);
    }
};
