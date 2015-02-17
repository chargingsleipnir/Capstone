function BuildScene1(scene) {
    var titleScreen = new GUISystem(new WndRect(0, 0, ViewMngr.wndWidth, ViewMngr.wndHeight), "Title screen");

    var style = new MsgBoxStyle();
    style.fontSize = 50;
    style.fontColour = new Vector3(0.0, 0.0, 0.0);
    style.textMaxWidth = 200;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.fontAlpha = 0.75;
    style.bgColour = new Vector3(1.0, 1.0, 1.0);
    style.margin = 20.0;
    style.bgAlpha = 1.0;
    style.bold = false;
    var title = new GUIObject(
        'title',
        new WndRect(titleScreen.sysRect.w/2 - 200, titleScreen.sysRect.h/2 - 100, 400, 200),
        "Test Title",
        style
    );

    style.fontAlpha = 0.0;
    style.bgAlpha = 0.0;
    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.fontColour = new Vector3(1.0, 1.0, 1.0);
    style.fontSize = 30;
    style.bold = true;
    var titleMsg = new GUIObject(
        'titleMsg',
        new WndRect(title.rectGlobal.w, title.rectLocal.y + title.rectLocal.h + 20, 700, 100),
        "Press enter to start the game!",
        style
    );

    style.bgAlpha = 1.0;
    style.bgTexture = EL.assets.textures['lava'];
    var background = new GUIObject(
        'background',
        titleScreen.sysRect,
        "",
        style
    );

    titleScreen.AddGUIObject(background);
    titleScreen.AddGUIObject(title);
    titleScreen.AddGUIObject(titleMsg);

    GUINetwork.AddSystem(titleScreen, false);

    var ctrlSchemeName = "Title screen transition";
    Input.RegisterControlScheme(ctrlSchemeName, false, InputTypes.keyboard);
    var nextSceneBtn = Input.CreateInputController(ctrlSchemeName, KeyMap.Enter);

    var fadingIn;

    function Start() {
        titleMsg.boxHdl.SetTintAlpha(0.0);
        titleMsg.strHdl.SetTintAlpha(0.0);
        fadingIn = true;
        GUINetwork.SetActive(titleScreen.name, true);
        Input.SetActive(ctrlSchemeName, true);
    }

    function Update() {
        if(nextSceneBtn.pressed) {
            nextSceneBtn.Release();
            SceneMngr.SetActive("Level 01");
        }
        if(fadingIn)
            if(titleMsg.FadeBackground(0.01) >= 1.0 && titleMsg.FadeMsg(0.01) >= 1.0)
                fadingIn = false;

    }

    function End() {
        GUINetwork.SetActive(titleScreen.name, false);
        Input.SetActive(ctrlSchemeName, false);
    }

    scene.SetCallbacks(Start, Update, End);
}