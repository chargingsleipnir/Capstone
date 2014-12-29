/**
 * Created by Devin on 2014-12-29.
 */

function BuildScene1(scene) {
    var titleScreen = new GUISystem(new WndRect(0, 0, GM.wndWidth, GM.wndHeight), "Title screen");

    var style = new MsgBoxStyle();
    style.fontSize = 50;
    style.fontColour = new Vector3(0.0, 0.0, 0.0);
    style.textMaxWidth = 200;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.bgColour = new Vector3(1.0, 1.0, 1.0);
    style.margin = 20.0;
    style.bgAlpha = 1.0;
    style.bold = false;
    var title = new GUIObject(
        new WndRect(titleScreen.sysRect.w/2 - 200, titleScreen.sysRect.h/2 - 100, 400, 200),
        "Test Title",
        style
    );

    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.fontColour = new Vector3(1.0, 1.0, 1.0);
    style.fontSize = 30;
    style.bold = true;
    var titleMsg = new GUIObject(
        new WndRect(title.rectGlobal.w, title.rectLocal.y + title.rectLocal.h + 20, 700, 100),
        "Press enter to start the game!",
        style
    );

    titleScreen.AddGUIObject(title);
    titleScreen.AddGUIObject(titleMsg);

    var nextSceneBtn;
    var ctrlSchemeName = "Title screen transition";

    function Start() {
        Input.RegisterControlScheme(ctrlSchemeName, true);
        nextSceneBtn = Input.CreateInputController(ctrlSchemeName, KeyMap.Enter);

        GUINetwork.AddSystem(titleScreen, true);

        console.log("Title screen started");
    }

    function Update() {
        if(nextSceneBtn.pressed) {
            Input.UnRegisterControlScheme(ctrlSchemeName);
            GUINetwork.RemoveSystem(titleScreen.name);
            SceneNetwork.SetActive("Level 1");
        }
    }

    scene.SetCallbacks(Start, Update);
}