function BuildScene1(scene, nextBtn) {
    var titleScreen = new GUISystem(new WndRect(0, 0, ViewMngr.wndWidth, ViewMngr.wndHeight), "Title screen");

    var style = new MsgBoxStyle();
    style.fontSize = 40;
    style.fontColour = new Vector3(0.0, 0.0, 0.0);
    style.textMaxWidth = 200;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.fontAlpha = 1.0;
    style.bgColour = new Vector3(1.0, 1.0, 1.0);
    style.margin = 10.0;
    style.bgAlpha = 1.0;
    style.bold = true;
    var title = new GUITextObject(
        new WndRect(titleScreen.sysRect.w/2, titleScreen.sysRect.h/2 + 100, 300, 80),
        "TORNADOOM",
        style
    );

    style.fontAlpha = 0.0;
    style.bgAlpha = 0.0;
    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.fontColour = new Vector3(1.0, 1.0, 1.0);
    style.fontSize = 30;
    style.bold = false;
    var nextSceneMsg = new GUITextObject(
        new WndRect(title.rectGlobal.x - 90, title.rectLocal.y + title.rectLocal.h + 20, title.rectGlobal.w + 180, 60),
        "Press enter to start!",
        style
    );

    style.bgAlpha = 1.0;
    style.bgTextures = [GameMngr.assets.textures['title']];
    var background = new GUITextObject(
        titleScreen.sysRect,
        "",
        style
    );

    titleScreen.AddTextObject("background", background);
    titleScreen.AddTextObject("title", title);
    titleScreen.AddTextObject("nextSceneMsg", nextSceneMsg);

    GUINetwork.AddSystem(titleScreen, false);

    var fadingIn;

    function Start() {
        nextSceneMsg.boxHdl.SetTintAlpha(0.0);
        nextSceneMsg.strHdl.SetTintAlpha(0.0);
        fadingIn = true;
        GUINetwork.SetActive(titleScreen.name, true);
    }

    function Update() {
        if(nextBtn.pressed) {
            nextBtn.Release();
            SceneMngr.SetActive("Level 01");
        }
        if(fadingIn)
            if(nextSceneMsg.FadeBackground(0.01) >= 1.0 && nextSceneMsg.FadeMsg(0.01) >= 1.0)
                fadingIn = false;

    }

    function End() {
        GUINetwork.SetActive(titleScreen.name, false);
    }

    scene.SetCallbacks(Start, Update, End);
}