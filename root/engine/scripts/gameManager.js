
var GM = {
    wndWidth: 0,
    wndHeight: 0,
    activeCam: null,
    rootObj: new GameObject("Root", Labels.none),
    models: [],
    Initialize: function(canvasWebGL, canvas2D) {
        /// <signature>
        ///  <summary>Start up of the game world</summary>
        ///  <param name="canvas" type="element">the game window</param>
        /// </signature>

        // get contexts
        GL.Initialize(canvasWebGL.getContext('webgl'));
        TwoD.Initialize(canvas2D.getContext('2d'));

        // Get and use GL canvas window sizing
        var canvasStyles = window.getComputedStyle(canvasWebGL, null);
        this.wndWidth = parseFloat(canvasStyles.width);
        this.wndHeight = parseFloat(canvasStyles.height);
        this.activeCam = new Camera(new Vector3(), GBL_FWD, GBL_UP, this.wndWidth, this.wndHeight)
        // Give it this one for now, but if I want to do anything serious with the 2D canvas
        this.activeCam.gui = new GUI(canvas2D);

        GL.ReshapeWindow(this.wndWidth, this.wndHeight);
    },
    Update: function() {
        this.rootObj.Update(this.rootObj.trfmLocal);
        this.activeCam.Update();
    }
}