/**
 * Created by Devin on 2014-12-29.
 */

function BuildScene1(scene) {
    var titleScreen = new GUISystem(new WndRect(0, 0, ViewMngr.wndWidth, ViewMngr.wndHeight), "Title screen");

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

    style.bgAlpha = 1.0;
    style.bgTexture = EL.assets.textures['lava'];
    var background = new GUIObject(
        titleScreen.sysRect,
        "",
        style
    );

    titleScreen.AddGUIObject(title);
    titleScreen.AddGUIObject(titleMsg);
    titleScreen.AddGUIObject(background);
    GUINetwork.AddSystem(titleScreen, false);

    var ctrlSchemeName = "Title screen transition";
    Input.RegisterControlScheme(ctrlSchemeName, false);
    var nextSceneBtn = Input.CreateInputController(ctrlSchemeName, KeyMap.Enter);

    function Start() {
        GUINetwork.SetActive(titleScreen.name, true);
        Input.SetActive(ctrlSchemeName, true);
    }

    function Update() {
        if(nextSceneBtn.pressed) {
            nextSceneBtn.Release();
            SceneMngr.SetActive("Basic Testbed with HUD");
        }
    }

    function End() {
        GUINetwork.SetActive(titleScreen.name, false);
        Input.SetActive(ctrlSchemeName, false);
    }

    scene.SetCallbacks(Start, Update, End);
}