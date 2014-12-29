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
    this.models = [];
    this.paused = false;
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
    }
}
Scene.prototype = {
    AddGameObject: function(gameObj) {
        /// <signature>
        ///  <summary>Add game objects or root objects, to be a part of this systems. Objects are updated and their visuals prepared when added</summary>
        ///  <param name="gameObj" type="GameObject"></param>
        /// </signature>
        this.models.push(gameObj.mdlHdlr);
    },
    Update: function() {
        if(!this.paused) {

            // update gameObjects...?


        }
    }
};

/********** Network that controls which scene to update and draw ************/

var SceneNetwork = (function() {

    var scenes = {};

    return {
        activeScene: new Scene("null scene"),
        AddScene: function(scene, setActive) {
            if(setActive) {
                this.activeScene = scene;
            }
            else
                scenes[scene.name] = scene;
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
            }
            else
                throw ("No scene by that name to make active");
        },
        GetActiveScenes: function() {
            return this.activeScene;
        },
        ListScenes: function() {
            for (var scene in scenes)
                console.log('Scene: ' + scene + ' : ' + scenes[scene]);
        },
        Update: function() {
            this.activeScene.Update();
        }
    }
})();