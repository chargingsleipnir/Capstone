
function ImpulseBalls() {
    this.obj;
}
ImpulseBalls.prototype = {
    Initialize: function(gameObject) {
        this.obj = gameObject;

        this.obj.collider.SetResponseCall(this.CollResponse);

        this.obj.rigidBody.SetMass(0.5);
        this.obj.rigidBody.SetInertiaTensor(this.obj.collider.sphere.radius);
        this.obj.rigidBody.dampening = 0.9;
    },
    CollResponse: function(c) {
        // This registers undefined... maybe because it's in a callback? Works fine in Update
        //console.log(this.obj);
    },
    Update: function() {
    }
};
