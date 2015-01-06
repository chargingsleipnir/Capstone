
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
    },
    Initialize: function() {
        if(this.active) {
            var performanceData = new GUISystem(new WndRect(ViewMngr.wndWidth - 220, 20, 200, 100), "Performance Data");

            var style = new MsgBoxStyle();
            style.fontSize = 20;
            style.fontColour = new Vector3(1.0, 1.0, 1.0);
            style.textMaxWidth = 0;
            style.textAlignWidth = Alignment.left;
            style.textAlignHeight = Alignment.top;
            style.bgTexture = null;
            style.bgColour = new Vector3(0.0, 0.0, 0.0);
            style.textLineSpacing = 0.0;
            style.margin = 5.0;
            style.bgAlpha = 0.25;
            style.bold = false;
            this.frameRateMsg = new GUIObject(new WndRect(0, 0, 200, 30), "FrameRt", style);
            performanceData.AddGUIObject(this.frameRateMsg);

            GUINetwork.AddSystem(performanceData, true);
        }
    },
    frameRateMsg: null,
    frameRateCapture: 0,
    counter: 0,
    Update: function() {
        if(this.active) {
            this.counter += Time.deltaMilli;
            if (this.counter > 0.5) {
                this.counter = 0.0;
                this.frameRateCapture = Time.fps;
            }
            this.frameRateMsg.UpdateMsg("FPS: " + this.frameRateCapture.toString());
        }
    }
};

function DebugHandler() {
    this.dispObjs = {
        orientAxes: {
            models: []
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
    AddOrientAxes: function(model) {
        this.dispObjs.orientAxes.models.push(model);
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
                    this.dispObjs.orientAxes.models[i].Update();
            }
            if(DebugMngr.dispShells) {
                for (var i = 0; i < this.dispObjs.shells.models.length; i++) {
                    this.dispObjs.shells.models[i].trfm.SetPosVec3(this.dispObjs.shells.trfms[i].pos);
                    if(this.dispObjs.shells.shapes[i] == BoundingShapes.sphere) {
                        var radius = this.dispObjs.shells.trfms[i].GetLargestScaleValue();
                        this.dispObjs.shells.models[i].trfm.SetScaleAxes(radius, radius, radius);
                    }
                    this.dispObjs.shells.models[i].trfm.IsChanging();
                    this.dispObjs.shells.models[i].Update();
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