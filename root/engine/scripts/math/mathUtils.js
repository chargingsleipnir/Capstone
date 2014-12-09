var MathUtils = {
    GetCofactor: function(tl, br, bl, tr) {
        return (tl * br) - (bl * tr);
    },
    GetGreatestDouble: function(value, startNum) {
        var out = startNum || 1;
        while (out < value) {
            out *= 2;
        }
        return out;
    }
};