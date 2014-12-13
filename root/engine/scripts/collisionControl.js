
function CollisionBody(model, trfm) {
    /// <signature>
    ///  <summary>Add collision body to gameobject</summary>
    ///  <param name="model" type="object">JSON import or Primitive model</param>
    ///  <param name="trfm" type="Transform">Transform of GameObject</param>
    ///  <returns type="CollisionBody" />
    /// </signature>

    this.trfm = trfm;
    // Sphere set as standard
    this.sphere = GeomUtils.GetFromVertCoords(model.vertices.byMesh.posCoords, new Sphere());
    this.aabb = GeomUtils.GetFromVertCoords(model.vertices.byMesh.posCoords, new AABB());
    this.activeBody = this.sphere;
    this.active = true;
}
CollisionBody.prototype = {
    SetBoundingShape: function(shape) {
        if (shape == BoundingShapes.aabb)
            this.activeBody = this.aabb;
        else
            this.activeBody = this.sphere;
    },
    Update: function() {
        this.activeBody = this.trfm.pos;
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

    function Partitioning() {

    }
    function BroadPhase() {

    }
    function MidPhase() {

    }
    function NarrowPhase() {

    }

    return {
        AddBody: function() {

        },
        RemoveBody: function() {

        }
    }
}
)();