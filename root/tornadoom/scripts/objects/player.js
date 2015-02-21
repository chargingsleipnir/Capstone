/**
 * Created by Devin on 2015-01-16.
 */

function Player(hud) {

    // Player characteristics -------------------------------------------------
    var windspeed = 7.5;
    var massDensity = 1.205;

    var contactScale = 2.0;
    var drawScale = 1.0;
    var captureRadius = 0.75;
    var launchScalar = 1000;

    var massMax = 200;
    var massHeld = 0.0;

    var ammoIdx = 0;
    var ammoTypeCount = 2;
    var caughtCows = [];
    var caughtHayBales = [];
    //var caughtDebris = [];
    var ammoTypes = [
        caughtCows,
        caughtHayBales
    ];

    var that = this;

    // Basic player obj visual -------------------------------------------------
    this.obj = new GameObject('Player01', Labels.player);
    var modelObj = new GameObject("Player01 model", Labels.none);
    //this.obj.trfmLocal.SetScaleAxes(1.5, 1.0, 1.5);
    //modelObj.trfmLocal.SetScaleAxes(1.5, 1.0, 1.5);

    modelObj.SetModel(GameMngr.assets.models['playerTornado']);
    modelObj.mdlHdlr.SetTexture(GameMngr.assets.textures['funnelTex'], TextureFilters.linear);
    this.obj.AddChild(modelObj);

    // Just to help in a few functions below
    var playerPos = this.obj.trfmGlobal.pos;
    var playerHeight = modelObj.shapeData.radii.y * modelObj.trfmLocal.scale.y * 2;

    // Tornado collisions -------------------------------------------------
    this.obj.AddComponent(Components.collisionSystem);
    this.obj.collider.ResizeBoundingShapes(modelObj.shapeData);
    //this.obj.collider.OffsetSpherePosAxes(3.0, 0.0, -3.0);
    this.obj.collider.ScaleSphere(contactScale);
    //this.obj.collider.OffsetBoxPosAxes(-3.0, 0.0, -3.0);
    //this.obj.collider.ScaleBox(3.0, 0.5, 0.5);

    function ObjInRange(collider) {
        var objToEyeVec = new Vector2(playerPos.x - collider.trfm.pos.x, playerPos.z - collider.trfm.pos.z);
        var objToEyeDistSqr = objToEyeVec.GetMagSqr();

        // This format allows not only for objects to only be captured if they are within the given radius,
        // but ensures that their velocities don't explode at heights above the tornado:
        // No force is applied if they're directly above the funnel.
        if(objToEyeDistSqr < captureRadius * captureRadius) {
            if(collider.trfm.pos.y < playerHeight) {
                Capture(collider.gameObj);
            }
        }
        else {
            collider.rigidBody.ApplyTornadoMotion(objToEyeVec, objToEyeDistSqr, windspeed, massDensity, drawScale);
            // Perfect lift right away, slowing once obj's gravity is re-applied.
            collider.rigidBody.ApplyGravity(VEC3_GRAVITY.GetNegative());
        }
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
    effects.scaleLen = 0.2;
    effects.colourBtm = new Vector3(0.5, 0.5, 0.5);
    effects.colourTop = new Vector3(0.5, 0.8, 0.8);
    effects.lineLength = 0.0;
    effects.size = 40.0;
    effects.texture = GameMngr.assets.textures['dustPtcl'];
    effects.alphaStart = 0.5;
    effects.fadePoint = 0.75;
    effects.alphaEnd = 0.0;

    // Inner dust effect
    var dustVisual1 = new ParticleField(40, true, null, effects);
    this.obj.ptclSys.AddField(dustVisual1);
    dustVisual1.Run();

    // Outer dust effect
    effects.travelTime = 3.0;
    effects.scaleAngle = 2.5;
    effects.scaleDiam = 0.85;
    effects.scaleLen = 0.1;
    effects.size = 20.0;
    var dustVisual2 = new ParticleField(30, true, null, effects);
    this.obj.ptclSys.AddField(dustVisual2);
    dustVisual2.Run();

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

    var hudAmmoMsgs = [
        caughtCowInfo,
        caughtBaleInfo
    ];

    // Add controls -------------------------------------------------
    this.obj.AddComponent(Components.camera);
    this.obj.camera.trfmAxes.SetPosAxes(0.0, 4.0, 8.0);
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


    // HELPER FUNCTIONS -------------------------------------------------

    var UpdateHUDAmmoCount = function(idx) {
        hudAmmoMsgs[idx].UpdateMsg("" + ammoTypes[idx].length);
    };
    var UpdateHUDAmmoSelection = function() {
        for(var i = 0; i < hudAmmoMsgs.length; i++) {
            hudAmmoMsgs[i].SetObjectFade(0.66);
        }
        hudAmmoMsgs[ammoIdx].SetObjectFade(1.0);
    };
    UpdateHUDAmmoSelection();
    var PrepAmmo = function(gameObj, isVisible) {
        if(gameObj.mdlHdlr)
            gameObj.mdlHdlr.active = isVisible;
        for (var i in gameObj.components)
            gameObj.components[i].SetActive(isVisible);
    };
    var Capture = function(gameObj) {
        // Small particle visual
        collectionVisual.Run();
        // Determine object captured
        switch(gameObj.name) {
            case 'cow':
                caughtCows.push(gameObj);
                UpdateHUDAmmoCount(0);
                break;
            case 'hay bale':
                caughtHayBales.push(gameObj);
                UpdateHUDAmmoCount(1);
                break;
        }
        PrepAmmo(gameObj, false);
    };
    var Shoot = function() {
        var fwd = that.obj.trfmLocal.GetFwd();
        var gameObj = ammoTypes[ammoIdx].pop();
        if(gameObj) {
            gameObj.trfmLocal.SetBaseTransByVec(playerPos.GetAdd(fwd.SetScaleByNum(contactScale + 2.0)));
            UpdateHUDAmmoCount(ammoIdx);
            PrepAmmo(gameObj, true);
            gameObj.rigidBody.AddForce(fwd.GetScaleByNum(windspeed * massDensity * launchScalar));
        }
    };

    // PLAYER METHODS -------------------------------------------------
    var SwitchControls = function() {

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
            Shoot();
            btnShoot.Release();
        }
        // Change ammo type
        if(btnAmmoScrollLeft.pressed) {
            ammoIdx = (ammoIdx > 0) ? ammoIdx - 1 : ammoTypeCount - 1;
            UpdateHUDAmmoSelection();
            btnAmmoScrollLeft.Release();
        }
        if(btnAmmoScrollRight.pressed) {
            ammoIdx = (ammoIdx + 1) % ammoTypeCount;
            UpdateHUDAmmoSelection();
            btnAmmoScrollRight.Release();
        }
    }
}