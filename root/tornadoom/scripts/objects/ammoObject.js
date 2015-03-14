/**
 * Created by Devin on 2015-02-18.
 */

function AmmoObject(name, model, texture, mass) {

    var that = this;

    this.obj = new GameObject(name, Labels.ammo);

    this.obj.SetModel(model);
    this.obj.mdlHdlr.SetTexture(texture, TextureFilters.linear);

    //this.obj.trfmBase.SetScaleAxes(3, 3, 3);
    this.halfHeight = this.obj.shapeData.radii.y * this.obj.trfmBase.scale.y;
    this.obj.trfmBase.SetPosByAxes(0.0, this.halfHeight, 0);

    this.obj.AddComponent(Components.rigidBody);
    this.obj.rigidBody.SetMass(mass);
    this.obj.rigidBody.dampening = 0.1;
    this.obj.rigidBody.SetInertiaTensor(this.obj.shapeData.radius);

    this.gravForce = new ForceGenerators.Gravity(VEC3_GRAVITY);
    this.obj.rigidBody.AddForceGenerator(this.gravForce);
    this.gravForce.active = false;
    this.gravBlock = false;

    this.obj.AddComponent(Components.collisionSystem);
    // Secondary collider, must be fully implemented here for now.
    // Adding it to this.obj is really Just for debug drawing
    this.capsuleCollider = new CollisionCapsule(this.obj);
    this.obj.collider.AddCollisionShape(BoundingShapes.capsule, this.capsuleCollider);

    var coefOfRest = 0.5;
    function ImpulseDeflection(collider) {
        var collisionDist = that.obj.trfmGlobal.pos.GetSubtract(collider.trfm.pos);
        var netVel = that.obj.rigidBody.GetNetVelocity(collider.rigidBody);
        if (netVel.GetDot(collisionDist) < 0) {
            if (collider.gameObj.label == Labels.ammo) {
                collisionDist = that.capsuleCollider.IntersectsCapsule(collider.suppShapeList[0].obj);
                if (collisionDist && netVel.GetDot(collisionDist) < 0) {
                    that.obj.rigidBody.CalculateImpulse(collider.rigidBody, collisionDist, coefOfRest);
                }
            }
        }
    }
    this.obj.collider.SetSphereCall(ImpulseDeflection);
}
AmmoObject.prototype = {
    SetGravBlock: function(isBlocked) {
        this.gravBlock = isBlocked;
    },
    SetVisible: function(isVisible) {
        this.obj.mdlHdlr.active = isVisible;
        for (var i in this.obj.components)
            this.obj.components[i].SetActive(isVisible);
    },
    Update: function() {
        // Apply gravity when in the air
            if (this.obj.trfmGlobal.pos.y > this.halfHeight && !this.gravBlock) {
                this.obj.rigidBody.dampening = 1.0;
                this.gravForce.active = true;
            }
            // Land and remove gravity force if not needed
            else if (this.obj.trfmGlobal.pos.y < this.halfHeight) {
                this.obj.rigidBody.dampening = 0.1;
                this.obj.trfmBase.SetPosY(this.halfHeight);
                this.obj.rigidBody.velF.y = 0;
                this.gravForce.active = false;
            }
        this.gravBlock = false;
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