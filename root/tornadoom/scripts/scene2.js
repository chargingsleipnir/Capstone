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
    barn.obj.trfmBase.TranslateByAxes(1.7, 0.0, -8.0);

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

    style.bgTextures = [GameMngr.assets.textures['baleIcon']];
    var caughtBaleInfo = new GUIObject(new WndRect(0, hud.sysRect.h - 68, 132, 68), "00", style);
    hud.AddGUIObject(caughtBaleInfo);
    caughtBaleInfo.UpdateMsg('0');

    style.bgTextures = [GameMngr.assets.textures['cowIcon']];
    var caughtCowInfo = new GUIObject(new WndRect(0, caughtBaleInfo.rectLocal.y - 78, 132, 68), "00", style);
    hud.AddGUIObject(caughtCowInfo);
    caughtCowInfo.UpdateMsg('0');

    var hudAmmoMsgs = [
        caughtCowInfo,
        caughtBaleInfo
    ];

    style.fontSize = 24;
    style.margin = 5.0;
    style.textMaxWidth = 25;
    style.textAlignWidth = Alignment.left;
    style.bgTextures = [];
    style.fontColour = new Vector3(1.0, 1.0, 1.0);
    var launchPowerMsg = new GUIObject(new WndRect(0, 0, 285, 40), "Extra Power: 000", style);
    hud.AddGUIObject(launchPowerMsg);
    launchPowerMsg.UpdateMsg("Extra Power: " + 0);

    var UpdateHUDAmmoSelection = function(ammoIdx) {
        for(var i = 0; i < hudAmmoMsgs.length; i++) {
            hudAmmoMsgs[i].SetObjectFade(0.66);
        }
        hudAmmoMsgs[ammoIdx].SetObjectFade(1.0);
    };
    var UpdateHUDAmmoCount = function(ammoIdx, count) {
        hudAmmoMsgs[ammoIdx].UpdateMsg("" + count);
    };
    var UpdateHUDPowerLevel = function(power) {
        launchPowerMsg.UpdateMsg("Extra Power: " + power);
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
                console.log("Cows saved: " + cowsSaved);
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
            if (objToEyeDistSqr < player.captureRadius * player.captureRadius) {
                if (collider.trfm.pos.y < player.height) {
                    if(collider.gameObj.name == "cow")
                        player.Capture(ammoTypes.cow, collider.gameObj);
                    else if(collider.gameObj.name == "hay bale")
                        player.Capture(ammoTypes.hayBale, collider.gameObj);
                }
            }
            else {
                player.Twist(collider.rigidBody, objToEyeVec, objToEyeDistSqr);
            }
        }
    }
    player.obj.collider.SetSphereCall(PlayerCollCallback);

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
                    abductee = cows[i];
                    ufoToCowDirVec.SetCopy(tempDirVec);
                }
            }
            if(ufo.Abduct(abductee, ufoToCowDistSqr, ufoToCowDirVec)) {
                cowsAbducted++;
                console.log("Cows abducted: " + cowsAbducted);
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