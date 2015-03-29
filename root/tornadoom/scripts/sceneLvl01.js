/**
 * Created by Devin on 2015-03-27.
 */

function BuildLvl01(scene, player, barn, cows, hud, nextBtn) {

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

    var initCowPos = new Vector3(3.0, 0.0, -12.0);
    var cowPos = [
        [-7.0, 0.0, -7.0],
        [0.0, 0.0, -10.0],
        [7.0, 0.0, -7.0]
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
        "Press SHIFT to shoot directly ahead!"
    ];

    InGameMsgr.AddMsgSequence("level01", msgs);

    var MsgStates = { msg00: 0, msg01: 1, msg02: 2, msg03: 3, msg04: 4, msg05: 5},
        msgState = 0;
    var phase1Complete = false;

    var msgBoard = new GUISystem(new WndRect(ViewMngr.wndWidth/2 - 200, ViewMngr.wndHeight/2 - 100, 400, 200), "Message Board");

    var style = new MsgBoxStyle();
    style.fontSize = 20;
    style.fontColour = new Vector3(0.0, 0.0, 0.0);
    style.textMaxWidth = 200;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.fontAlpha = 0.5;
    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.margin = 15.0;
    style.bgTextures = [GameMngr.assets.textures['cowBorderEnter']];

    var msgRect = new WndRect(0, 0, 400, 200);
    msgBoard.AddTextObject("msg00", new GUITextObject(msgRect, msgs[0], style));
    msgBoard.AddTextObject("msg01", new GUITextObject(msgRect, msgs[1], style));
    msgBoard.AddTextObject("msg02", new GUITextObject(msgRect, msgs[2], style));
    msgBoard.AddTextObject("msg03", new GUITextObject(msgRect, msgs[3], style));
    msgBoard.AddTextObject("msg04", new GUITextObject(msgRect, msgs[4], style));
    msgBoard.AddTextObject("msg05", new GUITextObject(msgRect, msgs[5], style));
    GUINetwork.AddSystem(msgBoard, false);
    for(var i in msgBoard.guiTextObjs)
        msgBoard.guiTextObjs[i].SetActive(false);

    function InitPhase2() {
        phase1Complete = true;
        for(var i = 0; i < cows.length; i++ ) {
            cows[i].SetVisible(true);
            cows[i].obj.trfmBase.SetPosByAxes(cowPos[i][0], cowPos[i][1], cowPos[i][2]);
            GameUtils.RaiseToGroundLevel(cows[i].obj);
            activeCows.push(cows[i]);
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
        player.AddAmmoContainer(GameUtils.ammoTypes.cow);

        for(var i = 0; i < cows.length; i++ ) {
            cows[i].SetVisible(false);
        }
        cows[0].SetVisible(true);
        cows[0].obj.trfmBase.SetPosByVec(initCowPos);
        activeCows.push(cows[0]);

        hud.guiTextObjs["caughtCowInfo"].SetActive(true);
        hud.guiTextObjs["rescueInfo"].SetActive(true);

        phase1Complete = false;
        GUINetwork.SetActive(msgBoard.name, true);
        msgBoard.guiTextObjs["msg00"].SetActive(true);
    }

    function MsgUpdate() {
        switch (msgState) {
            case MsgStates.msg00:
                msgBoard.guiTextObjs["msg00"].FadeMsg(0.02);
                if(nextBtn.pressed) {
                    msgState++;
                    msgBoard.guiTextObjs["msg00"].SetActive(false);
                    nextBtn.Release();
                }
                break;
            case MsgStates.msg01:
                console.log("At next message");
                scene.SetLoopCallback(GameplayUpdate);
                break;
            case MsgStates.msg02:
                break;
            case MsgStates.msg03:
                break;
            case MsgStates.msg04:
                break;
            case MsgStates.msg05:
                break;
        }
    }
    function GameplayUpdate() {
        player.Update();
        barn.Update();

        GameUtils.ContainInLevelBoundsUpdate(player.obj);

        for (var i = 0; i < activeCows.length; i++) {
            activeCows[i].Update();
            GameUtils.ContainInLevelBoundsUpdate(activeCows[i].obj);
        }

        if(!phase1Complete) {
            if (GameUtils.GetCowsSaved() == 1)
                InitPhase2();
        }
        else {
            if(activeCows.length <= 0)
                SceneMngr.SetActive("Level 02");
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

    for(var i = 0; i < cows.length; i++ )
        scene.Add(cows[i].obj);
    scene.Add(fence);
    scene.SetCallbacks(Start, MsgUpdate, End);
}