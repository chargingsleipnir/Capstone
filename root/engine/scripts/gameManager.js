
var GameMngr = {
    assets: {
        textures: {},
        models: {},
        sounds: {}
    },
    paused: false,
    UserUpdate: function() {},
    Initialize: function(canvasWebGL, canvas2D) {
        /// <signature>
        ///  <summary>Start up of the game world</summary>
        ///  <param name="canvas" type="element">the game window</param>
        /// </signature>
        console.log("GAME STARTUP");

        // get webGL context
        GL.Initialize(canvasWebGL.getContext('webgl'));
        ViewMngr.Initialize(canvasWebGL);
        Input.GetCanvas(canvasWebGL);
        TwoD.Initialize(canvas2D.getContext('2d'));
        DebugMngr.Initialize();
    },
    LoadExternal: function(textureNamesFilepaths, modelNamesFilepaths, audioNamesFilepaths, Callback) {
        var that = this;
        function LoadModels() {
            FileUtils.LoadModels(modelNamesFilepaths, that.assets.models, Callback);
        }

        // Load up audio quick and easy first
        for(var i = 0; i < audioNamesFilepaths.length; i++) {
            this.assets.sounds[audioNamesFilepaths[i][0]] = new Audio(audioNamesFilepaths[i][1]);
        }

        FileUtils.LoadTextures(textureNamesFilepaths, this.assets.textures, LoadModels);
    },
    TogglePause: function() {
        this.paused = !this.paused;
    },
    BeginLoop: function() {
        var time_LastFrame;
        var that = this;
        function LoopGame() {
            requestAnimationFrame(LoopGame);
            var time_ThisFrame = new Date().getTime();
            var time_Delta = time_ThisFrame - (time_LastFrame || time_ThisFrame);
            time_LastFrame = time_ThisFrame;
            Time.deltaMilli = time_Delta / 1000;
            Time.fps = 1000 / time_Delta;

            if(!that.paused) {
                Time.counter += Time.deltaMilli;
                // Updating Game World and Draw Calls
                SceneMngr.Update();
                DebugMngr.Update();

            }
            that.UserUpdate();
            GL.RenderScene();
        }
        LoopGame();
    }
};