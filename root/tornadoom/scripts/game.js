/**
 * Created by Devin on 2014-12-29.
 */

function BuildGame() {

    /********************************** GLOBAL GAME VARIABLES **********************************/

    /********************************** Global Input */

    var gameMouseCtrlName = "GameMouse";
    Input.RegisterControlScheme(gameMouseCtrlName, true, InputTypes.mouse);
    var gameMouse = Input.CreateInputController(gameMouseCtrlName);
    gameMouse.SetCursor(CursorTypes.none);

    var gameKeyCtrlName = "SceneAndMenuNav";
    Input.RegisterControlScheme(gameKeyCtrlName, true, InputTypes.keyboard);
    var nextSceneBtn = Input.CreateInputController(gameKeyCtrlName, KeyMap.Enter);
    var menuBtn = Input.CreateInputController(gameKeyCtrlName, KeyMap.Esc);

    /********************************** Main Menu */

    /*
    var menuSysName = "Main Menu";
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

    var resumeBtn = new GUIObject(
        new WndRect(20, 20, backDrop.rectGlobal.w - 40, 50),
        "Resume Game",
        style
    );
    function resumeCallback() {
        gameMouse.LeftRelease();
        console.log("Resume button pressed");
        GameMngr.assets.sounds['tick'].play();
    }

    var quitBtn = new GUIObject(
        new WndRect(20, 90, resumeBtn.rectGlobal.w, resumeBtn.rectGlobal.h),
        "Quit Game",
        style
    );
    function quitCallback() {
        gameMouse.LeftRelease();
        console.log("Quit button pressed");
        GameMngr.assets.sounds['select'].play();
    }

    mainMenu.AddGUIObject(backDrop);
    mainMenu.AddGUIObject(resumeBtn);
    mainMenu.AddGUIObject(quitBtn);

    GUINetwork.AddSystem(mainMenu, false);
    var menuToggle = false;
    */

    /******************************** HUD *************************************************/

    /*
    var hud = new GUISystem(new WndRect(20, 20, ViewMngr.wndWidth - 40, ViewMngr.wndHeight - 40), "in-game HUD");


    var style = new MsgBoxStyle();
    style.fontSize = 30;
    style.fontColour = new Vector3(1.0, 1.0, 1.0);
    style.textMaxWidth = 60;
    style.textAlignWidth = Alignment.right;
    style.textAlignHeight = Alignment.bottom;
    style.bgTexture = null;
    style.bgColour = new Vector3(0.0, 0.25, 0.0);
    style.textLineSpacing = 15.0;
    style.margin = 5.0;
    style.bgAlpha = 0.8;
    style.bold = false;
    var greenMsg = new GUIObject(new WndRect(0, 0, 300, 300), "$100 is 16% if the #stupid amount of tuition we pay!! Write devinodin@gmail.com", style);
    hud.AddGUIObject(greenMsg);

    style.bgColour = new Vector3(0.0, 0.0, 0.25);
    style.fontSize = 25;
    style.textAlignWidth = Alignment.left;
    style.textAlignHeight = Alignment.top;
    style.textLineSpacing = 10.0;
    style.bold = false;
    var blueMsg = new GUIObject(new WndRect(2000, 50, 200, 200), "Does this work?? \\\\Show me \"escaped\" characters", style);
    hud.AddGUIObject(blueMsg);

    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.fontColour = new Vector3(0.0, 0.0, 0.0);
    style.fontSize = 15;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.textLineSpacing = 5.0;
    style.bgAlpha = 1.0;
    style.bold = true;
    style.bgTexture = EL.assets.textures['questionBlock'];
    var redMsg = new GUIObject(new WndRect(30, 600, 100, 100), "Another test message box. I need to make a better font...", style);
    hud.AddGUIObject(redMsg);

    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.fontColour = new Vector3(1.0, 1.0, 1.0);
    style.fontSize = 30;
    style.textLineSpacing = 0.0;
    style.bgAlpha = 0.5;
    style.bgTexture = EL.assets.textures['purply'];
    style.bold = false;
    var aquaMsg = new GUIObject(new WndRect(redMsg.rectLocal.x + redMsg.rectLocal.w + 30 , redMsg.rectLocal.y, 200, 100), "Size", style);
    hud.AddGUIObject(aquaMsg);

    GUINetwork.AddSystem(hud, false);
    */

    /********************************** Global Objects */

    var testCube = new GameObject('test', Labels.testObject);
    testCube.SetModel(EL.assets.models['dimensionBox']);
    testCube.trfmLocal.SetPosAxes(0.0, 0.0, -10.0);

    var player = new Player();
    player.obj.trfmLocal.SetPosAxes(0.0, 1.0, -3.0);

    /********************************** Scenes */

    // Title screen just has gui elements
    var title = new Scene("Title Screen", SceneTypes.menu);
    BuildScene1(title);
    SceneMngr.AddScene(title, true);

    // Player, internal objects, and several different giu elements
    var bossBattle = new Scene("Final Boss Battle!", SceneTypes.gameplay);
    bossBattle.Add(testCube);
    bossBattle.Add(player.obj);
    BuildScene2(bossBattle);
    SceneMngr.AddScene(bossBattle, false);

    var angle = 0.01;
    function GameUpdate() {

        if(menuBtn.pressed) {
            menuToggle = !menuToggle;
            //GUINetwork.SetActive(menuSysName, menuToggle);
            GameMngr.TogglePause();
            if(menuToggle) gameMouse.SetCursor(CursorTypes.normal);
            else gameMouse.SetCursor(CursorTypes.none);
            menuBtn.Release();
        }
        /*
        if(GUINetwork.CheckActive(menuSysName)) {
            resumeBtn.AsButton(gameMouse.pos, gameMouse.leftPressed, resumeCallback);
            quitBtn.AsButton(gameMouse.pos, gameMouse.leftPressed, quitCallback);
        }
        */

        if(!GameMngr.paused) {
            if(SceneMngr.GetActiveScene().type == SceneTypes.gameplay) {
                player.Update();
            }
        }
    }

    GameMngr.UserUpdate = GameUpdate;
    GameMngr.BeginLoop();
}