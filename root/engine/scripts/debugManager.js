
var DM = {
    dispObjs: [],
    ShowWorldAxes: false,
    ShowTransformAxes: false,
    ShowBoundingShells: false,
    ShowVelocities: false,
    PrintProcessingData: false,
    Update: function() {
        for (var i = 0; i < this.dispObjs.length; i++) {
            if(this.dispObjs[i].model.active)
                this.dispObjs[i].model.UpdateModelViewControl(this.dispObjs[i].trfm);
        }
    }
};