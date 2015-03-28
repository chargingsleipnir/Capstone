/**
 * Created by Devin on 2015-03-27.
 */

function BuildLvl01(scene, player, barn, cows, hud) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.25;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);
    scene.light.pnt.bright = 0.0;
    scene.light.pnt.pos.SetValues(0.0, 0.0, 0.0);

    var fence = new GameObject('fence', Labels.none);
    fence.SetModel(GameMngr.assets.models['lvl01Fence']);
    fence.mdlHdlr.SetTexture(GameMngr.assets.textures['fenceTex'], TextureFilters.mipmap);
    GameUtils.RaiseToGroundLevel(fence);

    var cowPos = [
        [3.0, 0.0, -12.0],
        [-4.0, 0.0, -10.0],
        [0.0, 0.0, -10.0],
        [4.0, 0.0, -10.0]
    ];

    var phase1Complete = false;

    // Barn collisions
    function BarnCollCallback(collider) {
        if(collider.gameObj.name == "cow") {
            // Loop needed to compare GameObjects before using cow's GameObject wrapper
            for (var i = 0; i < cows.length; i++)
                if (cows[i].obj == collider.gameObj) {
                    cows[i].SetVisible(false);
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
                }
                else {
                    player.Twister(collider.rigidBody, objToEyeVec, objToEyeDistSqr);
                }
            }
        }
    }

    function InitPhase2() {
        phase1Complete = true;
        for(var i = 1; i < cows.length; i++ ) {
            cows[i].SetVisible(true);
        }
    }

    // Level Repeat functions ==========================================================================================

    function Start() {
        barn.obj.trfmBase.SetPosByAxes(0.0, 0.0, 20.0);
        barn.obj.trfmBase.SetUpdatedRot(VEC3_UP, 115);
        barn.obj.collider.SetSphereCall(BarnCollCallback);
        GameUtils.RaiseToGroundLevel(barn.obj);

        GameUtils.SetLevelBounds(fence);
        GameUtils.CowsSavedZero();

        player.ResetMotion();
        player.obj.collider.SetSphereCall(PlayerCollCallback);
        player.AddAmmoContainer(GameUtils.ammoTypes.cow);

        for(var i = 0; i < cows.length; i++ ) {
            cows[i].SetVisible(false);
            cows[i].obj.trfmBase.SetPosByAxes(cowPos[i][0], cowPos[i][1], cowPos[i][2]);
            GameUtils.RaiseToGroundLevel(cows[i].obj);
        }
        cows[0].SetVisible(true);

        hud.guiTextObjs["caughtCowInfo"].SetActive(true);
        hud.guiTextObjs["rescueInfo"].SetActive(true);

        phase1Complete = false;
    }

    function Update() {
        GameUtils.ContainInLevelBoundsUpdate(player.obj);

        for (var i = 0; i < cows.length; i++) {
            cows[i].Update();
            GameUtils.ContainInLevelBoundsUpdate(cows[i].obj);
        }

        if(!phase1Complete) {
            if (GameUtils.GetCowsSaved() == 1)
                InitPhase2();
        }
        else {
            if(GameUtils.GetCowsSaved() >= cows.length)
                SceneMngr.SetActive("Level 02");
        }

    }

    function End() {
        for(var i = 0; i < cows; i++ )
            cows[i].SetVisible(true);

        GameUtils.CowsSavedZero();
        hud.guiTextObjs["rescueInfo"].UpdateMsg("0");
    }

    scene.Add(fence);
    scene.SetCallbacks(Start, Update, End);
}