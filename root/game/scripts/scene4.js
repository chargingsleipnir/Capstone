/**
 * Created by Devin on 2014-12-29.
 */

function BuildScene4(scene) {

    scene.rootObj.AddComponent(Components.camera);
    scene.rootObj.camera.SetControlsActive(scene.name, true);

    var circle = new Primitives.Circle(1.0, 30);
    var circleVerts = ModelUtils.SelectVAOData(circle.vertices);
    ModelUtils.BuildShaderStrings(circleVerts, circle.materials, true);


    var lightTestScene = "LightTestScene";
    Input.RegisterControlScheme(lightTestScene, false);
    var nextScene = Input.CreateInputController(lightTestScene, KeyMap.Enter);

    function Start() {
        Input.SetActive(lightTestScene, true);
        ViewMngr.SetActiveCamera(scene.rootObj.camera);
        DebugMngr.SetFullActive(false);
    }

    function Update() {
        if(nextScene.pressed){
            nextScene.Release();
            SceneMngr.SetActive("Title Screen");
        }
    }

    function End() {
        DebugMngr.SetFullActive(true);

        ViewMngr.activeCam.ToDefaultOrientation();
        Input.SetActive(lightTestScene, false);
    }


    scene.SetCallbacks(Start, Update, End);
}