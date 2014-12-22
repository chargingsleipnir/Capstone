
var DM = {
    dispObjs: [],
    Update: function() {
        for (var i = 0; i < this.dispObjs.length; i++) {
            this.dispObjs[i].model.UpdateModelViewControl(this.dispObjs[i].trfm);
        }
    }
};