
var GM = {
    wndWidth: 0,
    wndHeight: 0,
    assets: {
        textures: {},
        models: {}
    },
    LoopCall: function(){},
    activeCam: null,
    rootObj: new GameObject("Root", Labels.none),
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

        TwoD.Initialize(canvas2D.getContext('2d'));
        GUI.InitializeCanvas();

        // Get and use GL canvas window sizing
        var canvasStyles = window.getComputedStyle(canvasWebGL, null);
        this.wndWidth = parseFloat(canvasStyles.width);
        this.wndHeight = parseFloat(canvasStyles.height);

        // Set up initial camera
        var mainCam = new GameObject("Main Camera", Labels.camera);
        mainCam.AddScript(new FPController());
        this.activeCam = new Camera(mainCam, this.wndWidth, this.wndHeight);
        this.activeCam.RunGUI();

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
        this.activeCam.Update();
        CollisionNetwork.Update();
    },
    SetActiveCamera: function(camera) {
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