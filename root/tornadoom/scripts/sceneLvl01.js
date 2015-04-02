/**
 * Created by Devin on 2015-03-27.
 */

function BuildLvl01(scene, player, barn, cows, hud, nextBtn, lvlCompMsg) {

    scene.light.amb.bright = 0.5;
    scene.light.dir.bright = 0.25;
    scene.light.dir.dir.SetValues(1.0, -1.0, -1.0);
    scene.light.pnt.bright = 0.0;
    scene.light.pnt.pos.SetValues(0.0, 0.0, 0.0);

    // Objects ==========================================================================================

    var fence = new GameObject('fence', Labels.none);
    fence.SetModel(GameMngr.assets.models['lvl01Fence']);
    fence.mdlHdlr.SetTexture(GameMngr.assets.textures['fenceTex'], TextureFilters.mipmap);
    GameUtils.RaiseToGroundLevel(fence);

    var NUM_COWS_PHASE_1 = 2,
        NUM_COWS_PHASE_2 = 3;
    var phase1CowPos = [
        [3.0, 0.0, -1.0],
        [0.0, 0.0, 0.0]
    ];
    var phase2CowPos = [
        [-7.0, 0.0, 7.0],
        [0.0, 0.0, 10.0],
        [7.0, 0.0, 7.0]
    ];
    var activeCows = [];

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
        "Howdy! I'm having a bit of a problem. Do you think you could help me out?",
        "My cattle have all been scared straight, and they just won't budge anymore!",
        "Think you can help my rustle them up into my barn? Be careful using those powerful winds of yours!",
        "Use W, S, A, D to move around the field",
        "Use the left and right arrow keys to rotate yourself around.",
        "Alright, you got one! Be a pal, and bring it into the barn for me?",
        "Objects you've captured are shown in the bottom-left corner.",
        "Press SHIFT to shoot directly ahead!",
        "Thanks so much! It looks like a few more got out, can you grab'em up?",
        "...Somethin' ain't sittin' right with me. Grab as many as you can, quick!",
        "Check the top-right to see how many cows have been saved."
    ];
    InGameMsgr.AddMsgSequence("level01", msgs);
    var msgLimit,
        lvlPhases,
        MAX_TIME = 60.0,
        counter;

    // Level Repeat functions ==========================================================================================

    function Start() {
        barn.obj.trfmBase.SetPosByAxes(0.0, 0.0, -20.0);
        barn.obj.trfmBase.SetUpdatedRot(VEC3_UP, -45);
        barn.obj.collider.SetSphereCall(BarnCollCallback);
        GameUtils.RaiseToGroundLevel(barn.obj);

        GameUtils.SetLevelBounds(fence);
        GameUtils.CowsSavedZero();

        player.ResetMotion();
        player.obj.trfmBase.SetPosByAxes(0.0, 0.0, 20);
        GameUtils.RaiseToGroundLevel(player.obj);
        player.AddAmmoContainer(GameUtils.ammoTypes.cow);

        for(var i = 0; i < cows.length; i++ ) {
            cows[i].SetVisible(false);
        }
        for(var i = 0; i < NUM_COWS_PHASE_1; i++ ) {
            cows[i].SetVisible(true);
            cows[i].obj.trfmBase.SetPosByAxes(phase1CowPos[i][0], phase1CowPos[i][1], phase1CowPos[i][2]);
            activeCows.push(cows[i]);
        }
        GameUtils.CowsEncounteredAdd(activeCows.length);

        InGameMsgr.SetActive(true);
        InGameMsgr.ChangeMsgSequence("level01");
        scene.SetLoopCallback(MsgUpdate);
        player.SetControlActive(false);
        msgLimit = 5;
        lvlPhases = 0;
        counter = MAX_TIME;

        hud.guiProgObjs["countdownBar"].UpdateValue(0.5);

        /////////////// TEMP
        //hud.guiTextObjs["caughtCowInfo"].SetActive(true);
        //hud.guiTextObjs["rescueInfo"].SetActive(true);
        //player.SetControlActive(true);
        //SceneMngr.SetActive("Level 02");
        /////////////// TEMP
    }

    function CommonUpdate() {
        player.Update();
        barn.Update();
        GameUtils.ContainInLevelBoundsUpdate(player.obj);
        for (var i = 0; i < activeCows.length; i++) {
            activeCows[i].Update();
            GameUtils.ContainInLevelBoundsUpdate(activeCows[i].obj);
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

        switch(lvlPhases) {
            case 0:
                if(player.GetAmmoCount(GameUtils.ammoTypes.cow) == 1) {
                    hud.guiTextObjs["caughtCowInfo"].SetActive(true);
                    hud.guiTextObjs["caughtCowInfo"].UpdateMsg("" + player.GetAmmoCount(GameUtils.ammoTypes.cow));
                    msgLimit = 8;
                    lvlPhases++;
                    scene.SetLoopCallback(MsgUpdate);
                    player.SetControlActive(false);
                }
                break;
            case 1:
                if (GameUtils.GetCowsSaved() == 2) {
                    hud.guiTextObjs["rescueInfo"].SetActive(true);
                    hud.guiTextObjs["rescueInfo"].UpdateMsg("" + GameUtils.GetCowsSaved());
                    msgLimit = 11;
                    lvlPhases++;
                    scene.SetLoopCallback(MsgUpdate);
                    player.SetControlActive(false);
                    for(var i = 0; i < NUM_COWS_PHASE_2; i++ ) {
                        cows[i].SetVisible(true);
                        cows[i].obj.trfmBase.SetPosByAxes(phase2CowPos[i][0], phase2CowPos[i][1], phase2CowPos[i][2]);
                        GameUtils.RaiseToGroundLevel(cows[i].obj);
                        activeCows.push(cows[i]);
                    }
                    GameUtils.CowsEncounteredAdd(activeCows.length);
                }
                break;
            case 2:
                hud.guiProgObjs["countdownBar"].SetActive(true);
                hud.guiProgObjs["countdownBar"].UpdateValue(counter / MAX_TIME);
                counter -= Time.deltaMilli;
                if(activeCows.length <= 0) {
                    lvlCompMsg.SetActive(true);
                    player.SetControlActive(false);
                    lvlPhases++;
                }
                else if(counter <= 0.0) {
                    counter = 0.0;
                    // They don't have to save them all, just more than half
                    if(GameUtils.GetCowsSaved() >= Math.ceil((NUM_COWS_PHASE_1 + NUM_COWS_PHASE_2) / 2.0)) {
                        GameUtils.CowsAbductedAdd(activeCows.length);
                        lvlCompMsg.SetActive(true);
                        player.SetControlActive(false);
                        lvlPhases++;
                    }
                    else
                        SceneMngr.SetActive("End Screen Lose");
                }
                break;
            case 3:
                if (nextBtn.pressed) {
                    lvlCompMsg.SetActive(false);
                    player.SetControlActive(true);
                    SceneMngr.SetActive("Level 02");
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
        hud.guiProgObjs["countdownBar"].SetActive(false);
        hud.guiProgObjs["countdownBar"].UpdateValue(0.0);
    }

    for(var i = 0; i < cows.length; i++ )
        scene.Add(cows[i].obj);
    scene.Add(fence);
    scene.SetCallbacks(Start, MsgUpdate, End);
}