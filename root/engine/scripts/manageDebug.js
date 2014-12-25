
var DM = (function() {

    var active;

    var dispObjs = {
        worldAxes: null,
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

    var dispActive = {
        worldAxes: false,
        orientAxes: false,
        shells: false,
        rayCasts: false,
        processingData: false
    };

    return {
        SetActive: function(isActive) {
            active = isActive;
        },
        GetActive: function() {
            return active;
        },
        ToDisplay: function(showWorldAxes, showObjOrient, showObjShells, showRays, showProcessData) {
            dispActive.worldAxes = showWorldAxes;

            dispActive.orientAxes = showObjOrient;
            for (var i = 0; i < dispObjs.orientAxes.models.length; i++)
                dispObjs.orientAxes.models[i].active = showObjOrient;

            dispActive.shells = showObjShells;
            for (var i = 0; i < dispObjs.shells.models.length; i++)
                dispObjs.shells.models[i].active = showObjShells;

            dispActive.rayCasts = showRays;
            for (var i = 0; i < dispObjs.rayCasts.rays.length; i++)
                dispObjs.rayCasts.rays[i].active = showRays;

            dispActive.processingData = showProcessData;
        },
        AddOrientAxes: function(model, trfm) {
            model.active = dispActive.orientAxes;
            dispObjs.orientAxes.models.push(model);
            dispObjs.orientAxes.trfms.push(trfm);
        },
        ReplaceOrientModel: function(newModel, refTrfm) {
            newModel.active = dispActive.orientAxes;
            var index = dispObjs.orientAxes.trfms.indexOf(refTrfm);
            dispObjs.orientAxes.models[index] = newModel;
        },
        AddBoundingShell: function(model, trfm, shape) {
            model.active = dispActive.shells;
            dispObjs.shells.models.push(model);
            dispObjs.shells.trfms.push(trfm);
            dispObjs.shells.shapes.push(shape);
        },
        AddRayCast: function(ray, pos, slope) {
            dispObjs.rayCasts.rays.push(ray);
            dispObjs.rayCasts.pos.push(pos);
            dispObjs.rayCasts.slopes.push(slope);
        },
        GetDispObjs: {
            OrientAxes: function() {return dispObjs.orientAxes.models;},
            BoundingShells: function() {return dispObjs.shells.models;},
            RayCasts: function() {return dispObjs.rayCasts.rays;}
        },
        Update: function () {
            if(active) {
                if(dispActive.orientAxes) {
                    for (var i = 0; i < dispObjs.orientAxes.models.length; i++)
                        dispObjs.orientAxes.models[i].UpdateModelViewControl(dispObjs.orientAxes.trfms[i]);
                }
                if(dispActive.shells) {
                    for (var i = 0; i < dispObjs.shells.models.length; i++) {
                        if(dispObjs.shells.shapes[i] == BoundingShapes.sphere) {
                            var radius = dispObjs.shells.trfms[i].GetLargestScaleValue();
                            dispObjs.shells.trfms[i].scale.SetValues(radius, radius, radius);
                        }

                        dispObjs.shells.models[i].UpdateModelViewControl(dispObjs.shells.trfms[i]);
                    }
                }
                if(dispActive.rayCasts) {
                    for (var i = 0; i < dispObjs.rayCasts.rays.length; i++) {
                        var newVertData = dispObjs.rayCasts.pos[i].GetData();
                        newVertData = newVertData.concat(dispObjs.rayCasts.pos[i].GetAdd(dispObjs.rayCasts.slopes[i]).GetData());
                        dispObjs.rayCasts.rays[i].RewriteVerts(newVertData);
                    }
                }
            }
        }
    }
})();