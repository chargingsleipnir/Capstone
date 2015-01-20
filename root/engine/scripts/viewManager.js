/**
 * Created by Devin on 2014-12-29.
 */

var ViewMngr = {
    wndWidth: 0,
    wndHeight: 0,
    offsetLeft: 0,
    offsetTop: 0,
    mtxProj: new Matrix4(),
    activeCam: null,
    frustum: null,
    farCullDist: 200.0,
    Initialize: function(canvas) {
        // Get and use GL canvas window sizing
        var canvasStyles = window.getComputedStyle(canvas, null);
        this.wndWidth = parseFloat(canvasStyles.width);
        this.wndHeight = parseFloat(canvasStyles.height);
        this.offsetLeft = canvas.offsetLeft;
        this.offsetTop = canvas.offsetTop;

        // Instantiate frustum and projection matrix together
        this.frustum = new Frustum(this.mtxProj, 45.0, this.wndWidth / this.wndHeight, 0.1, this.farCullDist);

        this.camera = new Camera();
        this.camera.SetFreeControls("Initial Camera Controller", true);
        this.activeCam = this.camera;
        this.SetActiveCamera(this.camera);

        GL.ReshapeWindow(this.wndWidth, this.wndHeight);
    },
    SetActiveCamera: function(camera) {
        this.activeCam.active = false;
        if(camera) {
            camera.active = true;
            this.activeCam = camera;
        }
        else {
            this.camera.active = true;
            this.activeCam = this.camera;
        }
        this.activeCam.trfmAxes.active = true;
    },
    Update: function() {
        this.activeCam.Update();
    }
};