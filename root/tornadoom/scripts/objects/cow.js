/**
 * Created by Devin on 2015-01-25.
 */

function Cow() {
    this.obj = new GameObject('cow', Labels.movable);

    this.obj.SetModel(GameMngr.assets.models['cow']);
    this.obj.mdlHdlr.SetTexture(GameMngr.assets.textures['cowTex'], TextureFilters.linear);

    this.obj.trfmLocal.SetScaleAxes(0.25, 0.25, 0.25);
    this.obj.trfmLocal.SetPosAxes(0.0, this.obj.shape.radii.y * this.obj.trfmLocal.scale.y, 0);

    this.obj.AddComponent(Components.rigidBody);

    this.obj.AddComponent(Components.collisionBody);
    this.obj.collider.SetTier2Shape(BoundingShapes.orientedBB);
}