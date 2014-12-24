
var DM = (function() {

    var active;

    var dispObjs = {
        worldAxes: null,
        objOrientAxes: [],
        // objDirAxes ??
        objBoundingShells: [],
        objVelocities: []
    };

    var dispActive = {
        worldAxes: false,
        objOrientAxes: false,
        objBoundingShells: false,
        objVelocities: false,
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

            dispActive.objOrientAxes = showObjOrient;
            for (var i = 0; i < dispObjs.objOrientAxes.length; i++)
                dispObjs.objOrientAxes[i].model.active = showObjOrient;

            dispActive.objBoundingShells = showObjShells;
            for (var i = 0; i < dispObjs.objBoundingShells.length; i++)
                dispObjs.objBoundingShells[i].model.active = showObjShells;

            dispActive.objVelocities = showObjVel;
            for (var i = 0; i < dispObjs.objVelocities.length; i++)
                dispObjs.objVelocities[i].model.active = showObjVel;

            dispActive.processingData = showProcessData;
        },
        AddOrientAxes: function(model, trfm) {
            // Will this switch automatically by reference?
            model.active = dispActive.objOrientAxes;
            dispObjs.objOrientAxes.push(new DebugDispObj(model, trfm));
        },
        AddBoundingShell: function(model, trfm) {
            // Will this switch automatically by reference?
            model.active = dispActive.objBoundingShells;
            dispObjs.objBoundingShells.push(new DebugDispObj(model, trfm));
        },
        GetDispObjs: {
            OrientAxes: function() {return dispObjs.objOrientAxes;},
            BoundingShells: function() {return dispObjs.objBoundingShells;}
        },
        Update: function () {
            if(active) {
                if(dispActive.objOrientAxes) {
                    for (var i = 0; i < dispObjs.objOrientAxes.length; i++)
                        dispObjs.objOrientAxes[i].model.UpdateModelViewControl(dispObjs.objOrientAxes[i].trfm);
                }
                if(dispActive.objBoundingShells) {
                    for (var i = 0; i < dispObjs.objBoundingShells.length; i++)
                        dispObjs.objBoundingShells[i].model.UpdateModelViewControl(dispObjs.objBoundingShells[i].trfm);
                }
            }
        }
    }
})();