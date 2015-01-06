/**
 * Created by Devin on 2015-01-03.
 */

function BuildScene5(scene) {

    scene.rootObj.AddComponent(Components.camera);
    scene.rootObj.camera.SetControlsActive(scene.name, true);


    var effects = new PtclEffects();
    effects.travelTime = 7.0;
    effects.staggerRate = 0.1;
    effects.startDist = 0.0;
    effects.dir = new Vector3(0.0, 1.0, 0.0);
    effects.range = 60.0;
    effects.speed = 5.0;
    effects.acc = new Vector3(0.0, -2.0, 0.0);
    effects.dampening = 1.0;
    effects.colourBtm = new Vector3(0.0, 1.0, 0.5);
    effects.colourTop = new Vector3(1.0, 1.0, 1.0);
    effects.alphaStart = 1.0;
    effects.alphaEnd = 1.0;

    var simplePtField = new ParticlePointField(100, 30.0, effects);

    var ptclObj1 = new GameObject('Particle Object 1', Labels.testObject);
    ptclObj1.AddComponent(Components.particleSystem);
    ptclObj1.trfmLocal.SetPosAxes(1.0, 1.0, 0.0);
    ptclObj1.ptclSys.AddField(simplePtField, "Point Sphere");



    var ctrlName = "ParticleTestScene";
    Input.RegisterControlScheme(ctrlName, false);
    var nextScene = Input.CreateInputController(ctrlName, KeyMap.Enter);

    function Start() {
        Input.SetActive(ctrlName, true);
        ViewMngr.SetActiveCamera(scene.rootObj.camera);
        ViewMngr.activeCam.trfmAxes.SetPosAxes(0.0, 0.0, 7.5);

        ptclObj1.ptclSys.RunField("Point Sphere");
    }

    var angle = 1;
    function Update() {
        if(nextScene.pressed){
            nextScene.Release();
            SceneMngr.SetActive("Title Screen");
        }
    }

    function End() {
        DebugMngr.SetFullActive(true);
        ViewMngr.activeCam.ToDefaultOrientation();
        Input.SetActive(ctrlName, false);
    }

    scene.Add(ptclObj1);
    scene.SetCallbacks(Start, Update, End);
}