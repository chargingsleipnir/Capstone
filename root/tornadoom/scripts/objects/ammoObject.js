/**
 * Created by Devin on 2015-02-18.
 */

function AmmoObject(name, model, texture, mass) {
    this.obj = new GameObject(name, Labels.movable);

    this.obj.SetModel(model);
    this.obj.mdlHdlr.SetTexture(texture, TextureFilters.linear);

    this.obj.trfmBase.SetScaleAxes(4, 4, 4);
    this.halfHeight = this.obj.shapeData.radii.y * this.obj.trfmBase.scale.y;
    this.obj.trfmBase.SetPosByAxes(0.0, this.halfHeight, 0);

    this.obj.AddComponent(Components.rigidBody);
    this.obj.rigidBody.SetMass(mass);
    this.obj.rigidBody.dampening = 0.1;

    this.gravForce = new ForceGenerators.Gravity(VEC3_GRAVITY);
    this.obj.rigidBody.AddForceGenerator(this.gravForce);
    this.gravForce.active = false;

    this.obj.AddComponent(Components.collisionSystem);
    // Secondary collider, must be fully implemented here for now.
    var capsule = new CollisionCapsule(this.obj);
    // Just for debug drawing
    this.obj.collider.AddCollisionShape(BoundingShapes.capsule, capsule);
}
AmmoObject.prototype = {
    Update: function() {
        // Apply gravity when in the air
        if(this.obj.trfmGlobal.pos.y > this.halfHeight) {
            this.obj.rigidBody.dampening = 1.0;
            this.gravForce.active = true;
        }
        // Land and remove gravity force if not needed
        else if(this.obj.trfmGlobal.pos.y < this.halfHeight) {
            this.obj.rigidBody.dampening = 0.1;
            this.obj.trfmBase.SetPosY(this.halfHeight);
            this.obj.rigidBody.velF.y = 0;
            this.gravForce.active = false;
        }
    }
};

function HayBale() {
    AmmoObject.call(this, 'hay bale', GameMngr.assets.models['hayBale'], GameMngr.assets.textures['hayBaleTex'], 30.0);
}
HayBale.prototype = AmmoObject.prototype;

function Cow() {
    AmmoObject.call(this, 'cow', GameMngr.assets.models['cow'], GameMngr.assets.textures['cowTex'], 20.0);
}
Cow.prototype = AmmoObject.prototype;