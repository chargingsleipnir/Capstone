/**
 * Created by Devin on 2015-01-16.
 */

function Player() {

    // Player characteristics
    var windspeed = 5.0;

    var contactScale = 1.5;
    var drawScale = 1.0;
    var captureRadius = 0.75;

    var massMax = 100;
    var massHeld = 0.0;

    var caughtCows = [];
    var caughtHayBales = [];
    var caughtDebris = [];

    // Basic player obj visual
    this.obj = new GameObject('Player01', Labels.player);
    var modelObj = new GameObject("Player01 model", Labels.none);
    modelObj.SetModel(GameMngr.assets.models['playerTornado']);
    modelObj.mdlHdlr.SetTexture(GameMngr.assets.textures['funnelTex'], TextureFilters.linear);
    this.obj.AddChild(modelObj);

    // Tornado collisions
    this.obj.AddComponent(Components.collisionSystem);
    this.obj.collider.ResizeBoundingShapes(modelObj.shapeData);
    //this.obj.collider.OffsetSpherePosAxes(3.0, 0.0, -3.0);
    this.obj.collider.ScaleSphere(contactScale);
    //this.obj.collider.OffsetBoxPosAxes(-3.0, 0.0, -3.0);
    //this.obj.collider.ScaleBox(3.0, 0.5, 0.5);

    // Wind characteristics
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

    // Add particle effects
    this.obj.AddComponent(Components.particleSystem);

    var effects = new PtclSpiralEffects();
    effects.travelTime = 8.0;
    effects.startDist = 1.0;
    effects.dir = new Vector3(0.0, -1.0, 0.0);
    effects.range = 15.0;
    effects.scaleAngle = 5.0;
    effects.scaleDiam = 0.33;
    effects.scaleLen = 0.25;
    effects.colourBtm = new Vector3(0.5, 0.5, 0.5);
    effects.colourTop = new Vector3(0.5, 0.8, 0.8);
    effects.lineLength = 0.0;
    effects.size = 5.0;
    effects.alphaStart = 0.75;
    effects.fadePoint = 0.90;
    effects.alphaEnd = 0.5;
    var ammoVisual = new ParticleField(200, null, effects);
    this.obj.ptclSys.AddField(ammoVisual);

    effects.texture = GameMngr.assets.textures['dustPtcl'];
    effects.size = 32.0;
    var dustVisual = new ParticleField(300, null, effects);
    this.obj.ptclSys.AddField(dustVisual);

    // Add controls
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
    var startPtcls = Input.CreateInputController(playerCtrlName, KeyMap.Z);
    var stopPtcls = Input.CreateInputController(playerCtrlName, KeyMap.X);


    // PLAYER METHODS
    var SwitchControls = function() {

    };
    var Capture = function(gameObj) {
        switch(gameObj.name) {
            case 'cow':
                caughtCows.push(gameObj);
                gameObj.MakeInert();
                console.log("Cows captured: " + caughtCows.length);
                break;
            case 'hayBale':
                console.log("Hay bales captured: " + caughtCows.length);
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

        //console.log(this.obj.collider.collBox.pos.GetData());
        //console.log(this.obj.mdlHdlr.sphere.pos.GetData());

        if(startPtcls.pressed) {
            ammoVisual.Run();
            dustVisual.Run();
            startPtcls.Release();
        }
        else if(stopPtcls.pressed) {
            ammoVisual.Stop();
            dustVisual.Stop();
            stopPtcls.Release();
        }
    }
}