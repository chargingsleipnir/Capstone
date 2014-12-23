
var GM = {
    wndWidth: 0,
    wndHeight: 0,
    assets: {
        textures: {},
        models: {}
    },
    LoopCall: function(){},
    activeCam: null,
    rootObj: null,
    models: [],
    Initialize: function(canvasWebGL, canvas2D) {
        /// <signature>
        ///  <summary>Start up of the game world</summary>
        ///  <param name="canvas" type="element">the game window</param>
        /// </signature>
        console.log("GAME STARTUP");

        // get webGL context - use it to create shader programs
        GL.Initialize(canvasWebGL.getContext('webgl'));
        GL.CreateShaderPrograms(EM.assets.shaderStrings, EM.assets.shaderPrograms);

        this.rootObj = new GameObject("Root", Labels.none);

        TwoD.Initialize(canvas2D.getContext('2d'));
        GUI.InitializeCanvas();

        // Get and use GL canvas window sizing
        var canvasStyles = window.getComputedStyle(canvasWebGL, null);
        this.wndWidth = parseFloat(canvasStyles.width);
        this.wndHeight = parseFloat(canvasStyles.height);

        // Set up initial camera
        this.rootObj.AddComponent(Components.camera);
        this.rootObj.camera.SetControlsActive(true);

        GL.ReshapeWindow(this.wndWidth, this.wndHeight);
    },
    LoadExternal: function(textureNamesFilepaths, modelNamesFilepaths, Callback) {
        var that = this;
        function LoadModels() {
            FileUtils.LoadModels(modelNamesFilepaths, that.assets.models, Callback);
        }
        FileUtils.LoadTextures(textureNamesFilepaths, this.assets.textures, LoadModels);
    },
    Update: function() {
        this.rootObj.Update(this.rootObj.trfmLocal);
        CollisionNetwork.Update();
        if(DEBUG)
            DM.Update();
    },
    SetActiveCamera: function(camera) {
        if(this.activeCam)
            this.activeCam.active = false;

        camera.active = true;
        this.activeCam = camera;
    },
    SetLoopCallback: function(Callback) {
        this.LoopCall = Callback;
    },
    BeginLoop: function() {
        var time_LastFrame;
        var that = this;
        function LoopGame() {
            requestAnimationFrame(LoopGame);
            var time_ThisFrame = new Date().getTime();
            var time_Delta = time_ThisFrame - (time_LastFrame || time_ThisFrame);
            time_LastFrame = time_ThisFrame;
            Time.delta_Milli = time_Delta / 1000;
            Time.fps = 1000 / time_Delta;
            that.LoopCall(Time.delta_Milli);
            // Updating Game World and Draw Calls
            that.Update();
            GL.RenderScene();
        }
        LoopGame();
    }
};