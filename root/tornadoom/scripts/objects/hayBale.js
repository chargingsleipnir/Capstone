/**
 * Created by Devin on 2015-02-17.
 */

function HayBale() {
    this.obj = new GameObject('hay bale', Labels.movable);

    this.obj.SetModel(GameMngr.assets.models['hayBale']);
    this.obj.mdlHdlr.SetTexture(GameMngr.assets.textures['hayBaleTex'], TextureFilters.linear);

    this.obj.trfmLocal.SetScaleAxes(0.25, 0.25, 0.25);
    var baleHalfHeight = this.obj.shapeData.radii.y * this.obj.trfmLocal.scale.y;
    this.obj.trfmLocal.SetBaseTransByAxes(0.0, baleHalfHeight, 0);

    this.obj.AddComponent(Components.rigidBody);
    this.obj.rigidBody.SetMass(40.0);
    var baleGrav = new ForceGenerators.Gravity(VEC3_GRAVITY);
    this.obj.rigidBody.AddForceGenerator(baleGrav);
    baleGrav.active = false;

    this.obj.AddComponent(Components.collisionSystem);

    this.Update = function() {
        // Apply gravity when in the air
        if(this.obj.trfmGlobal.pos.y > baleHalfHeight) {
            baleGrav.active = true;
        }
        // Land and remove gravity force if not needed
        else if(this.obj.trfmGlobal.pos.y < baleHalfHeight) {
            this.obj.trfmLocal.SetBaseTransY(baleHalfHeight);
            this.obj.rigidBody.velF.y = 0;
            baleGrav.active = false;
        }
    }
}