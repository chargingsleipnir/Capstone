
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
        velocities: {
            models: []
        }
    };

    var dispActive = {
        worldAxes: false,
        orientAxes: false,
        shells: false,
        velocities: false,
        processingData: false
    };

    return {
        SetActive: function(isActive) {
            active = isActive;
        },
        GetActive: function() {
            return active;
        },
        ToDisplay: function(showWorldAxes, showObjOrient, showObjShells, showObjVel, showProcessData) {
            dispActive.worldAxes = showWorldAxes;

            dispActive.orientAxes = showObjOrient;
            for (var i = 0; i < dispObjs.orientAxes.models.length; i++)
                dispObjs.orientAxes.models[i].active = showObjOrient;

            dispActive.shells = showObjShells;
            for (var i = 0; i < dispObjs.shells.models.length; i++)
                dispObjs.shells.models[i].active = showObjShells;

            dispActive.velocities = showObjVel;
            for (var i = 0; i < dispObjs.velocities.models.length; i++)
                dispObjs.velocities.models[i].active = showObjVel;

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
        AddVelocity: function(model) {
            dispObjs.velocities.models.push(model);
        },
        GetDispObjs: {
            OrientAxes: function() {return dispObjs.orientAxes.models;},
            BoundingShells: function() {return dispObjs.shells.models;}
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
                if(dispActive.velocities) {
                    for (var i = 0; i < dispObjs.velocities.models.length; i++) {
                        /*
                         var newVertData = [];
                         var zeroVec = new Vector3();
                         newVertData = newVertData.concat(zeroVec.GetData());
                         newVertData = newVertData.concat(this.trfmLocal.dirRight.GetData());
                         newVertData = newVertData.concat(zeroVec.GetData());
                         newVertData = newVertData.concat(this.trfmLocal.dirUp.GetData());
                         newVertData = newVertData.concat(zeroVec.GetData());
                         newVertData = newVertData.concat(this.trfmLocal.dirFwd.GetData());
                         newVertData = newVertData.concat(this.dirDisplay.model.vertData.colElems);
                         this.dirDisplay.model.RewriteVerts(newVertData);
                         */
                    }
                }
            }
        }
    }
})();