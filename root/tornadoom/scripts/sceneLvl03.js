/**
 * Created by Devin on 2015-03-27.
 */

function BuildLvl03(scene, player, barn, cows, haybales, ufo, hud) {

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
        [-24.0, 0.0, -10.0],
        [20.0, 0.0, -10.0],
        [4.0, 0.0, -10.0],
        [-23.0, 0.0, -13.0],
        [14.0, 0.0, 21.0],
        [-7.0, 0.0, 7.0],
        [-12.0, 0.0, -10.0],
        [12.0, 0.0, 10.0],
        [-2.0, 0.0, 17.0]
    ];
    var balePos = [
        [23.0, 0.0, -8.0],
        [-17.0, 0.0, -6.0],
        [0.0, 0.0, -26.0],
        [9.0, 0.0, -14.0],
        [13.0, 0.0, -8.0],
        [-4.0, 0.0, -21.0],
        [2.0, 0.0, -6.0],
        [14.0, 0.0, -1.0],
        [25.0, 0.0, -8.0],
        [-11.0, 0.0, -6.0]
    ];
    var activeCows = [];

    // Barn collisions - Needs to be new to accomodate new cows.length
    function BarnCollCallback(collider) {
        if(collider.gameObj.name == "cow") {
            // Loop needed to compare GameObjects before using cow's GameObject wrapper
            for (var i = 0; i < activeCows.length; i++)
                if (activeCows[i].obj == collider.gameObj) {
                    activeCows[i].SetVisible(false);
                    activeCows.splice(activeCows.indexOf(activeCows[i]), 1);
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
        barn.obj.trfmBase.SetPosByAxes(15.0, 0.0, -5.0);
        barn.obj.trfmBase.SetUpdatedRot(VEC3_UP, 30);
        barn.obj.collider.SetSphereCall(BarnCollCallback);
        GameUtils.RaiseToGroundLevel(barn.obj);
        GameUtils.CowsSavedZero();
        GameUtils.SetLevelBounds(fence);

        ufo.SetTractorBeamingCallback(ReleaseCowCallback);
        ufo.SetActive(true);

        player.ResetMotion();
        // Players sphere call still stands from last level

        for(var i = 0; i < cows.length; i++ ) {
            cows[i].SetVisible(true);
            cows[i].obj.trfmBase.SetPosByAxes(cowPos[i][0], cowPos[i][1], cowPos[i][2]);
            GameUtils.RaiseToGroundLevel(cows[i].obj);
        }
        activeCows = cows.slice();
        for(var i = 0; i < haybales.length; i++ ) {
            haybales[i].obj.trfmBase.SetPosByAxes(balePos[i][0], balePos[i][1], balePos[i][2]);
            GameUtils.RaiseToGroundLevel(haybales[i].obj);
        }

        hud.guiTextObjs["abductionInfo"].SetActive(true);
    }

    function Update() {
        player.Update();
        ufo.Update();
        barn.Update();

        GameUtils.ContainInLevelBoundsUpdate(player.obj);

        if(activeCows.length > 0) {
            ufoToCowDistSqr = 999999;
            for (var i = 0; i < activeCows.length; i++) {
                activeCows[i].Update();
                GameUtils.ContainInLevelBoundsUpdate(activeCows[i].obj);

                // Which cow to go after
                tempDirVec.SetValues(
                    activeCows[i].obj.trfmGlobal.pos.x - ufo.obj.trfmGlobal.pos.x,
                    activeCows[i].obj.trfmGlobal.pos.z - ufo.obj.trfmGlobal.pos.z);
                var tempDistSqr = tempDirVec.GetMagSqr();
                if (tempDistSqr < ufoToCowDistSqr) {
                    ufoToCowDistSqr = tempDistSqr;
                    ufoToCowDirVec.SetCopy(tempDirVec);
                    if(!ufo.tractoring)
                        abductee = activeCows[i];
                }
            }
            if(!ufo.tractoring) {
                // If abductee is in the tornado, remove from tornado's ammo
                cowSoughtFromPlayerIdx = player.GetAmmoIdx(GameUtils.ammoTypes.cow, abductee.obj);
                cowSceneListIdx = (cowSoughtFromPlayerIdx != -1) ? activeCows.indexOf(abductee) : -1;
            }

            if(ufo.Abduct(abductee, ufoToCowDistSqr, ufoToCowDirVec)) {
                GameUtils.CowsAbductedIncr();
                hud.guiTextObjs["abductionInfo"].UpdateMsg("" + GameUtils.GetCowsAbducted());
                activeCows.splice(activeCows.indexOf(abductee), 1);
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
        ufo.SetActive(false);
        activeCows.splice(0, activeCows.length);
        player.ClearAmmo();
        GameUtils.CowsSavedZero();
        GameUtils.CowsAbductedZero();
        hud.guiTextObjs["rescueInfo"].UpdateMsg("0");
        hud.guiTextObjs["abductionInfo"].UpdateMsg('0');
        hud.guiTextObjs["caughtCowInfo"].UpdateMsg('0');
        hud.guiTextObjs["caughtBaleInfo"].UpdateMsg('0');
    }

    for(var i = 0; i < cows.length; i++ )
        scene.Add(cows[i].obj);
    for(var i = 0; i < haybales.length; i++ )
        scene.Add(haybales[i].obj);
    scene.Add(fence);
    scene.SetCallbacks(Start, Update, End);
}