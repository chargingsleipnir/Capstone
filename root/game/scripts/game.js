/**
 * Created by Devin on 2014-12-29.
 */

function BuildGame() {

    /********************************** GLOBAL GAME VARIABLES **********************************/

    /********************************** Global Input */

    var gameMouseCtrlName = "GameMouse";
    Input.RegisterControlScheme(gameMouseCtrlName, true, InputTypes.mouse);
    var gameMouse = Input.CreateInputController(gameMouseCtrlName);

    var gameKeyCtrlName = "SceneAndMenuNav";
    Input.RegisterControlScheme(gameKeyCtrlName, true, InputTypes.keyboard);
    var nextSceneBtn = Input.CreateInputController(gameKeyCtrlName, KeyMap.Enter);
    var menuBtn = Input.CreateInputController(gameKeyCtrlName, KeyMap.Esc);

    /********************************** Global GUI */

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
    }

    var quitBtn = new GUIObject(
        new WndRect(20, 90, resumeBtn.rectGlobal.w, resumeBtn.rectGlobal.h),
        "Quit Game",
        style
    );
    function quitCallback() {
        gameMouse.LeftRelease();
        console.log("Quit button pressed");
    }

    mainMenu.AddGUIObject(backDrop);
    mainMenu.AddGUIObject(resumeBtn);
    mainMenu.AddGUIObject(quitBtn);

    GUINetwork.AddSystem(mainMenu, false);
    var menuToggle = false;


    /********************************** Global Objects */
    var player = new GameObject('disc', Labels.none);
    player.SetModel(GameMngr.assets.models['disc']);
    player.mdlHdlr.SetTexture(GameMngr.assets.textures['discSurface'], TextureFilters.linear);
    player.AddComponent(Components.collisionBody);
    player.trfmLocal.SetPosAxes(10.0, 5.0, -5.0);

    var skyBox = new GameObject('skybox', Labels.testObject);
    skyBox.SetModel(new Primitives.IcoSphere(2, 1));
    skyBox.mdlHdlr.SetTexture(EL.assets.textures['starfield'], TextureFilters.nearest);
    skyBox.trfmLocal.SetScaleAxes(100.0, 100.0, 100.0);

    var zeroPointAxes = new GameObject('zeroPointAxes', Labels.productionEnvironment);
    zeroPointAxes.SetModel(Primitives.axesZeroPoints);


    /********************************** Scenes */

    // Title screen just has gui elements
    var title = new Scene("Title Screen");
    BuildScene1(title);
    SceneMngr.AddScene(title, true);

    // Player, internal objects, and several different giu elements
    var guiTest = new Scene("Basic Testbed with HUD");
    guiTest.Add(player);
    guiTest.Add(skyBox);
    guiTest.Add(zeroPointAxes);
    BuildScene2(guiTest, player);
    SceneMngr.AddScene(guiTest, false);

    // Physics testing
    var physicsTest = new Scene("Physics Testbed");
    physicsTest.Add(skyBox);
    BuildScene3(physicsTest);
    SceneMngr.AddScene(physicsTest, false);

    // Various lighting samples and materials being used.
    var lightTest = new Scene("Light and blend testing");
    lightTest.Add(skyBox);
    BuildScene4(lightTest);
    SceneMngr.AddScene(lightTest, false);

    // Various particle systems being used.
    var particleTest = new Scene("Particle system testing");
    particleTest.Add(skyBox);
    particleTest.Add(zeroPointAxes);
    BuildScene5(particleTest);
    SceneMngr.AddScene(particleTest, false);

    var angle = 0.01;
    function GameUpdate() {

        if(menuBtn.pressed) {
            menuToggle = !menuToggle;
            GUINetwork.SetActive(menuSysName, menuToggle);
            menuBtn.Release();
            GameMngr.TogglePause();
        }
        if(GUINetwork.CheckActive(menuSysName)) {
            resumeBtn.AsButton(gameMouse.pos, gameMouse.leftPressed, resumeCallback);
            quitBtn.AsButton(gameMouse.pos, gameMouse.leftPressed, quitCallback);
        }


        if(!GameMngr.paused) {
            skyBox.trfmLocal.Rotate(VEC3_FWD, angle);
        }
    }

    GameMngr.UserUpdate = GameUpdate;
    GameMngr.BeginLoop();
}