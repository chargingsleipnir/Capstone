
function ImpulseBalls() {
    this.obj;
}
ImpulseBalls.prototype = {
    Initialize: function(gameObject) {
        this.obj = gameObject;

        this.obj.collider.SetResponseCall(this.CollResponse);

        this.obj.rigidBody.SetMass(0.5);
        this.obj.rigidBody.SetInertiaTensor(this.obj.collider.sphere.radius);
    },
    CollResponse: function(c) {
    },
    Update: function() {
    }
};
