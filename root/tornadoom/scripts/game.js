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

    var style = new MsgBoxStyle();
    style.fontSize = 30;
    style.fontColour = new Vector3(0.0, 0.0, 0.0);
    style.textMaxWidth = 15;
    style.textAlignWidth = Alignment.right;
    style.textAlignHeight = Alignment.centre;
    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.textLineSpacing = 0.0;
    style.margin = 15.0;
    style.bgAlpha = 1.0;
    style.bold = false;

    // Ammo Details
    style.bgTextures = [GameMngr.assets.textures['cowIcon']];
    hud.AddTextObject("caughtCowInfo", new GUITextObject(new WndRect(0, hud.sysRect.h - 64, 128, 64), "00", style));

    style.bgTextures = [GameMngr.assets.textures['baleIcon']];
    hud.AddTextObject("caughtBaleInfo", new GUITextObject(new WndRect(0, hud.guiTextObjs["caughtCowInfo"].rectLocal.y - 69, 128, 64), "00", style));

    // Abduction Details
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.bottom;
    style.fontSize = 24;
    // The images are 64 x 128, but with the bottom 28 clear, to not waste space,
    // Thus this margin needs to be here to elevate the text to compensate for the clear space.
    style.margin = 12.0;
    style.bgTextures = [GameMngr.assets.textures['rescueIcon']];
    hud.AddTextObject("rescueInfo", new GUITextObject(new WndRect(hud.sysRect.w - 64, 0, 64, 128), "00", style));

    style.bgTextures = [GameMngr.assets.textures['abductIcon']];
    hud.AddTextObject("abductionInfo", new GUITextObject(new WndRect(hud.guiTextObjs["rescueInfo"].rectLocal.x - 69, 0, 64, 128), "00", style));

    // Power info
    var powerBarStyle = new ProgressObjStyle();
    powerBarStyle.bgColour.SetValues(0.1, 0.1, 0.1);
    powerBarStyle.fgColour.SetValues(0.8, 0.5, 0.2);
    var barRect = new WndRect((hud.sysRect.w / 2) - 200, hud.sysRect.h - 30, 400, 20);
    hud.AddProgressObject("launchPowerBar", new GUIProgressBar(barRect, Axes.x, powerBarStyle));

    style.fontSize = 20;
    style.margin = 5.0;
    style.textMaxWidth = 25;
    style.textAlignHeight = Alignment.centre;
    style.bgTextures = [];
    style.bgAlpha = 0.5;
    style.bgColour.SetValues(1.0, 1.0, 1.0);
    style.fontColour.SetValues(0.0, 0.0, 0.0);
    hud.AddTextObject("launchPowerMsg", new GUITextObject(new WndRect(barRect.x + 110, barRect.y - 35, barRect.w - 220, 30), "Extra Power", style));

    hud.guiTextObjs["caughtCowInfo"].UpdateMsg('0');
    hud.guiTextObjs["caughtBaleInfo"].UpdateMsg('0');
    hud.guiTextObjs["rescueInfo"].UpdateMsg('0');
    hud.guiTextObjs["abductionInfo"].UpdateMsg('0');
    hud.guiProgObjs["launchPowerBar"].UpdateValue(0.0);

    var hudAmmoMsgs = [
        hud.guiTextObjs["caughtCowInfo"],
        hud.guiTextObjs["caughtBaleInfo"]
    ];

    for (var i in hud.guiTextObjs)
        hud.guiTextObjs[i].SetActive(false);
    for (var i in hud.guiProgObjs)
        hud.guiProgObjs[i].SetActive(false);

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

    /********************************** In-Game Menu **********************************/

    function ResetGame() {
        GameUtils.Reset();
        player.ResetAll();

        hud.guiTextObjs["caughtCowInfo"].UpdateMsg('0');
        hud.guiTextObjs["caughtBaleInfo"].UpdateMsg('0');
        hud.guiTextObjs["rescueInfo"].UpdateMsg('0');
        hud.guiTextObjs["abductionInfo"].UpdateMsg('0');
        hud.guiProgObjs["launchPowerBar"].UpdateValue(0.0);

        for (var i in hud.guiTextObjs)
            hud.guiTextObjs[i].SetActive(false);
        for (var i in hud.guiProgObjs)
            hud.guiProgObjs[i].SetActive(false);

        SceneMngr.SetActive("Title Screen");
    }

    var inGameMenu = new InGameMenu(gameMouse, player, ResetGame);

    /********************************** Scenes **********************************/

    // Title screen just has gui elements
    var title = new Scene("Title Screen", SceneTypes.menu);
    BuildScene1(title);
    SceneMngr.AddScene(title, true);

    // Teach player how to pick up a cow and shoot it into the barn
    // Once they do one, place 3 others - get them in the barn before the time runs out!
    var lvl01 = new Scene("Level 01", SceneTypes.gameplay);
    lvl01.Add(player.obj);
    lvl01.Add(barn.obj);
    lvl01.Add(skyBox);
    lvl01.Add(ground);
    BuildLvl01(lvl01, player, barn, cows.slice(0, 3), hud);
    SceneMngr.AddScene(lvl01, false);

    // Teach player how to shoot a hay bale vertically
    // Once they launch one, knock out the force field generator with 3 shots to access the barn!
    var lvl02 = new Scene("Level 02", SceneTypes.gameplay);
    lvl02.Add(player.obj);
    lvl02.Add(barn.obj);
    lvl02.Add(skyBox);
    lvl02.Add(ground);
    BuildLvl02(lvl02, player, barn, cows.slice(0, 6), haybales.slice(0, 4), hud);
    SceneMngr.AddScene(lvl02, false);

    // Enter alien
    // Player must save cows from alien abduction
    var lvl03 = new Scene("Level 03", SceneTypes.gameplay);
    lvl03.Add(player.obj);
    lvl03.Add(barn.obj);
    lvl03.Add(skyBox);
    lvl03.Add(ground);
    lvl03.Add(ufo.obj);
    BuildLvl03(lvl03, player, barn, cows.slice(), haybales.slice(), ufo, hud);
    SceneMngr.AddScene(lvl03, false);


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