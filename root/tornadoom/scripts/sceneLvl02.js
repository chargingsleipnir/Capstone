/**
 * Created by Devin on 2015-03-27.
 */

function BuildLvl02(scene, player, barn, hud) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.25;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);
    scene.light.pnt.bright = 0.0;
    scene.light.pnt.pos.SetValues(0.0, 0.0, 0.0);

    var fence = new GameObject('fence', Labels.none);
    fence.SetModel(GameMngr.assets.models['lvl02Fence']);
    fence.mdlHdlr.SetTexture(GameMngr.assets.textures['fenceTex'], TextureFilters.mipmap);
    GameUtils.RaiseToGroundLevel(fence);

    var cowPos = [
        [3.0, 0.0, -12.0],
        [-4.0, 0.0, -10.0],
        [0.0, 0.0, -10.0],
        [4.0, 0.0, -10.0],
        [-3.0, 0.0, -13.0],
        [2.0, 0.0, -5.0]
    ];
    var balePos = [
        [3.0, 0.0, -8.0],
        [-4.0, 0.0, -6.0],
        [0.0, 0.0, -6.0],
        [4.0, 0.0, -6.0]
    ];
    var cows = [];
    var MAX_COWS = 6;
    var haybales = [];
    var MAX_BALES = 4;

    // Barn collisions
    function BarnCollCallback(collider) {
        if(collider.gameObj.name == "cow") {
            // Loop needed to compare GameObjects before using cow's GameObject wrapper
            for (var i = 0; i < cows.length; i++)
                if (cows[i].obj == collider.gameObj) {
                    cows[i].SetVisible(false);
                    cows.splice(cows.indexOf(cows[i]), 1);
                    GameUtils.CowsSavedIncr();
                    hud.guiTextObjs["rescueInfo"].UpdateMsg("" + GameUtils.GetCowsSaved());
                }
        }
        else {
            if(collider.suppShapeList[0].obj.IntersectsSphere(barn.obj.collider.collSphere)) {
                collider.rigidBody.velF = collider.trfm.pos.GetSubtract(barn.obj.trfmGlobal.pos);
            }
        }
    }
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

    // Level Repeat functions ==========================================================================================

    function Start() {
        barn.obj.trfmBase.SetPosByAxes(-10.0, 0.0, 10.0);
        barn.obj.trfmBase.SetUpdatedRot(VEC3_UP, 225);
        barn.obj.collider.SetSphereCall(BarnCollCallback);
        GameUtils.RaiseToGroundLevel(barn.obj);
        GameUtils.CowsSavedZero();
        GameUtils.SetLevelBounds(fence);

        player.ResetMotion();
        player.obj.collider.SetSphereCall(PlayerCollCallback);
        player.AddAmmoContainer(GameUtils.ammoTypes.hayBale);

        for(var i = 0; i < MAX_COWS; i++ ) {
            cows[i] = new Cow();
            cows[i].obj.trfmBase.SetPosByAxes(cowPos[i][0], cowPos[i][1], cowPos[i][2]);
            GameUtils.RaiseToGroundLevel(cows[i].obj);
            scene.Add(cows[i].obj);
        }
        for(var i = 0; i < MAX_BALES; i++ ) {
            haybales[i] = new HayBale();
            haybales[i].obj.trfmBase.SetPosByAxes(balePos[i][0], balePos[i][1], balePos[i][2]);
            GameUtils.RaiseToGroundLevel(haybales[i].obj);
            scene.Add(haybales[i].obj);
        }

        hud.guiTextObjs["caughtBaleInfo"].SetActive(true);
    }

    function Update() {
        GameUtils.ContainInLevelBoundsUpdate(player.obj);

        for (var i = 0; i < cows.length; i++) {
            cows[i].Update();
            GameUtils.ContainInLevelBoundsUpdate(cows[i].obj);
        }
        for (var i = 0; i < haybales.length; i++) {
            haybales[i].Update();
            GameUtils.ContainInLevelBoundsUpdate(haybales[i].obj);
        }

        if(player.GetAimToggleHeld()) {
            hud.guiProgObjs["launchPowerBar"].SetActive(true);
            hud.guiTextObjs["launchPowerMsg"].SetActive(true);
        }
        else {
            hud.guiProgObjs["launchPowerBar"].SetActive(false);
            hud.guiTextObjs["launchPowerMsg"].SetActive(false);
        }

        if(GameUtils.GetCowsSaved() >= MAX_COWS)
            SceneMngr.SetActive("Level 03");
    }

    function End() {
        cows = [];
        haybales = [];
        player.ClearAmmo();
        GameUtils.CowsSavedZero();
        hud.guiTextObjs["rescueInfo"].UpdateMsg("0");
        hud.guiTextObjs["caughtCowInfo"].UpdateMsg('0');
        hud.guiTextObjs["caughtBaleInfo"].UpdateMsg('0');
    }

    scene.Add(fence);
    scene.SetCallbacks(Start, Update, End);
}