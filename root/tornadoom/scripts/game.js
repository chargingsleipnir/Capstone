/**
 * Created by Devin on 2014-12-29.
 */

function BuildGame() {

    /********************************** GLOBAL GAME SETUP **********************************/
    /********************************** Environment Init **********************************/

    // This is temporary, just to view the world and build scenes easier.
    ViewMngr.camera.trfmAxes.SetPosAxes(0.0, 5.0, 0.0);
    ViewMngr.camera.trfmAxes.RotateLocalViewX(-10);
    ViewMngr.camera.FreeControlUpdate();

    /********************************** Global Input **********************************/

    var gameMouseCtrlName = "GameMouse";
    Input.RegisterControlScheme(gameMouseCtrlName, true, InputTypes.mouse);
    var gameMouse = Input.CreateInputController(gameMouseCtrlName);
    gameMouse.SetCursor(CursorTypes.none);

    var gameKeyCtrlName = "SceneAndMenuNav";
    Input.RegisterControlScheme(gameKeyCtrlName, true, InputTypes.keyboard);
    var menuBtn = Input.CreateInputController(gameKeyCtrlName, KeyMap.Esc);

    /********************************** HUD **********************************/

    var hud = new GUISystem(new WndRect(20, 20, ViewMngr.wndWidth - 40, ViewMngr.wndHeight - 40), "in-game HUD");
    GUINetwork.AddSystem(hud, true);

    /********************************** Global Objects **********************************/

    var player = new Player(gameMouse);
    player.obj.trfmBase.SetPosByAxes(0.0, 1.0, 0.0);

    var ufo = new UFO();
    var barn = new Barn();

    var ground = new GameObject('ground', Labels.none);
    ground.SetModel(GameMngr.assets.models['ground']);
    ground.mdlHdlr.SetTexture(GameMngr.assets.textures['groundTex'], TextureFilters.mipmap);

    var skyBox = new GameObject('skybox', Labels.none);
    skyBox.SetModel(new Primitives.IcoSphere(2, 1));
    skyBox.mdlHdlr.SetTexture(GameMngr.assets.textures['skyTex'], TextureFilters.nearest);
    skyBox.trfmBase.SetScaleAxes(150.0, 150.0, 150.0);

    /********************************** In-Game Menu **********************************/
    var inGameMenu = new InGameMenu(gameMouse, player);

    /********************************** Scenes **********************************/

    // Title screen just has gui elements
    var title = new Scene("Title Screen", SceneTypes.menu);
    BuildScene1(title);
    SceneMngr.AddScene(title, true);

    // Player, internal objects, and several different giu elements
    var lvl01 = new Scene("Level 01", SceneTypes.gameplay);
    lvl01.Add(player.obj);
    lvl01.Add(ufo.obj);
    lvl01.Add(barn.obj);
    lvl01.Add(skyBox);
    lvl01.Add(ground);

    BuildScene2(lvl01, player, ufo, barn, hud);
    SceneMngr.AddScene(lvl01, false);

    /*
    var testScene = new Scene("Test", SceneTypes.cutScene);
    BuildScene3(testScene);
    SceneMngr.AddScene(testScene, true);
    */

    /********************************** Game Functions **********************************/

    var angle = 0.00;
    function GameUpdate() {
        if(SceneMngr.GetActiveScene().type == SceneTypes.gameplay) {

            inGameMenu.Update();
            if(menuBtn.pressed) {
                inGameMenu.ToggleActive();
                menuBtn.Release();
            }

            if(!GameMngr.paused) {
                player.Update();
                ufo.Update();
                barn.Update();

                angle += 0.01;
                skyBox.trfmBase.SetUpdatedRot(VEC3_FWD, angle);
            }
        }
    }

    GameMngr.UserUpdate = GameUpdate;
    //GameMngr.assets.sounds['bgMusicLight'].play();
    GameMngr.BeginLoop();
}