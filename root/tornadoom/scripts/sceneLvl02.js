/**
 * Created by Devin on 2015-03-27.
 */

function BuildLvl02(scene, player, barn, cows, haybales, hud, nextBtn, lvlCompMsg) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.25;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);
    scene.light.pnt.bright = 0.0;
    scene.light.pnt.pos.SetValues(0.0, 0.0, 0.0);

    // Objects ==========================================================================================

    var fence = new GameObject('fence', Labels.none);
    fence.SetModel(GameMngr.assets.models['lvl02Fence']);
    fence.mdlHdlr.SetTexture(GameMngr.assets.textures['fenceTex'], TextureFilters.mipmap);
    GameUtils.RaiseToGroundLevel(fence);

    var cowPos = [
        [13.0, 0.0, 22.0],
        [-24.0, 0.0, 10.0],
        [10.0, 0.0, 20.0],
        [-24.0, 0.0, 17.0],
        [-13.0, 0.0, 13.0],
        [22.0, 0.0, 25.0]
    ];
    var balePos = [
        [-13.0, 0.0, 8.0],
        [-4.0, 0.0, 26.0],
        [9.0, 0.0, 13.0],
        [24.0, 0.0, 19.0]
    ];
    var activeCows = [];
    var activeHaybales = [];

    var MAX_PROBES = 5;
    var allProbes = [];
    var probePos = [
        [0.0, 0.0, -25.0],
        [0.0, 0.0, -12.0],
        [0.0, 0.0, -31.0],
        [0.0, 0.0, -6.0],
        [0.0, 0.0, -37.0]
    ];
    var probeSpeeds = [
        10.0, 14.0, 18.0, 22.0, 26.0
    ];
    var probeWaypointSets = [
        [[-5.0, 1.0, -25.0], [-5.0, 2.0, -15.0], [5.0, 1.0, -15.0], [5.0, 2.0, -25.0]],
        [[-8.0, 3.0, -12.0], [-8.0, 1.0, -28.0], [8.0, 3.0, -28.0], [8.0, 1.0, -12.0]],
        [[-11.0, 3.0, -31.0], [-11.0, 1.0, -9.0], [11.0, 3.0, -9.0], [11.0, 1.0, -31.0]],
        [[-14.0, 1.0, -6.0], [-14.0, 2.0, -34.0], [14.0, 1.0, -34.0], [14.0, 2.0, -6.0]],
        [[-17.0, 2.0, -37.0], [-17.0, 1.0, -3.0], [17.0, 2.0, -3.0], [17.0, 1.0, -37.0]]
    ];

    for(var i = 0; i < MAX_PROBES; i++)
        allProbes[i] = new Probe(probeWaypointSets[i], probeSpeeds[i]);
    var activeProbes = [];

    // Barn collisions
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

    // Level Phases ==========================================================================================

    var msgs = [
        // Part 1
        "I knew I felt somethin' a comin'... what are these crazy things?",
        "They can't seem to get into my barn, but more of my cattle are exposed. Can you get them in here?",
        "Make sure ya don't touch one; They're movin' pretty darn fast, and I don't think that airy funnel of yours can take the impact!",
        "Don't let one of my babies hit those things either, or it'll be a goner for sure. The hay bales I'm not so worried about.",
        "If you capture any hay bales, press the { and } keys to switch what you want to shoot.",
        // Part 2
        "Not sure how to get them over this far? You'll have to put some extra power behind it.",
        "Hold Spacebar to get ready for a power-shot!",
        "In this view, move the mouse to aim, hold the left mouse button to build extra power, and release to fire!"
    ];
    InGameMsgr.AddMsgSequence("level02", msgs);
    var msgLimit,
        lvlPhases;

    // Level Repeat functions ==========================================================================================

    function Start() {

        //barn.obj.trfmBase.SetPosByAxes(-10.0, 0.0, 10.0);
        //barn.obj.trfmBase.SetUpdatedRot(VEC3_UP, 225);
        barn.obj.collider.SetSphereCall(BarnCollCallback);
        barn.obj.trfmBase.SetPosByAxes(0.0, 0.0, -20.0);
        GameUtils.RaiseToGroundLevel(barn.obj);
        GameUtils.CowsSavedZero();
        GameUtils.SetLevelBounds(fence);

        player.ResetMotion();
        player.obj.trfmBase.SetPosByAxes(0.0, 0.0, 20);
        GameUtils.RaiseToGroundLevel(player.obj);
        player.AddAmmoContainer(GameUtils.ammoTypes.hayBale);

        for(var i = 0; i < cows.length; i++ ) {
            cows[i].SetVisible(true);
            cows[i].obj.trfmBase.SetPosByAxes(cowPos[i][0], cowPos[i][1], cowPos[i][2]);
            GameUtils.RaiseToGroundLevel(cows[i].obj);
        }
        activeCows = cows.slice();
        GameUtils.CowsEncounteredAdd(activeCows.length);

        for(var i = 0; i < haybales.length; i++ ) {
            haybales[i].obj.trfmBase.SetPosByAxes(balePos[i][0], balePos[i][1], balePos[i][2]);
            GameUtils.RaiseToGroundLevel(haybales[i].obj);
        }
        activeHaybales = haybales.slice();

        for(var i = 0; i < MAX_PROBES; i++) {
            allProbes[i].SetVisible(true);
            allProbes[i].obj.trfmBase.SetPosByAxes(probePos[i][0], probePos[i][1], probePos[i][2]);
            GameUtils.RaiseToGroundLevel(allProbes[i].obj);
            allProbes[i].SetCollidables(player.obj, activeCows, activeHaybales);
        }
        activeProbes = allProbes.slice();

        InGameMsgr.ChangeMsgSequence("level02");
        scene.SetLoopCallback(MsgUpdate);
        player.SetControlActive(false);
        msgLimit = 5;
        lvlPhases = 0;

        hud.guiTextObjs["caughtBaleInfo"].SetActive(true);
    }

    function CommonUpdate() {
        player.Update();
        barn.Update();
        GameUtils.ContainInLevelBoundsUpdate(player.obj);
        for(var i = 0; i < activeProbes.length; i++) {
            activeProbes[i].Update();
        }
        for (var i = 0; i < activeCows.length; i++) {
            activeCows[i].Update();
            GameUtils.ContainInLevelBoundsUpdate(activeCows[i].obj);
        }
        for (var i = 0; i < activeHaybales.length; i++) {
            activeHaybales[i].Update();
            GameUtils.ContainInLevelBoundsUpdate(activeHaybales[i].obj);
        }
    }
    function MsgUpdate() {
        CommonUpdate();
        if(InGameMsgr.FadeMsgsWithinLimit(msgLimit)) {
            if (nextBtn.pressed) {
                InGameMsgr.NextMsg();
                nextBtn.Release();
            }
        }
        else {
            scene.SetLoopCallback(GameplayUpdate);
            player.SetControlActive(true);
        }
    }
    function GameplayUpdate() {
        CommonUpdate();
        if(player.GetAimToggleHeld()) {
            hud.guiProgObjs["launchPowerBar"].SetActive(true);
            hud.guiTextObjs["launchPowerMsg"].SetActive(true);
        }
        else {
            hud.guiProgObjs["launchPowerBar"].SetActive(false);
            hud.guiTextObjs["launchPowerMsg"].SetActive(false);
        }

        switch(lvlPhases) {
            case 0:
                if(player.GetAmmoCount(GameUtils.ammoTypes.cow) == 1) {
                    msgLimit = 8;
                    lvlPhases++;
                    scene.SetLoopCallback(MsgUpdate);
                    player.SetControlActive(false);
                }
                break;
            case 1:
                if(activeCows.length <= 0) {
                    // Must save at least half
                    if (GameUtils.GetCowsSaved() >= Math.ceil(cows.length / 2.0)) {
                        lvlCompMsg.SetActive(true);
                        player.SetControlActive(false);
                        lvlPhases++;
                    }
                    else
                        SceneMngr.SetActive("End Screen Lose");
                }
                break;
            case 2:
                if (nextBtn.pressed) {
                    lvlCompMsg.SetActive(false);
                    player.SetControlActive(true);
                    SceneMngr.SetActive("Level 03");
                    nextBtn.Release();
                }
                break;
        }
    }

    function End() {
        activeCows.splice(0, activeCows.length);
        player.ClearAmmo();
        GameUtils.CowsSavedZero();
        hud.guiTextObjs["rescueInfo"].UpdateMsg("0");
        hud.guiTextObjs["caughtCowInfo"].UpdateMsg('0');
        hud.guiTextObjs["caughtBaleInfo"].UpdateMsg('0');
    }

    for(var i = 0; i < MAX_PROBES; i++)
        scene.Add(allProbes[i].obj);
    for(var i = 0; i < cows.length; i++ )
        scene.Add(cows[i].obj);
    for(var i = 0; i < haybales.length; i++ )
        scene.Add(haybales[i].obj);
    scene.Add(fence);
    scene.SetCallbacks(Start, GameplayUpdate, End);
}