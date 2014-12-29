/**
 * Created by Devin on 2014-12-29.
 */

function BuildScene2(scene, playerObj, skyBoxObj) {

    var arrow = new GameObject('arrow', Labels.testObject);
    var heart = new GameObject('heart', Labels.testObject);

    arrow.SetModel(Primitives.arrow);
    heart.SetModel(Primitives.heart);

    arrow.AddComponent(Components.modelHandler);
    heart.AddComponent(Components.modelHandler);

    arrow.trfmLocal.SetPosAxes(-0.5, 1.0, -2.5);
    heart.trfmLocal.SetPosVec3(new Vector3(3.5, 0.5, -1.0));

    arrow.mdlHdlr.colourTint.SetValues(-0.2, 0.3, 0.5);
    heart.mdlHdlr.colourTint.SetValues(-0.2, 0.3, 0.5);

    arrow.AddComponent(Components.collisionBody);
    heart.AddComponent(Components.collisionBody);

    var angle = 0.01;
    var waveringValue = 0.0;

    var resetBtn;
    var ctrlSchemeName = "In-game menu control";

    function Start() {
        Input.RegisterControlScheme(ctrlSchemeName, true);
        resetBtn = Input.CreateInputController(ctrlSchemeName, KeyMap.Esc);

        console.log("Level 1 started");
    }

    function Update() {
        waveringValue += angle;

        playerObj.trfmLocal.Rotate(VEC3_RIGHT, angle * 20.0);
        playerObj.trfmLocal.ScaleAxes(Math.sin(waveringValue)  / 100, Math.sin(waveringValue) / 100, 0.0);

        skyBoxObj.trfmLocal.Rotate(VEC3_FWD, angle);

        if(resetBtn.pressed) {
            Input.UnRegisterControlScheme(ctrlSchemeName);
            SceneNetwork.SetActive("Title Screen");
        }
    }

    playerObj.AddChild(arrow);
    playerObj.AddChild(heart);
    scene.Render(arrow.mdlHdlr);
    scene.Render(heart.mdlHdlr);
    scene.SetCallbacks(Start, Update);
}