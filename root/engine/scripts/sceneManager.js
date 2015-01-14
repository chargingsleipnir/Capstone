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

    this.rootObj = new GameObject("Root", Labels.none);

    this.debug = new DebugHandler();
    this.models = [];
    this.ptclSystems = [];

    this.collisionNetwork = new CollisionNetwork();

    this.light = {
        amb: {
            bright: 0.0
        },
        dir: {
            bright: 0.0,
            dir: new Vector3(1.0, -1.0, 0.0)
        },
        pnt: {
            bright: 0.0,
            pos: new Vector3(0.0, 0.5, -0.5)
        }
    };

    this.InitCall = function() {};
    this.LoopCall = function() {};
    this.ExitCall = function() {};
}
Scene.prototype = {
    Add: function(gameObject) {
        /// <signature>
        ///  <summary>Add model handle to render model as part of this scene</summary>
        ///  <param name="gameObject" type="GameObject"></param>
        /// </signature>
        if(!gameObject.parent || gameObject.parent.name == "Root")
            this.rootObj.AddChild(gameObject);
        if(gameObject.mdlHdlr)
            this.models.push(gameObject.mdlHdlr);
        if(gameObject.collider)
            this.collisionNetwork.AddBody(gameObject.collider);
        if(gameObject.ptclSys)
            this.ptclSystems.push(gameObject.ptclSys);

        if(DebugMngr.active) {
            var axesLengths = gameObject.shape.radii.GetScaleByVec(gameObject.trfmGlobal.scale.SetScaleByNum(1.25));
            this.debug.AddOrientAxes(new ModelHandler(new Primitives.OrientAxes(axesLengths), gameObject.trfmGlobal, gameObject.shape));

            if(gameObject.collider) {
                var sphereShell = new ModelHandler(new Primitives.IcoSphere(2, gameObject.collider.sphere.radius), new Transform(Space.global), gameObject.collider.shapeData);
                //var aabbShell = new ModelHandler(new Primitives.Cube(this.aabb.radii, false), this.shapeData);
                sphereShell.MakeWireFrame();
                sphereShell.SetTintRGB(1.0, 1.0, 0.0);
                this.debug.AddBoundingShell(sphereShell, gameObject.collider.trfm, BoundingShapes.sphere);
            }
            if(gameObject.rigidBody) {
                this.debug.AddRayCast(new RayCastHandler(new Primitives.Ray()), gameObject.rigidBody.trfm.pos, gameObject.rigidBody.velFinal);
            }
        }
    },
    SetCallbacks: function(InitCallback, LoopCallback, ExitCallback) {
        this.InitCall = InitCallback;
        this.LoopCall = LoopCallback;
        this.ExitCall = ExitCallback;
    },
    Update: function() {
        this.rootObj.Update(this.rootObj.trfmLocal);
        this.debug.Update();
        this.LoopCall();

        this.collisionNetwork.Update();
    }
};

/********** Network that controls which scene to update and draw ************/

var SceneMngr = (function() {

    var scenes = {};
    var activeScene = new Scene("null scene");

    return {
        AddScene: function(scene, setActive) {
            scenes[scene.name] = scene;
            if(setActive) {
                activeScene.ExitCall();
                activeScene = scene;
                activeScene.InitCall();
            }
        },
        RemoveScene: function(sceneName) {
            if (sceneName in scenes)
                delete scenes[sceneName];
            else
                throw ("No scene by that name to remove");
        },
        SetActive: function(sceneName) {
            if (activeScene.name == sceneName) {
                throw(sceneName + " is already active.");
            }
            else if (sceneName in scenes) {
                activeScene.ExitCall();
                activeScene = scenes[sceneName];
                console.log("Switched scene to: " + sceneName);
                activeScene.InitCall();
            }
            else
                throw ("No scene by that name to make active");
        },
        GetActiveScene: function() {
            return activeScene;
        },
        ListScenes: function() {
            for (var scene in scenes)
                console.log('Scene: ' + scene + ' : ' + scenes[scene]);
        },
        Update: function() {
            activeScene.Update();
        }
    }
})();