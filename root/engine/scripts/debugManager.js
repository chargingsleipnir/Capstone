
var DM = {
    dispObjs: [],
    AddDisplayObject: function(model, trfm) {
        DM.dispObjs.push(new DispObj(model, trfm));
        return DM.dispObjs.length - 1;
    },
    ReplaceDisplayObject: function(index, model, trfm) {
        //var index = DM.dispObjs.indexOf(dispObj);
        DM.dispObjs[index] = new DispObj(model, trfm);
    },
    Update: function() {
        for (var i = 0; i < this.dispObjs.length; i++) {
            this.dispObjs[i].model.UpdateModelViewControl(this.dispObjs[i].trfm);
        }
    }
};