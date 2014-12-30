/**
 * Created by Devin on 2014-12-29.
 */

var ViewMngr = {
    wndWidth: 0,
    wndHeight: 0,
    mtxProj: new Matrix4(),
    activeCam: null,
    frustum: null,
    Initialize: function(canvas) {
        // Get and use GL canvas window sizing
        var canvasStyles = window.getComputedStyle(canvas, null);
        this.wndWidth = parseFloat(canvasStyles.width);
        this.wndHeight = parseFloat(canvasStyles.height);

        // Instantiate frustum and projection matrix together
        this.frustum = new Frustum(this.mtxProj, 45.0, this.wndWidth / this.wndHeight, 0.1, 200.0);
        this.activeCam = new Camera(new Transform(Space.local), true);

        GL.ReshapeWindow(this.wndWidth, this.wndHeight);
    },
    SetActiveCamera: function(camera) {
        if(this.activeCam) {
            this.activeCam.active = false;
        }

        camera.active = true;
        this.activeCam = camera;
    },
    Update: function() {
        this.activeCam.Update();
    }
};