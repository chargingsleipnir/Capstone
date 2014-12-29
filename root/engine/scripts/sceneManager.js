/**
 * Created by Devin on 2014-12-29.
 */

/********** Scenes to be added to the Network ************/

function Scene(name) {
    /// <signature>
    ///  <summary>Create a scene of models, lighting, etc</summary>
    ///  <param name="name" type="string">Scene identifier</param>
    /// </signature>
    this.name = name;
    this.paused = false;

    this.rootObj;
    //this.rootObj = new GameObject("Root", Labels.none);
    //this.rootObj.AddComponent(Components.camera);
    //this.rootObj.camera.SetControlsActive(true);

    this.models = [];

    this.lighting = {
        amb: {
            int: 0.0
        },
        dir: {
            int: 0.0,
            dir: new Vector3(1.0, -1.0, 0.0)
        },
        pnt: {
            int: 0.0,
            pos: new Vector3(0.0, 0.5, -0.5)
        }
    };

    this.InitCall = function() {};
    this.LoopCall = function() {};
}
Scene.prototype = {
    AddToRoot: function(gameObject) {
        /// <signature>
        ///  <summary>Add game objects or root objects, to be a child of the root object of this system</summary>
        ///  <param name="gameObject" type="GameObject"></param>
        /// </signature>
        this.rootObj.AddChild(gameObject);
    },
    Render: function(modelHandler) {
        /// <signature>
        ///  <summary>Add model handle to render model as part of this scene</summary>
        ///  <param name="modelHandler" type="ModelHandler"></param>
        /// </signature>
        this.models.push(modelHandler);
    },
    SetCallbacks: function(InitCallback, LoopCallback) {
        this.InitCall = InitCallback;
        this.LoopCall = LoopCallback;
    },
    Update: function() {
        if(!this.paused) {
            this.rootObj.Update(this.rootObj.trfmLocal);
            this.LoopCall();
        }
    }
};

/********** Network that controls which scene to update and draw ************/

var SceneNetwork = (function() {

    var scenes = {};

    return {
        activeScene: new Scene("null scene"),
        AddScene: function(scene, setActive) {
            scenes[scene.name] = scene;
            if(setActive) {
                this.activeScene = scene;
                this.activeScene.InitCall();
            }
        },
        RemoveScene: function(sceneName) {
            if (sceneName in scenes)
                delete scenes[sceneName];
            else
                throw ("No scene by that name to remove");
        },
        SetActive: function(sceneName) {
            if (this.activeScene.name == sceneName) {
                throw(sceneName + " is already active.");
            }
            else if (sceneName in scenes) {
                this.activeScene = scenes[sceneName];
                console.log("Switched scene to: " + sceneName);
                this.activeScene.InitCall();
            }
            else
                throw ("No scene by that name to make active");
        },
        GetActiveScene: function() {
            return this.activeScene;
        },
        ListScenes: function() {
            for (var scene in scenes)
                console.log('Scene: ' + scene + ' : ' + scenes[scene]);
        },
        BeginLoop: function() {
            var time_LastFrame;
            function LoopGame() {
                requestAnimationFrame(LoopGame);
                var time_ThisFrame = new Date().getTime();
                var time_Delta = time_ThisFrame - (time_LastFrame || time_ThisFrame);
                time_LastFrame = time_ThisFrame;
                Time.delta_Milli = time_Delta / 1000;
                Time.fps = 1000 / time_Delta;

                // Updating Game World and Draw Calls
                this.activeScene.Update();
                CollisionNetwork.Update();
                DM.Update();
                GL.RenderScene();
            }
            LoopGame();
        }
    }
})();