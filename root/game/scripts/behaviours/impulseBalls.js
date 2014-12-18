
function ImpulseBalls() {
    this.obj;
}
ImpulseBalls.prototype = {
    Initialize: function(gameObject) {
        this.obj = gameObject;

        var that = this;
        var Cr = 1.0;
        function CollResponse(c) {
            var collisionDist = that.obj.collider.sphere.IntersectsSphere(c.sphere);
            that.obj.rigidBody.CalculateImpulse(c.rigidBody, collisionDist, Cr);
        }

        this.obj.collider.SetResponseCall(CollResponse);

        this.obj.rigidBody.SetMass(0.5);
        this.obj.rigidBody.SetInertiaTensor(this.obj.collider.sphere.radius);
        this.obj.rigidBody.dampening = 0.9;
    },
    Update: function() {
    }
};
