/**
 * Created by Devin on 2015-01-16.
 */

function Player(hud) {

    // Player characteristics -------------------------------------------------
    var windspeed = 7.5;
    var massDensity = 1.205;

    var contactScale = 2.5;
    var drawScale = 1.0;
    var captureRadius = 0.75;

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
    modelObj.SetModel(GameMngr.assets.models['playerTornado']);
    modelObj.mdlHdlr.SetTexture(GameMngr.assets.textures['funnelTex'], TextureFilters.linear);
    this.obj.AddChild(modelObj);
    // Just to help
    var pos = this.obj.trfmGlobal.pos;

    // Tornado collisions -------------------------------------------------
    this.obj.AddComponent(Components.collisionSystem);
    this.obj.collider.ResizeBoundingShapes(modelObj.shapeData);
    //this.obj.collider.OffsetSpherePosAxes(3.0, 0.0, -3.0);
    this.obj.collider.ScaleSphere(contactScale);
    //this.obj.collider.OffsetBoxPosAxes(-3.0, 0.0, -3.0);
    //this.obj.collider.ScaleBox(3.0, 0.5, 0.5);

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

    var hudAmmoMsgs = [
        caughtCowInfo,
        caughtBaleInfo
    ];

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
            gameObj.trfmLocal.SetBaseTransByVec(pos.GetAdd(fwd.SetScaleByNum(contactScale + 1.0)));
            UpdateHUDAmmoCount(ammoIdx);
            PrepAmmo(gameObj, true);
            gameObj.rigidBody.AddForce(fwd.GetScaleByNum(windspeed * massDensity * 1000));
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