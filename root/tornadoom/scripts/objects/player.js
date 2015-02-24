/**
 * Created by Devin on 2015-01-16.
 */

function Player(hud, mouse) {

    // Player characteristics -------------------------------------------------

    var windspeed = 7.5;
    var massDensity = 1.205;

    var contactScale = 2.0;
    var drawScale = 1.0;
    var captureRadius = 0.75;
    var LAUNCH_SCALAR_MIN = 750;
    var LAUNCH_SCALAR_MAX = 1000;
    var launchScalar = LAUNCH_SCALAR_MIN;

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

    // The X and Y are just the mouses screen coords, assuming (0,0) at the centre
    // The Z and scalar are values used to try to control how steep the new direction becomes
    var mouseAimX = 0;
    var mouseAimY = 0;
    var mouseAimZ = -50;
    var mouseAimScalar = 0.1;
    var crosshairLength = 5.0;

    var that = this;

    // Basic player obj visual -------------------------------------------------

    this.obj = new GameObject('Player01', Labels.player);
    var modelObj = new GameObject("Player01 model", Labels.none);
    modelObj.SetModel(GameMngr.assets.models['playerTornado']);
    modelObj.mdlHdlr.SetTexture(GameMngr.assets.textures['funnelTex'], TextureFilters.linear);

    this.obj.AddChild(modelObj);

    // Just to help in a few functions below
    var playerPos = this.obj.trfmGlobal.pos;
    var playerHeight = modelObj.shapeData.radii.y * modelObj.trfmBase.scale.y * 2;

    // Tornado collisions -------------------------------------------------

    this.obj.AddComponent(Components.collisionSystem);
    this.obj.collider.ResizeBoundingShapes(modelObj.shapeData);
    this.obj.collider.ScaleSphere(contactScale);


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
    var dustVisual1 = new ParticleFieldAutomated(40, true, null, effects);
    this.obj.ptclSys.AddAutoField(dustVisual1);
    dustVisual1.Run();

    // Outer dust effect
    effects.travelTime = 3.0;
    effects.scaleAngle = 2.5;
    effects.scaleDiam = 0.85;
    effects.scaleLen = 0.1;
    effects.size = 20.0;
    var dustVisual2 = new ParticleFieldAutomated(30, true, null, effects);
    this.obj.ptclSys.AddAutoField(dustVisual2);
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
    var collectionVisual = new ParticleFieldAutomated(50, false, 0.25, effects);
    this.obj.ptclSys.AddAutoField(collectionVisual);

    effects = new PtclSimpleEffects();
    effects.colourBtm.SetValues(0.0, 0.0, 0.0);
    effects.colourTop.SetValues(0.0, 0.0, 0.0);
    effects.lineLength = 0.0;
    effects.size = 30.0;
    effects.texture = GameMngr.assets.textures['crosshair'];
    effects.alphaStart = 1.0;
    var aimDirVisual = new ParticleFieldControled(10, effects);
    this.obj.ptclSys.AddCtrlField(aimDirVisual);


    // Add to HUD -------------------------------------------------

    var style = new MsgBoxStyle();
    style.fontSize = 30;
    style.fontColour = new Vector3(0.0, 0.0, 0.0);
    style.textMaxWidth = 15;
    style.textAlignWidth = Alignment.right;
    style.textAlignHeight = Alignment.centre;
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

    style.textMaxWidth = 20;
    style.textAlignWidth = Alignment.left;
    style.bgTexture = null;
    style.fontColour = new Vector3(1.0, 1.0, 1.0);
    var launchPowerMsg = new GUIObject(new WndRect(0, 0, 375, 68), "Extra Power: 000", style);
    hud.AddGUIObject(launchPowerMsg);
    launchPowerMsg.UpdateMsg("Extra Power: " + (launchScalar - LAUNCH_SCALAR_MIN));


    // Add controls -------------------------------------------------

    this.obj.AddComponent(Components.camera);
    this.obj.camera.trfmAxes.SetPosAxes(0.0, 4.0, 8.0);
    this.obj.camera.trfmAxes.RotateLocalViewX(-15);
    ViewMngr.SetActiveCamera(this.obj.camera);

    this.ctrl = new TopDownController(this.obj, "Top-down player controls");
    this.ctrl.SetActive(true);

    var playerCtrlName = "PlayerCtrl";
    Input.RegisterControlScheme(playerCtrlName, true, InputTypes.keyboard);

    var btnShoot = Input.CreateInputController(playerCtrlName, KeyMap.Shift);
    var btnAmmoScrollLeft = Input.CreateInputController(playerCtrlName, KeyMap.BracketOpen);
    var btnAmmoScrollRight = Input.CreateInputController(playerCtrlName, KeyMap.BracketClose);

    // Allow player to hold space bar to go into a view where they use the mouse to aim within a given window
    // around the direction they are facing.
    var aimToggle = Input.CreateInputController(playerCtrlName, KeyMap.SpaceBar);
    function AimTogglePressed() {
        that.obj.camera.trfmAxes.SetPosAxes(1.25, 0.0, 2.25);
        that.obj.camera.trfmAxes.RotateLocalViewX(25);
        mouse.SetLeftBtnCalls(null, ChargeShotReleased);
        aimDirVisual.Run();
    }
    function AimToggleReleased() {
        that.obj.camera.trfmAxes.SetPosAxes(0.0, 4.0, 8.0);
        that.obj.camera.trfmAxes.RotateLocalViewX(-25);
        mouse.SetLeftBtnCalls(null, function(){});
        aimDirVisual.Stop();
        DropLaunchPower();
    }
    aimToggle.SetBtnCalls(AimTogglePressed, AimToggleReleased);

    // When in this mode, the left mouse button can also be held to charge up the shot.
    // Shoot when released
    var aimDir = new Vector3();
    function ChargeShotReleased() {
        Shoot(aimDir);
    }

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
    // Pop captured object from it's list and shoot forward from right on Tornado
    var RaiseLaunchPower = function() {
        launchScalar += 2.0;
        if(launchScalar > LAUNCH_SCALAR_MAX)
            launchScalar = LAUNCH_SCALAR_MAX;

        launchPowerMsg.UpdateMsg("Extra Power: " + (launchScalar - LAUNCH_SCALAR_MIN));
    };
    var DropLaunchPower = function() {
        launchScalar = LAUNCH_SCALAR_MIN;
        launchPowerMsg.UpdateMsg("Extra Power: " + (launchScalar - LAUNCH_SCALAR_MIN));
    };
    var Shoot = function(dir) {
        var gameObj = ammoTypes[ammoIdx].pop();
        if(gameObj) {
            gameObj.trfmBase.SetPosByVec(playerPos.GetAdd(dir.SetScaleByNum(contactScale + 2.0)));
            UpdateHUDAmmoCount(ammoIdx);
            PrepAmmo(gameObj, true);
            gameObj.rigidBody.AddForce(dir.GetScaleByNum(windspeed * massDensity * launchScalar));
        }
        DropLaunchPower();
    };

    // PLAYER METHODS -------------------------------------------------
    var angle = 0.0;
    this.Update = function() {
        angle++;
        if(angle > 360.0)
            angle = 0.0;

        this.ctrl.Update();

        modelObj.trfmBase.SetUpdatedRot(VEC3_UP, angle * 7.5);

        // Shooting mechanics
        if(btnShoot.pressed) {
            Shoot(this.obj.trfmBase.GetFwd());
            btnShoot.Release();
        }
        // Trade-off here, more difficult control, but power can be built

        if(aimToggle.pressed) {
            mouseAimX = mouse.pos.x - ViewMngr.wndWidth/2.0;
            mouseAimY = (mouse.pos.y - ViewMngr.wndHeight/2.0) * -1;

            aimDir.SetValues(mouseAimX * mouseAimScalar, mouseAimY * mouseAimScalar, mouseAimZ);
            aimDir.SetNormalized();
            // Send these positions, as obj's model matrix is used to achieve pos and rot
            aimDirVisual.ApplyEvenLine(aimDir.GetScaleByNum(crosshairLength), VEC3_ZERO);
            // Finish aim adjustment for local force application
            aimDir = that.obj.trfmGlobal.rot.GetMultiplyVec3(aimDir);

            if(mouse.leftPressed)
                RaiseLaunchPower();
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