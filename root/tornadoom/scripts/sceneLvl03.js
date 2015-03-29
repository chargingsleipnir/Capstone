/**
 * Created by Devin on 2015-03-27.
 */

function BuildLvl03(scene, player, barn, ufo, hud) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.25;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);
    scene.light.pnt.bright = 0.0;
    scene.light.pnt.pos.SetValues(0.0, 0.0, 0.0);

    var fence = new GameObject('fence', Labels.none);
    fence.SetModel(GameMngr.assets.models['lvl03Fence']);
    fence.mdlHdlr.SetTexture(GameMngr.assets.textures['fenceTex'], TextureFilters.mipmap);
    GameUtils.RaiseToGroundLevel(fence);

    var abductee = null,
        ufoToCowDistSqr = 0.0,
        ufoToCowDirVec = new Vector2(),
        tempDirVec = new Vector2();

    var cowPos = [
        [3.0, 0.0, -12.0],
        [-4.0, 0.0, -10.0],
        [0.0, 0.0, -10.0],
        [4.0, 0.0, -10.0],
        [-3.0, 0.0, -13.0],
        [14.0, 0.0, 1.0],
        [-7.0, 0.0, 7.0],
        [-12.0, 0.0, -10.0],
        [12.0, 0.0, 10.0],
        [-2.0, 0.0, 17.0]
    ];
    var balePos = [
        [3.0, 0.0, -8.0],
        [-17.0, 0.0, -6.0],
        [0.0, 0.0, -6.0],
        [9.0, 0.0, -14.0],
        [13.0, 0.0, -8.0],
        [-4.0, 0.0, -1.0],
        [2.0, 0.0, -6.0],
        [14.0, 0.0, -3.0],
        [5.0, 0.0, -8.0],
        [-11.0, 0.0, -6.0]
    ];
    var cows = [];
    var MAX_COWS = 10;
    var haybales = [];
    var MAX_BALES = 10;

    // Barn collisions - Needs to be new to accomodate new cows.length
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
    // Pulling cow from Player
    var cowSoughtFromPlayerIdx = -1;
    var cowSceneListIdx = -1;
    var ReleaseCowCallback = function() {
        if(cowSoughtFromPlayerIdx != -1) {
            player.ReleaseAmmoAbove(GameUtils.ammoTypes.cow, cowSoughtFromPlayerIdx);
            cows[cowSceneListIdx].SetGravBlock(true);
            cows[cowSceneListIdx].gravForce.active = false;
        }
    };


    // Level Repeat functions ==========================================================================================

    function Start() {
        barn.obj.trfmBase.SetPosByAxes(10.0, 0.0, -10.0);
        barn.obj.trfmBase.SetUpdatedRot(VEC3_UP, 30);
        barn.obj.collider.SetSphereCall(BarnCollCallback);
        GameUtils.RaiseToGroundLevel(barn.obj);
        GameUtils.CowsSavedZero();
        GameUtils.SetLevelBounds(fence);

        ufo.SetTractorBeamingCallback(ReleaseCowCallback);
        ufo.SetActive(true);

        player.ResetMotion();
        // Players sphere call still stands from last level

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

        hud.guiTextObjs["abductionInfo"].SetActive(true);
    }

    function Update() {
        GameUtils.ContainInLevelBoundsUpdate(player.obj);

        if(cows.length > 0) {
            ufoToCowDistSqr = 999999;
            for (var i = 0; i < cows.length; i++) {
                cows[i].Update();
                GameUtils.ContainInLevelBoundsUpdate(cows[i].obj);

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
                cowSoughtFromPlayerIdx = player.GetAmmoIdx(GameUtils.ammoTypes.cow, abductee.obj);
                cowSceneListIdx = (cowSoughtFromPlayerIdx != -1) ? cows.indexOf(abductee) : -1;
            }

            if(ufo.Abduct(abductee, ufoToCowDistSqr, ufoToCowDirVec)) {
                GameUtils.CowsAbductedIncr();
                hud.guiTextObjs["abductionInfo"].UpdateMsg("" + GameUtils.GetCowsAbducted());
                cows.splice(cows.indexOf(abductee), 1);
                abductee.SetVisible(false);
            }
        }
        else {
            console.log("gameover");
            //SceneMngr.SetActive("end");
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
    }

    function End() {
        cows = [];
        haybales = [];
        player.ClearAmmo();
        GameUtils.CowsSavedZero();
        hud.guiTextObjs["rescueInfo"].UpdateMsg("0");
        hud.guiTextObjs["abductionInfo"].UpdateMsg('0');
        hud.guiTextObjs["caughtCowInfo"].UpdateMsg('0');
        hud.guiTextObjs["caughtBaleInfo"].UpdateMsg('0');
    }

    scene.Add(fence);
    scene.SetCallbacks(Start, Update, End);
}