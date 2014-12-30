
var DebugMngr = {
    active: false,
    dispOrientAxes: false,
    dispShells: false,
    dispRays: false,
    SetFullActive: function(active) {
        if(active)
            this.active = this.dispOrientAxes = this.dispShells = this.dispRays = true;
        else
            this.active = this.dispOrientAxes = this.dispShells = this.dispRays = false;
    }
};

function DebugHandler() {
    this.dispObjs = {
        orientAxes: {
            models: [],
            trfms: []
        },
        // objDirAxes ??
        shells: {
            models: [],
            trfms: [],
            shapes: []
        },
        rayCasts: {
            rays: [],
            pos: [],
            slopes: []
        }
    };
}
DebugHandler.prototype =  {
    AddOrientAxes: function(model, trfm) {
        this.dispObjs.orientAxes.models.push(model);
        this.dispObjs.orientAxes.trfms.push(trfm);
    },
    ReplaceOrientModel: function(newModel, refTrfm) {
        var index = this.dispObjs.orientAxes.trfms.indexOf(refTrfm);
        this.dispObjs.orientAxes.models[index] = newModel;
    },
    AddBoundingShell: function(model, trfm, shape) {
        this.dispObjs.shells.models.push(model);
        this.dispObjs.shells.trfms.push(trfm);
        this.dispObjs.shells.shapes.push(shape);
    },
    AddRayCast: function(ray, pos, slope) {
        this.dispObjs.rayCasts.rays.push(ray);
        this.dispObjs.rayCasts.pos.push(pos);
        this.dispObjs.rayCasts.slopes.push(slope);
    },
    Update: function () {
        if(DebugMngr.active) {
            if(DebugMngr.dispOrientAxes) {
                for (var i = 0; i < this.dispObjs.orientAxes.models.length; i++)
                    this.dispObjs.orientAxes.models[i].UpdateModelViewControl(this.dispObjs.orientAxes.trfms[i]);
            }
            if(DebugMngr.dispShells) {
                for (var i = 0; i < this.dispObjs.shells.models.length; i++) {
                    if(this.dispObjs.shells.shapes[i] == BoundingShapes.sphere) {
                        var radius = this.dispObjs.shells.trfms[i].GetLargestScaleValue();
                        this.dispObjs.shells.trfms[i].scale.SetValues(radius, radius, radius);
                    }

                    this.dispObjs.shells.models[i].UpdateModelViewControl(this.dispObjs.shells.trfms[i]);
                }
            }
            if(DebugMngr.dispRays) {
                for (var i = 0; i < this.dispObjs.rayCasts.rays.length; i++) {
                    var newVertData = this.dispObjs.rayCasts.pos[i].GetData();
                    newVertData = newVertData.concat(this.dispObjs.rayCasts.pos[i].GetAdd(this.dispObjs.rayCasts.slopes[i]).GetData());
                    this.dispObjs.rayCasts.rays[i].RewriteVerts(newVertData);
                }
            }
        }
    }
};