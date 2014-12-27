/**
 * Created by Devin on 2014-12-26.
 */

/********** Build text for rendering **********/

function StaticCharBlock(string, charSize) {
    var w, h;
    if(charSize) {
        w = charSize.x;
        h = charSize.y;
    }
    else {
        w = h = 0.05;
    }

    function ShiftedPosCoords(shift) {
        return [
            0.0 + shift, 0.0,
            0.0 + shift, -h,
            w + shift, -h,
            0.0 + shift, 0.0,
            w + shift, -h,
            w + shift, 0.0
        ];
    }

    var posCoords = [];
    var texCoords = [];

    for (var i = 0; i < string.length; i++) {
        posCoords = posCoords.concat(ShiftedPosCoords(i*w));
        texCoords = texCoords.concat(TextUtils.GetTexCoords(string[i]));
    }

    return {
        count: string.length * 6,
        posCoords: posCoords,
        colElems: [],
        texCoords: texCoords,
        normAxes: []
    };
}