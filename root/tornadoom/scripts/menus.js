/**
 * Created by Devin on 2015-03-08.
 */

function InGameMenu(gameMouse, player) {

    var that = this;

    var camToggle = true;
    var menuToggle = false;
    var menuSysName = "Main Menu";
    var pages = { main: 0, devContol: 1 };
    var mainMenu = new GUISystem(new WndRect(ViewMngr.wndWidth/2 - 200, ViewMngr.wndHeight/2 - 300, 400, 600), menuSysName );

    var style = new MsgBoxStyle();
    style.bgColour = new Vector3(0.85, 0.6, 0.85);
    style.bgAlpha = 0.75;

    var backDrop = new GUIObject(
        new WndRect(0, 0, mainMenu.sysRect.w, mainMenu.sysRect.h),
        "",
        style
    );

    style.bgColour.SetValues(0.6, 0.85, 0.85);
    style.margin = 5.0;
    style.fontSize = 30;
    style.fontColour.SetValues(0.0, 0.0, 0.0);
    style.fontHoverColour.SetValues(0.5, 0.1, 0.9);
    style.bgHoverColour.SetValues(0.7, 0.6, 0.5);
    style.textMaxWidth = 200;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.fontAlpha = 1.0;
    style.bold = true;

    // FIRST PAGE MENU BUTTONS
    var resumeBtn = new GUIObject(
        new WndRect(20, 20, backDrop.rectGlobal.w - 40, 50),
        "Resume Game", style );
    function ResumeCallback() {
        gameMouse.LeftRelease();
        that.ToggleActive();
        GameMngr.assets.sounds['tick'].play();
    }
    // ----------
    var quitBtn = new GUIObject(
        new WndRect(20, 90, resumeBtn.rectGlobal.w, resumeBtn.rectGlobal.h),
        "Quit Game", style );
    function QuitCallback() {
        gameMouse.LeftRelease();
        // Make sure all other restart logic is sound here
        that.ToggleActive();
        SceneMngr.SetActive("Title Screen");
        GameMngr.assets.sounds['tick'].play();
    }
    // ----------
    var devBtn = new GUIObject(
        new WndRect(20, 160, quitBtn.rectGlobal.w, quitBtn.rectGlobal.h),
        "Developer Tools", style );
    function DevCallback() {
        gameMouse.LeftRelease();
        GameMngr.assets.sounds['tick'].play();
        ActivatePage(pages.devContol);
    }

    // DEV CONTROL PAGE

    var devBackBtn = new GUIObject(
        new WndRect(backDrop.rectGlobal.w - 120, backDrop.rectGlobal.h - 70, 100, 50),
        "Back", style );
    function MainPageCallback() {
        ActivatePage(pages.main);
        gameMouse.LeftRelease();
        GameMngr.assets.sounds['tick'].play();
    }

    /*
    style.bgColour.SetValues(0.6, 0.85, 0.85);
    style.margin = 5.0;
    style.fontSize = 24;
    style.fontColour.SetValues(0.0, 0.0, 0.0);
    style.fontHoverColour.SetValues(0.5, 0.1, 0.9);
    style.bgHoverColour.SetValues(0.7, 0.6, 0.5);
    style.textMaxWidth = 200;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.fontAlpha = 1.0;
    style.bold = false;
    */

    var camChangeBtn = new GUIObject(
        new WndRect(20, 20, backDrop.rectGlobal.w - 40, 50),
        "Free camera", style );
    function CamChangeCallback() {
        // CONTROL SHIFTED TO SEPARATE CAMERA
        camToggle = !camToggle;
        if(camToggle) {
            player.ctrl.SetActive(true);
            ViewMngr.SetActiveCamera(player.obj.camera);
        }
        else {
            player.ctrl.SetActive(false);
            ViewMngr.SetActiveCamera();
        }
        gameMouse.LeftRelease();
        GameMngr.assets.sounds['tick'].play();
    }
    // ----------
    var debugDispHeader = new GUIObject(
    new WndRect(20, 90, camChangeBtn.rectGlobal.w, camChangeBtn.rectGlobal.h),
    "Debug Visuals", style );

    mainMenu.AddGUIObject(backDrop);
    mainMenu.AddGUIObject(resumeBtn);
    mainMenu.AddGUIObject(quitBtn);
    mainMenu.AddGUIObject(devBtn);
    mainMenu.AddGUIObject(camChangeBtn);
    mainMenu.AddGUIObject(debugDispHeader);
    mainMenu.AddGUIObject(devBackBtn);

    GUINetwork.AddSystem(mainMenu, false);

    function ActivatePage(page) {
        for(var i = 0; i < mainMenu.guiObjs.length; i++)
            mainMenu.guiObjs[i].SetActive(false);

        backDrop.SetActive(true);

        switch(page) {
            case pages.main:
                resumeBtn.SetActive(true);
                quitBtn.SetActive(true);
                devBtn.SetActive(true);
                break;
            case pages.devContol:
                camChangeBtn.SetActive(true);
                debugDispHeader.SetActive(true);
                devBackBtn.SetActive(true);
                break;
        }
    }

    ActivatePage(pages.main);

    this.ToggleActive = function() {
        menuToggle = !menuToggle;
        GUINetwork.SetActive(menuSysName, menuToggle);
        ActivatePage(pages.main);
        GameMngr.TogglePause();
        if (menuToggle) gameMouse.SetCursor(CursorTypes.normal);
        else gameMouse.SetCursor(CursorTypes.none);
    };
    this.Update = function() {
        if(GUINetwork.CheckActive(menuSysName)) {
            resumeBtn.AsButton(gameMouse.pos, gameMouse.leftPressed, ResumeCallback);
            quitBtn.AsButton(gameMouse.pos, gameMouse.leftPressed, QuitCallback);
            devBtn.AsButton(gameMouse.pos, gameMouse.leftPressed, DevCallback);
            camChangeBtn.AsButton(gameMouse.pos, gameMouse.leftPressed, CamChangeCallback);
            devBackBtn.AsButton(gameMouse.pos, gameMouse.leftPressed, MainPageCallback);
        }
    };
}