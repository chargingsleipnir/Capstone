/**
 * Created by Devin on 2015-03-13.
 */

function Barn() {
    this.obj = new GameObject('barn', Labels.none);
    this.obj.SetModel(GameMngr.assets.models['barn']);
    this.obj.mdlHdlr.SetTexture(GameMngr.assets.textures['barnTex'], TextureFilters.linear);

    var ptclRotObj = new GameObject("tail particle rotation", Labels.none);
    ptclRotObj.AddComponent(Components.particleSystem);
    ptclRotObj.trfmOffset.SetPosByAxes(3.0, -1.0, 0.0);

    var effects = new FlatTailEffects();
    effects.colour = new Vector3(1.0, 0.7, 0.9);
    effects.thickness = 2.0;
    effects.axis = Axes.y;
    effects.alphaStart = 0.5;
    effects.fadePoint = 0.25;
    effects.alphaEnd = 0.0;
    var barnTail = new FlatTail(100, null, effects);
    ptclRotObj.ptclSys.AddTail(barnTail);
    barnTail.Run();

    this.obj.AddChild(ptclRotObj);

    var angle = 0.00;
    this.Update = function() {
        angle += 2.0;
        if(angle > 360.0)
            angle = 0.0;

        ptclRotObj.trfmOffset.SetUpdatedRot(VEC3_UP, angle);
    }
}