/**
 * Created by Devin on 2015-01-25.
 */

function Cow() {
    this.obj = new GameObject('cow', Labels.movable);

    this.obj.SetModel(GameMngr.assets.models['cow']);
    this.obj.mdlHdlr.SetTexture(GameMngr.assets.textures['cowTex'], TextureFilters.linear);

    //this.obj.trfmLocal.SetScaleAxes(0.25, 0.25, 0.25);
    var cowHalfHeight = this.obj.shapeData.radii.y * this.obj.trfmLocal.scale.y;
    this.obj.trfmLocal.SetBaseTransByAxes(0.0, cowHalfHeight, 0);

    this.obj.AddComponent(Components.rigidBody);
    this.obj.rigidBody.SetMass(20.0);
    var cowGrav = new ForceGenerators.Gravity(VEC3_GRAVITY);
    this.obj.rigidBody.AddForceGenerator(cowGrav);
    cowGrav.active = false;

    this.obj.AddComponent(Components.collisionSystem);

    this.Update = function() {
        // Apply gravity when in the air
        if(this.obj.trfmGlobal.pos.y > cowHalfHeight) {
            cowGrav.active = true;
        }
        // Land and remove gravity force if not needed
        else if(this.obj.trfmGlobal.pos.y < cowHalfHeight) {
            this.obj.trfmLocal.SetBaseTransY(cowHalfHeight);
            this.obj.rigidBody.velF.y = 0;
            cowGrav.active = false;
        }
    }
}