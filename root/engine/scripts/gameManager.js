
var GameMngr = {
    assets: {
        textures: {},
        models: {}
    },
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
        TwoD.Initialize(canvas2D.getContext('2d'));
    },
    LoadExternal: function(textureNamesFilepaths, modelNamesFilepaths, Callback) {
        var that = this;
        function LoadModels() {
            FileUtils.LoadModels(modelNamesFilepaths, that.assets.models, Callback);
        }
        FileUtils.LoadTextures(textureNamesFilepaths, this.assets.textures, LoadModels);
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

            // Updating Game World and Draw Calls
            SceneMngr.Update();
            ParticleForceRegistry.Update();
            CollisionNetwork.Update();
            that.UserUpdate();
            GL.RenderScene();
        }
        LoopGame();
    }
};