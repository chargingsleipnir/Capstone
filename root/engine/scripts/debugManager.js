
var DebugMngr = {
    active: false,
    dispOrientAxes: false,
    dispShells: false,
    dispRays: false,
    dispAxes: false,
    dispGrid: false,
    axes: null,
    grid: null,
    dispName: "Performance Data",
    SetFullActive: function(active) {
        if(active) this.active = this.dispOrientAxes = this.dispShells = this.dispRays = this.dispAxes = this.dispGrid = true;
        else this.active = this.dispOrientAxes = this.dispShells = this.dispRays = this.dispAxes = this.dispGrid = false;

        GUINetwork.SetActive(this.dispName, active);
    },
    Initialize: function() {
        if(this.active) {
            var zeroPointAxes = new GameObject('zeroPointAxes', Labels.productionEnvironment);
            zeroPointAxes.SetModel(Primitives.axesZeroPoints);
            this.axes = zeroPointAxes.mdlHdlr;

            var grid = new GameObject('grid', Labels.productionEnvironment);
            grid.trfmLocal.SetScaleAxes(10.0, 0.0, 10.0);
            grid.SetModel(Primitives.grid);
            grid.Update(grid.trfmGlobal);
            this.grid = grid.mdlHdlr;

            var performanceData = new GUISystem(new WndRect(ViewMngr.wndWidth - 320, 20, 300, 120), this.dispName);

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
            this.frameRateMsg = new GUIObject(new WndRect(0, 0, 300, 30), "FrameRt", style);
            this.mousePosMsg = new GUIObject(new WndRect(0, 30, 300, 30), "000000000000000000000", style);
            performanceData.AddGUIObject(this.frameRateMsg);
            performanceData.AddGUIObject(this.mousePosMsg);

            GUINetwork.AddSystem(performanceData, false);

            Input.RegisterControlScheme("GUIMouseTracking", true, InputTypes.mouse);
            this.mouse = Input.CreateInputController("GUIMouseTracking");
        }
    },
    frameRateMsg: null,
    frameRateCapture: 0,
    counter: 0,
    Update: function() {
        if(this.active) {
            if (this.frameRateMsg != null) {
                this.counter += Time.deltaMilli;
                if (this.counter > 0.25) {
                    this.counter = 0.0;
                    this.frameRateCapture = Time.fps;
                }
                this.frameRateMsg.UpdateMsg("FPS: " + this.frameRateCapture.toString());
                this.mousePosMsg.UpdateMsg("Mouse x: " + this.mouse.pos.x + ", y: " + this.mouse.pos.y);
            }
        }
    }
};

function DebugHandler() {
    this.dispObjs = {
        orientAxes: {
            models: []
        },
        shells: {
            models: []
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
    AddBoundingShell: function(model) {
        this.dispObjs.shells.models.push(model);
    },
    AddRayCast: function(ray, pos, slope) {
        this.dispObjs.rayCasts.rays.push(ray);
        this.dispObjs.rayCasts.pos.push(pos);
        this.dispObjs.rayCasts.slopes.push(slope);
    },
    Update: function () {
        if(DebugMngr.active) {
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