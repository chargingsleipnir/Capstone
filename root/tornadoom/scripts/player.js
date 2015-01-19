/**
 * Created by Devin on 2015-01-16.
 */

function Player() {
    // Basic player obj visual
    this.obj = new GameObject('Player01', Labels.player);
    this.obj.SetModel(GameMngr.assets.models['playerTornado']);
    this.obj.mdlHdlr.SetTexture(GameMngr.assets.textures['funnelTex'], TextureFilters.linear);

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

    effects.colourBtm.SetZero();
    effects.colourTop.SetZero();
    effects.alphaStart = 0.75;
    effects.fadePoint = 0.85;
    effects.alphaEnd = 0.25;
    effects.range = 10.0;
    effects.scaleDiam = 0.33;
    effects.lineLength = 0.02;
    var speedVisual = new ParticleField(200, null, effects);
    this.obj.ptclSys.AddField(speedVisual);
    speedVisual.Run();

    // Add controls

    this.obj.AddComponent(Components.camera);
    this.obj.camera.trfmAxes.SetPosAxes(1.0, 0.6, 2.75);
    this.obj.camera.trfmAxes.RotateLocalViewX(-10);
    this.obj.camera.SetControlsActive(this.obj.name, true);
    ViewMngr.SetActiveCamera(this.obj.camera);

    var playerCtrlName = "PlayerCtrl";
    Input.RegisterControlScheme(playerCtrlName, true, InputTypes.keyboard);
    var startPtcls = Input.CreateInputController(playerCtrlName, KeyMap.Z);
    var stopPtcls = Input.CreateInputController(playerCtrlName, KeyMap.X);

    this.Update = function() {
        //this.obj.trfmLocal.Rotate(VEC3_UP, 5.0);

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