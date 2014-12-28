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
            var tenth = 0.1;
            return [
                row * tenth, (col+1) * tenth,
                row * tenth, col * tenth,
                (row+1) * tenth, col * tenth,

                row * tenth, (col+1) * tenth,
                (row+1) * tenth, col * tenth,
                (row+1) * tenth, (col+1) * tenth
            ];
        }

        this.texCoords['A'] = GetCoordsByIndex(0, 9);
        this.texCoords['B'] = GetCoordsByIndex(1, 9);
        this.texCoords['C'] = GetCoordsByIndex(2, 9);
        this.texCoords['D'] = GetCoordsByIndex(3, 9);
        this.texCoords['E'] = GetCoordsByIndex(4, 9);
        this.texCoords['F'] = GetCoordsByIndex(5, 9);
        this.texCoords['G'] = GetCoordsByIndex(6, 9);
        this.texCoords['H'] = GetCoordsByIndex(7, 9);
        this.texCoords['I'] = GetCoordsByIndex(8, 9);
        this.texCoords['J'] = GetCoordsByIndex(9, 9);
        this.texCoords['K'] = GetCoordsByIndex(0, 8);
        this.texCoords['L'] = GetCoordsByIndex(1, 8);
        this.texCoords['M'] = GetCoordsByIndex(2, 8);
        this.texCoords['N'] = GetCoordsByIndex(3, 8);
        this.texCoords['O'] = GetCoordsByIndex(4, 8);
        this.texCoords['P'] = GetCoordsByIndex(5, 8);
        this.texCoords['Q'] = GetCoordsByIndex(6, 8);
        this.texCoords['R'] = GetCoordsByIndex(7, 8);
        this.texCoords['S'] = GetCoordsByIndex(8, 8);
        this.texCoords['T'] = GetCoordsByIndex(9, 8);
        this.texCoords['U'] = GetCoordsByIndex(0, 7);
        this.texCoords['V'] = GetCoordsByIndex(1, 7);
        this.texCoords['W'] = GetCoordsByIndex(2, 7);
        this.texCoords['X'] = GetCoordsByIndex(3, 7);
        this.texCoords['Y'] = GetCoordsByIndex(4, 7);
        this.texCoords['Z'] = GetCoordsByIndex(5, 7);
        this.texCoords['a'] = GetCoordsByIndex(6, 7);
        this.texCoords['b'] = GetCoordsByIndex(7, 7);
        this.texCoords['c'] = GetCoordsByIndex(8, 7);
        this.texCoords['d'] = GetCoordsByIndex(9, 7);
        this.texCoords['e'] = GetCoordsByIndex(0, 6);
        this.texCoords['f'] = GetCoordsByIndex(1, 6);
        this.texCoords['g'] = GetCoordsByIndex(2, 6);
        this.texCoords['h'] = GetCoordsByIndex(3, 6);
        this.texCoords['i'] = GetCoordsByIndex(4, 6);
        this.texCoords['j'] = GetCoordsByIndex(5, 6);
        this.texCoords['k'] = GetCoordsByIndex(6, 6);
        this.texCoords['l'] = GetCoordsByIndex(7, 6);
        this.texCoords['m'] = GetCoordsByIndex(8, 6);
        this.texCoords['n'] = GetCoordsByIndex(9, 6);
        this.texCoords['o'] = GetCoordsByIndex(0, 5);
        this.texCoords['p'] = GetCoordsByIndex(1, 5);
        this.texCoords['q'] = GetCoordsByIndex(2, 5);
        this.texCoords['r'] = GetCoordsByIndex(3, 5);
        this.texCoords['s'] = GetCoordsByIndex(4, 5);
        this.texCoords['t'] = GetCoordsByIndex(5, 5);
        this.texCoords['u'] = GetCoordsByIndex(6, 5);
        this.texCoords['v'] = GetCoordsByIndex(7, 5);
        this.texCoords['w'] = GetCoordsByIndex(8, 5);
        this.texCoords['x'] = GetCoordsByIndex(9, 5);
        this.texCoords['y'] = GetCoordsByIndex(0, 4);
        this.texCoords['z'] = GetCoordsByIndex(1, 4);
        this.texCoords['0'] = GetCoordsByIndex(2, 4);
        this.texCoords['1'] = GetCoordsByIndex(3, 4);
        this.texCoords['2'] = GetCoordsByIndex(4, 4);
        this.texCoords['3'] = GetCoordsByIndex(5, 4);
        this.texCoords['4'] = GetCoordsByIndex(6, 4);
        this.texCoords['5'] = GetCoordsByIndex(7, 4);
        this.texCoords['6'] = GetCoordsByIndex(8, 4);
        this.texCoords['7'] = GetCoordsByIndex(9, 4);
        this.texCoords['8'] = GetCoordsByIndex(0, 3);
        this.texCoords['9'] = GetCoordsByIndex(1, 3);
        this.texCoords[','] = GetCoordsByIndex(2, 3);
        this.texCoords['.'] = GetCoordsByIndex(3, 3);
        this.texCoords['!'] = GetCoordsByIndex(4, 3);
        this.texCoords['?'] = GetCoordsByIndex(5, 3);
        this.texCoords['<'] = GetCoordsByIndex(6, 3);
        this.texCoords['>'] = GetCoordsByIndex(7, 3);
        this.texCoords['/'] = GetCoordsByIndex(8, 3);
        this.texCoords['\\'] = GetCoordsByIndex(9, 3); // May cause problems
        this.texCoords[';'] = GetCoordsByIndex(0, 2);
        this.texCoords[':'] = GetCoordsByIndex(1, 2);
        this.texCoords['\''] = GetCoordsByIndex(2, 2); // May cause problems
        this.texCoords['\"'] = GetCoordsByIndex(3, 2); // May cause problems
        this.texCoords['['] = GetCoordsByIndex(4, 2);
        this.texCoords[']'] = GetCoordsByIndex(5, 2);
        this.texCoords['{'] = GetCoordsByIndex(6, 2);
        this.texCoords['}'] = GetCoordsByIndex(7, 2);
        this.texCoords['('] = GetCoordsByIndex(8, 2);
        this.texCoords[')'] = GetCoordsByIndex(9, 2);
        this.texCoords['|'] = GetCoordsByIndex(0, 1);
        this.texCoords['&'] = GetCoordsByIndex(1, 1); // May cause problems
        this.texCoords['+'] = GetCoordsByIndex(2, 1);
        this.texCoords['-'] = GetCoordsByIndex(3, 1);
        this.texCoords['='] = GetCoordsByIndex(4, 1); // May cause problems
        this.texCoords['_'] = GetCoordsByIndex(5, 1); // May cause problems
        this.texCoords['*'] = GetCoordsByIndex(6, 1);
        this.texCoords['^'] = GetCoordsByIndex(7, 1);
        this.texCoords['%'] = GetCoordsByIndex(8, 1);
        this.texCoords['$'] = GetCoordsByIndex(9, 1);
        this.texCoords['#'] = GetCoordsByIndex(0, 0);
        this.texCoords['@'] = GetCoordsByIndex(1, 0);
        this.texCoords['`'] = GetCoordsByIndex(2, 0);
        this.texCoords['~'] = GetCoordsByIndex(3, 0);
        this.texCoords[' '] = GetCoordsByIndex(4, 0);
    }
};
