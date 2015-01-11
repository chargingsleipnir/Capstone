/**
 * Created by Devin on 2015-01-03.
 */

function BuildScene5(scene) {

    scene.rootObj.AddComponent(Components.camera);
    scene.rootObj.camera.SetControlsActive(scene.name, true);


    //////////////////////////////////


    var ptclObj1 = new GameObject('Particle Object 1', Labels.testObject);
    ptclObj1.AddComponent(Components.particleSystem);
    ptclObj1.trfmLocal.SetPosAxes(0.0, 0.0, 0.0);

    var effects = new PtclFieldEffects();
    effects.travelTime = 7.0;
    effects.staggerRate = 0.1;
    effects.startDist = 0.0;
    effects.dir = new Vector3(0.0, 1.0, 0.0);
    effects.range = 60.0;
    effects.speed = 5.0;
    effects.acc = new Vector3(0.0, -2.0, 0.0);
    effects.dampening = 0.75;
    effects.colourBtm = new Vector3(0.5, 0.5, 0.5);
    effects.colourTop = new Vector3(1.0, 1.0, 1.0);
    effects.lineLength = 0.0;
    effects.alphaStart = 1.0;
    effects.alphaEnd = 1.0;
    effects.size = 10.0;

    ptclObj1.ptclSys.AddSimpleField(150, 30.0, effects);

    effects.travelTime = 7.0;
    effects.staggerRate = 0.1;
    effects.startDist = 5.0;
    effects.dir = new Vector3(-1.0, 1.0, -1.0);
    effects.range = 5.0;
    effects.speed = 10.0;
    effects.acc = new Vector3(4.0, -2.0, 2.0);
    effects.dampening = 1.0;
    effects.colourBtm = new Vector3(1.0, 1.0, 0.0);
    effects.colourTop = new Vector3(1.0, 1.0, 1.0);
    effects.lineLength = 0.3;
    effects.alphaStart = 1.0;
    effects.alphaEnd = 1.0;
    effects.size = 0.0;

    ptclObj1.ptclSys.AddSimpleField(150, 30.0, effects);


    //////////////////////////////////


    var ptclObj2 = new GameObject('Particle Object 2', Labels.testObject);
    ptclObj2.SetModel(Primitives.arrow);
    ptclObj2.AddComponent(Components.particleSystem);

    var tailEffects = new FlatTailEffects();
    tailEffects.colour = new Vector3(1.0, 1.0, 0.0);
    tailEffects.thickness = 0.3;
    tailEffects.axis = Axes.y;
    tailEffects.alphaStart = 1.0;
    tailEffects.alphaEnd = 1.0;

    ptclObj2.ptclSys.AddTail(101, 30, tailEffects);


    //////////////////////////////////


    var ptclObj3 = new GameObject('Particle Object 3', Labels.testObject);
    ptclObj3.trfmLocal.SetPosAxes(0.0, 10.0, 0.0);
    ptclObj3.SetModel(new Primitives.IcoSphere(2, 3));
    ptclObj3.mdlHdlr.SetTexture(EL.assets.textures['ice'], TextureFilters.linear);
    ptclObj3.AddComponent(Components.particleSystem);

    effects.travelTime = 7.0;
    effects.staggerRate = 0.1;
    effects.startDist = 5.0;
    effects.dir = new Vector3(1.0, 1.0, -1.0);
    effects.range = 360.0;
    effects.speed = 1.0;
    effects.acc = new Vector3(0.0, 1.0, 0.0);
    effects.dampening = 1.0;
    effects.colourBtm = new Vector3(1.0, 0.0, 0.0);
    effects.colourTop = new Vector3(1.0, 1.0, 1.0);
    effects.lineLength = 0.0;
    effects.alphaStart = 1.0;
    effects.alphaEnd = 1.0;
    effects.texture = EL.assets.textures['star'];
    effects.size = 64.0;

    ptclObj3.ptclSys.AddSimpleField(100, 30, effects);


    //////////////////////////////////


    var ctrlName = "ParticleTestScene";
    Input.RegisterControlScheme(ctrlName, false);
    var nextScene = Input.CreateInputController(ctrlName, KeyMap.Enter);
    var fireStream = Input.CreateInputController(ctrlName, KeyMap.Z);
    var fireGatling = Input.CreateInputController(ctrlName, KeyMap.X);
    var leaveTrail = Input.CreateInputController(ctrlName, KeyMap.C);
    var fireStars = Input.CreateInputController(ctrlName, KeyMap.V);

    function Start() {
        Input.SetActive(ctrlName, true);
        ViewMngr.SetActiveCamera(scene.rootObj.camera);
        ViewMngr.activeCam.trfmAxes.SetPosAxes(0.0, 0.0, 7.5);

        ptclObj2.trfmLocal.Rotate(VEC3_FWD, 90);
    }

    var angle = 1;
    function Update() {
        if(nextScene.pressed){
            nextScene.Release();
            SceneMngr.SetActive("Title Screen");
        }
        if(fireStream.pressed) {
            ptclObj1.ptclSys.RunField(0);
            fireStream.Release();
        }
        if(fireGatling.pressed) {
            ptclObj1.ptclSys.RunField(1);
            fireGatling.Release();
        }
        if(leaveTrail.pressed) {
            ptclObj2.ptclSys.RunTail(0);
            leaveTrail.Release();
        }
        if(fireStars.pressed) {
            ptclObj3.ptclSys.RunField(0);
            fireStars.Release();
        }

        angle += 0.25;
        if(angle > 360.0)
            angle = 0.0;

        ptclObj2.trfmLocal.Rotate(VEC3_RIGHT, -0.25);
        ptclObj2.trfmLocal.SetPosAxes(Math.sin(angle * DEG_TO_RAD) * 10.0, 3.0, Math.cos(angle * DEG_TO_RAD) * 10.0);
    }

    function End() {
        DebugMngr.SetFullActive(true);
        ViewMngr.activeCam.ToDefaultOrientation();
        Input.SetActive(ctrlName, false);
    }

    scene.Add(ptclObj1);
    scene.Add(ptclObj2);
    scene.Add(ptclObj3);
    scene.SetCallbacks(Start, Update, End);
}