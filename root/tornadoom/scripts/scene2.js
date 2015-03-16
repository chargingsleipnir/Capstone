function BuildScene2(scene, player, ufo, barn, hud) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.25;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);
    scene.light.pnt.bright = 0.0;
    scene.light.pnt.pos.SetValues(0.0, 0.0, 0.0);

    function RaiseToGruond(obj) {
        var halfHeight = obj.shapeData.radii.y * obj.trfmBase.scale.y;
        obj.trfmBase.SetPosByAxes(0.0, halfHeight, 0.0);
    }

    var fence = new GameObject('fence', Labels.none);
    fence.SetModel(GameMngr.assets.models['fence']);
    fence.mdlHdlr.SetTexture(GameMngr.assets.textures['fenceTex'], TextureFilters.mipmap);
    RaiseToGruond(fence);
    fence.trfmBase.TranslateByAxes(0.0, 0.0, 0.0);

    var wagon = new GameObject('wagon', Labels.none);
    wagon.SetModel(GameMngr.assets.models['wagon']);
    wagon.mdlHdlr.SetTexture(GameMngr.assets.textures['wagonTex'], TextureFilters.linear);
    RaiseToGruond(wagon);
    wagon.trfmBase.TranslateByAxes(-1.5, 0.0, -8.0);

    RaiseToGruond(barn.obj);
    barn.obj.trfmBase.TranslateByAxes(0.0, 0.0, 20.0);
    barn.obj.trfmBase.SetUpdatedRot(VEC3_UP, 115);

    var cows = [];
    var MAX_COWS = 10;
    var bales = [];
    var MAX_BALES = 10;

    for(var i = 0; i < MAX_COWS; i++ ) {
        cows[i] = new Cow();
        if(i < 5) cows[i].obj.trfmBase.TranslateByAxes(3.0, 0.0, -i * 6);
        else cows[i].obj.trfmBase.TranslateByAxes(-3.0, 0.0, ((-i + (MAX_COWS / 2)) * 6));

        bales[i] = new HayBale();
        if(i < 5) bales[i].obj.trfmBase.TranslateByAxes(6.0, 0.0, -i * 6);
        else bales[i].obj.trfmBase.TranslateByAxes(-6.0, 0.0, ((-i + (MAX_BALES / 2)) * 6));
    }

    // BUILD UP HUD FOR THIS SCENE -------------------------------------------------------

    var ammoTypes = { cow: 0, hayBale: 1 };

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
    var caughtCowInfo = new GUITextObject(new WndRect(0, hud.sysRect.h - 64, 128, 64), "00", style);
    hud.AddTextObject(caughtCowInfo);
    caughtCowInfo.UpdateMsg('0');

    style.bgTextures = [GameMngr.assets.textures['baleIcon']];
    var caughtBaleInfo = new GUITextObject(new WndRect(0, caughtCowInfo.rectLocal.y - 69, 128, 64), "00", style);
    hud.AddTextObject(caughtBaleInfo);
    caughtBaleInfo.UpdateMsg('0');

    var hudAmmoMsgs = [
        caughtCowInfo,
        caughtBaleInfo
    ];

    // Abduction Details
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.bottom;
    style.fontSize = 24;
    // The images are 64 x 128, but with the bottom 28 clear, to not waste space,
    // Thus this margin needs to be here to elevate the text to compensate for the clear space.
    style.margin = 12.0;

    style.bgTextures = [GameMngr.assets.textures['rescueIcon']];
    var rescueInfo = new GUITextObject(new WndRect(hud.sysRect.w - 64, 0, 64, 128), "00", style);
    hud.AddTextObject(rescueInfo);
    rescueInfo.UpdateMsg('0');

    style.bgTextures = [GameMngr.assets.textures['abductIcon']];
    var abductionInfo = new GUITextObject(new WndRect(rescueInfo.rectLocal.x - 69, 0, 64, 128), "00", style);
    hud.AddTextObject(abductionInfo);
    abductionInfo.UpdateMsg('0');


    // Power info
    var powerBarStyle = new ProgressObjStyle();
    powerBarStyle.bgColour.SetValues(0.1, 0.1, 0.1);
    powerBarStyle.fgColour.SetValues(0.8, 0.5, 0.2);
    var barRect = new WndRect((hud.sysRect.w / 2) - 200, hud.sysRect.h - 30, 400, 20);
    var launchPowerBar = new GUIProgressBar(barRect, Axes.x, powerBarStyle);
    hud.AddProgressObject(launchPowerBar);
    launchPowerBar.UpdateValue(0.0);

    style.fontSize = 20;
    style.margin = 5.0;
    style.textMaxWidth = 25;
    style.textAlignHeight = Alignment.centre;
    style.bgTextures = [];
    style.bgAlpha = 0.5;
    style.bgColour.SetValues(1.0, 1.0, 1.0);
    style.fontColour.SetValues(0.0, 0.0, 0.0);
    var launchPowerMsg = new GUITextObject(new WndRect(barRect.x + 110, barRect.y - 35, barRect.w - 220, 30), "Extra Power", style);
    hud.AddTextObject(launchPowerMsg);

    launchPowerBar.SetActive(false);
    launchPowerMsg.SetActive(false);


    var UpdateHUDAmmoSelection = function(ammoIdx) {
        for(var i = 0; i < hudAmmoMsgs.length; i++) {
            hudAmmoMsgs[i].SetObjectFade(0.66);
        }
        hudAmmoMsgs[ammoIdx].SetObjectFade(1.0);
    };
    var UpdateHUDAmmoCount = function(ammoIdx, count) {
        hudAmmoMsgs[ammoIdx].UpdateMsg("" + count);
    };
    var UpdateHUDAbductionCount = function() {
        rescueInfo.UpdateMsg("" + cowsSaved);
        abductionInfo.UpdateMsg("" + cowsAbducted);
    };
    var UpdateHUDPowerLevel = function(power) {
        launchPowerBar.UpdateValue(power);
    };
    player.SetAmmoSelectionCallback(UpdateHUDAmmoSelection);
    player.SetAmmoCountChangeCallback(UpdateHUDAmmoCount);
    player.SetPowerChangeCallback(UpdateHUDPowerLevel);


    // SCENE OBJECT INTERACTIONS ---------------------------------------------------------

    var abductee = null;
    var ufoToCowDistSqr = 0.0;
    var ufoToCowDirVec = new Vector2();
    var tempDirVec = new Vector2();

    var cowsAbducted = 0,
        cowsSaved = 0;

    // Arena containment
    var leftWall = fence.shapeData.min.x,
        rightWall = fence.shapeData.max.x,
        backWall = fence.shapeData.max.z,
        frontWall = fence.shapeData.min.z;
    function ContainRigidBody(gameObj) {
        if((gameObj.trfmGlobal.pos.x < leftWall + gameObj.shapeData.radii.x && gameObj.rigidBody.velF.x < 0) ||
            (gameObj.trfmGlobal.pos.x > rightWall - gameObj.shapeData.radii.x && gameObj.rigidBody.velF.x > 0))
            gameObj.rigidBody.velF.x = -gameObj.rigidBody.velF.x;

        if((gameObj.trfmGlobal.pos.z < frontWall + gameObj.shapeData.radii.z && gameObj.rigidBody.velF.z < 0) ||
            (gameObj.trfmGlobal.pos.z > backWall - gameObj.shapeData.radii.z && gameObj.rigidBody.velF.z > 0))
            gameObj.rigidBody.velF.z = -gameObj.rigidBody.velF.z;
    }

    // Barn collisions
    function BarnCollCallback(collider) {
        if(collider.gameObj.name == "cow") {
            var abductee = null;
            for (var i = 0; i < cows.length; i++)
                if (cows[i].obj == collider.gameObj)
                    abductee = cows[i];

            if(abductee) {
                cowsSaved++;
                UpdateHUDAbductionCount();
                cows.splice(cows.indexOf(abductee), 1);
                abductee.SetVisible(false);
            }
        }
        else {
            if(collider.suppShapeList[0].obj.IntersectsSphere(barn.obj.collider.collSphere)) {
                var repelVel = collider.trfm.pos.GetSubtract(barn.obj.trfmGlobal.pos);
                collider.rigidBody.velF = repelVel;
            }
        }
    }
    barn.obj.collider.SetSphereCall(BarnCollCallback);

    // Player collisions
    function PlayerCollCallback(collider) {
        if(collider.gameObj.label == Labels.ammo) {
            var objToEyeVec = new Vector2(player.obj.trfmGlobal.pos.x - collider.trfm.pos.x, player.obj.trfmGlobal.pos.z - collider.trfm.pos.z);
            var objToEyeDistSqr = objToEyeVec.GetMagSqr();

            // This format allows not only for objects to only be captured if they are within the given radius,
            // but ensures that their velocities don't explode at heights above the tornado:
            // No force is applied if they're directly above the funnel.
            if (collider.trfm.pos.y < player.height) {
                if (objToEyeDistSqr < player.captureRadius * player.captureRadius) {

                    if (collider.gameObj.name == "cow")
                        player.Capture(ammoTypes.cow, collider.gameObj);
                    else if (collider.gameObj.name == "hay bale")
                        player.Capture(ammoTypes.hayBale, collider.gameObj);
                }
                else {
                    player.Twister(collider.rigidBody, objToEyeVec, objToEyeDistSqr);
                }
            }
        }
    }
    player.obj.collider.SetSphereCall(PlayerCollCallback);


    // Pulling cow from Player
    var cowSoughtFromPlayerIdx = -1;
    var cowSceneListIdx = -1;
    var ReleaseCowCallback = function() {
        if(cowSoughtFromPlayerIdx != -1) {
            player.ReleaseAmmoAbove(ammoTypes.cow, cowSoughtFromPlayerIdx);
            cows[cowSceneListIdx].SetGravBlock(true);
            cows[cowSceneListIdx].gravForce.active = false;
        }
    };
    ufo.SetTractorBeamingCallback(ReleaseCowCallback);

    // -----------------------------------------------------------------------------------

    function Start() {

        player.AddAmmoContainer(ammoTypes.cow);
        player.AddAmmoContainer(ammoTypes.hayBale);

        ufo.SetActive(true);
        //for(var i = 0; i < MAX_COWS; i++ ) {

        //}
    }

    function Update() {
        ContainRigidBody(player.obj);

        if(player.GetAimToggleHeld()) {
            launchPowerBar.SetActive(true);
            launchPowerMsg.SetActive(true);
        }
        else {
            launchPowerBar.SetActive(false);
            launchPowerMsg.SetActive(false);
        }

        if(cows.length > 0) {
            ufoToCowDistSqr = 999999;
            for (var i = 0; i < cows.length; i++) {
                cows[i].Update();
                ContainRigidBody(cows[i].obj);

                // Which cow to go after
                tempDirVec.SetValues(
                    cows[i].obj.trfmGlobal.pos.x - ufo.obj.trfmGlobal.pos.x,
                    cows[i].obj.trfmGlobal.pos.z - ufo.obj.trfmGlobal.pos.z);
                var tempDistSqr = tempDirVec.GetMagSqr();
                if (tempDistSqr < ufoToCowDistSqr) {
                    ufoToCowDistSqr = tempDistSqr;
                    ufoToCowDirVec.SetCopy(tempDirVec);
                    if(!ufo.tractoring)
                        abductee = cows[i];
                }
            }
            if(!ufo.tractoring) {
                // If abductee is in the tornado, remove from tornado's ammo
                cowSoughtFromPlayerIdx = player.GetAmmoIdx(ammoTypes.cow, abductee.obj);
                cowSceneListIdx = (cowSoughtFromPlayerIdx != -1) ? cows.indexOf(abductee) : -1;
            }

            if(ufo.Abduct(abductee, ufoToCowDistSqr, ufoToCowDirVec)) {
                cowsAbducted++;
                UpdateHUDAbductionCount();
                cows.splice(cows.indexOf(abductee), 1);
                abductee.SetVisible(false);
            }
        }

        for(var i = 0; i < bales.length; i++ ) {
            bales[i].Update();
            ContainRigidBody(bales[i].obj);
        }
    }

    function End() {

    }

    scene.Add(fence);
    scene.Add(wagon);
    for(var i = 0; i < MAX_COWS; i++ ) {
        scene.Add(cows[i].obj);
        scene.Add(bales[i].obj);
    }

    scene.SetCallbacks(Start, Update, End);
}