/**
 * Created by Devin on 2014-12-29.
 */

function BuildGame() {
    /*====================================== GLOBAL GAME SETUP ======================================*/



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
    var nextBtn = Input.CreateInputController(gameKeyCtrlName, KeyMap.Enter);


    /********************************** In-Game GUI Systems **********************************/
    // HUD ------------------------------------------------------------------
    var hud = CreateHUD();

    var hudAmmoMsgs = [
        hud.guiTextObjs["caughtCowInfo"],
        hud.guiTextObjs["caughtBaleInfo"]
    ];

    /********************************** Global Objects **********************************/

    // Player ------------------------------------------------------------------
    var player = new Player(gameMouse);
    GameUtils.RaiseToGroundLevel(player.obj);
    function PlayerCollCallback(collider) {
        if (collider.gameObj.label == Labels.ammo) {
            var objToEyeVec = new Vector2(player.obj.trfmGlobal.pos.x - collider.trfm.pos.x, player.obj.trfmGlobal.pos.z - collider.trfm.pos.z);
            var objToEyeDistSqr = objToEyeVec.GetMagSqr();

            // This format allows not only for objects to only be captured if they are within the given radius,
            // but ensures that their velocities don't explode at heights above the tornado:
            // No force is applied if they're directly above the funnel.
            if (collider.trfm.pos.y < player.height) {
                if (objToEyeDistSqr < player.captureRadius * player.captureRadius) {
                    if (collider.gameObj.name == "cow")
                        player.Capture(GameUtils.ammoTypes.cow, collider.gameObj);
                    else if (collider.gameObj.name == "hay bale")
                        player.Capture(GameUtils.ammoTypes.hayBale, collider.gameObj);
                }
                else {
                    player.Twister(collider.rigidBody, objToEyeVec, objToEyeDistSqr);
                }
            }
        }
    }

    var UpdateHUDAmmoSelection = function (ammoIdx) {
        for (var i = 0; i < hudAmmoMsgs.length; i++) {
            hudAmmoMsgs[i].SetObjectFade(0.66);
        }
        hudAmmoMsgs[ammoIdx].SetObjectFade(1.0);
    };
    var UpdateHUDAmmoCount = function (ammoIdx, count) {
        hudAmmoMsgs[ammoIdx].UpdateMsg("" + count);
    };
    var UpdateHUDPowerLevel = function (power) {
        hud.guiProgObjs["launchPowerBar"].UpdateValue(power);
    };
    player.obj.collider.SetSphereCall(PlayerCollCallback);
    player.SetAmmoSelectionCallback(UpdateHUDAmmoSelection);
    player.SetAmmoCountChangeCallback(UpdateHUDAmmoCount);
    player.SetPowerChangeCallback(UpdateHUDPowerLevel);
    // -------------------------------------------------------------------------

    var ufo = new UFO();
    var barn = new Barn();

    var ground = new GameObject('ground', Labels.none);
    ground.SetModel(GameMngr.assets.models['ground']);
    ground.mdlHdlr.SetTexture(GameMngr.assets.textures['groundTex'], TextureFilters.mipmap);

    var skyBox = new GameObject('skybox', Labels.none);
    skyBox.SetModel(new Primitives.IcoSphere(2, 1));
    skyBox.mdlHdlr.SetTexture(GameMngr.assets.textures['skyTex'], TextureFilters.nearest);
    skyBox.trfmBase.SetScaleAxes(150.0, 150.0, 150.0);

    var cows = [];
    var MAX_COWS = 10;
    for (var i = 0; i < MAX_COWS; i++)
        cows[i] = new Cow();

    var haybales = [];
    var MAX_BALES = 10;
    for (var i = 0; i < MAX_BALES; i++)
        haybales[i] = new HayBale();

    /********************************** In-Game GUI Systems **********************************/

    // Level complete message -----------------------------------------------------
    var lvlCompMsg = new LevelCompleteMessage();

    // Menu ------------------------------------------------------------------
    function ResetGame() {
        GameUtils.Reset();
        player.ResetAll();
        Time.counter = 0.0;

        hud.guiTextObjs["caughtCowInfo"].UpdateMsg('0');
        hud.guiTextObjs["caughtBaleInfo"].UpdateMsg('0');
        hud.guiTextObjs["rescueInfo"].UpdateMsg('0');
        hud.guiTextObjs["abductionInfo"].UpdateMsg('0');
        hud.guiProgObjs["launchPowerBar"].UpdateValue(0.0);
        hud.guiProgObjs["countdownBar"].UpdateValue(0.0);

        for (var i in hud.guiTextObjs)
            hud.guiTextObjs[i].SetActive(false);
        for (var i in hud.guiProgObjs)
            hud.guiProgObjs[i].SetActive(false);

        lvlCompMsg.SetActive(false);
        InGameMsgr.SetActive(false);
        SceneMngr.SetActive("Title Screen");
    }

    var inGameMenu = new InGameMenu(gameMouse, player, ResetGame);

    // Messenger ------------------------------------------------------------------
    InGameMsgr.Initialize();

    /********************************** Scenes **********************************/

    // Title screen just has gui elements
    var title = new Scene("Title Screen", SceneTypes.menu);
    BuildSceneTitle(title, nextBtn);
    SceneMngr.AddScene(title, true);

    // Teach player how to pick up a cow and shoot it into the barn
    // Once they do one, place 3 others - get them in the barn before the time runs out!
    var lvl01 = new Scene("Level 01", SceneTypes.gameplay);
    lvl01.Add(player.obj);
    lvl01.Add(barn.obj);
    lvl01.Add(skyBox);
    lvl01.Add(ground);
    BuildLvl01(lvl01, player, barn, cows.slice(0, 3), hud, nextBtn, lvlCompMsg);
    SceneMngr.AddScene(lvl01, false);

    // Teach player how to shoot a hay bale vertically
    // Once they launch one, knock out the force field generator with 3 shots to access the barn!
    var lvl02 = new Scene("Level 02", SceneTypes.gameplay);
    lvl02.Add(player.obj);
    lvl02.Add(barn.obj);
    lvl02.Add(skyBox);
    lvl02.Add(ground);
    BuildLvl02(lvl02, player, barn, cows.slice(0, 6), haybales.slice(0, 4), hud, nextBtn, lvlCompMsg);
    SceneMngr.AddScene(lvl02, false);

    // Enter alien
    // Player must save cows from alien abduction
    var lvl03 = new Scene("Level 03", SceneTypes.gameplay);
    lvl03.Add(player.obj);
    lvl03.Add(barn.obj);
    lvl03.Add(skyBox);
    lvl03.Add(ground);
    lvl03.Add(ufo.obj);
    BuildLvl03(lvl03, player, barn, cows.slice(), haybales.slice(), ufo, hud, nextBtn, lvlCompMsg);
    SceneMngr.AddScene(lvl03, false);

    // End screens just have gui elements
    var endWin = new Scene("End Screen Win", SceneTypes.menu);
    var endLose = new Scene("End Screen Lose", SceneTypes.menu);
    BuildSceneEndBoth(endWin, endLose, nextBtn, ResetGame);
    SceneMngr.AddScene(endWin, false);
    SceneMngr.AddScene(endLose, false);

    /********************************** Game Functions **********************************/

    var angle = 0.00;

    function GameUpdate() {
        if (SceneMngr.GetActiveScene().type == SceneTypes.gameplay) {

            inGameMenu.Update();
            if (menuBtn.pressed) {
                inGameMenu.ToggleActive();
                menuBtn.Release();
            }

            if (!GameMngr.paused) {
                angle += 0.01;
                skyBox.trfmBase.SetUpdatedRot(VEC3_FWD, angle);
            }
        }
    }

    GameMngr.UserUpdate = GameUpdate;
    //GameMngr.assets.sounds['bgMusicLight'].play();
    GameMngr.BeginLoop();
}