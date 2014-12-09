
function CollisionBody(model, trfm) {
    /// <signature>
    ///  <summary>Add collision body to gameobject</summary>
    ///  <param name="model" type="object">JSON import or Primitive model</param>
    ///  <param name="trfm" type="Transform">Transform of GameObject</param>
    ///  <returns type="CollisionBody" />
    /// </signature>
    this.aabb = GeomUtils.GetFromVertCoords(model.vertices.byMesh.posCoords, new AABB());
    this.sphere = GeomUtils.GetFromVertCoords(model.vertices.byMesh.posCoords, new Sphere());
    this.active = true;

    this.Update = function() {
        this.aabb.pos = this.sphere.pos = trfm.pos;
    }
}

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
