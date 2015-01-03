/**
 * Created by Devin on 2014-12-29.
 */

function BuildScene4(scene) {

    scene.rootObj.AddComponent(Components.camera);
    scene.rootObj.camera.SetControlsActive(scene.name, true);

    scene.light.amb.bright = 0.25;
    scene.light.dir.bright = 0.0;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);
    scene.light.pnt.bright = 0.5;
    scene.light.pnt.pos.SetValues(0.0, 1.0, 3.0);

    // Testing with shader creation on the fly

    var circleObj = new GameObject('Basic circle', Labels.testObject);
    circleObj.SetModel(new Primitives.Circle(1.0, 30));
    circleObj.trfmLocal.SetPosAxes(-8.0, 0.0, -5.0);

    var heartObj = new GameObject('heart', Labels.testObject);
    heartObj.SetModel(Primitives.heart);
    heartObj.trfmLocal.SetPosAxes(-5.0, 0.0, -5.0);

    var texOnlyObj = new GameObject('textured rect', Labels.testObject);
    texOnlyObj.SetModel(Primitives.RectTextured(new Vector2(1.0, 1.0)));
    texOnlyObj.mdlHdlr.SetTexture(EL.assets.textures['questionBlock'], TextureFilters.linear);
    texOnlyObj.trfmLocal.SetPosAxes(-2.0, 0.0, -5.0);

    var colTexObj = new GameObject('coloured and textured cube', Labels.testObject);
    colTexObj.SetModel(EL.assets.models['dimensionBox']);
    colTexObj.mdlHdlr.SetTexture(EL.assets.textures['logo'], TextureFilters.linear);
    colTexObj.trfmLocal.SetPosAxes(2.0, 0.0, -5.0);

    var litObj = new GameObject('lit cube', Labels.testObject);
    litObj.SetModel(EL.assets.models['litUpCube']);
    litObj.mdlHdlr.tint.SetValues(1.0, 1.0, 1.0);
    litObj.trfmLocal.SetPosAxes(5.0, 0.0, -5.0);

    var floor = new GameObject('floor', Labels.none);
    floor.SetModel(GameMngr.assets.models['floor']);
    floor.mdlHdlr.tint.SetValues(1.0, 1.0, 1.0);
    floor.trfmLocal.SetPosAxes(0.0, -1.5, 0.0);

    // End testing

    var lightTestScene = "LightTestScene";
    Input.RegisterControlScheme(lightTestScene, false);
    var nextScene = Input.CreateInputController(lightTestScene, KeyMap.Enter);

    function Start() {
        Input.SetActive(lightTestScene, true);
        ViewMngr.SetActiveCamera(scene.rootObj.camera);
        ViewMngr.activeCam.trfm.SetPosAxes(0.0, 0.0, 7.5);
        DebugMngr.SetFullActive(false);
    }

    var angle = 1;
    function Update() {
        if(nextScene.pressed){
            nextScene.Release();
            SceneMngr.SetActive("Title Screen");
        }

        angle += 0.25;
        if(angle > 360.0)
            angle = 0.0;

        litObj.trfmLocal.Rotate(VEC3_UP, 1.0);
        scene.light.pnt.pos.SetValues(Math.sin(angle * DEG_TO_RAD) * 10.0, 2.0, -5.0 + Math.cos(angle * DEG_TO_RAD) * 10.0);
    }

    function End() {
        DebugMngr.SetFullActive(true);

        ViewMngr.activeCam.ToDefaultOrientation();
        Input.SetActive(lightTestScene, false);
    }

    scene.Add(circleObj);
    scene.Add(heartObj);
    scene.Add(texOnlyObj);
    scene.Add(colTexObj);
    scene.Add(litObj);
    scene.Add(floor);
    scene.SetCallbacks(Start, Update, End);
}