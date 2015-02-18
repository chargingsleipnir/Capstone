/**
 * Created by Devin on 2015-01-16.
 */

function Player(hud) {

    // Player characteristics -------------------------------------------------
    var windspeed = 5.0;

    var contactScale = 2.0;
    var drawScale = 1.0;
    var captureRadius = 0.75;

    var massMax = 100;
    var massHeld = 0.0;

    var ammoIdx = 0;
    var ammoTypeCount = 3;
    var caughtCows = [];
    var caughtHayBales = [];
    var caughtDebris = [];

    // Basic player obj visual -------------------------------------------------
    this.obj = new GameObject('Player01', Labels.player);
    var modelObj = new GameObject("Player01 model", Labels.none);
    modelObj.SetModel(GameMngr.assets.models['playerTornado']);
    modelObj.mdlHdlr.SetTexture(GameMngr.assets.textures['funnelTex'], TextureFilters.linear);
    this.obj.AddChild(modelObj);

    // Tornado collisions -------------------------------------------------
    this.obj.AddComponent(Components.collisionSystem);
    this.obj.collider.ResizeBoundingShapes(modelObj.shapeData);
    //this.obj.collider.OffsetSpherePosAxes(3.0, 0.0, -3.0);
    this.obj.collider.ScaleSphere(contactScale);
    //this.obj.collider.OffsetBoxPosAxes(-3.0, 0.0, -3.0);
    //this.obj.collider.ScaleBox(3.0, 0.5, 0.5);

    // Wind characteristics -------------------------------------------------
    var massDensity = 1.205;

    var that = this;
    var pos = this.obj.trfmLocal.pos;
    function ObjInRange(collider) {
        var objToEyeVec = new Vector2(pos.x - collider.trfm.pos.x, pos.z - collider.trfm.pos.z);
        var objToEyeDistSqr = objToEyeVec.GetMagSqr();

        if(objToEyeDistSqr < captureRadius * captureRadius)
            Capture(collider.gameObj);
        else
            collider.rigidBody.ApplyTornadoMotion(objToEyeVec, objToEyeDistSqr, windspeed, massDensity, drawScale);

    }
    this.obj.collider.SetSphereCall(ObjInRange);

    /*
    function ObjInFunnel(collider) {
        console.log("Player box colliding");
        // remove obj, add to gui
    }
    this.obj.collider.SetBoxCall(ObjInFunnel);
    */

    // Add particle effects -------------------------------------------------
    this.obj.AddComponent(Components.particleSystem);

    var effects = new PtclSpiralEffects();
    effects.travelTime = 2.5;
    effects.startDist = 1.0;
    effects.dir = new Vector3(0.0, -1.0, 0.0);
    effects.range = 15.0;
    effects.scaleAngle = 5.0;
    effects.scaleDiam = 0.5;
    effects.scaleLen = 0.15;
    effects.colourBtm = new Vector3(0.5, 0.5, 0.5);
    effects.colourTop = new Vector3(0.5, 0.8, 0.8);
    effects.lineLength = 0.0;
    effects.size = 32.0;
    effects.texture = GameMngr.assets.textures['dustPtcl'];
    effects.alphaStart = 0.5;
    effects.fadePoint = 0.75;
    effects.alphaEnd = 0.0;
    var dustVisual = new ParticleField(50, true, null, effects);
    this.obj.ptclSys.AddField(dustVisual);
    dustVisual.Run();

    effects = new PtclPhysicsEffects();
    effects.travelTime = 0.5;
    effects.startDist = 0.5;
    effects.dir.SetValues(0.0, 1.0, 0.0);
    effects.range = 360.0;
    effects.speed = 1.5;
    effects.acc.SetValues(0.0, 0.0, 0.0);
    effects.dampening = 0.25;
    effects.colourBtm.SetValues(0.0, 0.5, 0.25);
    effects.colourTop.SetValues(0.0, 1.0, 1.0);
    effects.lineLength = 0.0;
    effects.alphaStart = 1.0;
    effects.fadePoint = 0.5;
    effects.alphaEnd = 0.0;
    effects.size = 5.0;
    var collectionVisual = new ParticleField(50, false, 0.25, effects);
    this.obj.ptclSys.AddField(collectionVisual);

    // Add to HUD -------------------------------------------------
    var style = new MsgBoxStyle();
    style.fontSize = 30;
    style.fontColour = new Vector3(0.0, 0.0, 0.0);
    style.textMaxWidth = 15;
    style.textAlignWidth = Alignment.right;
    style.textAlignHeight = Alignment.bottom;
    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.textLineSpacing = 0.0;
    style.margin = 15.0;
    style.bgAlpha = 1.0;
    style.bold = false;

    style.bgTexture = GameMngr.assets.textures['baleIcon'];
    var caughtBaleInfo = new GUIObject(new WndRect(0, hud.sysRect.h - 68, 132, 68), "00", style);
    hud.AddGUIObject(caughtBaleInfo);
    caughtBaleInfo.UpdateMsg('0');

    style.bgTexture = GameMngr.assets.textures['cowIcon'];
    var caughtCowInfo = new GUIObject(new WndRect(0, caughtBaleInfo.rectLocal.y - 78, 132, 68), "00", style);
    hud.AddGUIObject(caughtCowInfo);
    caughtCowInfo.UpdateMsg('0');

    // Add controls -------------------------------------------------
    this.obj.AddComponent(Components.camera);
    this.obj.camera.trfmAxes.SetPosAxes(0.0, 4.0, 7.5);
    this.obj.camera.trfmAxes.RotateLocalViewX(-15);
    ViewMngr.SetActiveCamera(this.obj.camera);


    var topDownCtrl = new TopDownController(this.obj, "Top-down player controls");
    topDownCtrl.SetActive(true);
    var snipeCtrl = new SnipeController(this.obj, "Over-shoulder player controls");
    this.ctrl = topDownCtrl;

    var playerCtrlName = "PlayerCtrl";
    Input.RegisterControlScheme(playerCtrlName, true, InputTypes.keyboard);
    var btnShoot = Input.CreateInputController(playerCtrlName, KeyMap.Shift);
    var btnAmmoScrollLeft = Input.CreateInputController(playerCtrlName, KeyMap.BracketOpen);
    var btnAmmoScrollRight = Input.CreateInputController(playerCtrlName, KeyMap.BracketClose);


    // PLAYER METHODS -------------------------------------------------
    var SwitchControls = function() {

    };
    var Capture = function(gameObj) {
        // Small particle visual
        collectionVisual.Run();
        // Determine object captured
        switch(gameObj.name) {
            case 'cow':
                caughtCows.push(gameObj);
                caughtCowInfo.UpdateMsg("" + caughtCows.length);
                gameObj.SetActive(false);
                break;
            case 'hay bale':
                caughtHayBales.push(gameObj);
                caughtBaleInfo.UpdateMsg("" + caughtHayBales.length);
                gameObj.SetActive(false);
                break;
        }

    };
    this.LevelUp = function() {

    };
    var angle = 0.0;
    this.Update = function() {
        angle++;
        if(angle > 360.0)
            angle = 0.0;

        this.ctrl.Update();

        modelObj.trfmLocal.SetUpdatedOrient(VEC3_UP, angle * 7.5);

        // Pop captured object from it's list and shoot forward from right on Tornado
        if(btnShoot.pressed) {
            btnShoot.Release();
        }
        // Change ammo type
        if(btnAmmoScrollLeft.pressed) {
            ammoIdx = (ammoIdx > 0) ? ammoIdx - 1 : ammoTypeCount - 1;
            console.log(ammoIdx);
            // change int type
            // ammoList[type].hudMsg + ammoList[type].list.length
            // hud.guiObjs['ammo info'].UpdateMsg("Cows: " + caughtCows.length);
            btnAmmoScrollLeft.Release();
        }
        if(btnAmmoScrollRight.pressed) {
            ammoIdx = (ammoIdx + 1) % ammoTypeCount;
            console.log(ammoIdx);


            btnAmmoScrollRight.Release();
        }
    }
}