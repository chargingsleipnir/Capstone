/**
 * Created by Devin on 2014-12-29.
 */

function BuildGame() {

    /********************************** GLOBAL GAME SETUP **********************************/


    /********************************** Env. Init */

    // This is temporary, just to view the world and build scenes easier.
    ViewMngr.camera.trfmAxes.SetPosAxes(0.0, 5.0, 0.0);
    ViewMngr.camera.trfmAxes.RotateLocalViewX(-10);
    var camToggle = true;
    var gizmoToggle = true;

    /********************************** Global Input */

    var gameMouseCtrlName = "GameMouse";
    Input.RegisterControlScheme(gameMouseCtrlName, true, InputTypes.mouse);
    var gameMouse = Input.CreateInputController(gameMouseCtrlName);
    gameMouse.SetCursor(CursorTypes.none);

    var gameKeyCtrlName = "SceneAndMenuNav";
    Input.RegisterControlScheme(gameKeyCtrlName, true, InputTypes.keyboard);
    var menuBtn = Input.CreateInputController(gameKeyCtrlName, KeyMap.Esc);

    // Controls for engine display
    var showGizmos = Input.CreateInputController(gameKeyCtrlName, KeyMap.G);
    var switchCam = Input.CreateInputController(gameKeyCtrlName, KeyMap.C);

    /********************************** Main Menu */

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

    // Menu buttons and callback functions
    var resumeBtn = new GUIObject(
        new WndRect(20, 20, backDrop.rectGlobal.w - 40, 50),
        "Resume Game",
        style
    );
    var quitBtn = new GUIObject(
        new WndRect(20, 90, resumeBtn.rectGlobal.w, resumeBtn.rectGlobal.h),
        "Quit Game",
        style
    );
    function resumeCallback() {
        gameMouse.LeftRelease();
        menuBtn.pressed = true;
        GameMngr.assets.sounds['tick'].play();
    }
    function quitCallback() {
        gameMouse.LeftRelease();

        // Make sure all other restart logic is sound here

        DisplayOptionMenu();
        SceneMngr.SetActive("Title Screen");
        GameMngr.assets.sounds['tick'].play();
    }

    mainMenu.AddGUIObject(backDrop);
    mainMenu.AddGUIObject(resumeBtn);
    mainMenu.AddGUIObject(quitBtn);

    GUINetwork.AddSystem(mainMenu, false);
    var menuToggle = false;

    /******************************** HUD *************************************************/

    var hud = new GUISystem(new WndRect(20, 20, ViewMngr.wndWidth - 40, ViewMngr.wndHeight - 40), "in-game HUD");
    // Only added to in Player so far
    GUINetwork.AddSystem(hud, true);

    /********************************** Global Objects */

    var player = new Player(hud, gameMouse);
    player.obj.trfmBase.SetPosByAxes(0.0, 1.0, 0.0);

    var ufo = new UFO();

    var skyBox = new GameObject('skybox', Labels.none);
    skyBox.SetModel(new Primitives.IcoSphere(2, 1));
    skyBox.mdlHdlr.SetTexture(GameMngr.assets.textures['skyTex'], TextureFilters.nearest);
    skyBox.trfmBase.SetScaleAxes(150.0, 150.0, 150.0);

    /********************************** Scenes */

    // Title screen just has gui elements
    var title = new Scene("Title Screen", SceneTypes.menu);
    BuildScene1(title);
    SceneMngr.AddScene(title, true);

    // Player, internal objects, and several different giu elements
    var lvl01 = new Scene("Level 01", SceneTypes.gameplay);
    lvl01.Add(player.obj);
    lvl01.Add(ufo.obj);
    lvl01.Add(skyBox);
    BuildScene2(lvl01);
    SceneMngr.AddScene(lvl01, false);

    var angle = 0.00;
    function DisplayOptionMenu() {
        menuToggle = !menuToggle;
        GUINetwork.SetActive(menuSysName, menuToggle);
        GameMngr.TogglePause();
        if (menuToggle) gameMouse.SetCursor(CursorTypes.normal);
        else gameMouse.SetCursor(CursorTypes.none);
    }

    function GameUpdate() {

        if(menuBtn.pressed) {
            if(SceneMngr.GetActiveScene().type == SceneTypes.gameplay) {
                DisplayOptionMenu();
                menuBtn.Release();
            }
        }

        if(GUINetwork.CheckActive(menuSysName)) {
            resumeBtn.AsButton(gameMouse.pos, gameMouse.leftPressed, resumeCallback);
            quitBtn.AsButton(gameMouse.pos, gameMouse.leftPressed, quitCallback);
        }

        if(!GameMngr.paused) {
            if(SceneMngr.GetActiveScene().type == SceneTypes.gameplay) {
                player.Update();
                ufo.Update();

                angle += 0.01;
                skyBox.trfmBase.SetUpdatedRot(VEC3_FWD, angle);

                // ACTIVATES FULL ENGINE-BUILD VIEW WITH ALL CONTROL SHIFTED TO SEPARATE CAMERA
                if(switchCam.pressed) {
                    camToggle = !camToggle;
                    if(camToggle) {
                        player.ctrl.SetActive(true);
                        ViewMngr.SetActiveCamera(player.obj.camera);
                    }
                    else {
                        player.ctrl.SetActive(false);
                        ViewMngr.SetActiveCamera();
                    }

                    switchCam.Release();
                }
                else if(showGizmos.pressed) {
                    DebugMngr.SetFullActive(gizmoToggle);
                    gizmoToggle = !gizmoToggle;
                    showGizmos.Release();
                }
            }
        }
    }

    GameMngr.UserUpdate = GameUpdate;
    //GameMngr.assets.sounds['bgMusicLight'].play();
    GameMngr.BeginLoop();
}