/**
 * Created by Devin on 2015-01-16.
 */

function Player() {
    // Basic player obj visual
    this.obj = new GameObject('Player01', Labels.player);
    this.obj.SetModel(GameMngr.assets.models['playerTornado']);
    this.obj.mdlHdlr.SetTexture(GameMngr.assets.textures['funnelTex'], TextureFilters.linear);
    //var effectsObj = new GameObject("Player01 wind and particle effects", Labels.none);
    //effectsObj.SetModel(GameMngr.assets.models['playerTornadoEffects']);
    //effectsObj.mdlHdlr.SetTexture(GameMngr.assets.textures['funnelEffectsTex'], TextureFilters.linear);
    //this.obj.AddChild(effectsObj);
    // Add particles
    this.obj.AddComponent(Components.particleSystem);

    var effects = new PtclSpiralEffects();
    effects.travelTime = 8.5;
    effects.startDist = 1.0;
    effects.dir = new Vector3(0.0, -1.0, 0.0);
    effects.range = 15.0;
    effects.scaleAngle = 7.5;
    effects.scaleDiam = 0.33;
    effects.scaleLen = 0.25;
    effects.colourBtm = new Vector3(0.2, 0.2, 0.2);
    effects.colourTop = new Vector3(0.2, 0.3, 0.6);
    effects.lineLength = 0.0;
    effects.size = 7.0;
    effects.alphaStart = 0.75;
    effects.fadePoint = 0.90;
    effects.alphaEnd = 0.5;
    this.obj.ptclSys.AddField(200, null, effects);
    this.obj.ptclSys.RunField(0);

    effects.texture = EL.assets.textures['star'];
    effects.size = 32.0;
    this.obj.ptclSys.AddField(300, null, effects);
    this.obj.ptclSys.RunField(1);

    effects.alphaStart = 1.0;
    effects.fadePoint = 1.0;
    effects.alphaEnd = 1.0;
    effects.range = 10.0;
    effects.scaleDiam = 0.5;
    effects.lineLength = 0.03;
    this.obj.ptclSys.AddField(200, null, effects);
    this.obj.ptclSys.RunField(2);
    // Add controls

    this.obj.AddComponent(Components.camera);
    this.obj.camera.trfmAxes.SetPosAxes(1.0, 0.6, 2.75);
    this.obj.camera.trfmAxes.RotateLocalViewX(-10);
    this.obj.camera.SetControlsActive(this.obj.name, true);
    ViewMngr.SetActiveCamera(this.obj.camera);
}
Player.prototype = {
    Update: function() {
        this.obj.trfmLocal.Rotate(VEC3_UP, 5.0);
        //this.obj.trfmLocal.TranslateAxes(0.005, 0.0, 0.0);
    }
};