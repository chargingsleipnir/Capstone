
function CollisionBody(shapeData, trfm) {
    /// <signature>
    ///  <summary>Add collision body to gameobject</summary>
    ///  <param name="shapeData" type="object">Data container describing the object's relative shape</param>
    ///  <param name="trfm" type="Transform">Transform of GameObject</param>
    ///  <returns type="CollisionBody" />
    /// </signature>

    this.trfm = trfm;
    this.shapeData = shapeData;

    this.sphere = new Sphere(shapeData.centre, shapeData.radius);
    this.aabb = new AABB(this.shapeData.centre, this.shapeData.radii);

    // Sphere set as standard
    this.activeBody = this.sphere;

    this.activeFrame = new ModelHandler(new Primitives.IcoSphere(1, shapeData.radius), shapeData);
    this.activeFrame.MakeWireFrame();
    this.activeFrame.colourTint.SetValues(1.0, 1.0, 0.0);

    // Make a new transform for this??

    this.active = true;

    CollisionNetwork.AddBody(this);
}
CollisionBody.prototype = {
    SetBoundingShape: function(shape) {
        if (shape == BoundingShapes.aabb) {
            this.activeBody = this.aabb;
            this.activeFrame = new ModelHandler(Primitives.cube);
        }
        else {
            this.activeBody = this.sphere;
            this.activeFrame = new ModelHandler(new Primitives.IcoSphere(1, this.sphere.radius));
        }
    },
    Update: function() {
        this.sphere.pos = this.aabb.pos = this.trfm.pos;
        this.sphere.radius = this.shapeData.radius * this.trfm.GetLargestScaleValue();
        this.aabb.radii = this.shapeData.radii.GetScaleByVec(this.trfm.scale);

        this.activeFrame.UpdateModelViewControl(this.trfm);
    }
};

var CollisionDetect = {
    SphereVSphere: function(s1, s2) {
        var collisionDist = s1.trfmGlobal.pos.GetSubtract(s2.trfmGlobal.pos);
        if(collisionDist.GetMagSqr() < Math.pow(s1.collider.sphere.radius, 2) + Math.pow(s2.collider.sphere.radius, 2)) {
            var netVel = s1.rigidBody.velFinal.GetSubtract(s2.rigidBody.velFinal);
            if(netVel.GetDot(collisionDist) < 0)
                return collisionDist;
        }
        return false;
    }
};

var CollisionNetwork = (function() {

    var colliders = [];

    function Partitioning() {

    }
    function BroadPhase() {

    }
    function MidPhase() {

    }
    function NarrowPhase() {

    }

    return {
        AddBody: function(collisionBody) {
            colliders.push(collisionBody);
        },
        RemoveBody: function() {
        }
    }
}
)();
